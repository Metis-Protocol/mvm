// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <0.8.0;
/* Contract Imports */
/* External Imports */
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { MVM_Coinbase } from "./MVM_Coinbase.sol";
contract MVM_GasOracle is Ownable{
    // Current l2 gas price
    uint256 public gasPrice;
    MVM_Coinbase constant coinbase = MVM_Coinbase(0x4200000000000000000000000000000000000006);

    constructor(
      address _owner,
      uint256 _initialGasPrice
    )
      Ownable() 
    {
      setGasPrice(_initialGasPrice);
      transferOwnership(_owner);
    }

    function setGasPrice(
        uint256 _gasPrice
    )
        public
        onlyOwner
    {
        gasPrice = _gasPrice;
    }

    //for compatibility
    function setPrice(uint256 _gasPrice) public onlyOwner{
       gasPrice = _gasPrice;
    }

    function transferSetter(address newsetter) public onlyOwner{
       transferOwnership(newsetter);
    }

    function transferTo(address target, uint256 amount) public onlyOwner{
        // Transfer fee to relayer.
        require(
            coinbase.transfer(
                target,
                amount
            ),
            "transfer failed."
        );
    }
}