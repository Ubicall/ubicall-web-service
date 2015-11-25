FROM node:0.12.7-wheezy
MAINTAINER Waleed Samy <waleed_samy@ymail.com>

RUN mkdir -p /var/www/{agent,static} && mkdir -p /var/www/agent/avatar/
RUN npm install -g forever grunt-cli bower


RUN mkdir -p /src

WORKDIR /src
ADD . /src

# Expose port
EXPOSE  4000

# Run app using nodemon
CMD ["node", "/src/api.js"]