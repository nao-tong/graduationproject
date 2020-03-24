
function alaysisCookie(cookie) {
    var group = cookie.split(';')
    var object = {}
    for (let item in group) {
        var key = group[item].split('=')[0].trim();
        var value = group[item].split('=')[1].trim();
        object[key] = value;
    }
    return object;
}

class Cookie {
    constructor(cookieobj) {
        this.name = cookieobj.name;
        this.value = cookieobj.value;
        this.init(cookieobj.time, cookieobj.path);
    }
    init(t, p) {
        var tim = parseFloat(t) * 3600 * 24 * 1000;
        var date = new Date();
        var time = date.getTime() + tim;
        this.time = "expires=" + (new Date(time)).toUTCString();
        this.path = "path=" + p;
        if (!tim) {
            this.time = ""
        }
        if (!p) {
            this.path = ""
        }
        document.cookie = this.name + "=" + this.value + ";" + this.time + ";" + this.path;

    }
}

$(function () {
    let svgtext;
    //获取验证码
    $.get('/svg', function (data) {
        let svg = JSON.parse(JSON.stringify(data));
        svgtext = svg.text;
        $('.svg').prepend(svg.data);
    })

    //点击验证码图片刷新
    $('.verificationCodeImg').click(function () {
        $('.svg').empty();
        $.get('/svg', function (data) {
            let svg = JSON.parse(JSON.stringify(data));
            svgtext = svg.text;
            $('.svg').prepend(svg.data);
        })
    })

    //获取头像
    $('#username').blur(function () {
        let userid = $('#username').val();
        let getheadimg = new Promise(function (resolve, reject) {
            $.get('/user/judgment?userid=' + userid, function (data) {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            })
        })
        getheadimg
            .then(function (data) {
                if (!userid) {
                    $('#error').text('');
                } else if (!data.userid) {
                    $('#error').text('账号不存在');
                } else {
                    $('#error').text('');
                    $('#headimg').attr('src', data.headimg);
                }

            }, function () {
                $('#error').text('服务器错误')
            })

    })

    //提交表单,登录
    $('.submit').click(function (e) {
        /**
         * 1、检查是否填写完整
         * 2、验证 验证码 账号密码
         */
        e.preventDefault();
        let userid = $('#username').val();
        let password = $('#password').val();
        let verifyCode = $('#verificationCode').val().toLowerCase();
        if (!userid) {
            $('#error').text('请输入账号');
        } else if (!password) {
            $('#error').text('请输入密码');
        } else if (!verifyCode) {
            $('#error').text('请输入验证码');
        } else if (verifyCode == svgtext.toLowerCase()) {
            // $('#error').text('');
            $.post('/user/login',
                {
                    userid,
                    password
                },
                function (data, status) {
                    if (!data.password) {
                        $('#error').text('账号或密码错误')
                        $('.svg').empty();
                        $.get('/svg', function (data) {
                            let svg = JSON.parse(JSON.stringify(data));
                            svgtext = svg.text;
                            $('.svg').prepend(svg.data);
                        })
                    } else {
                        //$.cookie('userid',userid,{ expires: 1, path: '/' });
                        new Cookie({
                            name:"user",
                            value:data.token,
                            time:1,
                            path:"/"
                        })
                        new Cookie({
                            name:"login",
                            value:data.id,
                            time:1,
                            path:"/"
                        })
                        var cookieobj = alaysisCookie(document.cookie)
                        // 解析cookie成对象
                        window.location.href = '/user/personpage';
                        window.navigate('/user/personpage');
                        window.location.replace('/user/personpage');
                        self.location = '/user/personpage';
                        top.location = '/user/personpage';
                    }
                });

        } else {
            $('#error').text('验证码错误');
            $('.svg').empty();
            $.get('/svg', function (data) {
                let svg = JSON.parse(JSON.stringify(data));
                svgtext = svg.text;
                $('.svg').prepend(svg.data);
            })
        }

    })
});