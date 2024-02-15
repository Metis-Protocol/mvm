// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import { iMVM_ChainConfig } from "./iMVM_ChainConfig.sol";

/* Contract Imports */
/* External Imports */
contract MVM_ChainConfig is iMVM_ChainConfig {
    bytes32 public constant DAC_NAME = keccak256("DAC_NAME");
    bytes32 public constant DAC_CHARTER = keccak256("DAC_CHARTER");

    // Current l2 gas price
    mapping(bytes32 => bytes) public config;
    mapping(address => bytes) public account_config;

    constructor() {}

    function setConfig(bytes32 key, bytes calldata values) public {
        if (config[key].length == 0) {
            config[key] = values;
            emit NewChainConfig(msg.sender, key, values);
        }
    }

    function setConfig(bytes calldata values) public {
        account_config[msg.sender] = values;
        emit NewAccountConfig(msg.sender, msg.sender, values);
    }

    function getConfig(bytes32 key) public view returns (bytes memory) {
        return config[key];
    }

    function getConfig() public view returns (bytes memory) {
        return account_config[msg.sender];
    }
}
