/**
 * 用户创建数据库表
 * 变量名对应对象索引名，对应数据库字段名
 */

var mysql = require('mysql');

var connection;

//封装连接函数
var connectdb = function () {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '980921',
        database: 'graduationdesign'
    });
}

//创建表
function createTable(){
    connectdb();
    connection.connect();
    connection.query('',
    function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}