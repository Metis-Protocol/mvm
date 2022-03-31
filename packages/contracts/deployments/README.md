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
|BondManager|[0xC6aAFd23435EC9FF4061d198786D3A3B2a983bae](https://rinkeby.etherscan.io/address/0xC6aAFd23435EC9FF4061d198786D3A3B2a983bae)|
|CanonicalTransactionChain|[0x8B987C16815c7f446526dFa00E40A718dC975c39](https://rinkeby.etherscan.io/address/0x8B987C16815c7f446526dFa00E40A718dC975c39)|
|ChainStorageContainer-CTC-batches|[0x742Fe6f8F601149958605fcBCeb7163174D7a12b](https://rinkeby.etherscan.io/address/0x742Fe6f8F601149958605fcBCeb7163174D7a12b)|
|ChainStorageContainer-CTC-queue|[0xCF823912Af4ab34FbD0865698E0092d1ff91bD76](https://rinkeby.etherscan.io/address/0xCF823912Af4ab34FbD0865698E0092d1ff91bD76)|
|ChainStorageContainer-SCC-batches|[0xbb0B27085F9021B9fe2091F46C09CF50f40e2e1A](https://rinkeby.etherscan.io/address/0xbb0B27085F9021B9fe2091F46C09CF50f40e2e1A)|
|L1StandardBridge_for_verification_only|[0xd76bE43f9AB76803bd116Fa2e80E200E8AD7efAB](https://rinkeby.etherscan.io/address/0xd76bE43f9AB76803bd116Fa2e80E200E8AD7efAB)|
|Lib_AddressManager|[0xE40d6A7302Aa8734511c5537da13e2d62909dbF9](https://rinkeby.etherscan.io/address/0xE40d6A7302Aa8734511c5537da13e2d62909dbF9)|
|MVM_CanonicalTransaction|[0x28EA77F3bEcfc089EFA2c3eD36c4b499a6580e80](https://rinkeby.etherscan.io/address/0x28EA77F3bEcfc089EFA2c3eD36c4b499a6580e80)|
|MVM_DiscountOracle|[0x9ea3Ccf0d51Ca001B9A32A30b5C1a3B344D5d65A](https://rinkeby.etherscan.io/address/0x9ea3Ccf0d51Ca001B9A32A30b5C1a3B344D5d65A)|
|MVM_L2ChainManagerOnL1_for_verification_only|[0xE9C3Da1094A63D54a116Fb9C5D8621f6A6074b80](https://rinkeby.etherscan.io/address/0xE9C3Da1094A63D54a116Fb9C5D8621f6A6074b80)|
|MVM_Verifier_for_verification_only|[0x0E8d38015e4d20Ba7755dd67B0890131A96B8561](https://rinkeby.etherscan.io/address/0x0E8d38015e4d20Ba7755dd67B0890131A96B8561)|
|OVM_L1CrossDomainMessenger|[0x4A87567C0b8B88bA3753AAB285fbC3EedBF27303](https://rinkeby.etherscan.io/address/0x4A87567C0b8B88bA3753AAB285fbC3EedBF27303)|
|Proxy__MVM_CanonicalTransaction|[0xF3C31368e9909215065677F7EC6D5B4C4B0E62E3](https://rinkeby.etherscan.io/address/0xF3C31368e9909215065677F7EC6D5B4C4B0E62E3)|
|Proxy__MVM_ChainManager|[0xce05788D0C85121bbAb1bEb0A2b31EE5f4A90658](https://rinkeby.etherscan.io/address/0xce05788D0C85121bbAb1bEb0A2b31EE5f4A90658)|
|Proxy__MVM_Verifier|[0x94B3d85A89151bd5BB8329A35567E641C90C2b13](https://rinkeby.etherscan.io/address/0x94B3d85A89151bd5BB8329A35567E641C90C2b13)|
|Proxy__OVM_L1CrossDomainMessenger|[0x4E2415337B9d1C2847a17E1dF4A90304885049e4](https://rinkeby.etherscan.io/address/0x4E2415337B9d1C2847a17E1dF4A90304885049e4)|
|Proxy__OVM_L1StandardBridge|[0x0A9d50cCfB57d4B66E088Af5Cb4Abe5035058EC8](https://rinkeby.etherscan.io/address/0x0A9d50cCfB57d4B66E088Af5Cb4Abe5035058EC8)|
|StateCommitmentChain|[0xa79224E5Cd7880e4329A17c479EFEa96334359eF](https://rinkeby.etherscan.io/address/0xa79224E5Cd7880e4329A17c479EFEa96334359eF)|
<!--
Implementation addresses. DO NOT use these addresses directly.
Use their proxied counterparts seen above.

-->
---
## STARDUST

Network : __rinkeby (chain id: 4)__

|Contract|Address|
|--|--|
|BondManager|[0x9D9cb79c7741adD5A468FEaA7d8c9F21A9D16873](https://rinkeby.etherscan.io/address/0x9D9cb79c7741adD5A468FEaA7d8c9F21A9D16873)|
|CanonicalTransactionChain|[0x8872d61135E71745Da6Ddda1F98d4b79E599E889](https://rinkeby.etherscan.io/address/0x8872d61135E71745Da6Ddda1F98d4b79E599E889)|
|ChainStorageContainer-CTC-batches|[0xa04060eFAFE3c63De460E53151c0206A886576a0](https://rinkeby.etherscan.io/address/0xa04060eFAFE3c63De460E53151c0206A886576a0)|
|ChainStorageContainer-CTC-queue|[0x3f33339857C795a50E7F741C3df4C2abb9d97383](https://rinkeby.etherscan.io/address/0x3f33339857C795a50E7F741C3df4C2abb9d97383)|
|ChainStorageContainer-SCC-batches|[0x4e9F8D9CDE0f19490b7e6Cc04CE20F9612262C72](https://rinkeby.etherscan.io/address/0x4e9F8D9CDE0f19490b7e6Cc04CE20F9612262C72)|
|L1StandardBridge_for_verification_only|[0x7AE95D1241d7B27312baA8245dfAC80B08E2e68a](https://rinkeby.etherscan.io/address/0x7AE95D1241d7B27312baA8245dfAC80B08E2e68a)|
|Lib_AddressManager|[0xC9EB2B0bD7dbA69bb72886E9cF5da34d1Ca88C38](https://rinkeby.etherscan.io/address/0xC9EB2B0bD7dbA69bb72886E9cF5da34d1Ca88C38)|
|MVM_CanonicalTransaction|[0xCCB4a3279310Ed85A3ff1Ef84DE1a9d91fAF56e0](https://rinkeby.etherscan.io/address/0xCCB4a3279310Ed85A3ff1Ef84DE1a9d91fAF56e0)|
|MVM_CanonicalTransaction_for_verification_only|[0x76d4Fc1CB6D554ff9A065914A22C46df0ffB8A6D](https://rinkeby.etherscan.io/address/0x76d4Fc1CB6D554ff9A065914A22C46df0ffB8A6D)|
|MVM_DiscountOracle|[0x9db3BedF13fa81a887DA2010470E4A5E49523239](https://rinkeby.etherscan.io/address/0x9db3BedF13fa81a887DA2010470E4A5E49523239)|
|MVM_L2ChainManagerOnL1_for_verification_only|[0x23b1BFb369667cc0bDa7B1da628268d3531d1D38](https://rinkeby.etherscan.io/address/0x23b1BFb369667cc0bDa7B1da628268d3531d1D38)|
|MVM_Verifier|[0xA9b8E3a95e0E22352747Ab5395Ec535Cd113016a](https://rinkeby.etherscan.io/address/0xA9b8E3a95e0E22352747Ab5395Ec535Cd113016a)|
|MVM_Verifier_for_verification_only|[0xe47bc1F78BFF44b144b4830f0651908012d1E99d](https://rinkeby.etherscan.io/address/0xe47bc1F78BFF44b144b4830f0651908012d1E99d)|
|OVM_L1CrossDomainMessenger|[0xFbB32A0b32FE568B5e11829C83c4f20397c6f740](https://rinkeby.etherscan.io/address/0xFbB32A0b32FE568B5e11829C83c4f20397c6f740)|
|Proxy__MVM_CanonicalTransaction|[0x4fB8A54377d5c2D24a61Fb51D78cceC0B3221412](https://rinkeby.etherscan.io/address/0x4fB8A54377d5c2D24a61Fb51D78cceC0B3221412)|
|Proxy__MVM_ChainManager|[0x5553c94Cf01e1e631F9F92F26Afb1383F17a8D30](https://rinkeby.etherscan.io/address/0x5553c94Cf01e1e631F9F92F26Afb1383F17a8D30)|
|Proxy__MVM_Verifier|[0x33f81D2E1E1203A3186BE79022CC36C5b929E9f9](https://rinkeby.etherscan.io/address/0x33f81D2E1E1203A3186BE79022CC36C5b929E9f9)|
|Proxy__OVM_L1CrossDomainMessenger|[0xfD1b91066D27345023eBE2FE0D4C59d78c46129f](https://rinkeby.etherscan.io/address/0xfD1b91066D27345023eBE2FE0D4C59d78c46129f)|
|Proxy__OVM_L1StandardBridge|[0x056999aea33e5A6e51b5cF24a0684d565dF741EF](https://rinkeby.etherscan.io/address/0x056999aea33e5A6e51b5cF24a0684d565dF741EF)|
|StateCommitmentChain|[0xA9917d31D30048Dcf257639FE777F6606A100F89](https://rinkeby.etherscan.io/address/0xA9917d31D30048Dcf257639FE777F6606A100F89)|
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
