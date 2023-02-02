#/usr/bin/env bash

cd regis/src

ts-node-esm ./scripts/importRounds.ts ./data/qpui2/round1.yaml ./data/qpui2/round2.yaml ./data/qpui2/round25.yaml ./data/qpui2/round3.yaml && ts-node-esm ./scripts/importTeams.ts ./data/qpui2/teams.yaml