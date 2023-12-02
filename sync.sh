#!/bin/bash

# Sync changes with the server
rsync -av -e "ssh -i $HOME/.ssh/id_rsa" "$HOME/ws/garage-manifest/server/dist/" $REMOTE_SERVER:"/var/lib/nodejs/garage.gochin.home/"

