# ubicall-web-service
exposed ubicall web service for public and internal use , to make CRUD operations on calls , feedback , agent and queues tables

**How to install :**
```
npm install
```
**generate & deploy API documentation :**
``` bash
grunt jsdoc:docs copy:docs
```
**create model from db using :**
``` bash
sequelize-auto -o "./storage/models/ubicall" -d ubicall -h localhost -u root -p 3306 -x root -e mysql
sequelize-auto -o "./storage/models/ast_rt" -d ast_rt -h localhost -u root -p 3306 -x root -e mysql
sequelize-auto -o "./storage/models/web_fs_db" -d WEB_FS_DB -h localhost -u root -p 3306 -x root -e mysql
```
