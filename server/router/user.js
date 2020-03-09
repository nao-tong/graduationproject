/**
 * 设置路由
 * 1、登录(后台验证)
 * 2、注册
 * 3、个人页面
 */

//引入模块
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const multer = require('multer');
const aes = require('../encAnddec/aes')
const JwtUtil = require('../encapsulation/jwt')
const usertable = require('../db/usertable')
const tablelink = require('../db/tablelink')
const createtable = require('../db/createtable')
const filelink = require('../db/filelink')
const filemsg = require('../db/filemsg')


var user = express.Router();

// body-parser配置
user.use(bodyParser.urlencoded({ extended: false }))
user.use(bodyParser.json())
//multer配置
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let userid = '';
        let filetype;
        let upl = String(file.mimetype).split('/')[0];
        if (req.headers.userid != undefined) {
            userid = aes.Decrypt(req.headers.userid)
        }
        if (upl == 'image') {
            filetype = 'images'
        } else if (upl == 'video') {
            filetype = 'video'
        } else {
            filetype = 'text'
        }
        cb(null, './upload/' + filetype + '/' + userid)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage });

//变量
let images = [];
let imgindex = 0;
let fileindex = 0;
let file = [];

/**
 * 登录
 */
//判断用户是否存在,用于登录时获取头像
user.get('/user/judgment', function (req, res) {
    let userid = req.query.userid;
    let account = {};
    try {
        usertable.findOne(userid, function (userdata) {
            if (!userdata) {
                account.userid = false;
                account.msg = 'user dose not exist';
                res.send(account)
            } else {
                account.userid = true;
                account.headimg = userdata.headimg;
                res.send(account)
            }
        })
    } catch (error) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }

})

//获取用户信息
user.post('/datauser', function (req, res) {
    let userid = aes.Decrypt(req.body.userid);
    let account = {};
    try {
        usertable.findOne(userid, function (userdata) {
            if (!userdata) {
                account.userid = false;
                account.msg = 'user dose not exist';
                res.send(account)
            } else {
                account = userdata;
                account.password = '';
                account.serial = '';
                res.send(account)
            }
        })
    } catch (error) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }
})

//密码验证
user.post('/user/login', function (req, res) {
    let userid = req.body.userid;
    let password = aes.Encrypt(req.body.password);
    let account = {};
    usertable.findOne(userid, function (userdata) {
        if (password !== userdata.password) {
            //user.userid = undefined;
            account.password = false;
            account.msg = 'password error';
            res.send(account);
        } else {
            //user.userid = userid
            // 登陆成功，添加token验证
            let _id = userid.toString();
            // 将用户id传入并生成token
            let jwt = new JwtUtil(_id);
            account.id = aes.Encrypt(userid)
            account.token = jwt.generateToken();
            account.password = true;
            account.msg = 'password right';
            res.send(account);
        }
    })
})

/**
 * 注册
 */
//获取可用id
user.get('/user/register/createId', function (req, res) {
    let userid;
    try {
        usertable.findLast(function (userdata) {
            userid = String(parseInt(userdata.userid) + 1)
            res.send(userid);
        })
    } catch (error) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }
})

//头像上传(并发事件会导致污染变量，用数组、自加变量解决)
user.post('/user/upload', upload.single('avatar'), function (req, res) {
    let result = {};
    imgindex++;
    headimg = (req.file.destination + '/' + req.file.filename).replace('.', '');
    images.push(headimg);
    result.imgindex = imgindex;
    result.upload = false;
    if (req.file) {
        result.upload = true;
        result.headimg = headimg;
        res.send(result);
    }
})

