require('dotenv').config();
const mysql = require('mysql2');
module.exports={
  client: 'mysql2',
    connection: {
      host: process.env.STACKHERO_MYSQL_HOST,
      port: 3306,
      user: process.env.STACKHERO_MYSQL_USER,
      password: process.env.STACKHERO_MYSQL_ROOT_PASSWORD,
      database: process.env.STACKHERO_MYSQL_DATABASE,
      ssl:{}
    }
  }

