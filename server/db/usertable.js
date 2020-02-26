/**
 * 封装用户表（user）操作
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

//添加用户
function addUser(userobject, callback) {
    connectdb();
    connection.connect();
    connection.query('INSERT INTO user (username,userid,password,headimg,admin) VALUES (' + '"' + userobject.username + '"' + ',' + '"' + userobject.userid + '"' + ',' + '"' + userobject.password + '"' + ',' + '"' + userobject.headimg + '"' + ',' + userobject.admin + ')', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

//查询所有
function findAll(callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM user', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}

//查询一个
function findOne(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM user WHERE userid = ' + '"' + userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results))[0]);
    });
    connection.end();
}

//查询最后一个
function findLast(callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM user ORDER BY serial DESC limit 1', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results))[0]);
    });
    connection.end();
}

//更新数据(id必要)
function upDate(userdata, callback) {
    let objlength = Object.keys(userdata).length
    connectdb();
    connection.connect();
    for (let item in userdata) {
        if (item == 'userid') {
            continue
        } else{
            connection.query('UPDATE user SET ' + item + '= ' + '"' + userdata[item] + '"' + ' WHERE userid = ' + '"' + userdata.userid + '"', function (error, results, fields) {
                objlength--;
                if (error) throw error;
                if (objlength == 1) {
                    callback(results.affectedRows)
                }
            });
        }
    }
    connection.end();
}

//删除数据(只需要id)
function deleteData(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('DELETE FROM user WHERE userid = ' + userid, function (error, results, fields) {
        if (error) throw error;
        callback(result.affectedRows)
    });
    connection.end();
}

exports.findAll = findAll;
exports.findOne = findOne;
exports.findLast = findLast;
exports.addUser = addUser;
exports.upDate = upDate;
exports.deleteData = deleteData;