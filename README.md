# app_ecommerce_bachelor_3

# Documentation
- General
  - [Database/README](./config/database/README.md)
- Backend
  - [backend/README](./backend/README.md)
- Frontend
  - [frontend/README](./frontend/README.md)

## Clone project

1. Go to https://gitlab.com/claudetsiangana/app_ecommerce_bachelor_3.
2. Execute command `git clone https://gitlab.com/claudetsiangana/app_ecommerce_bachelor_3.git`  

glpat-zCm1vUojGaUeJPzJPK5x


## Installation
Pour lancer le server api
```
cd backend 
npm install
npm run dev
```
Pour lancer le site
```
cd frontend/site
npm install
npm run dev
```
Pour lancer l'interface admin
```
cd frontend/admin
npm install
npm run dev
```
Pour lancer l'application mobile
- Commenssez par lancer un émulateur sur android studio ou xcode 
```
cd mobile
npm install
npm start
```
- Une fois l'application lancée, choisir la bonne option sur la console en fonction de votre configuration (exemple: sur la console press sur a pour lancer l'app sur l'émulateur android) 
- Si vous souhaitez lancer l'app sur votre propre téléphone, commencez par télécharger l'application expo sur google play ou app store, ensuite depuis votre camera scannez le qrcode sur la console (NB: votre pc et votre téléphone doivent être sur le même réseaux wifi).


# API Links

<!-- Liens pour backend -->
### Prod link
* https://..../api/v1

### Preprod link
* https://..../api/v1

### localhost link
* http://localhost:5173/

<!-- liens pour frontend -->
# App Links

### Prod links
* site: https://airneis.tsiang.fr/
* admin: https://admin-airneis.tsiang.fr/

### Preprod links
* https://  

### localhost link
* http://localhost:5173/



<!-- App avec docker -->
## Installation app avec docker

* ouvrir wsl et lancer run_dev_app.sh ou stop_dev_app.sh  

Pour lancer les apps(containers)
```
./run_dev_app.sh
```

Pour arrêter les apps(containers)
```
./stop_dev_app.sh
```
# App Links Docker

### localhost link
* site:    http://localhost:3000/
* admin:    http://localhost:3001/
