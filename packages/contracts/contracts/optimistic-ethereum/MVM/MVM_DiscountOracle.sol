// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
/* Contract Imports */
/* External Imports */
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
contract MVM_DiscountOracle is Ownable{
    // Current l2 gas price
    uint256 public discount;

    constructor(
      uint256 _initialDiscount
    )
      Ownable() 
    {
      set(_initialDiscount);
    }

    function set(
        uint256 _discount
    )
        public
        onlyOwner
    {
        discount = _discount;
    }

    function transferSetter(address newsetter) public onlyOwner{
       transferOwnership(newsetter);
    }
}
