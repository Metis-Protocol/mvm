// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/* Interface Imports */
import { IBondManager } from "./IBondManager.sol";

/* Contract Imports */
import { Lib_AddressResolver } from "../../libraries/resolver/Lib_AddressResolver.sol";
import { Lib_Uint } from "../../libraries/utils/Lib_Uint.sol";

/**
 * @title BondManager
 * @dev This contract is, for now, a stub of the "real" BondManager that does nothing but
 * allow the "OVM_Proposer" to submit state root batches.
 *
 * Runtime target: EVM
 */
contract BondManager is IBondManager, Lib_AddressResolver {
    /**
     * @param _libAddressManager Address of the Address Manager.
     */
    constructor(address _libAddressManager) Lib_AddressResolver(_libAddressManager) {}

    /**
     * Checks whether a given address is properly collateralized and can perform actions within
     * the system.
     * @param _who Address to check.
     * @return true if the address is properly collateralized, false otherwise.
     */
    function isCollateralized(address _who) public view returns (bool) {
        // Only authenticate sequencer to submit state root batches.
        return _who == resolve("OVM_Proposer");
    }

    function isCollateralizedByChainId(
        uint256 _chainId,
        address _who,
        address _prop
    ) public view override returns (bool) {
        require(_who == _prop, "sender must the proposer!");
        require(
            _prop ==
                resolve(string(abi.encodePacked(Lib_Uint.uint2str(_chainId), "_MVM_Proposer"))),
            "Proposer does not match this chain."
        );
        return true;
        //return bonds[_who].state == State.COLLATERALIZED;
    }

    // function registerSequencerByChainId(
    //    uint256 _chainId,
    //    address _sequencer,
    //    address _proposer
    //) public {
    //}
}
