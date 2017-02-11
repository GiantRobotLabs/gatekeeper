FROM node:alpine
COPY gk.js /gatekeeper/gk.js
RUN npm install restify
WORKDIR /gatekeeper
EXPOSE 3000
ENTRYPOINT ["node", "gk.js"]

