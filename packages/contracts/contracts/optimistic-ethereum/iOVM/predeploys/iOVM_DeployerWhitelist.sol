// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;

/**
 * @title iOVM_DeployerWhitelist
 */
interface iOVM_DeployerWhitelist {

    /********************
     * Public Functions *
     ********************/

    function initialize(address _owner, bool _allowArbitraryDeployment, bool _allowAllXDomainSenders) external;
    function owner() external returns (address _owner);
    function setWhitelistedDeployer(address _deployer, bool _isWhitelisted) external;
    function setWhitelistedXDomainSender(address _sender, bool _isWhitelisted) external;
    function setOwner(address _newOwner) external;
    function setAllowArbitraryDeployment(bool _allowArbitraryDeployment) external;
    function setAllowAllXDomainSenders(bool _allowAllXDomainSenders) external;
    function enableArbitraryContractDeployment() external;
    function enableAllXDomainSenders() external;
    function isDeployerAllowed(address _deployer) external returns (bool _allowed);
    function isXDomainSenderAllowed(address _sender) external returns (bool _allowed);
    
}
