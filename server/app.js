const express = require('express');
const fs = require('fs');
const path = require('path');
const user = require('./router/user')
const svg = require('./router/svg')
const JwtUtil = require('./encapsulation/jwt')

var app = express();

/* 跨域设置 */
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, userid'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//配置静态资源
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
app.use('/upload/', express.static(path.join(__dirname, './upload/')));

app.use(function (req, res, next) {
    // 我这里只是把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
    flag = req.url.indexOf('/user') == -1 ? true : false
    flag = flag && req.url != '/svg' && req.url != '/' && req.url != "/favicon.ico"
    if (flag) {
        let token = req.headers.token;
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            res.send({status: 403, msg: '身份信息已过期,请重新登录'});
        } else {
            next();
        }
    } else {
        next();
    }
})

app.get('/', function (req, res) {
    res.redirect('/user/login')
})

//login
app.get('/user/login', function (req, res) {
    fs.readFile('../client/login/login.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})

//register
app.get('/user/register', function (req, res) {
    fs.readFile('../client/register/register.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})

//personpage
app.get('/user/personpage', function (req, res) {
    fs.readFile('../client/personpage/personpage.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})

//alter
app.get('/user/alter', function (req,res) {
    fs.readFile('../client/alter/alter.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})

app.get('/user/playvideo', function (req,res) {
    fs.readFile('../client/playvideo/video.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})

//挂载路由
app.use(user)
app.use(svg)

//监听3000端口
app.listen(3000, function () {
    console.log('app is running at port 3000.')
})
