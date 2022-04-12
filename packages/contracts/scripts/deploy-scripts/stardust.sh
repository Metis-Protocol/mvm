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

CONTRACTS_TARGET_NETWORK=stardust \
npx hardhat deploy \
  --ctc-max-transaction-gas-limit 1100000000 \
  --ctc-enqueue-gas-cost 60000 \
  --ctc-l2-gas-discount-divisor 32 \
  --l1-block-time-seconds 15 \
  --ovm-address-manager-owner 0x67bE001A254B81Dc44EaB9F5a7C66889a5c009AE \
  --ovm-sequencer-address 0x2897cb2D1d32871F01ea23850Ef8b592Dd65D595 \
  --ovm-proposer-address 0xc6903bfF3452a7adBFfCe597d36f36C3dE8aC060 \
  --scc-fraud-proof-window 10 \
  --scc-sequencer-publish-window 12592000 \
  --network stardust \
  --num-deploy-confirmations 0 \
  --mvm-metis-address 0xe552Fb52a4F19e44ef5A967632DBc320B0820639 \
  --mvm-metis-manager 0x67bE001A254B81Dc44EaB9F5a7C66889a5c009AE \
  --l2chainid 588 \
  "$@"
  
CONTRACTS_TARGET_NETWORK=stardust \
yarn autogen:markdown

CONTRACTS_TARGET_NETWORK=stardust \
yarn build:dumpaddr

cd ./dist/dumps
exec python -c \
            'import BaseHTTPServer as bhs, SimpleHTTPServer as shs; bhs.HTTPServer(("0.0.0.0", 8081), shs.SimpleHTTPRequestHandler).serve_forever()'
