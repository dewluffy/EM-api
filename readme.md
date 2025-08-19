EmployeeManager
===
### env guide
PORT=8899  
DATABASE_URL= ***  
JWT_SECRET= ***  

---
### service
|path |method |authen |params |query |body |
|:-- |:-- |:-- |:-- |:-- |:-- |
|/api/auth/login|post|-|-|-| {identity, password}
|/api/auth/register|post|-|-|-| {identity, firstName, lastName, password, confirmPassword}

---
