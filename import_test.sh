#/usr/bin/env bash

cd regis/src

ts-node-esm ./scripts/importRoundsTest.ts ./data/qpui1/round1.yaml ./data/qpui1/round2.yaml ./data/qpui1/round25.yaml ./data/qpui1/round3.yaml && ts-node-esm ./scripts/importTeamsTest.ts ./data/qpui1/teams.yaml