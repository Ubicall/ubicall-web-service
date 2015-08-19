# ubicall-web-service
exposed ubicall web service for public and internal use , to make CRUD operations on calls , feedback , agent and queues tables

**create model from db using :**
``` bash
sequelize-auto -o "./storage/ubicall/models" -d ubicall -h localhost -u sand -p 3306 -x sand -e mysql
sequelize-auto -o "./storage/ast_rt/models" -d ast_rt -h localhost -u sand -p 3306 -x sand -e mysql
```
