#!/bin/bash

# Build Server
pushd ./server
yarn build
popd

# Build Client
pushd ./client
yarn build
popd