//点击注册
user.post('/user/register', function (req, res) {
    let arr = ['images', 'text', 'video']
    for (let i = 0; i < arr.length; i++) {
        fs.mkdir("./upload/" + arr[i] + '/' + req.body.userid, {
            recursive: true  //是否递归,默认false
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    let user = {};
    let account = {};
    user.username = req.body.nickname;
    user.userid = req.body.userid;
    user.password = aes.Encrypt(req.body.password);
    user.headimg = images[req.body.imgindex - 1];
    user.admin = 2;
    try {
        usertable.addUser(user, function (data) {
            if (data) {
                account.account = true;
                //表连接中创建用户地址
                tablelink.addUser(user.userid, function () { })
                filelink.addUser(user.userid, function () { })
            } else {
                account.account = false;
                fs.unlink(user.headimg, function (err) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    console.log('删除文件成功');
                });
            }
            res.send(account)
        })

    } catch (error) {
        fs.unlink(user.headimg, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log('删除文件成功');
        });
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }

})

/**
 * 个人页面
 */
//personpage
user.post('/user/personpage', function (req, res) {

})

//修改个人信息
user.post('/alteruser', function (req, res) {
    let olduserdata;
    let user = {}
    let account = {}
    let oldheadimg;
    let oldpassword = aes.Encrypt(req.body.oldpassword);
    user.username = req.body.nickname
    user.userid = req.body.userid
    user.password = aes.Encrypt(req.body.password)
    try {
        new Promise(function (resolve, reject) {
            usertable.findOne(user.userid, function (data) {
                if (data.password == oldpassword) {
                    resolve(data)
                } else {
                    reject(data)
                }
            })
        })
            .then(function (dt) {
                account.password = true
                olduserdata = dt
                if (req.body.imgindex) {
                    oldheadimg = olduserdata.headimg
                    user.headimg = images[req.body.imgindex - 1]
                }
                usertable.upDate(user, function (data) {
                    if (data) {
                        account.account = true
                        //更新成功删除旧文件（头像）
                        if (user.headimg) {
                            fs.unlink('./' + oldheadimg, function (err) {
                                if (err) {
                                    console.log(err);
                                    return false;
                                }
                                console.log('删除文件成功');
                            });
                        }
                    } else {
                        account.account = false;
                        //更新失败删除新文件（头像）
                        fs.unlink('./' + user.headimg, function (err) {
                            if (err) {
                                console.log(err);
                                return false;
                            }
                            console.log('删除文件成功');
                        });
                    }
                    res.send(account)
                })
            }, function (dt) {
                account.password = false
                res.send(account)
            })
    } catch (error) {
        fs.unlink('./' + user.headimg, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log('删除文件成功');
        });
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }
})

