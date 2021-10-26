// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
/* Contract Imports */
/* External Imports */
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { iMVM_DiscountOracle } from "./iMVM_DiscountOracle.sol";
import { MVM_AddressResolver } from "../libraries/resolver/MVM_AddressResolver.sol";
contract MVM_DiscountOracle is Ownable, iMVM_DiscountOracle, MVM_AddressResolver{
    // Current l2 gas price
    uint256 public discount;
    uint256 public minL2Gas;
    mapping (address => bool) public xDomainWL;
    bool allowAllXDomainSenders;
    constructor(
      address _mvmAddressManager,
      uint256 _initialDiscount
    )
      Ownable() 
      MVM_AddressResolver(_mvmAddressManager)
    {
      setDiscount(_initialDiscount);
      setMinL2Gas(1_000_000);
      allowAllXDomainSenders = false;
    }
    
    function getMinL2Gas() view public override returns (uint256){
      return minL2Gas;
    }
    
    function getDiscount() view public override returns (uint256){
      return discount;
    }
    
    

    function setDiscount(
        uint256 _discount
    )
        public
        override
        onlyOwner
    {
        discount = _discount;
    }
    
    function setMinL2Gas(
        uint256 _minL2Gas
    )
        public
        override
        onlyOwner
    {
        minL2Gas = _minL2Gas;
    }

    function transferSetter(address newsetter) public override onlyOwner{
       transferOwnership(newsetter);
    }
    
    function setWhitelistedXDomainSender(
        address _sender,
        bool _isWhitelisted
    )
        external
        override
        onlyOwner
    {
        xDomainWL[_sender] = _isWhitelisted;
    }
    
    function isXDomainSenderAllowed(
        address _sender
    )
        view
        override
        public
        returns (
            bool
        )
    {
        return (
            allowAllXDomainSenders == true
            || xDomainWL[_sender]
        );
    }
    
    function setAllowAllXDomainSenders(
        bool _allowAllXDomainSenders
    )
        public
        override
        onlyOwner
    {
        allowAllXDomainSenders = _allowAllXDomainSenders;
    }
    
    function processL2SeqGas(address sender, uint256 _chainId) 
    public payable override {
        require(isXDomainSenderAllowed(sender), "sender is not whitelisted");
        string memory ch = makeChainSeq(_chainId);
        
        address sequencer = resolveFromMvm(ch);
        require (sequencer != address(0), string(abi.encodePacked("sequencer address not available: ", ch)));
        
        //take the fee
        (payable(sequencer)).transfer(msg.value);
    }
    
    function isTrustedRelayer(uint256 chainid, address sender) view public override returns(bool) {
        return (sender == resolveFromMvm(string(abi.encodePacked(uint2str(chainid), "_MVM_RELAYER"))));
    }
    
    function makeChainSeq(uint256 i) internal returns (string memory c) {
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
        string memory s="_MVM_Sequencer";
        bytes memory _bb=bytes(s);
        k = length;
        for (i = 0; i < 14; i++)
            bstr[k++] = _bb[i];
        c = string(bstr);
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
         uint k = len - 1;
         while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
         }
         return string(bstr);
   }
}
