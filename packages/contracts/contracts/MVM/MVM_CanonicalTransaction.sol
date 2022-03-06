// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/* Library Imports */
import { Lib_AddressResolver } from "../libraries/resolver/Lib_AddressResolver.sol";


/* Interface Imports */
import { iMVM_CanonicalTransaction } from "./iMVM_CanonicalTransaction.sol";
import { ICanonicalTransactionChain } from "../L1/rollup/ICanonicalTransactionChain.sol";
import { IChainStorageContainer } from "../L1/rollup/IChainStorageContainer.sol";

contract MVM_CanonicalTransaction is iMVM_CanonicalTransaction, Lib_AddressResolver{
    /*************
     * Constants *
     *************/

    string constant public CONFIG_OWNER_KEY = "METIS_MANAGER";

    // lock seconds when begin to submit batch tx data slice
    uint256 constant public TXDATA_SUBMIT_TIMEOUT = 1800;

    /*************
     * Variables *
     *************/

    // submit tx data slice size (in bytes)
    uint256 public txDataSliceSize;
    // stake duration seconds for sequencer submit batch tx data
    uint256 public stakeSeqSeconds;
    // verifier stake cost for a batch tx data requirement (in ETH)
    uint256 public stakeCost;

    /***************
     * Queue State *
     ***************/

    // verifier stakes statistic
    mapping(address => uint256) public verifierStakes;

    // batch element information for validation queue
    mapping(uint256 => mapping(uint256 => BatchElement)) queueBatchElement;

    // tx data request stake queue
    mapping(uint256 => mapping(uint256 => TxDataRequestStake)) queueTxDataRequestStake;

    // tx data for verification queue
    mapping(uint256 => mapping(uint256 => TxDataSlice)) queueTxData;

    /***************
     * Constructor *
     ***************/

    constructor(
        address _libAddressManager,
        uint256 _txDataSliceSize,
        uint256 _stakeSeqSeconds,
        uint256 _stakeCost
    ) Lib_AddressResolver(_libAddressManager)
    {
        txDataSliceSize = _txDataSliceSize;
        stakeSeqSeconds = _stakeSeqSeconds;
        stakeCost = _stakeCost;
    }

    /**********************
     * Function Modifiers *
     **********************/

    modifier onlyManager {
        require(
            msg.sender == resolve(CONFIG_OWNER_KEY),
            "MVM_CanonicalTransaction: Function can only be called by the METIS_MANAGER."
        );
        _;
    }

    /********************
     * Public Functions *
     ********************/

    function setStakeCost(uint256 _stakeCost) override public onlyManager {
        // 1e16 = 0.01 ether
        require(_stakeCost >= 1e16, "stake cost should gte 1e16");
        stakeCost = _stakeCost;
    }

    function getStakeCost() override public view returns (uint256) {
        return stakeCost;
    }

    function setTxDataSliceSize(uint256 _size) override public onlyManager {
        require(_size > 0, "slice size should gt 0");
        require(_size != txDataSliceSize, "slice size has not changed");
        txDataSliceSize = _size;
    }

    function getTxDataSliceSize() override public view returns (uint256) {
        return txDataSliceSize;
    }

    function setStakeSeqSeconds(uint256 _seconds) override public onlyManager {
        require(_seconds > 0, "seconds should gt 0");
        require(_seconds != stakeSeqSeconds, "seconds has not changed");
        stakeSeqSeconds = _seconds;
    }

    function getStakeSeqSeconds() override public view returns (uint256) {
        return stakeSeqSeconds;
    }

    function appendSequencerBatchByChainId() override public {
        uint256 _chainId;
        uint40 shouldStartAtElement;
        uint24 totalElementsToAppend;
        uint24 numContexts;
        uint256 batchTime;
        bytes32 batchHash;
        uint256 _dataSize;
        assembly {
            _dataSize             := calldatasize()
            _chainId              := calldataload(4)
            shouldStartAtElement  := shr(216, calldataload(36))
            totalElementsToAppend := shr(232, calldataload(41))
            numContexts           := shr(232, calldataload(44))
        }
        require(
            msg.sender == resolve(string(abi.encodePacked(uint2str(_chainId),"_MVM_Sequencer_Wrapper"))),
            "Function can only be called by the Sequencer."
        );
        uint256 posTs =  47 + 16 * numContexts;
        uint256 posHash =  9 + posTs;
        if (_dataSize > posTs) {
            // when tx count = 0, there is no hash!
            assembly {
                batchTime := shr(204, calldataload(posTs))
                batchHash := calldataload(posHash)
            }
        }

        address ctc = resolve("CanonicalTransactionChain");
        IChainStorageContainer batchesRef = ICanonicalTransactionChain(ctc).batches();
        uint256 batchIndex = batchesRef.lengthByChainId(_chainId);

        {
            // ctc call
            (bool success, bytes memory result) = ctc.call(msg.data);
            if (success == false) {
                assembly {
                    let ptr := mload(0x40)
                    let size := returndatasize()
                    returndatacopy(ptr, 0, size)
                    revert(ptr, size)
                }
            }
        }

        // save
        queueBatchElement[_chainId][batchIndex] = BatchElement({
            shouldStartAtElement:  shouldStartAtElement,
            totalElementsToAppend: totalElementsToAppend,
            txBatchTime:           batchTime,
            txBatchHash:           batchHash
        });
    }

    function setBatchTxData(
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _sliceIndex,
        string memory _data,
        bool _end
    )
        override
        public
    {
        require(
            msg.sender == resolve(string(abi.encodePacked(uint2str(_chainId),"_MVM_Sequencer_Wrapper"))),
            "Function can only be called by the Sequencer."
        );
        _setBatchTxData(_chainId, _batchIndex, _sliceIndex, _data, _end, true);

        if (_end) {
            emit SetBatchTxData(
                msg.sender,
                _chainId,
                _batchIndex,
                0,
                true,
                true
            );
        }
    }

    function setBatchTxDataForStake(
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _sliceIndex,
        string memory _data,
        bool _end
    )
        override
        public
    {
        require(
            msg.sender == resolve(string(abi.encodePacked(uint2str(_chainId),"_MVM_Sequencer_Wrapper"))),
            "Function can only be called by the Sequencer."
        );
        // check stake
        require(queueTxDataRequestStake[_chainId][_batchIndex].timestamp > 0, "there is no stake for this batch index");
        require(queueTxDataRequestStake[_chainId][_batchIndex].status == STAKESTATUS.INIT, "not allowed to submit");
        require(queueTxDataRequestStake[_chainId][_batchIndex].endtime >= block.timestamp, "can not submit out of sequencer submit protection");

        _setBatchTxData(_chainId, _batchIndex, _sliceIndex, _data, _end, true);

        if (_end) {
            require(
                queueTxDataRequestStake[_chainId][_batchIndex].amount <= verifierStakes[queueTxDataRequestStake[_chainId][_batchIndex].sender],
                "insufficient stake"
            );
            require(
                queueTxDataRequestStake[_chainId][_batchIndex].amount <= address(this).balance,
                "insufficient balance"
            );
            queueTxDataRequestStake[_chainId][_batchIndex].status = STAKESTATUS.SEQ_SET;
            // transfer from contract to sender ETHER and record
            address payable _to = payable(msg.sender);
            (bool success, ) = _to.call{value: queueTxDataRequestStake[_chainId][_batchIndex].amount}("");
            require(success, "insufficient balance");
            verifierStakes[queueTxDataRequestStake[_chainId][_batchIndex].sender] -= queueTxDataRequestStake[_chainId][_batchIndex].amount;

            emit SetBatchTxData(
                msg.sender,
                _chainId,
                _batchIndex,
                queueTxDataRequestStake[_chainId][_batchIndex].amount,
                true,
                true
            );
        }
    }

    function setBatchTxDataForVerifier(
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _sliceIndex,
        string memory _data,
        bool _end
    )
        override
        public
    {
        // check stake
        require(queueTxDataRequestStake[_chainId][_batchIndex].timestamp > 0, "there is no stake for this batch index");
        require(queueTxDataRequestStake[_chainId][_batchIndex].status == STAKESTATUS.INIT, "not allowed to submit");
        require(queueTxDataRequestStake[_chainId][_batchIndex].sender == msg.sender, "can not submit with other's stake");
        require(queueTxDataRequestStake[_chainId][_batchIndex].endtime < block.timestamp, "can not submit during sequencer submit protection");

        _setBatchTxData(_chainId, _batchIndex, _sliceIndex, _data, _end, false);

        if (_end) {
            queueTxDataRequestStake[_chainId][_batchIndex].status = STAKESTATUS.VERIFIER_SET;

            if (queueTxDataRequestStake[_chainId][_batchIndex].amount <= verifierStakes[msg.sender]) {
                require(
                    queueTxDataRequestStake[_chainId][_batchIndex].amount <= address(this).balance,
                    "insufficient balance"
                );
                // transfer from contract to sender ETHER and record
                address payable _to = payable(msg.sender);
                (bool success, ) = _to.call{value: queueTxDataRequestStake[_chainId][_batchIndex].amount}("");
                require(success, "insufficient balance");
                verifierStakes[msg.sender] -= queueTxDataRequestStake[_chainId][_batchIndex].amount;
            }

            emit SetBatchTxData(
                msg.sender,
                _chainId,
                _batchIndex,
                queueTxDataRequestStake[_chainId][_batchIndex].amount,
                false,
                false
            );
        }
    }

    function _setBatchTxData(
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _sliceIndex,
        string memory _data,
        bool _end,
        bool _requireVerify
    )
        internal
    {
        require(txDataSliceSize > 0, "slice size not config yet");
        // check queue BatchElement
        require(queueBatchElement[_chainId][_batchIndex].txBatchTime > 0, "batch element does not exist");
        require(queueBatchElement[_chainId][_batchIndex].totalElementsToAppend > 0, "batch total element to append should not be zero");

        // slice data check
        require(bytes(_data).length / 2 <= txDataSliceSize, "slice size of data is too large");
        require(_sliceIndex <= queueTxData[_chainId][_batchIndex].txDataSlices.length, "incorrect slice index");

        // sequencer protect
        if (queueTxData[_chainId][_batchIndex].timestamp > 0) {
            if (queueTxData[_chainId][_batchIndex].sender != msg.sender) {
                require(queueTxData[_chainId][_batchIndex].timestamp + TXDATA_SUBMIT_TIMEOUT > block.timestamp, "in submitting");

                // _sliceIndex should be zero
                require(_sliceIndex == 0, "slice index should start from zero");

                // change sumbitter
                queueTxData[_chainId][_batchIndex].sender = msg.sender;
                queueTxData[_chainId][_batchIndex].timestamp = block.timestamp;
                queueTxData[_chainId][_batchIndex].txDataSlices = [_data];
                queueTxData[_chainId][_batchIndex].verified = false;
                queueTxData[_chainId][_batchIndex].end = _end;
            }
            else {
                if (_sliceIndex < queueTxData[_chainId][_batchIndex].txDataSlices.length) {
                    queueTxData[_chainId][_batchIndex].txDataSlices[_sliceIndex] = _data;
                }
                else {
                    queueTxData[_chainId][_batchIndex].txDataSlices.push(_data);
                }
                // verified restore to false
                queueTxData[_chainId][_batchIndex].verified = false;
                queueTxData[_chainId][_batchIndex].end = _end;
            }
        }
        else {
            string[] memory emptySlices;
            emptySlices[0] = _data;
            queueTxData[_chainId][_batchIndex] = TxDataSlice({
                sender:         msg.sender,
                timestamp:      block.timestamp,
                txDataSlices:   emptySlices,
                verified:       false,
                end:            _end
            });
        }
        if (_end && _requireVerify) {
            string memory split = "_";
            string memory startAt = uint2str(queueBatchElement[_chainId][_batchIndex].shouldStartAtElement);
            string memory totalElement = uint2str(queueBatchElement[_chainId][_batchIndex].totalElementsToAppend);
            string memory batchTime = uint2str(queueBatchElement[_chainId][_batchIndex].txBatchTime);

            string memory txData = concat(queueTxData[_chainId][_batchIndex].txDataSlices);

            bytes32 hexSha256 = sha256(abi.encodePacked(startAt, split, totalElement, split, batchTime, split, txData));
            require(hexSha256 == queueBatchElement[_chainId][_batchIndex].txBatchHash, "tx data verify failed");
            // save verified status
            queueTxData[_chainId][_batchIndex].verified = true;
        }
    }

    function getBatchTxData(
        uint256 _chainId,
        uint256 _batchIndex
    )
        override
        external
        view
        returns (
            string memory txData,
            bool verified
        )
    {
        require(queueTxData[_chainId][_batchIndex].timestamp != 0, "tx data does not exist");
        return (
            concat(queueTxData[_chainId][_batchIndex].txDataSlices),
            queueTxData[_chainId][_batchIndex].verified
        );
    }

    function verifierStake(
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _amount
    )
        override
        public
    {
        require(stakeCost > 0, "stake cost not config yet");
        require(stakeCost == _amount, "stake cost incorrect");
        require(stakeSeqSeconds > 0, "sequencer submit seconds not config yet");
        if (queueTxDataRequestStake[_chainId][_batchIndex].timestamp > 0) {
            require(queueTxDataRequestStake[_chainId][_batchIndex].status != STAKESTATUS.INIT, "there is a stake for this batch index");
        }
        require(
            _amount <= msg.sender.balance,
            "insufficient balance"
        );
        // transfer from sender ETHER to contract and record
        address payable _to = payable(address(this));
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "transfer stake cost failed");
        queueTxDataRequestStake[_chainId][_batchIndex] = TxDataRequestStake({
            sender:    msg.sender,
            timestamp: block.timestamp,
            endtime:   block.timestamp + stakeSeqSeconds,
            amount:    _amount,
            status:    STAKESTATUS.INIT
        });
        verifierStakes[msg.sender] += _amount;

        emit VerifierStake(msg.sender, _chainId, _batchIndex, _amount);
    }

    function withdrawStake(
        uint256 _chainId,
        uint256 _batchIndex
    )
        override
        public
    {
        require(queueTxDataRequestStake[_chainId][_batchIndex].timestamp > 0, "there is no stake for this batch index");
        require(queueTxDataRequestStake[_chainId][_batchIndex].status == STAKESTATUS.INIT, "withdrawals are not allowed");
        require(queueTxDataRequestStake[_chainId][_batchIndex].sender == msg.sender, "can not withdraw other's stake");
        require(queueTxDataRequestStake[_chainId][_batchIndex].endtime < block.timestamp, "can not withdraw during submit protection");
        require(queueTxDataRequestStake[_chainId][_batchIndex].amount <= verifierStakes[msg.sender], "insufficient stake");

        require(
            queueTxDataRequestStake[_chainId][_batchIndex].amount <= address(this).balance,
            "insufficient balance"
        );
        queueTxDataRequestStake[_chainId][_batchIndex].status = STAKESTATUS.PAYBACK;
        // transfer from contract to sender ETHER and record
        address payable _to = payable(msg.sender);
        (bool success, ) = _to.call{value: queueTxDataRequestStake[_chainId][_batchIndex].amount}("");
        require(success, "insufficient balance");
        verifierStakes[msg.sender] -= queueTxDataRequestStake[_chainId][_batchIndex].amount;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function concat(string[] memory words) internal pure returns (string memory) {
        bytes memory output;

        for (uint256 i = 0; i < words.length; i++) {
            output = abi.encodePacked(output, words[i]);
        }

        return string(output);
    }
}
