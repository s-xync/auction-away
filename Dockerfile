FROM node:latest
RUN mkdir -p /usr/src/auction-away
WORKDIR /usr/src/auction-away
COPY package.json /usr/src/auction-away/
RUN npm install
copy . /usr/src/auction-away
EXPOSE 3000
CMD ["npm","start"]
