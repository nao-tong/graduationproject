(function(){
    //雪花类
    class snowflake{
        constructor(num){
            this.num = num;
            this.init();
        }
        init(){
            var width = document.documentElement.clientWidth;//可视区域的宽度
            var snowbox = document.getElementsByClassName('snowbox')[0];
            var div = document.createElement('div');
            this.div = div;
            snowbox.appendChild(div);
            div.style.position = "absolute";
            div.className = this.num + "snow";
            div.style.left = Math.random()*width - 7 + 'px';//x坐标随机;
            div.style.top = 0;
            div.style.width = Math.random()*7 + 3 +  "px";
            div.style.height = div.style.width;
            div.style.borderRadius = 50 + "%";
            div.style.opacity = Math.random();
            div.style.backgroundColor = 'white';
            this.speed = parseInt(div.style.width) - 3;//雪花下落速度为0-10以内的随机数;
        }
        draw(){
            this.div.style.top = parseInt(this.div.style.top) + 1 + this.speed * 0.2 + "px";//y坐标每次递增1像素;
            this.div.style.opacity -= 0.00016;//透明度每次递减0.01;
            
        }
    }
    
    var snowbox = document.getElementsByClassName('snowbox')[0];
    var snowArray = [];
    function cartoon(){
        let height = document.documentElement.clientHeight - 7;
        let num = 0;
        var timer = setInterval(function(){
            num++;
            //实例化雪花对象;
            var snow = new snowflake(num);
            //将雪花对象添加到数组中;
            snowArray.push(snow);
            for(let i = 0; i < snowArray.length; i++){
                let opacity = snowArray[i].div.style.opacity;
                let y = parseInt(snowArray[i].div.style.top) + parseInt(snowArray[i].div.style.width) / 2;
                //透明度小于0、雪花落地，即雪花消失，重新绘制雪花;
                if(opacity <= 0 || y >= height){
                    snowbox.removeChild(document.getElementsByClassName(snowArray[i].div.className)[0]);
                    snowArray.splice(i,1);
                }
                snowArray[i].draw();
            }
        },100)
    }
    cartoon();
})()