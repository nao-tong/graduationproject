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

//查询所有
function findAll(callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM file', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results)));
    });
    connection.end();
}

//查询一个
function findOne(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('SELECT * FROM file WHERE userid = ' + '"' + userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(JSON.parse(JSON.stringify(results))[0]);
    });
    connection.end();
}

//添加用户
function addUser(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('INSERT INTO file (userid) VALUES (' + '"' + userid + '"' + ')', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
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

//封装判断字段是否为空（返回第一个为空的字段）
function judgeField(userid, callback) {
    connectdb();
    connection.connect();
    connection.query('',
        function (error, results, fields) {
            if (error) throw error;
            callback(JSON.parse(JSON.stringify(results)));
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

//更新数据(id必要)
function upDate(fileobj, callback) {
    connectdb();
    connection.connect();
    connection.query('UPDATE file SET ' + fileobj.field + '= ' + '"' + fileobj.fileid + '"' + ' WHERE userid = ' + '"' + fileobj.userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows)
    });
    connection.end();
}

//添加文件
function addFile(fileobj, callback) {
    connectdb();
    connection.connect();
    connection.query('UPDATE user SET ' + item + '= ' + '"' + fileobj.fileid + '"' + ' WHERE userid = ' + '"' + fileobj.userid + '"', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}

//添加字段demo
// descTable('file',function(data){
//     console.log(data[data.length - 1].Field.indexOf('file'))
//     if(!data[data.length - 1].Field.indexOf('file')){
//         let field = 'file'+ (Number(data[data.length - 1].Field.split('e')[1]) + 1)
//         addField('file',field,function(data){
//             console.log('123')
//         })
//     }else{
//         addField('file','file1',function(data){
//             console.log('456')
//         })
//     }
//     console.log(data[data.length - 1].Field)
// })

//删除字段demo
// deleteField('file','file1',function(){})

//删除某一文件id

findOne('0',function(data){
    console.log(data)
})



exports.findAll = findAll
exports.findOne = findOne
exports.addField = addField
exports.descTable = descTable
exports.deleteField = deleteField
exports.addUser = addUser
exports.upDate = upDate
exports.addFile = addFile