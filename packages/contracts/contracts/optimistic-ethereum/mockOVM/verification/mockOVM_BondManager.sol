// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;

/* Interface Imports */
import { iOVM_BondManager } from "../../iOVM/verification/iOVM_BondManager.sol";

/* Contract Imports */
import { Lib_AddressResolver } from "../../libraries/resolver/Lib_AddressResolver.sol";

/**
 * @title mockOVM_BondManager
 */
contract mockOVM_BondManager is iOVM_BondManager, Lib_AddressResolver {
    constructor(
        address _libAddressManager
    )
        Lib_AddressResolver(_libAddressManager)
    {}

    function recordGasSpent(
        bytes32 _preStateRoot,
        bytes32 _txHash,
        address _who,
        uint256 _gasSpent
    )
        override
        public
    {}

    function finalize(
        bytes32 _preStateRoot,
        address _publisher,
        uint256 _timestamp
    )
        override
        public
    {}

    function deposit()
        override
        public
    {}

    function startWithdrawal()
        override
        public
    {}

    function finalizeWithdrawal()
        override
        public
    {}

    function claim(
        address _who
    )
        override
        public
    {}

    function isCollateralized(
        address _who
    )
        override
        public
        view
        returns (
            bool
        )
    {
        // Only authenticate sequencer to submit state root batches.
        return _who == resolve("OVM_Proposer");
    }
    
    function makeChainProp(uint256 i) internal returns (string memory c) {
        if (i == 0) return "0";
        uint j = i;
        uint length;

        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length+14);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(uint8(48 + i % 10));
            i /= 10;
        }
        string memory s="_MVM_Proposer";
        bytes memory _bb=bytes(s);
        k = length;
        for (i = 0; i < 14; i++)
            bstr[k++] = _bb[i];
        c = string(bstr);
    }

    function isCollateralizedByChainId(
        uint256 _chainId,
        address _who
    )
        override
        public
        view
        returns (
            bool
        )
    {
        // Only authenticate sequencer to submit state root batches.
        string memory ch = makeChainProp(_chainId);
        return _who == resolveFromMvm(ch);
    }
    
    function getGasSpent(
        bytes32, // _preStateRoot,
        address // _who
    )
        override
        public
        pure
        returns (
            uint256
        )
    {
        return 0;
    }
}
