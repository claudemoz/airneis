# Structure du project/backend

- Dossiers
  - config
    - Le dossier config comprend toute la configuration global à l'application comme la connexion à la base de données.

  - models
    - Le dossier models comprend pour toutes les models de l'application. Un model fait reference à une table dans une base de données relationnel comme mysql.
    - NB: chaque fichier du model comprend le nom du model suivi d'un point model. (ex, pour le model user  on aura user.model)

  - controllers
    - Le dossier controllers comprend toute les traitements d'intéraction avec la base de données.

  - routes
    - Le dossier routes comprend pour chaque resource toutes les routes qui intéragissent avec les controllers.

  - services
    - Le dossier services comprend toute l'interaction avec les services externes.

- NB: ----------.