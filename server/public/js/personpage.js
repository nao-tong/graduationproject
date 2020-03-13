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
    let editflag = false

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
                if(!res.message){
                    $('.warning').css('display', 'block')
                    $('.warning').text('请添加表格')
                    setTimeout(function () {
                        $('.warning').css('display', 'none')
                    }, 1500)
                }else{
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
            var data = {
                list: res
            }
            var html = template('navdata', data)
            document.getElementById('nav').innerHTML = html
            // $('#headimg').attr('src', res.headimg)
            // $('.username').text(res.username)
        }
    })
    //获取文件信息
    getfile()

    //头像下拉信息
    $('#nav').on('mouseenter', '#headimg', function () {
        $('#information').css('display', 'block')
    })
    $('#nav').on('mouseleave', '#headimg', function () {
        $('#information').css('display', 'none')
    })
    $('#nav').on('mouseenter', '#information', function () {
        $('#information').css('display', 'block')
    })
    $('#nav').on('mouseleave', '#information', function () {
        $('#information').css('display', 'none')
    })

    //退出
    $('#nav').on('click', '#exit', function () {
        new Cookie({
            name: "login",
            value: '',
            time: -1,
            path: "/"
        })
        location.replace('/')
    })

    //修改信息
    $('#nav').on('click', '#persondate', function () {
        window.location.href = '/user/alter';
        window.navigate('/user/alter');
        window.location.replace('/user/alter');
        self.location = '/user/alter';
        top.location = '/user/alter';
    })

    //左侧下拉列表
    $('.files').click(function () {
        let nowdate = new Date().getTime()
        let datesub = nowdate - olddate
        olddate = nowdate
        $('.xiala').removeClass('active')
        $('.files').addClass('active')
        $('.files').siblings().stop().slideToggle()
        $('.file').css('display', 'block')
        $('.addtable').css('display', 'none')
        $('.form').css('display', 'none')
        if (datesub < 500) {
            $('.warning').css('display', 'block')
            $('.warning').text('操作频繁')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else {
            getfile()
        }

    })

    $('.tables').click(function () {
        let nowdate = new Date().getTime()
        let datesub = nowdate - olddate
        olddate = nowdate
        $('.xiala').removeClass('active')
        $('.tables').addClass('active')
        $('.tables').siblings().stop().slideToggle()
        $('.form').css('display', 'block')
        $('.file').css('display', 'none')
        $('.addtable').css('display', 'none')
        if (datesub < 500) {
            $('.warning').css('display', 'block')
            $('.warning').text('操作频繁')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else {
            gettable()
        }
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
                }, 1500)
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
            }, 1500)
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

    //视频播放
    $('#filelist').on('click', '.playvideo', function (e) {
        let filepath = $(e.target).siblings('a').attr('href')
        let videotype = filepath.split('.')[1]
        if (videotype == 'mp4') {
            new Cookie({
                name: "video",
                value: filepath,
                time: 1,
                path: "/"
            })
            window.open('/user/playvideo')
        } else {
            $('.warning').css('display', 'block')
            $('.warning').text('不支持此视频格式')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        }

    })

    /**
     * 文件删除
     * ？？？文件路径(文件id)
     */
    $('#filelist').on('click', '.icon-shanchu', function (e) {
        let filepath = $(e.target).siblings('.download').attr('href')
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
            xhr: function () {
                var xhr = new XMLHttpRequest();
                //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                xhr.upload.addEventListener('progress', function (e) {
                    //loaded代表上传了多少
                    //total代表总数为多少
                    var progressRate = (e.loaded / e.total)
                    if (progressRate == 1) {
                        $('.warning').css('display', 'block')
                        $('.warning').text('上传成功')
                        setTimeout(function () {
                            $('.warning').css('display', 'none')
                        }, 1500)
                    }
                })
                return xhr;
            },
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

    $('#deleterow').click(function () {
        let rowlength = $('.editrow').length
        if (rowlength == 1) {
            $('.warning').css('display', 'block')
            $('.warning').text('至少一行')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else {
            $('.editrow')[rowlength - 1].remove()
        }
    })

    $('#deletecol').click(function () {
        let fieldlength = $('.editcol').children('th').length
        if (fieldlength == 1) {
            $('.warning').css('display', 'block')
            $('.warning').text('至少一列')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else {
            $($('.editcol').children('th')[fieldlength - 1]).remove()
            for (let i = 0; i < fieldlength; i++) {
                $($('.editrow').children('td')[fieldlength - 1]).remove()
            }
        }
    })

    $('#editor').click(function () {
        editflag = true
        let tableobj = {}
        tableobj.tablename = $('caption').text()
        tableobj.field = []
        tableobj.rowdata = []
        for (let i = 0; i < $('.col').children('th').length; i++) {
            tableobj.field.push($($('.col').find('th')[i]).text())
        }
        for (let i = 0; i < $('#tablebox').find('tbody').find('.row').length; i++) {
            let obj = {}
            for (let j = 0; j < $('.col').children('th').length; j++) {
                obj[tableobj.field[j]] = $($($('.row')[i]).find('td')[j]).text()
            }
            tableobj.rowdata.push(obj)
        }
        var table = {
            list: tableobj
        }
        var tablehtml = template('edit', table)
        $('#edittable').html(tablehtml)
        $('.addtable').css('display', 'block')
        $('.form').css('display', 'none')
        $('.file').css('display', 'none')
        // document.getElementById('#edittable').innerHTML = tablehtml
    })

    //不保存
    $('#notsave').click(function () {
        $('.form').css('display', 'block')
        $('.file').css('display', 'none')
        $('.addtable').css('display', 'none')
        let base = `<caption><input type="text" placeholder="请输入表名"></caption>
            <tr class="editcol">
                <th><input type="text"></th>
            </tr>
            <tr class="editrow">
                <td><input type="text"></td>
            </tr>`
        $('#edittable').empty()
        $('#edittable').append(base)
    })

    //添加表保存
    $('#saveeditor').click(function () {
        //获取输入数据
        let tableobj = {}
        let field = true
        let numtablename = false
        let numfield = false
        tableobj.tablename = $('#edittable').children('caption').find('input').val()
        tableobj.field = []
        tableobj.rowdata = []
        if (Number(tableobj.tablename)) {
            numtablename = true
        }
        for (let i = 0; i < $('.editcol').children('th').length; i++) {
            //字段为空
            if (!$($('.editcol').find('input')[i]).val()) {
                field = false
                break
            }
            //字段是纯数字
            if (Number($($('.editcol').find('input')[i]).val())) {
                numfield = true
                break
            }
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
        if (!tableobj.tablename) {
            //表名不能为空
            $('.warning').css('display', 'block')
            $('.warning').text('表名不能为空')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else if (!field) {
            $('.warning').css('display', 'block')
            $('.warning').text('字段不能为空')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else if (numtablename) {
            $('.warning').css('display', 'block')
            $('.warning').text('表名不能为纯数字或以数字开头')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else if (numfield) {
            $('.warning').css('display', 'block')
            $('.warning').text('字段不能为纯数字或以数字开头')
            setTimeout(function () {
                $('.warning').css('display', 'none')
            }, 1500)
        } else {
            if (!editflag) {
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
                        if (data.success) {
                            $('.form').css('display', 'block')
                            $('.file').css('display', 'none')
                            $('.addtable').css('display', 'none')
                            gettable()
                        } else {
                            $('.warning').css('display', 'block')
                            $('.warning').text('此表已存在')
                            setTimeout(function () {
                                $('.warning').css('display', 'none')
                            }, 1500)
                        }

                    }

                })
            } else {
                //编辑表保存
                console.log('编辑')
                editflag = true
            }
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
            }, 1500)
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

                    //
                    $('.form').css('display', 'block')
                    $('.file').css('display', 'none')
                    $('.addtable').css('display', 'none')
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

    $('#deletetable').click(function () {
        let tablename = $('caption').text()
        $.ajax({
            url: '/deletetable',
            data: {tablename},
            type: 'post',
            beforeSend: function (request) {
                //将cookie中的token信息放于请求头中
                request.setRequestHeader("token", cookieobj.user)
                request.setRequestHeader('userid', cookieobj.login)
            },
            success: function (data) {
                //刷新页面
                gettable()
            }
        })
    })
})