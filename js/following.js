function follow(id) {
    var box = document.getElementById(id);
    var span = box.getElementsByClassName("mask")[0];
    box.onmouseenter = function (e) {//用enter代替over事件
        e = e || window.event;
        //先要判断鼠标是从盒子的那个方向进来的
        var res = getDirection(this, e);//res即为鼠标进入的方向,res是0，1，2，3
       // console.log(res);
        switch (res) {
            case 0:
                utils.css(span, {left: -113, top: 0});
                break;
            case 1:
                utils.css(span, {left: 0, top: 113});
                break;
            case 2:
                utils.css(span, {left: 113, top: 0});
                break;
            case 3:
                utils.css(span, {left: 0, top: -113});
                break
        }
        animate(span, {left: 0, top: 0}, 300);
    };
    function getDirection(box, e) {//获取鼠标进入方向
        //当鼠标进入的那一刻，鼠标的x，y向坐标
        /*console.log(utils.offset(box));*/
        var x = e.pageX - utils.offset(box).left - box.offsetWidth / 2;
        var y = utils.offset(box).top + box.offsetHeight / 2 - e.pageY;
        //console.log(x + "," + y);
        //根据坐标调用Math.atan2(y,x)求弧度角，并转化为角度
        var ang = Math.atan2(y, x) * (180 / Math.PI);//弧度转角度
        //这个角度的区间是【-180，+180】(区间)；
        //ang+180之后是【0，360】
        //ang加180后除以90，返回【0，4】，但是不一定是正数
        //再Math.round();四舍五入取整
        //再%4，返回0（L），1（B），2（R），3（T）
        //需要返回值代表哪个方向
        return Math.round((ang + 180) / 90) % 4;
    }

    box.onmouseleave = function (e) {
        var res = getDirection(box, e);
        switch (res) {
            case 0:
                animate(span, {left: -113, top: 0}, 300);
                break;
            case 1:
                animate(span, {left: 0, top: 113}, 300);
                break;
            case 2:
                animate(span, {left: 113, top: 0}, 300);
                break;
            case 3:
                animate(span, {left: 0, top: -113}, 300);
                break;
        }
    }
}




