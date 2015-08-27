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
