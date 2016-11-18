/**
 * Created by admin on 2016/9/4.
 */
var utils = (function () {
    var isStandarBrowser = "getComputedStyle" in window;

    function jsonParse(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    function listToAry(likeAry) {
        try {
            return Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < likeAry.length; i++) {
                ary.push(likeAry[i]);
            }
        }
        return ary;
    }

    function getRandom(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var tem = m;
            m = n;
            n = tem;
        }
        return Math.round(Math.random() * (m - n) + n);
    }

    function win(attr, val) {
        if (typeof val != "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        } else {
            return document.documentElement[attr] || document.body[atrr];
        }
    }

    function getCss(ele, attr) {

        var val = null;
        if (isStandarBrowser) {
            val = window.getComputedStyle(ele, null)[attr];//注意ele是传给getComputedStyle()的参数，而且getComputedStyle获取回来的是一个对象，所以用[attr]获取
        } else {
            if (attr == "opacity") {
                val = ele.currentStyle["filter"];
                var reg = /alpha\(opacity=(\d+(?:\.\d+)?)\)/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            }
            val = ele.currentStyle[attr];
        }
        var reg2 = /-?\d+(\.\d+)?(px|pm|em|deg)?/;
        if (reg2.test(val)) {
            val = parseFloat(val);
        }
        return val;
    }

    function setCss(ele, attr, val) {
        if (attr == "opacity") {
            ele.style.opacity = val;
            ele.style.filter = "alpha(opacity=" + val * 100 + ")";
            return;
        }
        if (attr == "float") {
            ele.style.cssFloat = val;
            ele.style.styleFloat = val;
            return;
        }
        //debugger;
        var reg = /width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?/;//注意js设置行内样式时margin-left这种格式不支持，得写成marginLeft样式
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += "px";
            }
        }
        ele.style[attr] = val;
    }

    function setGroupCss(ele, options) {
        options = options || [];
        if (options.toString() == "[object Object]") {//这行代码就是保证options是{}数据类型
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    setCss(ele, key, options[key]);
                }
            }
        }

    }

    function Css(ele) {//根据函数的参数个数和类型的不同来调用不同函数类型实现不同类型；
        var secondParam = arguments[1];
        var thirdParam = arguments[2];//undefined?
        if (typeof secondParam == "string") {//第二个参数是字符串有可能是getcss或者setcss进一步判第三个参数是否参数
            if (typeof thirdParam == "undefined") {
                return getCss(ele, secondParam);
            }
            //只要代码执行至此说明有第三个参数，单个设置样式
            setCss(ele, secondParam, thirdParam);
            return;//设置完了就可以结束了
        }
        //debugger;
        secondParam = secondParam || [];
        if (secondParam.toString() == "[object Object]") {
            //只要代码能执行至此，说明第二个参数是对象
            setGroupCss(ele, secondParam);
        }

    }

    function offset(ele) {
        var l = null,
            t = null;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while (par) {
            if (!/MSIE 8/.test(window.navigator.userAgent)) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }

    //////////////////////////////////////////////////////////////////////
    function prev(ele) {
        if (isStandarBrowser) {
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType != 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    function children(ele, tagName) {
        var ary = [];
        if (isStandarBrowser) {//当children不存在的时候返回一个[],布尔值不是false
            ary = listToAry(ele.children);
        } else {
            var nodes = ele.childNodes;
            for (var i = 0; i < nodes.length; i++) {//挑出所有的元素节点放到数组里
                var cur = nodes[i];
                if (cur.nodeType == 1) {
                    ary.push(cur);
                }
            }
        }
        if (typeof tagName == "string") {//tagName传值了且为一个字符串
            for (var j = 0; j < ary.length; j++) {
                var curele = ary[j];//此时数组中的每一项是一个元素了
                if (curele.nodeName.toLowerCase() != tagName.toLowerCase()) {
                    ary.splice(j, 1);
                    j--;//数组塌陷问题
                }
            }
        }
        return ary;
    }

    function next(ele) {
        if (isStandarBrowser) {
            return ele.nextElementSibling;
        }
        var next = ele.nextSibling;
        while (next && next.nodeType != 1) {
            next = next.nextSibling;
        }
        return next;
    }

    function prevAll(ele) {//获取所有的元素哥哥节点
        var ary = [];
        var prev = this.prev(ele);//先获取上一个元素哥哥节点
        while (prev) {
            ary.unshift(prev);//哥哥是往前面放
            prev = this.prev(prev);
        }
        return ary;
    }

    function nextAll(ele) {
        var ary = [];
        var next = this.next(ele);
        while (next) {
            ary.push(next);//弟弟往后面放
            next = this.next(next);
        }
        return ary;
    }

    function sibling(ele) {//获取相邻的两兄弟节点
        var ary = [];
        //在向数组里放的时候要判断
        this.prev(ele) ? ary.push(this.prev(ele)) : void 0;
        this.next(ele) ? ary.push(this.next(ele)) : void 0;
        return ary;
    }

    function siblings(ele) {
        return this.prevAll(ele).concat(this.nextAll(ele));//获取所有的哥哥弟弟元素方法
    }

    function index(ele) {//索引值和所有元素哥哥集合的length相等
        return this.prevAll(ele).length;
    }

    function firstElementChild(ele) {//获取第一个元素子节点，
        if (isStandarBrowser) {
            return ele.firstElementChild;
        }
        var chds = this.children(ele);
        return chds.length > 0 ? chds[0] : null;//如果chds的length>0说明至少有一个儿子
    }

    function lastElementChild(ele) {
        if (isStandarBrowser) {
            return ele.lastElementChild;
        }
        var chds = this.children(ele);
        return chds.length > 0 ? chds[chds.length - 1] : null;
    }

    ///////////////////////////////////////////////////////////////////
    function append(newEle, container) {//向容器的末尾添加内容
        container.append(newEle);
    }

    function preappend(newEle, container) {//向容器开头增加内容
        var firChd = this.firstElementChild(container);
        //如果第一个元素孩子存在，直接插入到其前面，如果不存在则直接appendChild到容器内
        firChd ? container.insertBefore(newEle, firChd)/*insertBefore的第一个参数是new，第二个是old*/ : container.appendChild(newEle);
    }

    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);//因只有父级才能调用insertbBefore方法所以先需要先获取oldEle.parentNode
    }

    function insertAfter(newEle, oldEle) {//向谁的后面插入一个元素，插入谁的后面即是想谁的弟弟前面插入，所以先获取谁的弟弟
        var next = this.next(oldEle);
        next ? oldEle.parentNode.insertBefore(newEle, next) : oldEle.parentNode.appendChild(newEle);//如果弟弟存在，直接插入到弟弟的前面，如果不存在说明我就是最后一个，所以直接appendChild就可以了
    }

    /////////////////////////////////////////////
    function hasClass(ele, strClass) {//判断ele是否有strClass这个类名
        //先去掉strClass首位空格；
        strClass = strClass.replace(/(^\s+|\s+$)/g, "");
        //var reg=/^|\s++strClass+\s+|$/;
        var reg = new RegExp("(^|\\s+)" + strClass + "(\\s+|$)");//以实例创建方式创建活的正则,注意在字符串里写\s时要写转译符\；
        return reg.test(ele.className);
    }

    function addClass(ele, strClass) {//在内置方法中有classList.add()

        strClass = strClass.replace(/^\s+|\s+$/g, "");
        var classAry = strClass.split(/\s+/);
        for (var i = 0; i < classAry.length; i++) {
            var curClass = classAry[i];
            if (!this.hasClass(ele, curClass)) {//如果不包含这个类名的时候才能添加
                ele.className += " " + curClass;//引号里是空格
            }
        }
    }

    function removeClass(ele, strClass) {//在ele的className中移除strClass
        debugger;
        strClass = strClass.replace(/(^ +| +$)g/, "");
        var strClassAry = strClass.replace(/(^ +| +$)/g, " ").split(/ +/);
        for (var i = 0; i < strClassAry.length; i++) {
            var curClass = strClassAry[i];
            if (this.hasClass(ele, strClass)) {
                var reg = new RegExp("(^| +)" + curClass + "( +|$)", "g");//把所有能用c2和c3拼接成的正则的能在className中能匹配到的全部用" "(空格字符串)替换
                ele.className = ele.className.replace(reg, " ");
            }
        }


    }

    function getElesByClass(strClass, context) {
        context = context || document;
        if (isStandarBrowser) {
            return context.getElementsByClassName(strClass);
        }
        strClassAry = strClass.replace(/(^ +| +$)/g).split(/ +/);
        var ary = [];
        var childs = context.getElementsByTagName("*");
        for (var i = 0; i < childs.length; i++) {
            var curEle = childs[i];
            curEle.flag = true;
            for (var j = 0; j < strClassAry.length; j++) {
                var curClass = strClassAry[j];
                var reg = new RegExp("(^| +)" + curClass + "( +|$)");
                if (!reg.test(curEle.className)) {
                    curEle.flag = false;
                    break;
                }
            }
            if (curEle.flag) {
                ary.push(curEle);
            }
        }
        return ary;
    }

    return {
        win: win,
        listToAry: listToAry,
        jsonParse: jsonParse,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        getRandom: getRandom,
        offset: offset,
        prev: prev,
        children: children,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstElementChild: firstElementChild,
        lastElementChild: lastElementChild,
        append: append,
        preappend: preappend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElesByClass: getElesByClass,
        css: Css
    }


})();