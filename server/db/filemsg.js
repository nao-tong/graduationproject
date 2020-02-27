/**
 * 封装文件信息表
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

//添加文件
function addfile(fileobj, callback) {
    connectdb();
    connection.connect();
    connection.query('INSERT INTO filemsg (fileid,filename,filetype,filesize,updt,filepath) VALUES (' + '"' + fileobj.fileid + '"' + ',' + '"' + fileobj.filename + '"' + ',' + '"' + fileobj.filetype + '"' + ',' + '"' + fileobj.filesize + '"' + ',' + '"' + fileobj.update + '"' + ',' + '"' + fileobj.filepath + '"' + ')', function (error, results, fields) {
        if (error) throw error;
        callback(results.affectedRows);
    });
    connection.end();
}


exports.addflie = addfile