FROM node:0.12.7-wheezy
MAINTAINER Waleed Samy <waleed_samy@ymail.com>

RUN npm install -g forever grunt-cli bower

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

WORKDIR /src
ADD . /src

# Expose port
EXPOSE  4000

# Run app using nodemon
CMD ["forever", "start", "/src/api.js"]