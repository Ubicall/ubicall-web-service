FROM mysql:5.6
MAINTAINER Waleed Samy <waleed_samy@ymail.com>

ENV MYSQL_ROOT_PASSWORD "root"
ENV MYSQL_USER  "ubiuser"
ENV MYSQL_PASSWORD  "UbIPaWd15dB@1"
ENV MYSQL_DATABASE  "ast_rt"

# copy ast_rt.sql to /docker-entrypoint-initdb.d/ to be executed
ADD ast_rt.sql /docker-entrypoint-initdb.d/