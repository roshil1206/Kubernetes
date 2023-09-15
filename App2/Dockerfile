# Reffered from https://docs.docker.com/engine/reference/builder/
# Reffered from https://hub.docker.com/_/node/tags

FROM node:slim
WORKDIR /app
COPY . .
RUN npm install
CMD "npm" "start"
EXPOSE 3500