FROM mysql:5.6
MAINTAINER Waleed Samy <waleed_samy@ymail.com>

ENV MYSQL_ROOT_PASSWORD "root"
ENV MYSQL_USER  "ubiuser"
ENV MYSQL_PASSWORD  "UbIPaWd15dB@1"
ENV MYSQL_DATABASE  "WEB_FS_DB"

# copy web_fs_db.sql to /docker-entrypoint-initdb.d/ to be executed
ADD web_fs_db.sql /docker-entrypoint-initdb.d/