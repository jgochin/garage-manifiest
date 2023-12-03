#!/bin/bash

# Build Server
echo "Building server"
pushd ./server
yarn build
popd

# Build Client
echo "Build client"
pushd ./client
yarn build
popd