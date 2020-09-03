Commande Docker a lancer pour créer l'image

Après avoir construit le code : npm run build

docker build --tag printerapi:1.8 .
docker run --publish 8000:3000 --detach --name printer-api printerapi:1.8