//文件上传
user.post('/uploadfile', upload.single('avatar'), function (req, res) {
    let fileobj = {}
    let result = {}
    fileindex++;

    fileobj.userid = aes.Decrypt(req.headers.userid)
    fileobj.update = req.file.filename.split('-')[1]
    fileobj.filesize = req.file.size
    fileobj.fileid = Number(Math.random().toString().substr(3) + Date.now()).toString(36)
    fileobj.filename = req.file.filename
    fileobj.filetype = req.file.mimetype.split('/')[0]
    fileobj.filepath = (req.file.destination + '/' + req.file.filename).replace('.', '')

    file.push(fileobj.filepath);
    result.fileindex = fileindex;
    result.upload = false;
    if (req.file) {
        //文件关联数据库
        try {
            //添加字段(判断字段是否为空，为空直接添加数据，不为空则先添加字段，再添加数据？？？)
            //查询空字段
            filelink.descTable('file', function (data) {
                let objlength = Object.keys(data).length
                let arr = []
                for (let i = 0; i < objlength; i++) {
                    if (data[i].Field == 'userid') {
                        continue
                    } else {
                        arr.push(data[i].Field)
                    }
                }
                if (arr.length) {
                    new Promise(function (resolve, reject) {
                        filelink.findOne(fileobj.userid, function (data) {
                            if (data) {
                                let field = {}
                                for (let i = 0; i < arr.length; i++) {
                                    if (!data[arr[i]]) {
                                        //查询到空字段
                                        field.empty = arr[i]
                                        fileobj.field = arr[i]
                                        resolve(field)
                                        break
                                    } else {
                                        if (i == arr.length - 1) {
                                            //没有空字段,需要增加字段
                                            field.empty = false
                                            resolve(field)
                                        }
                                    }
                                }
                            } else {
                                reject()
                            }

                        })
                    })
                        .then(function (data) {
                            if (data.empty) {
                                //有空字段
                                filelink.upDate(fileobj, function () {
                                    //字段添加成功后添加文件信息
                                    filemsg.addflie(fileobj, function (data) {
                                        result.upload = true;
                                        result.file = fileobj.filepath;
                                        res.send(result);
                                    })
                                })
                            } else {
                                //无空字段
                                new Promise(function (resolve, reject) {
                                    filelink.descTable('file', function (data) {
                                        //console.log(data[data.length - 1].Field.indexOf('file'))

                                        if (data) {
                                            if (!data[data.length - 1].Field.indexOf('file')) {
                                                let field = 'file' + (Number(data[data.length - 1].Field.split('e')[1]) + 1)
                                                filelink.addField('file', field, function (data) {
                                                    fileobj.field = field
                                                    resolve(fileobj)
                                                })
                                            } else {
                                                filelink.addField('file', 'file1', function (data) {
                                                    fileobj.field = 'file1'
                                                    resolve(fileobj)
                                                })
                                            }
                                        } else {
                                            reject(data)
                                        }
                                        //console.log(data[data.length - 1].Field)
                                    })
                                })
                                    .then(function (data) {
                                        filelink.upDate(data, function () {
                                            //字段添加成功后添加文件信息
                                            filemsg.addflie(fileobj, function (data) {
                                                result.upload = true;
                                                result.file = fileobj.filepath;
                                                res.send(result);
                                            })
                                        })
                                    }, function () {
                                        res.send(result)
                                    })
                            }
                        }, function () {
                            //查询失败
                        })
                } else {
                    //没有字段，需添加字段
                    new Promise(function (resolve, reject) {
                        filelink.descTable('file', function (data) {
                            //console.log(data[data.length - 1].Field.indexOf('file'))

                            if (data) {
                                if (!data[data.length - 1].Field.indexOf('file')) {
                                    let field = 'file' + (Number(data[data.length - 1].Field.split('e')[1]) + 1)
                                    filelink.addField('file', field, function (data) {
                                        fileobj.field = field
                                        resolve(fileobj)
                                    })
                                } else {
                                    filelink.addField('file', 'file1', function (data) {
                                        fileobj.field = 'file1'
                                        resolve(fileobj)
                                    })
                                }
                            } else {
                                reject(data)
                            }
                            //console.log(data[data.length - 1].Field)
                        })
                    })
                        .then(function (data) {
                            filelink.upDate(data, function () {
                                //字段添加成功后添加文件信息
                                filemsg.addflie(fileobj, function (data) {
                                    result.upload = true;
                                    result.file = fileobj.filepath;
                                    res.send(result);
                                })
                            })
                        }, function () {
                            res.send(result)
                        })
                }
            })

            // new Promise(function(resolve,reject){
            //     filelink.descTable('file',function(data){
            //         //console.log(data[data.length - 1].Field.indexOf('file'))

            //         if(data){
            //             if(!data[data.length - 1].Field.indexOf('file')){
            //                 let field = 'file'+ (Number(data[data.length - 1].Field.split('e')[1]) + 1)
            //                 filelink.addField('file',field,function(data){
            //                     fileobj.field = field
            //                     resolve(fileobj)
            //                 })
            //             }else{
            //                 filelink.addField('file','file1',function(data){
            //                     fileobj.field= 'file1'
            //                     resolve(fileobj)
            //                 })
            //             }
            //         }else{
            //             reject(data)
            //         }
            //         //console.log(data[data.length - 1].Field)
            //     })
            // })
            // .then(function(data){
            //     filelink.upDate(data,function(){
            //         //字段添加成功后添加文件信息
            //         filemsg.addflie(fileobj,function(data){
            //             result.upload = true;
            //             result.file = fileobj.filepath;
            //             res.send(result);
            //         })
            //     })
            // },function(){
            //     res.send(result)
            // })  
        } catch (error) {
            fs.unlink('./' + fileobj.filepath, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
                console.log('删除文件成功');
            });
            fs.writeFile('../log.txt', '"' + error + '"', function (err) {
                if (err) {
                    console.log('写入失败')
                } else {
                    console.log('写入成功了')
                }
            })
            res.send(result)
        }

    } else {
        res.send(result)
    }
})

//删除文件
user.post('/deletefile', function (req, res) {
    let filepath = req.body.filepath;
    let userid = aes.Decrypt(req.headers.userid)
    let fileid = req.body.fileid
    let dlt = false

    /**
     * 先删除filemsg，再删除fileid，再删除文件
     */

    try {
        new Promise(function (resolve) {
            filemsg.deleteData(fileid, function (data) {
                if (data) {
                    resolve()
                }
            })
        })
            .then(function () {
                return new Promise(function (resolve) {
                    filelink.findOne('0', function (data) {
                        let fileobj = {}
                        fileobj.userid = userid
                        fileobj.fileid = ''
                        for (let item in data) {
                            if (data[item] == fileid) {
                                fileobj.field = item
                            }
                        }
                        filelink.upDate(fileobj, function (dt) {
                            if (dt) {
                                resolve()
                            }
                        })
                    })
                })

            })
            .then(function () {
                fs.unlink('./' + filepath, function (err) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    dlt = true
                    res.send(dlt)
                });
            })
    } catch (error) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
        res.send(dlt)
    }

})

