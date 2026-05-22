# blaise.style

Base de site vitrine pour Blaise, solution de gestion de salon avec formulaire de contact SMTP.

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Copier la configuration d'environnement :

```bash
cp .env.example .env
```

3. Compléter les variables SMTP dans `.env` :

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`

4. Générer le CSS Tailwind :

```bash
npm run build
```

5. Démarrer le serveur :

```bash
npm start
```

6. Ouvrir `http://localhost:3000`

## Déploiement avec Nginx

1. Construire le CSS en production :

```bash
npm run build
```

2. Copier le projet sur le serveur ou cloner le dépôt.

3. Installer Node.js et les dépendances :

```bash
npm install
```

4. Copier `.env.example` en `.env` et remplir les paramètres SMTP.

5. Lancer l'application en arrière-plan. Par exemple avec `pm2` :

```bash
npm install -g pm2
pm2 start server.js --name blaise-style
```

6. Configurer Nginx pour faire le proxy inverse vers l'application Node. Exemple de bloc Nginx :

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

7. Tester la configuration Nginx :

```bash
sudo nginx -t
```

8. Redémarrer Nginx :

```bash
sudo systemctl restart nginx
```

9. Visiter votre domaine (`http://example.com`) pour vérifier que le site est servi correctement.
