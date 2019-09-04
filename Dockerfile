FROM node:8.11.2-alpine

# File Author / Maintainer
MAINTAINER Antonio Mejias / Ernesto Rojas

#Setting enviroment variables
ENV appDir /var/www/app
ENV NODE_ENV development

#Setting work directory
WORKDIR ${appDir}

# Create app directory
RUN mkdir -p $appDir
RUN apk add --no-cache git

# Install app dependencies while the images is builded
ADD package.json $appDir
RUN npm i -g pm2
RUN yarn

# Bundle app source
ADD . $appDir

# Compilate the app
RUN yarn run build

EXPOSE 20145

# Staring App
ENTRYPOINT ["pm2", "start"]
CMD ["dist/server.js","--name=cano-tamplate","--no-daemon"]