//检索用户所拥有的所有文件（分类）
user.post('/findfile', function (req, res) {
    let userid = aes.Decrypt(req.body.userid)
    try {
        filelink.findOne(userid, function (data) {
            let filemessage = []
            new Promise(function (resolve) {
                let arr = []
                let num = 0
                for (let item in data) {
                    num++
                    if (item == 'userid') {
                        continue
                    } else {
                        arr.push(data[item])
                        if (num == Object.keys(data).length) {
                            resolve(arr)
                        }
                    }
                }
            })
                .then(function (arr) {
                    let j = 0
                    for (let i = 0; i < arr.length; i++) {
                        filemsg.findOne(arr[i], function (data) {
                            j++
                            if (!data) {
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            } else {
                                let dt = data
                                let date = new Date(Number(dt.updt))
                                let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
                                let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
                                dt.updt = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate() + ' ' + hour + ':' + minute
                                dt.fullname = dt.filename.split('-')[2]
                                dt.filename = dt.filename.split('-')[2].split('.')[0]
                                if (dt.filesize / 1024 < 1 || dt.filesize / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024).toFixed(2) + ' K'
                                } else if (dt.filesize / 1024 / 1024 > 1 || dt.filesize / 1024 / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024 / 1024).toFixed(2) + ' M'
                                } else {
                                    dt.filesize = (dt.filesize / 1024 / 1024 / 1024).toFixed(2) + ' G'
                                }

                                filemessage.push(dt)
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            }

                        })
                    }
                })
        })
    } catch (eror) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }

})

//文件分类
user.post('/typefile', function (req, res) {
    let type = req.body.type
    let userid = aes.Decrypt(req.headers.userid)
    try {
        //查询到用户拥有的所有文件
        filelink.findOne(userid, function (data) {
            let filemessage = []
            new Promise(function (resolve) {
                let arr = []
                let num = 0
                for (let item in data) {
                    num++
                    if (item == 'userid') {
                        continue
                    } else {
                        arr.push(data[item])
                        if (num == Object.keys(data).length) {
                            resolve(arr)
                        }
                    }
                }
            })
                .then(function (arr) {
                    let j = 0
                    for (let i = 0; i < arr.length; i++) {
                        filemsg.findOne(arr[i], function (data) {
                            j++
                            if (!data) {
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            } else if (data.filetype != type) {
                                //不符合文件类型
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            } else {
                                let dt = data
                                let date = new Date(Number(dt.updt))
                                let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
                                let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
                                dt.updt = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate() + ' ' + hour + ':' + minute
                                dt.fullname = dt.filename.split('-')[2]
                                dt.filename = dt.filename.split('-')[2].split('.')[0]
                                if (dt.filesize / 1024 < 1 || dt.filesize / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024).toFixed(2) + ' K'
                                } else if (dt.filesize / 1024 / 1024 > 1 || dt.filesize / 1024 / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024 / 1024).toFixed(2) + ' M'
                                } else {
                                    dt.filesize = (dt.filesize / 1024 / 1024 / 1024).toFixed(2) + ' G'
                                }

                                filemessage.push(dt)
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            }

                        })
                    }
                })
        })
    } catch (eror) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }
})

