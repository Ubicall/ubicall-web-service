# ubicall-web-service
exposed ubicall web service for public and internal use


**generate & deploy API documentation :**
  *make sure you add developer.dev.ubicall.com to your* **/etc/hosts** *file :*
  ```
  10.0.0.170  developer.dev.ubicall.com
  ```

``` bash
npm install
sudo grunt jsdoc:docs copy:docs
# node_env [test | development | production]
# demo_user - [true] use default user and will pass authentication middle ware
# db_env - [internal | external] control db connections attributes , default *internal* which use internal_ip and internal_port to connect to DB
# config_version - which configuration version you like to use i.e. 20150908
# in production we use forever : https://github.com/foreverjs/forever
node_env=test db_env=external demo_user=true config_version=20150908 node api.js
```
**create model from db using :**
``` bash
node_modules/sequelize-auto/bin/sequelize-auto -o "./storage/models/ubicall" -d ubicall -h localhost -u root -p 3306 -x root -e mysql
node_modules/sequelize-auto/bin/sequelize-auto -o "./storage/models/ast_rt" -d ast_rt -h localhost -u root -p 3306 -x root -e mysql
node_modules/sequelize-auto/bin/sequelize-auto -o "./storage/models/web_fs_db" -d WEB_FS_DB -h localhost -u root -p 3306 -x root -e mysql
```
**how to contribute :**

1. will create branch with your feature or fix i.e. feature-xx , fix-xx
2. open pull request describing what your code change and assign devloper to review this code ,after reviewing he/she will merge this code on master branch (but make sure it work and has no problem otherwise you will be in charge for pushing untested code on our stable branches)
