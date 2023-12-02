#!/bin/bash

REMOTE_SERVER=gochinj@razzie1.gochin.home

mongoexport --host 127.0.0.1  --port 27017 --db garageManifest --collection manifestitems --out ./mongo-export/manifestitems.data
mongoexport --host 127.0.0.1  --port 27017 --db garageManifest --collection locations --out ./mongo-export/locations.data
mongoexport --host 127.0.0.1  --port 27017 --db garageManifest --collection locationImages.files --out ./mongo-export/loctionImages.files.data
mongoexport --host 127.0.0.1  --port 27017 --db garageManifest --collection locationImages.chunks --out ./mongo-export/loctionImages.chunks.data

# copy DB stuff
rsync -av -e "ssh -i $HOME/.ssh/id_rsa" "$HOME/ws/garage-manifest/mongo-import.sh" $REMOTE_SERVER:"/var/lib/nodejs/"
rsync -av -e "ssh -i $HOME/.ssh/id_rsa" "$HOME/ws/garage-manifest/mongo-export/*" $REMOTE_SERVER:"/var/lib/nodejs/mongo-import/"
