#!/bin/bash

yarn clean 
npx tsc -p tsconfig.prod.json 
npx tsc-alias 
cp package.json ./dist/ 
cp .env.prod ./dist/.env

pushd dist
yarn install --prod
popd

