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
    //头像下拉信息
    $('#headimg').mouseenter(function(){
        $('#information').css('display','block')
    })
    $('#information').mouseenter(function(){
        $('#information').css('display','block')
    })
    $('#headimg').mouseleave(function(){
        $('#information').css('display','none')
    })
    $('#information').mouseleave(function(){
        $('#information').css('display','none')
    })

    //退出
    $('#exit').click(function(){
        new Cookie({
            name:"login",
            value:'',
            time:0,
            path:"/"
        })
        location.replace(location.href)
    })

    //修改信息
    $('#persondate').click(function(){
        window.location.href = '/user/alter';
        window.navigate('/user/alter');
        window.location.replace('/user/alter');
        self.location = '/user/alter';
        top.location = '/user/alter';
    })

    //左侧下拉列表
    $('.files').click(function () {
        $('.xiala').removeClass('active')
        $('.files').addClass('active')
        $('.files').siblings().stop().slideToggle()
        $('.form').css('display', 'none')
        $('.file').css('display', 'block')
    })

    $('.tables').click(function () {
        $('.xiala').removeClass('active')
        $('.tables').addClass('active')
        $('.tables').siblings().stop().slideToggle()
        $('.file').css('display', 'none')
        $('.form').css('display', 'block')
    })

    //图标类型选择
    $('#charttype').click(function () {
        $('.chartbox').stop().slideToggle()
    })

    $('.chart').click(function (e) {
        $('#charttype').text($(e.target).text())
    })

    /**
     * 文件删除
     * ？？？文件路径(文件id)
     */
    $('.delete').click(function () {
        let filepath = './upload/images/avatar-15818234346801d4fda0283a18075.jpg'
        $.ajax({
            url: '/deletefile',
            data: {filepath},
            type: 'post',
            beforeSend: function (request) {
                //将cookie中的token信息放于请求头中
                request.setRequestHeader("token", cookieobj.user);
            },
            success: function (data) {
                //刷新页面
            }
        })
    })


    /**
     * 文件上传
     * ？？？上传成功刷新页面
     * ？？？上传进度条
     */
    $('#uploadfile').change(function () {
        let fileform = new FormData(document.getElementById('avater'))
        $.ajax({
            url: '/uploadfile',
            data: fileform,
            type: 'post',
            beforeSend: function (request) {
                //将cookie中的token信息放于请求头中
                request.setRequestHeader("userid", cookieobj.login);
                request.setRequestHeader("token", cookieobj.user);
            },
            //ajax2.0可以不用设置请求头，但是jq帮我们自动设置了，这样的话需要我们自己取消掉 ???
            contentType: false,
            //取消帮我们格式化数据，是什么就是什么   ???
            processData: false,
            success: function (data) {
                //刷新页面
                console.log(data)
            }
        })
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
            $('#headimg').attr('src', res.headimg)
            $('.username').text(res.username)
        }
    })
})