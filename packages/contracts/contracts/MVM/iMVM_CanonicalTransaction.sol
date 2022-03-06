// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/* Contract Imports */

/* External Imports */

/**
 * @title ICanonicalTransactionChain
 */
interface iMVM_CanonicalTransaction {
    /*********
     * Enums *
     *********/

    enum STAKESTATUS {
        INIT,
        SEQ_SET,
        VERIFIER_SET,
        PAYBACK
    }

    /**********
     * Events *
     **********/

    event VerifierStake(
        address _sender,
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _amount
    );

    // default : stakeAmount=0, verified=true, sequencer=true
    // sequencer response for stake: stakeAmount>0, verified=true, sequencer=true
    // verifier response for stake timeout: stakeAmount>0, verified=false, sequencer=false
    event SetBatchTxData(
        address _sender,
        uint256 _chainId,
        uint256 _batchIndex,
        uint256 _stakeAmount,
        bool _verified,
        bool _sequencer
    );

    /***********
     * Structs *
     ***********/

    // locker the same sender for 30 min
    struct TxDataSlice {
        address sender;
        uint256 timestamp;
        string[] txDataSlices;
        bool verified;
        bool end;
    }

    struct TxDataRequestStake {
        address sender;
        uint256 timestamp;
        uint256 endtime;
        uint256 amount;
        STAKESTATUS status;
    }

    struct BatchElement {
        uint40 shouldStartAtElement;
        uint24 totalElementsToAppend;
        uint256 txBatchTime;
        bytes32 txBatchHash;
    }

    /*******************************
     * Authorized Setter Functions *
     *******************************/

    /**
     * Sets the verifier stake cost of ETH.
     * @param _stakeCost Stake cost for verifier.
     */
    function setStakeCost(uint256 _stakeCost) external;

    /**
     * Gets the verifier stake cost of ETH.
     * @return Stake cost for verifier.
     */
    function getStakeCost() external view returns (uint256);

    /**
     * Sets batch transaction data slice size per submit.
     * @param _size Slice size of batch transaction data.
     */
    function setTxDataSliceSize(uint256 _size) external;

    /**
     * Gets batch transaction data slice size per submit.
     * @return Slice size of batch transaction data.
     */
    function getTxDataSliceSize() external view returns (uint256);

    /**
     * Sets seconds can submit transaction data after staking.
     * @param _seconds Seconds the Sequencer can sumbit transaction data after verifier staking.
     */
    function setStakeSeqSeconds(uint256 _seconds) external;

    /**
     * Gets seconds can submit transaction data after staking.
     * @return Seconds the Sequencer can sumbit transaction data after verifier staking.
     */
    function getStakeSeqSeconds() external view returns (uint256);

    /**
     * Allows the sequencer to append a batch of transactions.
     * @dev This function uses a custom encoding scheme for efficiency reasons.
     */
    function appendSequencerBatchByChainId() external;

    /**
     * Sets batch tx data.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
     * @param _sliceIndex slice index.
     * @param _data tx data hex.
     * @param _end sliceIndex is the end or not.
    */
    function setBatchTxData(uint256 _chainId, uint256 _batchIndex, uint256 _sliceIndex, string memory _data, bool _end) external;

    /**
     * Sets batch tx data for stake.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
     * @param _sliceIndex slice index.
     * @param _data tx data hex.
     * @param _end sliceIndex is the end or not.
    */
    function setBatchTxDataForStake(uint256 _chainId, uint256 _batchIndex, uint256 _sliceIndex, string memory _data, bool _end) external;

    /**
     * Sets batch tx data for verifier.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
     * @param _sliceIndex slice index.
     * @param _data tx data hex.
     * @param _end sliceIndex is the end or not.
    */
    function setBatchTxDataForVerifier(uint256 _chainId, uint256 _batchIndex, uint256 _sliceIndex, string memory _data, bool _end) external;

    /**
     * Gets batch tx data.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
     * @return txData
     * @return verified
    */
    function getBatchTxData(uint256 _chainId, uint256 _batchIndex) external view returns (string memory txData, bool verified);

    /**
     * Stake by verifier.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
     * @param _amount slice index.
    */
    function verifierStake(uint256 _chainId, uint256 _batchIndex, uint256 _amount) external;

    /**
     * Withdraw stake by verifier.
     * @param _chainId chain id.
     * @param _batchIndex batch index of CTC.
    */
    function withdrawStake(uint256 _chainId, uint256 _batchIndex) external;

}
