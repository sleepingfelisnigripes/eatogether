# eatogether
a mobile app:)

## Frontend: Expo React Native App
### 1. Install dependencies
Run 
```
cd ./frontend/eatogether
npm install --legacy-peer-deps
``` 
* Due to dependencies introduced by Stream.io, the `--legacy-peer-deps` option is required for npm install

### 2. Run expo server
Run 
```
npx expo start 
```
---
## Backend: Node-red and Postgres with Docker Compose

### 1. Install docker and docker-compose

### 2. Prepare .env file
Here is the sample .env file
```
CF_TUNNEL_TOKEN_NR= {Cloudflare tunnel token for Node-red}
CF_TUNNEL_TOKEN_DB= {Cloudflare tunnel token for Postgres database}
PG_ADMIN_PASSWORD= C0MP90018@@
```

### 2. Run docker-compose script
```
cd ./backend
docker-compose up
```

### 3. Visit node-red UI for backend flows
Go to https://localhost:1880/et-admin

(Our live production backend is deployed on https://api.eatogether.site/et-admin)

Log in as User: `admin` password: `COMP90018$`
