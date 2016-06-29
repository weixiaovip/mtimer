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



    return {
        Carousel:Carousel,
        TabControl:TabControl
    };

})();
