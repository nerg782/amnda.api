# Cano Template

| Variable | Description |
| ------ | ------ |
| PORT | Current port of the app |
| NODE_ENV | Current environment of app |
| MONGODB_URI | URI of connection to mongodb |
| JWT_TOKEN_SECRET | The JWT secret key |
| HOST_MAIL | Host mail service |
| PORT_MAIL | Port mail service |
| EMAIL_USER | Email emitter mails |
| PASSWORD_USER | Password emitter mails |
| FROM_MAIL | Text name for emitter mails |

### Install dependecies
With NPM:
```sh
$ npm i
```
or Yarn:
```sh
$ yarn
```
### Build app
With NPM:
```sh
$ npm run build
```
or Yarn:
```sh
$ yarn build
```
### Run app in develop env
With NPM:
```sh
$ npm start
```
or Yarn:
```sh
$ yarn start
```
### Run app in production env
With node js:
```sh
$ node dist/server.js
```
or PM2:
```sh
$ pm2 start dist/server.js
```
