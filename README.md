# ubicall-web-service
exposed ubicall web service for public and internal use


**generate & deploy API documentation :**
  *make sure user who run grunt command has folder   __~./conf/ubicall.js__  in his home directory*
``` bash
npm install
grunt jsdoc:docs copy:docs
node index.js
```
**create model from db using :**
``` bash
sequelize-auto -o "./storage/models/ubicall" -d ubicall -h localhost -u root -p 3306 -x root -e mysql
sequelize-auto -o "./storage/models/ast_rt" -d ast_rt -h localhost -u root -p 3306 -x root -e mysql
sequelize-auto -o "./storage/models/web_fs_db" -d WEB_FS_DB -h localhost -u root -p 3306 -x root -e mysql
```
**how to contribute :**

1. will create branch with your feature or fix i.e. feature-xx , fix-xx
2. open pull request describing what your code change and assign devloper to review this code ,after reviewing he/she will merge this code on master branch (but make sure it work and has no problem otherwise you will be in charge for pushing untested code on our stable branches)

__ tested github protected branches __
