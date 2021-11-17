# Optimism Regenesis Deployments
## LAYER 2

### Chain IDs:
- Mainnet: 10
- Kovan: 69
- Goerli: 420
*The contracts relevant for the majority of developers are `OVM_ETH` and the cross-domain messengers. The L2 addresses don't change.*

### Predeploy contracts:
|Contract|Address|
|--|--|
|OVM_L2ToL1MessagePasser|0x4200000000000000000000000000000000000000|
|OVM_DeployerWhitelist|0x4200000000000000000000000000000000000002|
|MVM_ChainConfig|0x4200000000000000000000000000000000000005|
|L2CrossDomainMessenger|0x4200000000000000000000000000000000000007|
|OVM_GasPriceOracle|0x420000000000000000000000000000000000000F|
|L2StandardBridge|0x4200000000000000000000000000000000000010|
|OVM_SequencerFeeVault|0x4200000000000000000000000000000000000011|
|L2StandardTokenFactory|0x4200000000000000000000000000000000000012|
|OVM_L1BlockNumber|0x4200000000000000000000000000000000000013|
|MVM_Coinbase|0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000|
|OVM_ETH|0x420000000000000000000000000000000000000A|

---
---

## LAYER 1

## TRIAL

Network : __rinkeby (chain id: 4)__

