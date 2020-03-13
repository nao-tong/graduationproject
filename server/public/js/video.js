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

var video = document.getElementsByClassName("video")[0];
var myvideo = document.getElementsByTagName('video')[0];
var myplay = document.getElementsByClassName('play')[0];
var myscreen = document.getElementsByClassName('screen')[0];
var mycurrent = document.getElementsByClassName('current')[0];
var mytotal = document.getElementsByClassName('total')[0];
var myline = document.getElementsByClassName('linebar')[0];
var progressbar = document.getElementsByClassName('progressbar')[0];

//变量
var flag = true
var f = true
var cookieobj = alaysisCookie(document.cookie)

myvideo.src = cookieobj.video

//开始/暂停
myplay.onclick = function () {
    if (flag) {
        myvideo.play();
        myplay.className = "play iconfont icon-zanting";
    }
    else {
        myvideo.pause();
        myplay.className = "play iconfont icon-bofang";
    }
    flag = !flag;
}

//获取当前播放时间
function time(time) {
    var hour = parseInt(time / 3600);
    var minate = parseInt(time / 60) % 60;
    var second = parseInt(time % 60);
    return (hour > 10 ? hour : '0' + hour) + ':' + (minate > 10 ? minate : '0' + minate) + ':' + (second > 10 ? second : '0' + second)
}

myvideo.oncanplay = function () {
    mytotal.innerHTML = time(parseInt(myvideo.duration));
}

//进度条
myvideo.ontimeupdate = function () {
    var currenttime = myvideo.currentTime;
    var totaltime = myvideo.duration;
    var linewidth = (currenttime / totaltime).toFixed(2) * 100 + "%";
    myline.style.width = linewidth;
    mycurrent.innerHTML = time(currenttime);
}

//跃进功能
progressbar.onclick = function (e) {
    var width = e.offsetX;
    var allwidth = progressbar.offsetWidth;
    console.log(allwidth);
    var linewidth = (width / allwidth).toFixed(2) * 100 + "%";
    var currenttime = myvideo.duration * (width / allwidth).toFixed(2);
    console.log(currenttime);
    myvideo.currentTime = currenttime;
    myline.style.width = linewidth;
    mycurrent.innerHTML = time(currenttime);
}

//全屏操作
myscreen.onclick = function () {
    if (f) {
        video.webkitRequestFullScreen(); //全屏
        myscreen.className = "screen iconfont icon-shisetuichuquanping";
    } else {
        document.webkitCancelFullScreen(); //退出全屏
        myscreen.className = "screen iconfont icon-shisequanping";
    }
    f = !f;
}