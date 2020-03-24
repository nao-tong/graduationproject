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

//修改表名
function renameTable(oldname, newname, callback) {
    connectdb();
    connection.connect();
    connection.query('ALTER TABLE ' + oldname + ' RENAME TO ' + newname,
        function (error, results, fields) {
            if (error) throw error;
            callback(results.warningCount);
        });
    connection.end();
}

//删除表
function deleteTable(tablename, callback) {
    connectdb();
    connection.connect();
    connection.query('DROP TABLE ' + tablename,
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

//删除字段
function deleteField(tablename, field, callback) {
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
function upData(tablename, tabledata, callback) {
    let str = 'UPDATE tablename SET field=value WHERE serial=num'
    let field = ',field=value'
    let j = 0
    str = str.replace('tablename', tablename)
    for (let item in tabledata) {
        j++
        if (item == 'serial') {
            continue
        }
        if (j != Object.keys(tabledata).length) {
            str = str.replace('field=value', item + '=' + '"' + tabledata[item] + '"' + field)
        } else {
            str = str.replace('num', tabledata.serial)
            str = str.replace('field=value', item + '=' + '"' + tabledata[item] + '"')
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

//删除一条记录(id必要)
function delData(tablename, serial, callback) {
    connectdb();
    connection.connect();
    connection.query('DELETE FROM ' + tablename + ' WHERE serial = ' + serial,
        function (error, results, fields) {
            if (error) throw error;
            callback(results.warningCount);
        });
    connection.end();
}

//更新字段
function upField(tableobj, callback) {
    connectdb();
    connection.connect();
    connection.query('ALTER TABLE ' + tableobj.tablename + ' change ' + tableobj.oldfield + ' ' + tableobj.newfield + ' varchar(255)',
        function (error, results, fields) {
            if (error) throw error;
            callback(results.warningCount);
        });
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
function findAllTable(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('select table_name from information_schema.tables where table_schema="graduationdesign" and table_name like "%_' + userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}


exports.createTable = createTable
exports.renameTable = renameTable
exports.deleteTable = deleteTable
exports.addField = addField
exports.deleteField = deleteField
exports.addData = addData
exports.upData = upData
exports.delData = delData
exports.upField = upField
exports.findAll = findAll
exports.findAllTable = findAllTable
exports.descTable = descTable