|Contract|Address|
|--|--|
|BondManager|[0xB620aa2207b31074f7222A9D74677AA8C15CFA3c](https://rinkeby.etherscan.io/address/0xB620aa2207b31074f7222A9D74677AA8C15CFA3c)|
|CanonicalTransactionChain|[0xcc9634D1bA6340Fecd1DFb45544533B61622989F](https://rinkeby.etherscan.io/address/0xcc9634D1bA6340Fecd1DFb45544533B61622989F)|
|ChainStorageContainer-CTC-batches|[0xAe31E27Af67559e830E0D0b0CE3D55b499Bdb18b](https://rinkeby.etherscan.io/address/0xAe31E27Af67559e830E0D0b0CE3D55b499Bdb18b)|
|ChainStorageContainer-CTC-queue|[0x5475F91F29acfCDa0c17F891b453A854B499251E](https://rinkeby.etherscan.io/address/0x5475F91F29acfCDa0c17F891b453A854B499251E)|
|ChainStorageContainer-SCC-batches|[0x07ea1ce6E1593243ae60bbD315209a3B79b2A376](https://rinkeby.etherscan.io/address/0x07ea1ce6E1593243ae60bbD315209a3B79b2A376)|
|Lib_AddressManager|[0x4816F334Ec321D209FAd525Fc189b42f22ea37a7](https://rinkeby.etherscan.io/address/0x4816F334Ec321D209FAd525Fc189b42f22ea37a7)|
|MVM_Verifier_for_verification_only|[0x7CEC095D26C671353539927e5d24D781759033C2](https://rinkeby.etherscan.io/address/0x7CEC095D26C671353539927e5d24D781759033C2)|
|OVM_L1CrossDomainMessenger|[0xE74F1C47858D76b75777f0bA9f53e4e8A85377c5](https://rinkeby.etherscan.io/address/0xE74F1C47858D76b75777f0bA9f53e4e8A85377c5)|
|Proxy__MVM_Verifier|[0xA2E66C16FB311A5d04228A96877Bb83859afbb86](https://rinkeby.etherscan.io/address/0xA2E66C16FB311A5d04228A96877Bb83859afbb86)|
|Proxy__OVM_L1CrossDomainMessenger|[0xb3dcCd71465cb9a75B5750182Cf673410E78ad03](https://rinkeby.etherscan.io/address/0xb3dcCd71465cb9a75B5750182Cf673410E78ad03)|
|Proxy__OVM_L1StandardBridge|[0x6fe722e6324b5717aE41336E69EDbc639F150444](https://rinkeby.etherscan.io/address/0x6fe722e6324b5717aE41336E69EDbc639F150444)|
|StateCommitmentChain|[0x813eF4b2b510cd764a37728691EAC27396fB3C5d](https://rinkeby.etherscan.io/address/0x813eF4b2b510cd764a37728691EAC27396fB3C5d)|
<!--
Implementation addresses. DO NOT use these addresses directly.
Use their proxied counterparts seen above.

-->
---
## STARDUST

Network : __rinkeby (chain id: 4)__

|Contract|Address|
|--|--|
|BondManager|[0xec0b054F9524fa803d4555339BC70Be159e0485B](https://rinkeby.etherscan.io/address/0xec0b054F9524fa803d4555339BC70Be159e0485B)|
|CanonicalTransactionChain|[0x2b9c6FE921982284145ec1930989bd482268a3f9](https://rinkeby.etherscan.io/address/0x2b9c6FE921982284145ec1930989bd482268a3f9)|
|ChainStorageContainer-CTC-batches|[0x0561bdA99BD43A15459eC3f826C077A96929F5Fd](https://rinkeby.etherscan.io/address/0x0561bdA99BD43A15459eC3f826C077A96929F5Fd)|
|ChainStorageContainer-CTC-queue|[0x4B4D0f95688697bA221b90147eA16C30a7884DE4](https://rinkeby.etherscan.io/address/0x4B4D0f95688697bA221b90147eA16C30a7884DE4)|
|ChainStorageContainer-SCC-batches|[0x9f19b8391D664c51bDBfEFaa77D5C01764BdCD8E](https://rinkeby.etherscan.io/address/0x9f19b8391D664c51bDBfEFaa77D5C01764BdCD8E)|
|L1StandardBridge_for_verification_only|[0x7AE95D1241d7B27312baA8245dfAC80B08E2e68a](https://rinkeby.etherscan.io/address/0x7AE95D1241d7B27312baA8245dfAC80B08E2e68a)|
|Lib_AddressManager|[0x3870c347e84dE40F8bD8b5FB8CbCC423Ed38CE12](https://rinkeby.etherscan.io/address/0x3870c347e84dE40F8bD8b5FB8CbCC423Ed38CE12)|
|MVM_DiscountOracle|[0xa9BdA5A0881e59587B119685027a601Cae1Cc83d](https://rinkeby.etherscan.io/address/0xa9BdA5A0881e59587B119685027a601Cae1Cc83d)|
|MVM_L2ChainManagerOnL1_for_verification_only|[0x23b1BFb369667cc0bDa7B1da628268d3531d1D38](https://rinkeby.etherscan.io/address/0x23b1BFb369667cc0bDa7B1da628268d3531d1D38)|
|MVM_Verifier|[0xBde12E56D6d029Bed3e61d6E3b0CCb3311c0bCFb](https://rinkeby.etherscan.io/address/0xBde12E56D6d029Bed3e61d6E3b0CCb3311c0bCFb)|
|OVM_L1CrossDomainMessenger|[0xe4d0940df19f04C60006BA3420D13a82E3af7bA2](https://rinkeby.etherscan.io/address/0xe4d0940df19f04C60006BA3420D13a82E3af7bA2)|
|Proxy__MVM_ChainManager|[0x5553c94Cf01e1e631F9F92F26Afb1383F17a8D30](https://rinkeby.etherscan.io/address/0x5553c94Cf01e1e631F9F92F26Afb1383F17a8D30)|
|Proxy__OVM_L1CrossDomainMessenger|[0xBa6f1aAF3F909F208b224F3985eCda745FA9101A](https://rinkeby.etherscan.io/address/0xBa6f1aAF3F909F208b224F3985eCda745FA9101A)|
|Proxy__OVM_L1StandardBridge|[0x325049462E30472E7d27Fc53DF7d5a49210cBC70](https://rinkeby.etherscan.io/address/0x325049462E30472E7d27Fc53DF7d5a49210cBC70)|
|StateCommitmentChain|[0xc4139869E2e988ac71c65f8b68F02fD8A0C50B49](https://rinkeby.etherscan.io/address/0xc4139869E2e988ac71c65f8b68F02fD8A0C50B49)|
<!--
Implementation addresses. DO NOT use these addresses directly.
Use their proxied counterparts seen above.

-->
---
## ANDROMEDA

Network : __mainnet (chain id: 1)__

|Contract|Address|
|--|--|
|BondManager|[0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be](https://etherscan.io/address/0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be)|
|CanonicalTransactionChain|[0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9](https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9)|
|ChainStorageContainer-CTC-batches|[0x38473Feb3A6366757A249dB2cA4fBB2C663416B7](https://etherscan.io/address/0x38473Feb3A6366757A249dB2cA4fBB2C663416B7)|
|ChainStorageContainer-CTC-queue|[0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57](https://etherscan.io/address/0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57)|
|ChainStorageContainer-SCC-batches|[0x10739F09f6e62689c0aA8A1878816de9e166d6f9](https://etherscan.io/address/0x10739F09f6e62689c0aA8A1878816de9e166d6f9)|
|L1StandardBridge_for_verification_only|[0x101500214981e7A5Ad2334D8404eaF365C2c3113](https://etherscan.io/address/0x101500214981e7A5Ad2334D8404eaF365C2c3113)|
|Lib_AddressManager|[0x918778e825747a892b17C66fe7D24C618262867d](https://etherscan.io/address/0x918778e825747a892b17C66fe7D24C618262867d)|
|MVM_DiscountOracle|[0xC8953ca384b4AdC8B1b11B030Afe2F05471664b0](https://etherscan.io/address/0xC8953ca384b4AdC8B1b11B030Afe2F05471664b0)|
|MVM_L2ChainManagerOnL1_for_verification_only|[0x9E2E3be85df5Ca63DE7674BA64ffD564075f3B48](https://etherscan.io/address/0x9E2E3be85df5Ca63DE7674BA64ffD564075f3B48)|
|MVM_Verifier|[0x9Ed4739afd706122591E75F215208ecF522C0Fd3](https://etherscan.io/address/0x9Ed4739afd706122591E75F215208ecF522C0Fd3)|
|OVM_L1CrossDomainMessenger|[0x8bF439ef7167023F009E24b21719Ca5f768Ecb36](https://etherscan.io/address/0x8bF439ef7167023F009E24b21719Ca5f768Ecb36)|
|Proxy__MVM_ChainManager|[0xf3d58D1794f2634d6649a978f2dc093898FEEBc0](https://etherscan.io/address/0xf3d58D1794f2634d6649a978f2dc093898FEEBc0)|
|Proxy__OVM_L1CrossDomainMessenger|[0x081D1101855bD523bA69A9794e0217F0DB6323ff](https://etherscan.io/address/0x081D1101855bD523bA69A9794e0217F0DB6323ff)|
|Proxy__OVM_L1StandardBridge|[0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b](https://etherscan.io/address/0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b)|
|StateCommitmentChain|[0xf209815E595Cdf3ed0aAF9665b1772e608AB9380](https://etherscan.io/address/0xf209815E595Cdf3ed0aAF9665b1772e608AB9380)|
<!--
Implementation addresses. DO NOT use these addresses directly.
Use their proxied counterparts seen above.

-->
---
