# eatogether
a mobile app:)

## Frontend: Expo React Native App
### 1. Install dependencies
Run 
```
cd ./frontend/eatogether
npm install --legacy-peer-deps
``` 

### 2. Run expo server
Run 
```
npx expo start 
```
---
## Backend: Node-red and Postgres with Docker Compose

### 1. Install docker and docker-compose
### 2. Run docker-compose script
```
cd ./backend
docker-compose up
```

### 3. Visit node-red UI for backend flows
Go to https://localhost:1880/et-admin
(Our production backend is deployed on https://api.eatogether.site/et-admin)

Log in as User: `admin` password: `COMP90018$`
