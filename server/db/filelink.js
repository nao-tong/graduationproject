/**
 * 封装文件链接表
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

//添加用户
function addUser(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('INSERT INTO file (userid) VALUES (' +'"'+ userid +'"'+ ')', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

//添加文件
function addfile(object, callback) {
    connectdb();
    connection.connect();
    connection.query('', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

exports.addUser = addUser