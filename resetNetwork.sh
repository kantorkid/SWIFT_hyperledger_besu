#!/bin/bash

echo "Stopping Besu nodes..."
pkill -f besu

echo "Deleting blockchain data..."
rm -rf Node-1/data/database Node-2/data/database Node-3/data/database Node-4/data/database
rm -rf Node-1/data/caches Node-2/data/caches Node-3/data/caches Node-4/data/caches

echo "QBFT network reset complete."