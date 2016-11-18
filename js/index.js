var banner = document.getElementById("bannerlg");
var bannerInner = document.getElementById("bannerInner");
var imgs = bannerInner.getElementsByTagName("img");
var foucusList = document.getElementById("focusList");
var lis = foucusList.getElementsByTagName("li");
var em=document.getElementById("em");
var step = 0;
function autoMove() {
    if (step == 3) {
        step = 0;
        utils.css(bannerInner, "top", -160 * step);
    }
    step++;
    animate(bannerInner, {top: -160 * step}, 500);
    focusAlign();
}
function focusAlign() {
    var temStep = step == 3 ? 0 : step;

    animate(em,{top:temStep*55},300);
    for (var i = 0; i < lis.length; i++) {
        lis[i].className = i == temStep ? "selected" : "";
    }
}
var timer = window.setInterval(autoMove, 2000);
banner.onmouseover = function () {
    window.clearInterval(timer);
};
banner.onmouseout = function () {
    timer = window.setInterval(autoMove, 2000);
};
(function lisClkEvent() {
    for (var i = 0; i < lis.length; i++) {
        lis[i].onmouseover = function () {
            //debugger;
            step = utils.index(this)-1;
            //console.log(step);
            animate(bannerInner, {top: -160 * step}, 100);
            focusAlign();
        }
    }
})();
////////////////////////////////////////////////////////
var cross = document.getElementById("cross");
var oAs = utils.getElesByClass("box",cross);
var oDls = cross.getElementsByTagName("dl");
for (var k = 0; k < oAs.length; k++) {
    // console.log(oAs);
    follow("box" + k);
};

////////////////////////////////////////////////////////

var login=document.getElementById("login");
var backtop=document.getElementById("backtop");
var feedback=document.getElementById("feedback");

var t=document.getElementById("backtop");
function fn(){

    var scrT=utils.win("scrollTop");
    var scrH=utils.win("scrollHeight");
    var cltH=utils.win("clientHeight");
    if(scrT==0){
        utils.setCss(t,"display","none");
    }
    if(scrT>utils.win("clientHeight")/2){
        utils.setCss(t,"display","block");
    }
    if(scrT+cltH==scrH){
        utils.css(login,"bottom","64px");
        utils.css(backtop,"bottom","180px");
        utils.css(feedback,"bottom","138px");
    }else {
        utils.css(login,"bottom","0");
        utils.css(backtop,"bottom","116px");
        utils.css(feedback,"bottom","74px");
    }
}
window.onscroll=fn;
var timer=null;
t.onclick=function(){
    window.clearInterval(timer);
    utils.css(login,"bottom","0");
    utils.css(backtop,"bottom","116px");
    utils.css(feedback,"bottom","74px");
    utils.css(this,"background-position","right top");
    var scrT=utils.win("scrollTop");
    var that=this;
    timer=window.setInterval(function(){
        if(scrT<=0){
            window.onscroll=fn;
            window.clearInterval(timer);
            utils.setCss(t,"display","none");
            utils.css(that,"background-position","left top");
        }
        scrT-=15;
        utils.win("scrollTop",scrT);
    },10);
    window.onscroll=null;
};
///////////////////////////////////////////////////////

/*选项卡*/
var recruitListtab=document.getElementById('recruitListtab');
var titles=document.getElementById('title');
var oLis=titles.getElementsByTagName("h2");
var oDivs=recruitListtab.getElementsByTagName("ul");
for(var i=0;i<oLis.length;i++){
    oLis[i].index=i;
    oLis[i].onclick=function(){
        for(var j=0;j<oLis.length;j++){
            oLis[j].className="";
            oDivs[j].className="";
        }
        this.className="on";
        oDivs[this.index].className="cur";
    }
}

