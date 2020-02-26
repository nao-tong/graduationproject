/**
 * 封装数据的增删改查
 * 变量名对应对象索引名，对应数据库字段名
 */

var mysql = require('mysql');

var connection;

var connectdb = function () {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '980921',
        database: 'graduationdesign'
    });
}

