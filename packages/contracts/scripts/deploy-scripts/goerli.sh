#!/bin/bash

### DEPLOYMENT SCRIPT ###
# To be called from root of contracts dir #

# Required env vars
if [[ -z "$CONTRACTS_DEPLOYER_KEY" ]]; then
  echo "Must pass CONTRACTS_DEPLOYER_KEY"
  exit 1
fi
if [[ -z "$CONTRACTS_RPC_URL" ]]; then
  echo "Must pass CONTRACTS_RPC_URL"
  exit 1
fi

CONTRACTS_TARGET_NETWORK=goerli \
npx hardhat deploy \
  --ctc-max-transaction-gas-limit 1100000000 \
  --ctc-enqueue-gas-cost 60000 \
  --ctc-l2-gas-discount-divisor 32 \
  --l1-block-time-seconds 15 \
  --ovm-address-manager-owner 0x8F6b91322dD52131fFACE493D1A36F7103bB246C \
  --ovm-sequencer-address 0x8F6b91322dD52131fFACE493D1A36F7103bB246C \
  --ovm-proposer-address 0x8F6b91322dD52131fFACE493D1A36F7103bB246C \
  --scc-fraud-proof-window 10 \
  --scc-sequencer-publish-window 12592000 \
  --network goerli \
  --num-deploy-confirmations 0 \
  --mvm-metis-address 0x114f836434A9aa9ca584491E7965b16565bF5d7b \
  --mvm-metis-manager 0x8F6b91322dD52131fFACE493D1A36F7103bB246C \
  --l2chainid 599 \
  "$@"
  
CONTRACTS_TARGET_NETWORK=goerli \
yarn autogen:markdown

CONTRACTS_TARGET_NETWORK=goerli \
yarn build:dumpaddr

cd ./dist/dumps
exec python3 -c \
              'import http.server as hs; hs.HTTPServer(("0.0.0.0", 8081), hs.SimpleHTTPRequestHandler).serve_forever()'
