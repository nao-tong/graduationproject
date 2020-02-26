/**
 * 设置路由
 * 1、登录(后台验证)
 * 2、注册
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const multer = require('multer');
const aes = require('../encAnddec/aes')
const JwtUtil = require('../encapsulation/jwt')
const usertable = require('../db/usertable')
const tablelink = require('../db/tablelink')
const filelink = require('../db/filelink')


var user = express.Router();

// body-parser配置
user.use(bodyParser.urlencoded({ extended: false }))
user.use(bodyParser.json())
//multer配置
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let filetype;
        let upl = String(file.mimetype).split('/')[0];
        if (upl == 'image') {
            filetype = 'images'
        } else if (upl == 'video') {
            filetype = 'video'
        } else {
            filetype = 'text'
        }
        cb(null, './upload/' + filetype)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
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
        new Promise(function(resolve,reject){
            usertable.findOne(user.userid, function (data) {
                if(data.password == oldpassword){
                    resolve(data)
                }else{
                    reject(data)
                }
            })
        })
        .then(function(dt){
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
        },function(dt){
            account.password = false
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


//文件上传
user.post('/uploadfile', upload.single('avatar'), function (req, res) {
    let result = {};
    fileindex++;
    let userid = aes.Decrypt(req.headers.userid)
    filepath = (req.file.destination + '/' + req.file.filename).replace('.', '');
    file.push(filepath);
    result.fileindex = fileindex;
    result.upload = false;
    if (req.file) {
        result.upload = true;
        result.file = filepath;
        res.send(result);
    } else {
        res.send(result)
    }
})

//删除文件
user.post('/deletefile', function (req, res) {
    let filepath = req.body.filepath;
    console.log(filepath)
    fs.unlink(filepath, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        console.log('删除文件成功');
    });
})

//暴露user
module.exports = user