/**
 * Created by wx on 2016/6/24.
 */
//这是封装的功能类集
var packUtils = (function(){

    /**
     * Carousel 【轮播图构造函数】
     * @param oBox 大盒子[object]
     * @param aSingle 单个轮播项的元素集合[array]
     * @param duration 自动轮播的时间[number]
     * @param aFocus 焦点元素集合[array]
     * @param oBtnL 左切换按钮[object]
     * @param oBtnR 右切换按钮[object]
     * @constructor
     */
    function Carousel(oBox,aSingle,duration,aFocus,oBtnL,oBtnR){
        this.oBox = oBox; //大盒子
        this.aSingle = aSingle; //单个轮播项集合
        this.duration = duration||500; //自动轮播的时间
        this.aFocus = aFocus; //焦点元素集合
        this.oBtnL = oBtnL; //左切换按钮
        this.oBtnR = oBtnR; //右切换按钮
        this.focusSelectClass = 'cur'; //表示焦点选中的类名
        this.maxNum = aSingle.length; //轮播项的个数
        this.step = 0; //用于逐步轮播的计数变量
        this.timer = null; //轮播定时器编号


        this.init();
    }

    Carousel.prototype = {
        init:init,
        constructor:Carousel,
        autoMove:autoMove,
        setBanner:setBanner,
        bannerTip:bannerTip,
        stopStart:stopStart,
        focusChange:focusChange,
        btnChange:btnChange
    };

    function init(){
        clearInterval(this.timer);
        this.timer = setInterval(this.autoMove.bind(this),this.duration);
        this.stopStart();
        if(this.aFocus)
        {
            this.focusChange();
        }

        if(this.oBtnL && this.oBtnR)
        {
            this.btnChange();
        }

    }

    function autoMove(){
        this.step++;
        if(this.step > this.maxNum-1)
        {
            this.step = 0;
        }

        this.setBanner();
    }

    function setBanner(){

        for(var i=0; i<this.maxNum; i++)
        {
            if(i === this.step)
            {
                utils.css(this.aSingle[i],'zIndex',1);
                myAnimate(this.aSingle[this.step],{opacity:1},100,0,function(){
                    //此回调函数中的this为当前元素
                    var siblings = utils.siblingEleAll(this);
                    for(var i=0; i<siblings.length; i++)
                    {
                        utils.css(siblings[i],'opacity',0);
                    }
                })
            }else{
                utils.css(this.aSingle[i],'zIndex',0);
            }

        }

        if(this.aFocus)
        {
            this.bannerTip();
        }
    }

    function bannerTip(){
        for(var i=0; i < this.maxNum; i++)
        {
            if(i == this.step)
            {
                utils.addClass(this.aFocus[i], this.focusSelectClass);
            }else{
                utils.removeClass(this.aFocus[i], this.focusSelectClass);
            }
        }
    }

    function stopStart(){
        var _this = this;
        this.oBox.onmouseenter = function(e){
            clearInterval(_this.timer);
        };

        this.oBox.onmouseleave = function(e){
            _this.timer = setInterval(_this.autoMove.bind(_this),_this.duration);
        };

    }

    function focusChange(){
        var _this = this;
        for(var i=0; i<this.maxNum; i++)
        {
            this.aFocus[i].index = i;
            this.aFocus[i].onclick = function(e){
                _this.step = this.index;
                _this.autoMove();
            };
        }

    }


    function btnChange(){
        var _this = this;
        this.oBtnL.onclick = function(e){
            _this.step--;
            if(_this.step < 0)
            {
                _this.step = _this.maxNum -1;
            }
            _this.setBanner();
        };

        this.oBtnR.onclick = autoMove.bind(this);
    }

//---------------------------------轮播图构造函数end--------------------------------------------//


    /**
     * TabControl 【选项卡构造函数】
     * @param aItem 选项元素集合[array]
     * @param aContent 选项对应的内容集合[array]
     * @param selectType 绑定的事件名称[string]
     * @param selectClass 表示选中的类名[string]
     * @constructor
     */
    function TabControl(aItem,aContent,selectType,selectClass){
    this.aItem = aItem; //选项集合
    this.aContent = aContent; //选项对应的内容集合
    this.selectType = selectType||'onclick'; //如何选择，即：绑定的事件名称，如：onclick、onmouseenter
    this.selectClass = selectClass; //用于表示当前选项的class名
    this.maxNum = aItem.length; //选项的个数

    this.init();
}

    TabControl.prototype = {
        init:initTabControl,
        constructor:TabControl,
        bindFun:bindFun,
        selectTab:selectTab

    };

    function bindFun(){
        var _this = this;
        for(var i=0; i<this.maxNum; i++)
        {

            this.aItem[i].index = i;
            this.aItem[i][this.selectType] = function(e){
               _this.selectTab(this.index);

            }
        }

    }

    function selectTab(num){
        for(var i=0; i<this.maxNum; i++)
        {
            if(i === num)
            {
                utils.addClass(this.aItem[i],this.selectClass);
                this.aContent[i].style.display = 'block';
            }else{
                utils.removeClass(this.aItem[i],this.selectClass);
                this.aContent[i].style.display = 'none';
            }
        }
    }

    function initTabControl(){
        this.bindFun();
    }

    //百度搜索热词jsonp接口
    var jsonpBaiduSearch = (function () {
        var word = null; //记录最后一次搜索的词
        var timer = null; //输入框失去焦点的定时器
        //工具函数
        var tools = (function () {
            //百度搜索的jsonp接口
            function baiduSuggestion(word, callback) {
                jsonp('https://www.baidu.com/su', {wd: word}, 'cb', function (data) {
                    callback(data);
                });
            }

            //搜索关键词并绑定数据，返回：搜索的关键词
            function searchAndBind(oInput,oUl,eleName) {
                word = oInput.value;
                if (word.length == 0) {
                    return;
                }

                baiduSuggestion(word, function (data) {
                    if (!data) {
                        return;
                    }
                    //热词存放在返回对象的属性名s中
                    data = data.s;
                    var len = data.length > 5? 5:data.length > 5;
                    var str = '';
                    for (var i = 0; i < len; i++) {
                        str += '<'+eleName+'>' + data[i] + '</'+ eleName +'>';
                    }

                    //让ul显示
                    oUl.style.display = 'block';
                    oUl.innerHTML = str;

                });

                return word;
            }

            function hasClass(curEle, strName) {
                var reg = new RegExp('\\b' + strName + '\\b', 'g');
                return reg.test(curEle.className); //curEle.className表示ele对象上的类名属性
            }

            function addClass(curEle, strClass) {
                var ary = strClass.replace(/(^ +)|( +$)/g, '').split(/ +/);
                for (var i = 0; i < ary.length; i++) {
                    var curClass = ary[i];
                    if (!this.hasClass(curEle, curClass)) {
                        curEle.className += ' ' + curClass;
                    }
                }

            }

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

            return {
                baiduSuggestion: baiduSuggestion,
                searchAndBind: searchAndBind,
                hasClass: hasClass,
                addClass: addClass,
                removeClass: removeClass
            }
        })();

        /**
         * jsonpBaiduSearch 调用百度的jsonp接口，返回搜索词相关的十个热门词汇
         * @param oInput 输入框
         * @param oSearchBar 搜索按钮
         * @param oUl 推荐词汇展示的ul
         * @param className 被选中的li的类名
         */
        function jsonpBaiduSearch(oInput, oSearchBar, oUl, className) {

            var eleName = oUl instanceof  HTMLDListElement?'dd':'li';
            console.log(eleName)

            //搜索按钮绑定点击事件
            oSearchBar.onclick = function(){
                //tools.searchAndBind(oInput,oUl,eleName);
                //点击搜索让输入框获得焦点，从而进行jsonp调用
                oInput.focus();
            };

            //输入框获得焦点就进行搜索
            oInput.onfocus = function(){
                tools.searchAndBind(oInput,oUl,eleName);
            };

            //失去焦点时让ul隐藏
            oInput.onblur = function(){
                clearTimeout(timer);
                //延迟200ms，解决input失去焦掉ul就立即隐藏问题
                timer = setTimeout(function(){
                    oUl.style.display = 'none';
                },200);

            };


            //输入框绑定键盘事件
            oInput.onkeyup = function (e) {
                e = e || window.event;
                var val = this.value;
                //输入框没有值，让ul隐藏
                if (val.length == 0) {
                    oUl.style.display = 'none';
                } else {
                    //在输入框中按回车，直接查询搜索词
                    if (e.keyCode == 13) {
                        word = tools.searchAndBind(oInput,oUl,eleName);
                    }

                    //上下方向键
                    if (e.keyCode == 38 || e.keyCode == 40) {
                        var aLis = oUl.getElementsByTagName(eleName);
                        if (aLis && aLis.length > 0)
                        //最大的li的索引值
                            var maxNum = aLis.length - 1;
                        var minNum = 0;
                        var curNum = -1;
                        //遍历li，根据谁拥有选中的类名，判断当前的li
                        for (var i = 0; i < aLis.length; i++) {

                            if (tools.hasClass(aLis[i], className)) {
                                curNum = i;
                                tools.removeClass(aLis[i], className)
                            }
                        }

                        //上方向键
                        if (e.keyCode == 38) {
                            curNum--;
                            //已经是第一个，再按上键，则显示本次的搜索的关键词
                            if (curNum < 0) {
                                this.value = word;
                                return;
                            } else {
                                curNum = curNum < minNum ? minNum : curNum;
                            }

                        }

                        //下方向键
                        if (e.keyCode == 40) {
                            curNum++;
                            curNum = curNum > maxNum ? maxNum : curNum;
                        }

                        //给当前li添加选中类名，并把输入框内容改为当前li中的内容
                        tools.addClass(aLis[curNum], className);
                        this.value = aLis[curNum].innerHTML;
                    }
                }

            };

            //ul下的每个热词的li绑定点击事件，实现新窗口打开
            oUl.onclick = function (e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                var val = target.innerHTML;
                if (val.length > 0) {
                    window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(val), '_blank');
                }
            };
        }

        return jsonpBaiduSearch;
    })();

    return {
        Carousel:Carousel,
        TabControl:TabControl,
        jsonpBaiduSearch:jsonpBaiduSearch
    };

})();
