//cookie解析
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

// 对函数进行 节流
function throttle(fn, interval = 500) {
    let timer = null;
    let firstTime = true;

    return function (...args) {
        if (firstTime) {
            // 第一次加载
            fn.apply(this, args);
            return firstTime = false;
        }
        if (timer) {
            // 定时器正在执行中，跳过
            console.log('定时器正在执行中，跳过')
            return;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            fn.apply(this, args);
        }, interval);
    };
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

    let olddate = new Date().getTime()

    function getfile(dt) {
        if (dt) {
            var data = {
                list: dt
            }
            var html = template('test', data)
            document.getElementById('filelist').innerHTML = html
        } else {
            $.ajax({
                url: "/findfile",
                dataType: "json",
                type: "post",
                data: { userid: cookieobj.login },
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("token", cookieobj.user);
                },
                success: function (res) {
                    //文件信息
                    var data = {
                        list: res
                    }
                    var html = template('test', data)
                    document.getElementById('filelist').innerHTML = html
                }
            })
        }

    }

    function gettable() {
        $.ajax({
            url: "/alltable",
            dataType: "json",
            type: "post",
            data: { userid: cookieobj.login },
            beforeSend: function (request) {
                //将cookie中的token信息放于请求头中
                request.setRequestHeader("token", cookieobj.user);
            },
            success: function (res) {
                //表格信息
                var table = {
                    list: res
                }
                var data = {
                    list: res.tablename
                }
                var html = template('secondboxtable', data)
                var tablehtml = template('nowtable', table)
                document.getElementById('tablebox').innerHTML = tablehtml
                document.getElementById('tablelist').innerHTML = html
            }
        })
    }

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
            $('#headimg').attr('src', res.headimg)
            $('.username').text(res.username)
        }
    })
    //获取表格信息

    gettable()
    getfile()

    //头像下拉信息
    $('#headimg').mouseenter(function () {
        $('#information').css('display', 'block')
    })
    $('#information').mouseenter(function () {
        $('#information').css('display', 'block')
    })
    $('#headimg').mouseleave(function () {
        $('#information').css('display', 'none')
    })
    $('#information').mouseleave(function () {
        $('#information').css('display', 'none')
    })

    //退出
    $('#exit').click(function () {
        new Cookie({
            name: "login",
            value: '',
            time: 0,
            path: "/"
        })
        location.replace('/')
    })

    //修改信息
    $('#persondate').click(function () {
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
        $('.file').css('display', 'block')
        $('.addtable').css('display', 'none')
        $('.form').css('display', 'none')
        getfile()
    })

    $('.tables').click(function () {
        $('.xiala').removeClass('active')
        $('.tables').addClass('active')
        $('.tables').siblings().stop().slideToggle()
        $('.form').css('display', 'block')
        $('.file').css('display', 'none')
        $('.addtable').css('display', 'none')
        gettable()
    })

    $('#addtable').click(function () {
        $('.addtable').css('display', 'block')
        $('.form').css('display', 'none')
        $('.file').css('display', 'none')
    })




    $('#delete').click(function () {
        $('.seachdata').val('')
        getfile()
    })

    //文件搜索
    $('.seachfile').click(function () {
        let message = $('.seachdata').val()
        let nowdate = new Date().getTime()
        let datesub = nowdate - olddate
        olddate = nowdate
        if (!message) {
            $('.seachdata').val('请输入关键信息')
        } else {
            if (datesub < 500) {
                $('.warning').css('display', 'block')
                $('.warning').text('操作频繁')
                setTimeout(function () {
                    $('.warning').css('display', 'none')
                }, 1000)
            } else {
                $.ajax({
                    url: '/queryfile',
                    data: { message },
                    type: 'post',
                    beforeSend: function (request) {
                        //将cookie中的token信息放于请求头中
                        request.setRequestHeader("token", cookieobj.user)
                        request.setRequestHeader('userid', cookieobj.login)
                    },
                    success: function (data) {
                        //刷新页面
                        if (data) {
                            getfile(data)
                        } else {
                            //服务端错误
                        }
                    }
                })
            }

        }
    })

    //分类文件
    $('.secondfile').on('click', 'span', function (e) {
        let nowdate = new Date().getTime()
        let datesub = nowdate - olddate
        olddate = nowdate
        let filetype = $(e.target).text()
        let type
        if (filetype == '视频') {
            type = 'video'
        } else if (filetype == '图片') {
            type = 'image'
        } else {
            type = 'text'
        }
        if (datesub < 500) {
            $('.warning').css('display', 'block')
            $('.warning').text('操作频繁')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1000)
        } else {
            $.ajax({
                url: '/typefile',
                data: { type },
                type: 'post',
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("token", cookieobj.user)
                    request.setRequestHeader('userid', cookieobj.login)
                },
                success: function (data) {
                    //刷新页面
                    if (data) {
                        getfile(data)
                    } else {
                        //服务端错误
                    }
                }
            })
        }

    })

    /**
     * 文件删除
     * ？？？文件路径(文件id)
     */
    $('#filelist').on('click', '.icon-shanchu', function (e) {
        let filepath = $(e.target).siblings('a').attr('href')
        let fileid = $(e.target).next().text()
        $.ajax({
            url: '/deletefile',
            data: {
                filepath,
                fileid
            },
            type: 'post',
            beforeSend: function (request) {
                //将cookie中的token信息放于请求头中
                request.setRequestHeader("token", cookieobj.user)
                request.setRequestHeader('userid', cookieobj.login)
            },
            success: function (data) {
                //刷新页面
                if (data) {
                    getfile()
                } else {
                    //服务端错误
                }
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
        let file = document.getElementById('uploadfile').files[0]
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
                getfile()
            }
        })
    })


    /**
     * 表格部分
     */
    //图表类型选择
    $('#charttype').click(function () {
        $('.chartbox').stop().slideToggle()
    })

    $('#charttypelist').on('click', 'li', function (e) {
        $('.chartbox').stop().slideToggle()
        $('#charttype').text($(e.target).text())
    })

    //编辑图表
    $('#addcol').click(function () {
        let textcol = "<th><input type='text'></th>"
        let textrow = "<td><input type='text'></td>"
        $('.editcol').append(textcol)
        $('.editrow').append(textrow)
    })

    $('#addrow').click(function () {
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        let input = document.createElement('input')
        $(td).append(input)
        for (let i = 0; i < $('.editcol').children('th').length; i++) {
            $(tr).append($(td).clone())
        }
        tr.className = 'editrow'
        $('#edittable').append(tr)
    })

    //添加表保存
    $('#saveeditor').click(function () {
        //获取输入数据
        let tableobj = {}
        tableobj.tablename = $('#edittable').children('caption').find('input').val()
        tableobj.field = []
        tableobj.rowdata = []
        for (let i = 0; i < $('.editcol').children('th').length; i++) {
            tableobj.field.push($($('.editcol').find('input')[i]).val())
        }
        for (let i = 0; i < $('#edittable').children('tbody').find('.editrow').length; i++) {
            let obj = {}
            for (let j = 0; j < $('.editcol').children('th').length; j++) {
                obj[tableobj.field[j]] = $($($('.editrow')[i]).find('input')[j]).val()
            }
            tableobj.rowdata.push(obj)
        }
        let obj = JSON.stringify(tableobj)
        if (tableobj.tablename) {
            $.ajax({
                url: '/addtable',
                data: obj,
                dataType: "json",
                // traditional: true,
                type: 'post',
                contentType: 'application/json',
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("userid", cookieobj.login);
                    request.setRequestHeader("token", cookieobj.user);
                },
                success: function (data) {
                    //添加表格成功，显示当前表
                    $('.form').css('display', 'block')
                    $('.file').css('display', 'none')
                    $('.addtable').css('display', 'none')
                    gettable()
                }

            })
        } else {
            //表名不能为空
            $('.warning').css('display', 'block')
            $('.warning').text('表名不能为空')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1000)
        }


    })

    //左侧下拉选择表格
    $('#tablelist').on('click', 'span', function (e) {
        let nowdate = new Date().getTime()
        let datesub = nowdate - olddate
        olddate = nowdate
        let tablename = $(e.target).text()
        if (datesub < 500) {
            $('.warning').css('display', 'block')
            $('.warning').text('操作频繁')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1000)
        } else {
            $.ajax({
                url: '/nowtabledata',
                data: { tablename },
                dataType: "json",
                type: 'post',
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("userid", cookieobj.login);
                    request.setRequestHeader("token", cookieobj.user);
                },
                success: function (data) {
                    //显示当前表格
                    var table = {
                        list: data
                    }
                    var tablehtml = template('nowtable', table)
                    document.getElementById('tablebox').innerHTML = tablehtml
                }
    
            })
        }
    })

    //表格搜索
    $('.seachtable').click(function () {
        let message = $('.seachdata').val()
        if (!message) {
            $('.seachdata').val('请输入关键信息')
        } else {
            $.ajax({
                url: '/querytable',
                data: { message },
                type: 'post',
                beforeSend: function (request) {
                    //将cookie中的token信息放于请求头中
                    request.setRequestHeader("token", cookieobj.user)
                    request.setRequestHeader('userid', cookieobj.login)
                },
                success: function (data) {
                    //刷新页面
                    if (data) {
                        getfile(data)
                    } else {
                        //服务端错误
                    }
                }
            })
        }
    })
})