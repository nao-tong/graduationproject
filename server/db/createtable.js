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
function createTable(tablename, callback) {
    connectdb();
    connection.connect();
    connection.query('CREATE TABLE IF NOT EXISTS `' + tablename + '`(`serial` INT UNSIGNED AUTO_INCREMENT,PRIMARY KEY(`serial`))ENGINE=InnoDB DEFAULT CHARSET=utf8;',
        function (error, results, fields) {
            if (error) throw error;
            callback(results.warningCount);
        });
    connection.end();
}

//添加字段
function addField(tablename, field, callback) {
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

//获取表字段
function descTable(tablename, callback) {
    connectdb();
    connection.connect();
    connection.query('desc ' + tablename + ';',
        function (error, results, fields) {
            if (error) throw error;
            callback(JSON.parse(JSON.stringify(results)));
        });
    connection.end();
}

//插入数据
function addData(tablename, tableobj, callback) {
    let str = 'INSERT INTO tablename (field) VALUES (value)'
    let field = ',field'
    let value = ',value'
    let j = 0
    str = str.replace('tablename', tablename)
    for (let item in tableobj) {
        j++
        if (j != Object.keys(tableobj).length) {
            str = str.replace('field', item + field)
            str = str.replace('value', '"' + tableobj[item] + '"' + value)
        } else {
            str = str.replace('field', item)
            str = str.replace('value', '"' + tableobj[item] + '"')
        }
    }
    connectdb();
    connection.connect();
    connection.query(str, function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

//更新数据(id必要)
function upDate(tabledata, callback) {
    let objlength = Object.keys(userdata).length
    connectdb();
    connection.connect();
    for (let item in tabledata) {
        if (item == 'serial') {
            continue
        } else {
            connection.query('UPDATE user SET ' + item + '= ' + '"' + tabledata[item] + '"' + ' WHERE serial = ' + '"' + tabledata.serial + '"', function (error, results, fields) {
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

//查询所有
function findAll(tablename, callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM ' + tablename, function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}

//查询该用户名下的所有表
function findAllTable(userid,callback){
    connectdb();
    connection.connect();
    connection.query('select table_name from information_schema.tables where table_schema="graduationdesign" and table_name like "%_' + userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}


exports.createTable = createTable
exports.addField = addField
exports.addData = addData
exports.upDate = upDate
exports.findAll = findAll
exports.findAllTable = findAllTable
exports.descTable = descTable