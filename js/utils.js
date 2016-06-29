/**
 * Created by wx on 2016/5/14.
 */
var utils = (function () {

    //flag 判断是否是IE 6,7,8
    var flag = "getComputedStyle" in window;

    /**
     * listToArray：把类数组转成数组
     * @param arg
     * @returns {*}
     */
    function listToArray(arg) {

        try {
            return [].slice.call(arg);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < arg.length; i++) {
                ary[ary.length] = arg[i];
            }
            return ary;
        }
    }

    //自动注释： "/**"+回车
    /**
     * jsonParse：把JSON类型的字符串转化为JSON类型的对象
     * @param jsonStr JSON类型的字符串
     * @returns {Object}  JSON类型的对象
     */
    function jsonParse(jsonStr) {
        //try...catch思想封装
        /*        try{
         return JSON.parse(jsonStr);
         }catch(e){
         return eval("("+ jsonStr +")");
         }*/
        //属性boolean判断思想封装
        return flag ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    /**
     * numToUpperCase -把传入字符串中的小写数字替换成中文大写
     * @param str
     * @returns {string}
     */
    function numToUpperCase(str) {
        var retStr = '';
        var ary = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var reg = /\d/g;
        retStr = str.replace(reg, function () { //个人猜测：把reg.exec每次捕获的结果，当参数传入此回调函数
            return ary[arguments[0]];
        })
        return retStr;
    }

    /**
     * getCss 兼容获得元素css属性的方法（可以获得到非行间样式）
     * @param ele 当前元素
     * @param attr 属性名
     * @returns {Number}
     */
    function getCss(ele, attr) {

        var res = null, reg = null;
        if (flag) {
            res = window.getComputedStyle(ele, null)[attr];
        }
        else {
            if (attr == 'opacity') {
                var str = ele.currentStyle["filter"];
                var reg = /alpha\(opacity\s*=\s*(\d+(?:\.\d+)?)\)/;
                res = reg.test(str) ? RegExp.$1 / 100 : 1;
            }
            else {
                res = ele.currentStyle[attr];
                //console.log(attr);
            }
        }

        reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?(px|pt|em|rem)?$/;
        return reg.test(res) ? parseFloat(res) : res;
    }

    /**
     * setCss 设置行内样式
     * @param curEle 当前的元素
     * @param attr 设置的属性
     * @param value 设置的属性值
     */
    function setCss(curEle,attr,value){

        if(attr == 'float')
        {
            curEle.style.cssFloat = value; //高级浏览器
            curEle.style.styleFloat = value; //ie 6-8
            return;
        }

        //透明度设置
        if(attr == 'opacity')
        {
            curEle.style['opacity'] = value;
            curEle.style.filter='alpha(opacity='+ value*100 +')'; //ie
            return;
        }


        //加单位的处理；

        var reg = /(width|height|top|right|bottom|left|borderRadius|((margin|padding)(Top|Right|Bottom|Left)?))/;
        if(reg.test(attr) && !isNaN(value))
        {
            value+='px';
        }


        curEle.style[attr] = value;
    }

    /**
     * setCssGroup 批量设置一组css属性
     * @param curEle
     * @param options
     */
    function setCssGroup(curEle,options)
    {
        if(options.toString() !== '[object Object]')
        {
            return;
        }

        for(var attr in options)
        {
            this.setCss(curEle,attr,options[attr]);
        }
    }


    /**
     * css 根据传参的不同实现获取或（批量）设置css样式
     * @param curEle
     * @returns {Number}
     */
    function css(curEle) {
        var argTwo = arguments[1];
        if (typeof arguments[2] === 'undefined') //没有第三个参数
        {
            if (typeof argTwo == 'string') //第二个参数是字符串
            {
                return this.getCss(curEle, argTwo);
            }
            else //第二个参数是对象 或其他的
            {
                this.setCssGroup(curEle, argTwo);
            }
        }
        else //存在第三个参数
        {
            this.setCss(curEle, argTwo, arguments[2]);
        }
    }

    /**
     * getWin 获取文档的13个/设置2个(scrollTop/scrollLeft) 浏览器的宽高属性值
     * @param attr
     * @param value
     * @returns {*}
     */
    function getWin(attr, value) {
        if (typeof value == 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    /**
     * offset：当前元素距离文档顶部和最左侧的距离
     * @param ele 当前元素
     * @returns {{left: (Number|number), top: (Number|number)}}
     */
    function offset(ele) {
        var l = ele.offsetLeft;
        var t = ele.offsetTop;

        var p = ele.offsetParent;
        while (p) {
            if (window.navigator.userAgent.indexOf('MSIE 8.0') == -1) //不是ie8，则加上边框
            {
                l += p.clientLeft;
                t += p.clientTop;
            }

            l += p.offsetLeft;
            t += p.offsetTop;

            p = p.offsetParent;
        }

        //返回对象
        return {left: l, top: t};

    }

    /**
     * children 获取当前元素ele下的所有子元素，或指定标记名的子元素
     * @param ele
     * @param tagName
     * @returns {Array}
     */
    function getChildren(ele, tagName) {
        var ary = [];

        if (flag)
        {
            ary = Array.prototype.slice.call(ele.children);

        }
        else {  //ie 6 7 8
            var childs = ele.childNodes;
            for (var i = 0; i < childs.length; i++) {
                var curChild = childs[i];
                if (curChild.nodeType == 1) {
                    ary.push(curChild);
                }
            }
        }

        //ary里保存的是ele下所有的子元素节点
        //筛选出和传进来的tagName相同的子元素节点
        //如果传了第二个参数，则应该把ary里标记名不是第二个参数的元素删除

        if (typeof tagName == 'string') //第二参数是字符串类型才比较，不是或没传直接返回所有子元素节点
        {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur.nodeName.toLowerCase() != tagName.toLowerCase()) {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }

        return ary;
    }

    /**
     * preEle 获得一个哥哥元素节点
     * @param ele 当前的元素
     * @returns {*}
     */
    function preEle(ele) {
        if (flag) {
            return ele.previousElementSibling;
        }

        var preNode = ele.previousSibling;
        while (preNode && preNode.nodeType !== 1) {
            preNode = preNode.previousSibling;
        }

        return preNode;
    }

    /**
     * preEleAll 获得所有哥哥元素节点
     * @param ele
     * @returns {Array}
     */
    function preEleAll(ele) {
        var ary = [];
        var pre = preEle(ele);

        while (pre) {
            ary.unshift(pre);
            pre = preEle(pre);
        }

        return ary;
    }

    /**
     * nextEle 获得下一个弟弟节点
     * @param ele
     * @returns {*}
     */
    function nextEle(ele) {
        if (flag) {
            return ele.nextElementSibling;
        }

        var nextNode = ele.nextSibling;
        while (nextNode && nextNode.nodeType !== 1) {
            nextNode = nextNode.nextSibling;
        }

        return nextNode;
    }

    /**
     * nextEleAll 获得所有弟弟节点
     * @param ele
     * @returns {Array}
     */
    function nextEleAll(ele) {
        var ary = [];
        var next = nextEle(ele);

        while (next) {
            ary.push(next);
            next = nextEle(next);
        }

        return ary;
    }

    /**
     * siblingEle 获得相邻的兄弟节点
     * @param ele
     * @returns {Array}
     */
    function siblingEle(ele) {
        var ary = [];
        //首先判断哥哥（弟弟）元素节点是否存在，存在就放在数组里
        var pre = preEle(ele);
        var next = nextEle(ele);
        pre ? ary.push(pre) : null;
        next ? ary.push(next) : null;

        return ary;

    }

    /**
     * siblingEleAll 获得所有的兄弟元素节点
     * @param ele
     * @returns {Array.<T>}
     */
    function siblingEleAll(ele) {
        return this.preEleAll(ele).concat(this.nextEleAll(ele));
    }

    /**
     * firstEle 获得第一个子元素节点
     * @param ele
     * @returns {null}
     */
    function firstEle(ele) {
        var ary = getChildren(ele);
        return ary.length == 0 ? null : ary[0];
    }

    /**
     * lastEle 获得最后一个子元素节点
     * @param ele
     * @returns {null}
     */
    function lastEle(ele) {
        var ary = getChildren(ele);
        return ary.length == 0 ? null : ary[ary.length - 1];
    }

    /**
     * index 求当前元素的索引
     * @param curEle 当前元素
     * @returns {Number} 索引
     */
    function index(curEle) {
        //看上面有几个哥哥，才能知道自己老几
        return this.preEleAll(curEle).length;
    }

    /**
     * appendChild 插入到子元素的最后
     * @param context
     * @param curEle
     */
    function appendChild(context, curEle) {
        context.appendChild(curEle);
    }

    /**
     * 把当前元素插入到oldEle之前
     * @param curEle 当前元素
     * @param oldEle 已有元素
     */
    function insertBefore(curEle,oldEle){
        oldEle.parentNode.insertBefore(curEle,oldEle);
    }

    /**
     * prePend 把newEle添加到container的第一个子元素之前
     * @param context
     * @param newEle
     */
    function prePend(context, newEle) {
        //1、先判断下是否有第一个子元素节点，如果有，则添加到第一个子元素节点之前，如果没有，则添加到末尾位置
        var first = firstEle(context);
        first ? context.insertBefore(newEle, first) : context.appendChild(newEle);
    }

    /**
     * insertAfter 插入到一个元素之后
     * @param newEle
     * @param oldEle
     */
    function insertAfter(newEle, oldEle) {
        //首先获得oldEle之后的元素节ooldELe点；如果ooldEle存在，则插入其之前，如果不存在插入到最后的位置
        var next = nextEle(ele);
        if (next) //如果下一个元素节点存在，则插入其之前
        {
            oldEle.parentNode.insertBefore(newEle, next);
        }
        else {
            oldEle.parentNode.appendChild(newEle);
        }
    }

    /**
     * hasClass 判断ele下是否有className这个类名
     * @param curEle
     * @param strName
     * @returns {boolean}
     */
    function hasClass(curEle, strName) {
        var reg = new RegExp('\\b' + strName + '\\b', 'g');
        return reg.test(curEle.className); //curEle.className表示ele对象上的类名属性
    }

    /**
     * addClass 向元素上添加类名
     * @param curEle
     * @param strClass
     */
    function addClass(curEle, strClass) {
        var ary = strClass.replace(/(^ +)|( +$)/g, '').split(/ +/);
        for (var i = 0; i < ary.length; i++) {
            var curClass = ary[i];
            if (!this.hasClass(curEle, curClass)) {
                curEle.className += ' ' + curClass;
            }
        }

    }

    /**
     * removeClass 删除元素ele上的类名strClass
     * @param curEle 当前的元素
     * @param strClass 要删除的类名字符串，可能包含多个类名，eg: ' aa bb '
     */
    function removeClass(curEle, strClass) {
        //把传入的strClass中的前后空格去掉，然后再按空格拆分成数组
        var aryName = strClass.replace(/(^ +| +$)/, '').split(/ +/g);

        for (var i = 0; i < aryName.length; i++) {
            var curName = aryName[i];
            var reg = new RegExp('(^| +)' + curName + '( +|$)');
            //数组的每一项匹配当前元素的类名字符串，匹配到则把本类名删除
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(reg, ' ');
            }
        }
    }

    /**
     * getElesByClass 通过类名获得当前ele下的元素
     * @param curEle 当前的元素
     * @param strClass 一个或多个类名的字符串
     * @returns {*} 数组
     */
    function getElesByClass(curEle, strClass) {
        if (flag) {
            return Array.prototype.slice.call(curEle.getElementsByClassName(strClass));
        }

        var ary = [];
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/ +/);

        //拿到当前元素下的所有元素
        var nodeList = curEle.getElementsByTagName('*');

        //循环：目的为了匹配每个元素的className是否符合要求，匹配要求：当前这个元素上的className包含aryClass中个每一项
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var bOk = true; //假设都符合
            for (var j = 0; j < aryClass.length; j++) {
                var curClass = aryClass[j];
                var reg = new RegExp('(\\b)' + curClass + '(\\b)') //\b单词边界（开头、结尾或空格）
                if (!reg.test(curNode.className)) //有一个不匹配，bOk设置为false
                {
                    bOk = false;
                    break;
                }
            }
            //aryClass中的每一项都包含的话，说明就是想要的元素，把当前元素添加到ary数组中
            if (bOk) {
                ary.push(curNode);
            }
        }
        return ary;
    }

    /**
     * rndNum 产生一个[n,m]之间的随机整数
     * @param n
     * @param m
     * @returns {number}
     */
    function rndNum(n,m){
        if(n>m) //如果n > m 交换两个数；
        {
            m = m+n;
            n = m-n;
            m = m-n;
        }
        return Math.round(Math.random()*(m-n)+n);
    }

    /**
     *  formatDate 格式化输出时间字符串
     * @param srcStr 原始时间字符串 eg:'2015/5-23 21.42:01' （必须从年到秒）
     * @param modelStr 格式字符串 eg:'{0}年{1}月{2}日{3}时{4}分{5}秒' （格式固定，可以只取其中一部分）
     * @returns {string}
     */
    function formatDate(srcStr,modelStr){
        modelStr = modelStr||'{0}年{1}月{2}日{3}时{4}分{5}秒';
        var arySrc = [];
        var reg = /^(\d{2,4})(?:-|\.|\/| )(\d{1,2})(?:-|\.|\/| )(\d{1,2})(?:-|\.|\/| )(\d{1,2})(?:-|\.|\/| |:)(\d{1,2})(?:-|\.|\/| |:)(\d{1,2})$/;
        arySrc = [].slice.call(reg.exec(srcStr),1,7);

        return modelStr.replace(/{(\d)}/g,function(){
            var val = arySrc[arguments[1]];
            return val ===1 ? '0'+val:val;
        });
    }

    return {
        listToArray: listToArray,
        jsonParse: jsonParse,
        numToUpperCase: numToUpperCase,
        getCss: getCss,
        setCss:setCss,
        setCssGroup:setCssGroup,
        css:css,
        getWin: getWin,
        offset: offset,
        getChildren: getChildren,
        preEle: preEle,
        preEleAll: preEleAll,
        nextEle: nextEle,
        nextEleAll: nextEleAll,
        siblingEle: siblingEle,
        siblingEleAll: siblingEleAll,
        firstEle: firstEle,
        lastEle: lastEle,
        index: index,
        appendChild: appendChild,
        insertBefore:insertBefore,
        prePend: prePend,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElesByClass: getElesByClass,
        rndNum:rndNum,
        formatDate:formatDate

    }
})();
