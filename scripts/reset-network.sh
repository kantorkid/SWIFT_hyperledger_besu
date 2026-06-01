#!/bin/bash

pkill -f besu || true

rm -rf Node-1/data/database Node-1/data/caches
rm -rf Node-2/data/database Node-2/data/caches
rm -rf Node-3/data/database Node-3/data/caches
rm -rf Node-4/data/database Node-4/data/caches

echo "QBFT network reset complete."
