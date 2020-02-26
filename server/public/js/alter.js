
function alaysisCookie(cookie) {
    var group = cookie.split(';')
    var object = {}
    for (let item in group) {
        var key = group[item].split('=')[0] ? group[item].split('=')[0].trim() : "msg";
        var value = group[item].split('=')[1] ? group[item].split('=')[1].trim() : false;
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

var cookieobj = alaysisCookie(document.cookie)
if (!cookieobj.login) {
    window.location.href = '/';
    window.navigate('/');
    window.location.replace('/');
    self.location = '/';
    top.location = '/';
}


$(function () {


    /**
     * 1、检查是否填写完整
     * 2、验证： 密码是否一致 验证码是否正确
     */

    let data;
    let userid;
    let svgtext;
    let imgindex;
    let form = document.getElementById('formlist');


    //获取验证码text
    $.get('/svg', function (data) {
        let svg = JSON.parse(JSON.stringify(data));
        svgtext = svg.text;
        $('.svg').prepend(svg.data);
    })

    //获取可用的用户id
    // $.get('/user/register/createId', function (data) {
    //     $('#username').val(data);
    // })

    //点击验证码图片刷新
    $('.verificationCodeImg').click(function () {
        $('.svg').empty();
        $.get('/svg', function (data) {
            let svg = JSON.parse(JSON.stringify(data));
            svgtext = svg.text;
            $('.svg').prepend(svg.data);
        })
    })


    //去除表单的默认事件
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    })

    //点击保存
    $('#submit').click(function () {
        let userid = $('#username').val();
        let nickname = $('#nickname').val();
        let oldpassword = $('#password').val();
        let password = $('#newPassword').val();
        let verificationCode = $('#verificationCode').val().toLowerCase();
        let verifyflag = !(svgtext.toLowerCase() == verificationCode);
        let pwstring = String($('#newPassword').val());

        //检查密码/验证码
        if (!nickname) {
            $('#error').text('昵称不能为空');
        } else if (!password) {
            $('#error').text('密码不能为空');
        } else if (pwstring.length < 6 || pwstring.length > 15) {
            $('#error').text('密码限制为6-15位');
        } else if (!verificationCode) {
            $('#error').text('请输入验证码');
        } else if (verifyflag) {
            $('#error').text('验证码不正确');
            $('.svg').empty();
            $.get('/svg', function (data) {
                let svg = JSON.parse(JSON.stringify(data));
                svgtext = svg.text;
                $('.svg').prepend(svg.data);
            })
        } else {
            $('#error').text('');
            $.ajax({
                url: "/alteruser",
                dataType: 'json',
                type: 'post',
                data: {
                    nickname,
                    userid,
                    oldpassword,
                    password,
                    imgindex
                },
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("token", cookieobj.user);
                },
                success: function (dt) {
                    if (dt.password) {
                        if(dt.account){
                            $('#error').text('修改成功');
                        }else{
                            $('#error').text('修改失败');
                        }
                    } else {
                        $('#error').text('原密码错误');
                    }
                }
            })
        }
    })

      
    //上传头像
    $('#headimage').change(function () {
        let img = document.getElementById('headimage');
        console.log(img.files)
        let filetype = img.files[0].name.split('.')[1];
        if (filetype == 'jpg' || filetype == 'png') {
            let imgform = new FormData(document.getElementById('avater'))
            $.ajax({
                url: '/user/upload',
                data: imgform,
                type: 'post',
                //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉 ???
                contentType: false,
                //取消帮我们格式化数据，是什么就是什么   ???
                processData: false,
                success: function (data) {
                    $('#headimgid').attr('src', data.headimg);
                    imgindex = data.imgindex
                }
            })
        } else {
            $('#error').text('请上传图片文件');
        }
    })

    $.ajax({
        url: "/datauser",
        dataType: "json",
        type: "post",
        data: { userid: cookieobj.login },
        beforeSend: function (request) {
            //将cookie中的token信息放于请求头中
            request.setRequestHeader("token", cookieobj.user);
        },
        success: function (res) {
            //个人信息
            console.log(res)
            $('#headimgid').attr('src', res.headimg);
            $('#username').val(res.userid)
            $('#nickname').val(res.username)
        }
    })
})
