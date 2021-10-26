// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;

/* Interface Imports */
import { iOVM_CrossDomainMessenger } from
    "../../iOVM/bridge/messaging/iOVM_CrossDomainMessenger.sol";

/**
 * @title OVM_CrossDomainEnabled
 * @dev Helper contract for contracts performing cross-domain communications
 *
 * Compiler used: defined by inheriting contract
 * Runtime target: defined by inheriting contract
 */
contract OVM_CrossDomainEnabled {

    /*************
     * Variables *
     *************/

    // Messenger contract used to send and recieve messages from the other domain.
    address public messenger;

    uint32 private  constant DEFAULT_FINALIZE_DEPOSIT_L2_GAS = 8999999;
    uint32 private  constant DEFAULT_FINALIZE_WITHDRAWAL_L1_GAS = 8999999;

    /***************
     * Constructor *
     ***************/

    /**
     * @param _messenger Address of the CrossDomainMessenger on the current layer.
     */
    constructor(
        address _messenger
    ) {
        messenger = _messenger;
    }


    /**********************
     * Function Modifiers *
     **********************/

    /**
     * Enforces that the modified function is only callable by a specific cross-domain account.
     * @param _sourceDomainAccount The only account on the originating domain which is
     *  authenticated to call this function.
     */
    modifier onlyFromCrossDomainAccount(
        address _sourceDomainAccount
    ) {
        require(
            msg.sender == address(getCrossDomainMessenger()),
            "OVM_XCHAIN: messenger contract unauthenticated"
        );

        require(
            getCrossDomainMessenger().xDomainMessageSender() == _sourceDomainAccount,
            "OVM_XCHAIN: wrong sender of cross-domain message"
        );

        _;
    }


    /**********************
     * Internal Functions *
     **********************/

    /**
     * Gets the messenger, usually from storage. This function is exposed in case a child contract
     * needs to override.
     * @return The address of the cross-domain messenger contract which should be used.
     */
    function getCrossDomainMessenger()
        internal
        virtual
        returns (
            iOVM_CrossDomainMessenger
        )
    {
        return iOVM_CrossDomainMessenger(messenger);
    }

    /**
     * Sends a message to an account on another domain
     * @param _crossDomainTarget The intended recipient on the destination domain
     * @param _message The data to send to the target (usually calldata to a function with
     *  `onlyFromCrossDomainAccount()`)
     * @param _gasLimit The gasLimit for the receipt of the message on the target domain.
     */
    function sendCrossDomainMessage(
        address _crossDomainTarget,
        uint32 _gasLimit,
        bytes memory _message,
        uint256 fee
    )
        internal
    {
        getCrossDomainMessenger().sendMessage{value:fee}(_crossDomainTarget, _message, _gasLimit);
    }

    /**
     * @notice Sends a message to an account on another domain
     * @param _chainId L2 chain id.
     * @param _crossDomainTarget The intended recipient on the destination domain
     * @param _gasLimit The gasLimit for the receipt of the message on the target domain.
     * @param _message The data to send to the target (usually calldata to a function with `onlyFromCrossDomainAccount()`)
     */
    function sendCrossDomainMessageViaChainId(
        uint256 _chainId,
        address _crossDomainTarget,
        uint32 _gasLimit,
        bytes memory _message,
        uint256 fee
    ) internal {
        getCrossDomainMessenger().sendMessageViaChainId{value:fee}(_chainId, _crossDomainTarget, _message, _gasLimit);
    }
}
