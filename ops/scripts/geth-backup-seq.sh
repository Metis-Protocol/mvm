#!/bin/sh

# FIXME: Cannot use set -e since bash is not installed in Dockerfile
# set -e

RETRIES=${RETRIES:-40}
VERBOSITY=${VERBOSITY:-6}

# get the genesis file from the deployer
curl \
    --fail \
    --show-error \
    --silent \
    --retry-connrefused \
    --retry $RETRIES \
    --retry-delay 5 \
    $ROLLUP_STATE_DUMP_PATH \
    -o genesis.json

# wait for the dtl to be up, else geth will crash if it cannot connect
curl \
    --fail \
    --show-error \
    --silent \
    --output /dev/null \
    --retry-connrefused \
    --retry $RETRIES \
    --retry-delay 1 \
    $ROLLUP_CLIENT_HTTP

# import the key that will be used to locally sign blocks
# this key does not have to be kept secret in order to be secure
# we use an insecure password ("pwd") to lock/unlock the password
echo "Importing private key"
echo $BLOCK_SIGNER_KEY > key.prv
echo "pwd" > password
geth account import --password ./password ./key.prv

# initialize the geth node with the genesis file
echo "Initializing Geth other sequencer node"
geth --verbosity="$VERBOSITY" "$@" init genesis.json

# get the main node's enode
l2URL = "http://l2geth:8545"
if [ "$L2_URL" != "" ]; then 
    l2URL = $L2_URL
fi
JSON='{"jsonrpc":"2.0","id":0,"method":"admin_nodeInfo","params":[]}'
NODE_INFO=$(curl --silent --fail --show-error -H "Content-Type: application/json" --retry-connrefused --retry $RETRIES --retry-delay 3  -d $JSON $l2URL)
NODE_ENODE=$(echo $NODE_INFO | jq -r '.result.enode')
NODE_IP=$(echo $NODE_INFO | jq -r '.result.ip')
if [ "$NODE_IP" = "127.0.0.1" ];then
    HOST_IP=$(/sbin/ip route | awk '/default/ { print $3 }')
    if [ "$L2_MAIN_IP" != "" ]; then
       HOST_IP=$L2_MAIN_IP
    fi
    NODE_ENODE=${NODE_ENODE//127.0.0.1/$HOST_IP}
fi
touch $(echo $DATADIR)/static-nodes.json

echo $DATADIR

echo "[\"$NODE_ENODE\"]"
echo "[\"$NODE_ENODE\"]" > $(echo $DATADIR)/static-nodes.json
# start the geth node
echo "Starting Geth sequencer backup node"

exec geth \
  --verbosity="$VERBOSITY" \
  --password ./password \
  --allow-insecure-unlock \
  --unlock $BLOCK_SIGNER_ADDRESS \
  --mine \
  --miner.etherbase $BLOCK_SIGNER_ADDRESS \
  --syncmode full \
  --gcmode archive \
  "$@"
