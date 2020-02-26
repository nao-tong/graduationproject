/**
 * 表连接
 * 创建连接字段（用于存放文件路径）
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


//添加用户id
function addUser(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('INSERT INTO linktable (userid) VALUES (' +'"'+ userid +'"'+ ')', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

//添加字段
function addField(tablename,field,callback) {
    connectdb();
    connection.connect();
    connection.query('ALTER TABLE ' + tablename +
    ' ADD ' + field + ' VARCHAR(255)',
    function (error, results, fields) {
        if (error) throw error;
        callback(results.protocol41);
    });
    connection.end();
}

//删除字段
function deleteField(tablename,field,callback) {
    connectdb();
    connection.connect();
    connection.query('ALTER TABLE ' + tablename +
    ' DROP ' + field,
    function (error, results, fields) {
        if (error) throw error;
        callback(results.protocol41);
    });
    connection.end();
}

//获取表字段
function descTable(tablename,callback){
    connectdb();
    connection.connect();
    connection.query('desc ' + tablename + ';',
    function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}

exports.addUser = addUser
exports.addField = addField
exports.deleteField = deleteField
exports.descTable = descTable