//文件搜索
user.post('/queryfile', function (req, res) {
    let message = req.body.message
    let userid = aes.Decrypt(req.headers.userid)
    try {
        //查询到用户拥有的所有文件
        filelink.findOne(userid, function (data) {
            let filemessage = []
            new Promise(function (resolve) {
                let arr = []
                let num = 0
                for (let item in data) {
                    num++
                    if (item == 'userid') {
                        continue
                    } else {
                        arr.push(data[item])
                        if (num == Object.keys(data).length) {
                            resolve(arr)
                        }
                    }
                }
            })
                .then(function (arr) {
                    let j = 0
                    for (let i = 0; i < arr.length; i++) {
                        filemsg.findOne(arr[i], function (data) {
                            j++
                            if (!data) {
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            } else if (data.filename.split('-')[2].split('.')[0].indexOf(message) == -1) {
                                //不符合文件类型
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            } else {
                                let dt = data
                                let date = new Date(Number(dt.updt))
                                let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
                                let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
                                dt.updt = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate() + ' ' + hour + ':' + minute
                                dt.fullname = dt.filename.split('-')[2]
                                dt.filename = dt.filename.split('-')[2].split('.')[0]
                                if (dt.filesize / 1024 < 1 || dt.filesize / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024).toFixed(2) + ' K'
                                } else if (dt.filesize / 1024 / 1024 > 1 || dt.filesize / 1024 / 1024 / 1024 < 1) {
                                    dt.filesize = (dt.filesize / 1024 / 1024).toFixed(2) + ' M'
                                } else {
                                    dt.filesize = (dt.filesize / 1024 / 1024 / 1024).toFixed(2) + ' G'
                                }

                                filemessage.push(dt)
                                if (j == arr.length) {
                                    res.send(filemessage)
                                }
                            }

                        })
                    }
                })
        })
    } catch (eror) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }
})

//获取用户创建的所有表?
user.post('/alltable', function (req, res) {
    //用户id
    let result = {}
    result.tablefield = []
    result.tablename = []
    let userid = aes.Decrypt(req.body.userid)
    new Promise(function(resolve,reject){
        tablelink.findOne(userid,function(data){
            let num = 0
            for (let item in data) {
                num++
                if (item == 'userid') {
                    continue
                } else {
                    result.tablename.push(data[item])
                    if (num == Object.keys(data).length) {
                        resolve(result.tablename[0])
                    }
                }
            }
        })
    })
    .then(function(data){
        let tablename = data
        new Promise(function(resolve,reject){
            createtable.descTable(tablename,function(data){
                if(data){
                    for(let i = 0;i<data.length;i++){
                        if(data[i].Field == 'serial'){
                            continue
                        }
                        result.tablefield.push(data[i].Field)
                    }
                    resolve()
                }
            })
        })
        .then(function(){
            createtable.findAll(tablename,function(dt){
                result.table = dt
                res.send(result)
            })
        })
        
    },function(){

    })
})

//获取当前表格数据
user.post('/nowtabledata',function(req,res){
    /**
     * 必要：
     * 1、表名
     * 2、用户id
     * 先进行表名查询，再进行表格查询
     */
    let result = {}
    result.tablefield = []
    let userid = aes.Decrypt(req.headers.userid)
    let tablename = req.body.tablename
    result.tablename = tablename
    new Promise(function(resolve,reject){
        tablelink.findOne(userid,function(data){
            let num = 0
            for (let item in data) {
                num++
                if (item == 'userid') {
                    continue
                } else {
                    if(data[item] == tablename){
                        resolve(data[item])
                        break
                    }
                }
            }
        })
    })
    .then(function(data){
        let tablename = data
        new Promise(function(resolve,reject){
            createtable.descTable(tablename,function(data){
                if(data){
                    for(let i = 0;i<data.length;i++){
                        if(data[i].Field == 'serial'){
                            continue
                        }
                        result.tablefield.push(data[i].Field)
                    }
                    resolve()
                }
            })
        })
        .then(function(){
            createtable.findAll(data,function(dt){
                result.table = dt
                res.send(result)
            })
        },function(){

        })
        
    },function(){

    })
})

