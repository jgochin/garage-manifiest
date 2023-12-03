#!/bin/bash
export REMOTE_SERVER=gochinj@razzie1.gochin.home

# Full build
./build.sh

# Sync changes with the server
./sync.sh