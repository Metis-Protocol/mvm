#!/bin/bash

RETRIES=10
URL=https://metis-us-east-2-goerli.s3.us-east-2.amazonaws.com/addresses.json
ADDRESSES=$(curl --fail --show-error --silent --retry-connrefused --retry $RETRIES --retry-delay 5 $URL)

for s in $(echo $ADDRESSES | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
    export $s
done

# set the address to the proxy gateway if possible
export L1_STANDARD_BRIDGE_ADDRESS=$Proxy__OVM_L1StandardBridge
if [ $L1_STANDARD_BRIDGE_ADDRESS == null ]; then
    export L1_STANDARD_BRIDGE_ADDRESS=$L1StandardBridge
fi

export L1_CROSS_DOMAIN_MESSENGER_ADDRESS=$Proxy__OVM_L1CrossDomainMessenger
if [ $L1_CROSS_DOMAIN_MESSENGER_ADDRESS == null ]; then
    export L1_CROSS_DOMAIN_MESSENGER_ADDRESS=$L1CrossDomainMessenger
fi

export L1_METIS_MANAGER_ADDRESS=$Proxy__MVM_ChainManager
if [ $L1_METIS_MANAGER_ADDRESS == null ]; then
    export L1_METIS_MANAGER_ADDRESS=$MVM_ChainManager
fi

export L2_BLOCK_GAS_LIMIT=1100000000
export L2_CHAIN_ID=599
export BLOCK_SIGNER_ADDRESS=0x00000398232E2064F896018496b4b44b3D62751F
export L1_FEE_WALLET_ADDRESS=0x8F6b91322dD52131fFACE493D1A36F7103bB246C
export WHITELIST_OWNER=0x8F6b91322dD52131fFACE493D1A36F7103bB246C
export GAS_PRICE_ORACLE_OWNER=0x8F6b91322dD52131fFACE493D1A36F7103bB246C
export GAS_PRICE_ORACLE_OVERHEAD=2750
export GAS_PRICE_ORACLE_SCALAR=1500000
export GAS_PRICE_ORACLE_L1_BASE_FEE=1200000000
export GAS_PRICE_ORACLE_GAS_PRICE=60000000
export GAS_PRICE_ORACLE_DECIMALS=6
export METIS_ADDRESS=0x114f836434A9aa9ca584491E7965b16565bF5d7b
export MIN_L1_ERC20_BRIDGE_COST=1000000
export BERLIN_BLOCK=0

yarn build:dump

cd ./dist/dumps
exec python3 -c \
              'import http.server as hs; hs.HTTPServer(("0.0.0.0", 8081), hs.SimpleHTTPRequestHandler).serve_forever()'