//添加表?？？？？？？待完善
user.post('/addtable', function (req, res) {
    let result = {}
    let tableobj = {}
    let userid = aes.Decrypt(req.headers.userid)
    tableobj.userid = userid
    let tablename = req.body.tablename
    tableobj.tablename = tablename
    let field = req.body.field
    let rowdata = req.body.rowdata
    //给用户添加链接表名
    //文件关联数据库
    try {
        //添加字段(判断字段是否为空，为空直接添加数据，不为空则先添加字段，再添加数据？？？)
        //查询空字段
        tablelink.descTable('tablelink', function (data) {
            let objlength = Object.keys(data).length
            let arr = []
            for (let i = 0; i < objlength; i++) {
                if (data[i].Field == 'userid') {
                    continue
                } else {
                    arr.push(data[i].Field)
                }
            }
            //arr
            if (arr.length) {
                new Promise(function (resolve, reject) {
                    tablelink.findOne(userid, function (data) {
                        if (data) {
                            let obj = {}
                            for (let i = 0; i < arr.length; i++) {
                                if (!data[arr[i]]) {
                                    //查询到空字段
                                    obj.empty = arr[i]
                                    tableobj.field = arr[i]
                                    resolve(obj)
                                    break
                                } else {
                                    if (i == arr.length - 1) {
                                        //没有空字段,需要增加字段
                                        obj.empty = false
                                        resolve(obj)
                                    }
                                }
                            }
                        } else {
                            reject()
                        }

                    })
                })
                    .then(function (data) {
                        if (data.empty) {
                            //有空字段
                            tablelink.upDate(tableobj, function (data) {
                                //字段添加成功后添加表格信息????
                                addTable(tablename,field,rowdata)
                            })
                        } else {
                            //无空字段
                            new Promise(function (resolve, reject) {
                                tablelink.descTable('tablelink', function (data) {
                                    //console.log(data[data.length - 1].Field.indexOf('file'))
                                    if (data) {
                                        if (!data[data.length - 1].Field.indexOf('table')) {
                                            let field = 'table' + (Number(data[data.length - 1].Field.split('e')[1]) + 1)
                                            tablelink.addField('tablelink', field, function (data) {
                                                tableobj.field = field
                                                resolve(tableobj)
                                            })
                                        } else {
                                            tablelink.addField('tablelink', 'table1', function (data) {
                                                tableobj.field = 'table1'
                                                resolve(tableobj)
                                            })
                                        }
                                    } else {
                                        reject(data)
                                    }
                                    //console.log(data[data.length - 1].Field)
                                })
                            })
                                .then(function (data) {
                                    tablelink.upDate(data, function () {
                                        //字段添加成功后添加表格信息???
                                        addTable(tablename,field,rowdata)
                                    })
                                }, function () {
                                    res.send(result)
                                })
                        }
                    }, function () {
                        //查询失败
                    })
            } else {
                //没有字段，需添加字段
                new Promise(function (resolve, reject) {
                    tablelink.descTable('tablelink', function (data) {
                        //console.log(data[data.length - 1].Field.indexOf('file'))

                        if (data) {
                            if (!data[data.length - 1].Field.indexOf('table')) {
                                let field = 'table' + (Number(data[data.length - 1].Field.split('e')[1]) + 1)
                                tablelink.addField('tablelink', field, function (data) {
                                    tableobj.field = field
                                    resolve(tableobj)
                                })
                            } else {
                                tablelink.addField('tablelink', 'table1', function (data) {
                                    tableobj.field = 'table1'
                                    resolve(tableobj)
                                })
                            }
                        } else {
                            reject(data)
                        }
                        //console.log(data[data.length - 1].Field)
                    })
                })
                    .then(function (data) {
                        tablelink.upDate(data, function () {
                            //字段添加成功后添加表格信息？？？
                            addTable(tablename,field,rowdata)
                        })
                    }, function () {
                        res.send(result)
                    })
            }
        })
    } catch (error) {
        fs.writeFile('../log.txt', '"' + error + '"', function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
            }
        })
    }

    function addTable(tn,fd,ra){
        let tablename = tn
        let field = fd
        let rowdata = ra
        //添加表格到数据库
        new Promise(function (resolve, reject) {
            createtable.createTable(tablename, function (data) {
                if (!data) {
                    //创建成功
                    resolve()
                } else {
                    //创建失败?
                    reject()
                }
            })
        })
            .then(function () {
                return new Promise(function (resolve, reject) {
                    //创建成功,添加字段
                    let j = 0
                    for (let i = 0; i < field.length; i++) {
                        createtable.addField(tablename, field[i], function (data) {
                            j++
                            if (data) {
                                if (j == field.length) {
                                    resolve()
                                }
                            } else {
                                //添加字段失败，删除表
                            }
                        })
                    }
                })

            }, function () {
                //此表已存在
                result.success = false
                res.send(result)
            })
            .then(function () {
                //字段添加成功,添加数据
                let j = 0
                for (let i = 0; i < rowdata.length; i++) {
                    
                    createtable.addData(tablename, rowdata[i], function (data) {
                        j++
                        if(data){
                            if(j == rowdata.length){
                                result.success = true
                                res.send(result)
                            }
                        }
                    })
                }
            }, function () {
                //添加字段失败
            })
    }

    

})

//编辑表?
user.post('/edittable', function (req, res) {

})

//暴露user
module.exports = user