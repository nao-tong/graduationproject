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
    $.get('/user/register/createId', function (data) {
        $('#username').val(data);
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


    //去除表单的默认事件
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    })

    //点击注册
    $('#submit').click(function () {
        let nickname = $('#nickname').val();
        let password = $('#password').val();
        let verifyPassword = $('#verifyPassword').val();
        let verificationCode = $('#verificationCode').val().toLowerCase();
        let headimg = $('#headimage')[0].files.length;
        let passwordflag = !(password == verifyPassword);
        let verifyflag = !(svgtext.toLowerCase() == verificationCode);
        let pwstring = String($('#password').val());

        //检查密码/验证码
        if (!headimg) {
            $('#error').text('请上传头像');
        }else if(!nickname){
            $('#error').text('昵称不能为空');
        } else if (!password) {
            $('#error').text('密码不能为空');
        } else if (pwstring.length < 6 || pwstring.length > 15) {
            $('#error').text('密码限制为6-15位');
        } else if (passwordflag) {
            $('#error').text('密码不一致');
        }else if(!verificationCode){
            $('#error').text('请输入验证码');
        }else if (verifyflag) {
            $('#error').text('验证码不正确');
            $('.svg').empty();
            $.get('/svg', function (data) {
                let svg = JSON.parse(JSON.stringify(data));
                svgtext = svg.text;
                $('.svg').prepend(svg.data);
            })
        } else {
            $('#error').text('');
            let nickname = $('#nickname').val();
            let userid = $('#username').val();
            let password = $('#password').val();
            $.post("/user/register", {
                nickname,
                userid,
                password,
                imgindex
            }, function (dt, status) {
                if (dt.account) {
                    window.location.href = '/';
                    window.navigate("/");
                    window.location.replace("/");
                    self.location = '/';
                    top.location = '/';
                } else {
                    $('#error').text('服务器繁忙');
                }
            })
        }
    })

    //上传头像
    $('#headimage').change(function(){
        let img = document.getElementById('headimage');
        let filetype = img.files[0].name.split('.')[1];
        if(filetype == 'jpg' || filetype == 'png'){
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
        }else{
            $('#error').text('请上传图片文件');
        }
    })
})
