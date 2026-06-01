#!/bin/bash

BOOTNODE="enode://e70893dc45c35288a56f933813fa1839e9af8f2f91f38f010d9c33f459db35eca85b3cf1a37924e033bee63c49de38f1cd54d91f97fe5e681aae34a863c7a7a3@127.0.0.1:30303"

echo "Starting Node-1..."
cd Node-1
besu \
--data-path=data \
--genesis-file=../genesis.json \
--permissions-nodes-config-file-enabled \
--permissions-accounts-config-file-enabled \
--rpc-http-enabled \
--rpc-http-api=ADMIN,ETH,NET,QBFT,PERM,TXPOOL \
--host-allowlist="*" \
--rpc-http-cors-origins="all" \
--profile=ENTERPRISE \
--metrics-enabled \
--metrics-host=0.0.0.0 \
--metrics-port=9545 \
--metrics-protocol=PROMETHEUS \
> ../node1.log 2>&1 &
cd ..

sleep 5

echo "Starting Node-2..."
cd Node-2
besu \
--data-path=data \
--genesis-file=../genesis.json \
--bootnodes=$BOOTNODE \
--p2p-port=30304 \
--permissions-nodes-config-file-enabled \
--permissions-accounts-config-file-enabled \
--rpc-http-enabled \
--rpc-http-port=8546 \
--rpc-http-api=ADMIN,ETH,NET,QBFT,PERM,TXPOOL \
--host-allowlist="*" \
--rpc-http-cors-origins="all" \
--profile=ENTERPRISE \
--metrics-enabled \
--metrics-host=0.0.0.0 \
--metrics-port=9546 \
--metrics-protocol=PROMETHEUS \
> ../node2.log 2>&1 &
cd ..

echo "Starting Node-3..."
cd Node-3
besu \
--data-path=data \
--genesis-file=../genesis.json \
--bootnodes=$BOOTNODE \
--p2p-port=30305 \
--permissions-nodes-config-file-enabled \
--permissions-accounts-config-file-enabled \
--rpc-http-enabled \
--rpc-http-port=8547 \
--rpc-http-api=ADMIN,ETH,NET,QBFT,PERM,TXPOOL \
--host-allowlist="*" \
--rpc-http-cors-origins="all" \
--profile=ENTERPRISE \
--metrics-enabled \
--metrics-host=0.0.0.0 \
--metrics-port=9547 \
--metrics-protocol=PROMETHEUS \
> ../node3.log 2>&1 &
cd ..

echo "Starting Node-4..."
cd Node-4
besu \
--data-path=data \
--genesis-file=../genesis.json \
--bootnodes=$BOOTNODE \
--p2p-port=30306 \
--permissions-nodes-config-file-enabled \
--permissions-accounts-config-file-enabled \
--rpc-http-enabled \
--rpc-http-port=8548 \
--rpc-http-api=ADMIN,ETH,NET,QBFT,PERM,TXPOOL \
--host-allowlist="*" \
--rpc-http-cors-origins="all" \
--profile=ENTERPRISE \
--metrics-enabled \
--metrics-host=0.0.0.0 \
--metrics-port=9548 \
--metrics-protocol=PROMETHEUS \
> ../node4.log 2>&1 &
cd ..

echo "All QBFT permissioned nodes started 🚀"

echo "Node status:"
sleep 8

curl -X POST \
-H "Content-Type: application/json" \
--data '{"jsonrpc":"2.0","method":"qbft_getValidatorsByBlockNumber","params":["latest"],"id":1}' \
localhost:8545

echo ""