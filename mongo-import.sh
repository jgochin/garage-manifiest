
mongoimport --host 127.0.0.1  --port 27017 --db garageManifest --collection manifestitems --file ./mongo-import/manifestitems.data
mongoimport --host 127.0.0.1  --port 27017 --db garageManifest --collection locations --file ./mongo-import/locations.data
mongoimport --host 127.0.0.1  --port 27017 --db garageManifest --collection locationImages.files --file ./mongo-import/loctionImages.files.data
mongoimport --host 127.0.0.1  --port 27017 --db garageManifest --collection locationImages.chunks --file ./mongo-import/loctionImages.chunks.data
