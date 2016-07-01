/**
 * Created by wx on 2016/5/27.
 */

(function () {
    window.addEventListener('DOMContentLoaded', function () {
        //轮播图-闭包
        (function () {

            var oCarousel = document.getElementById('carousel');
            var oImgWrap = oCarousel.getElementsByTagName('div')[0]; //承泽所有图片的大容器，用来移动
            var aDiv = oImgWrap.getElementsByTagName('div');
            var aImg = oImgWrap.getElementsByTagName('img');
            var oUl = oCarousel.getElementsByTagName('ul')[0];
            var aLi = oUl.getElementsByTagName('li'); //焦点小圆圈
            var oBtnLeft = utils.getElesByClass(oCarousel, 'btnLeft')[0];
            var oBtnRight = utils.getElesByClass(oCarousel, 'btnRight')[0];
            var autoTimer = null;
            var step = null;
            var data = null; //ajax数据
            var interval = 2000;

            carouselInit();
            function carouselInit() {

                //1、AJAX获取数据
                getData();
                //2、绑定数据
                bind();
                //3、图片延时加载
                setTimeout(lazyImg, 500);
                //4、图片自动轮播
                autoTimer = setInterval(autoMove, interval);
                //5、焦点自动轮播
                focusTip();
                //6、鼠标移入停止轮播、移出开启轮播
                stopStart();
                //7、点击焦点手动切换
                focusChange();
                //8、点击两侧按钮实现切换
                btnChange();
            }


            function getData() {
                var xml = new XMLHttpRequest();
                xml.open('get', 'json/data.txt', false);
                xml.onreadystatechange = function () {
                    if (xml.readyState === 4 && /^2\d\d$/.test(xml.status)) {
                        data = utils.jsonParse(xml.responseText);
                    }
                }
                xml.send(null);
            }

            function bind() {
                var str1 = '';
                var str2 = '';
                for (var i = 0; i < data.length; i++) {
                    str1 += '<div><img src="" realImg="' + data[i].imgSrc + '" alt=""></div>';
                    str2 += i === 0 ? '<li class="bg"></li>' : '<li></li>';
                }
                oImgWrap.innerHTML = str1;
                oUl.innerHTML = str2;
            }

            function lazyImg() {

                for (var i = 0; i < aImg.length; i++) {

                    (function (index) {
                        var curImg = aImg[index];
                        var newImg = new Image;
                        newImg.src = curImg.getAttribute('realImg');
                        newImg.onload = function () {
                            curImg.src = newImg.src;
                            newImg = null;
                        }

                        newImg.onerror = function () {
                            curImg.innerHTML = '图片加载失败！';
                            newImg = null;
                        }
                    })(i)

                }
                utils.css(aDiv[0], 'zIndex', 1);
                utils.css(aDiv[0], 'opacity', 1);
            }

            function autoMove() {
                if (step >= aImg.length - 1) //图片到达最后一张时，瞬间拉回第一张位置，由于两张图片一样，所以用户不会察觉
                {
                    step = -1;
                }
                step++;
                setBanner();
            }

            function setBanner() {
                for (var i = 0; i < aDiv.length; i++) {
                    var curDiv = aDiv[i];
                    if (i == step) {
                        utils.css(curDiv, 'zIndex', 1);
                        myAnimate(curDiv, {"opacity": 1}, 300, function () {
                            var siblings = utils.siblingEleAll(this);
                            for (var i = 0; i < siblings.length; i++) {
                                utils.css(siblings[i], 'opacity', 0);
                            }
                        })
                    }
                    else {
                        utils.css(curDiv, 'zIndex', 0);
                    }
                }
                focusTip()
            }

            function focusTip() {
                for (var i = 0; i < aLi.length; i++) {
                    var curLi = aLi[i];
                    i === step ? utils.addClass(curLi, 'bg') : utils.removeClass(curLi, 'bg');
                }
            }


            function stopStart() {
                oCarousel.onmouseover = function () {
                    clearInterval(autoTimer);
                };

                oCarousel.onmouseout = function () {
                    autoTimer = setInterval(autoMove, interval);
                };
            }

            function focusChange() {
                for (var i = 0; i < aLi.length; i++) {
                    var curLi = aLi[i];
                    curLi.index = i;
                    curLi.onclick = function () {
                        //通过更改step的值实现：点击焦点，切换到对应图片，且设置对应焦点选中，
                        step = this.index;
                        setBanner();
                    }
                }
            }

            function btnChange() {
                //点击左侧按钮实现图片右移
                oBtnLeft.onclick = function () {
                    if (step <= 0) //当已经是第一张了，瞬间拉回到最后一张
                    {
                        step = aImg.length;
                    }
                    step--;
                    setBanner();
                };

                oBtnRight.onclick = autoMove;
            }


        })();

        //quickBuy选项卡
        (function () {
            var oTicketList = document.getElementById('ticketList');
            var oTabBox = document.getElementById('tab-box');
            var aOption = oTicketList.getElementsByTagName('li');
            var aOptionContent = utils.getChildren(oTabBox, 'div');

            for (var i = 0; i < aOption.length; i++) {
                aOption[i].index = i;
                aOption[i].onmouseenter = function () {
                    changeTab(this.index);
                }
            }


            function changeTab(num) {
                for (var i = 0; i < aOption.length; i++) {
                    utils.removeClass(aOption[i], 'cur');
                    utils.removeClass(aOptionContent[i], 'isSelect');
                }

                utils.addClass(aOption[num], 'cur');
                utils.addClass(aOptionContent[num], 'isSelect');

            }

            //按钮切换
            var oBtnPrev1 = utils.getElesByClass(aOptionContent[0], 'prev')[0];
            var oBtnNext1 = utils.getElesByClass(aOptionContent[0], 'next')[0];
            var oBtnPrev2 = utils.getElesByClass(aOptionContent[1], 'prev')[0];
            var oBtnNext2 = utils.getElesByClass(aOptionContent[1], 'next')[0];
            var oMovieListSelling = utils.getElesByClass(aOptionContent[0], 'movieListSelling')[0];
            var oMovieListOnNext = utils.getElesByClass(aOptionContent[1], 'movieListOnNext')[0];
            var oShadowright = utils.getElesByClass(aOptionContent[0], 'shadowright')[0];
            var oShadowLeft2 = utils.getElesByClass(aOptionContent[1], 'shadowleft')[0];
            var oShadowRight2 = utils.getElesByClass(aOptionContent[1], 'shadowright')[0];

            oBtnNext1.onclick = function () {
                //left: -685px;
                myAnimate(oMovieListSelling, {left: -706}, 500, 5, function () {
                    oBtnPrev1.style.display = 'block';
                    oShadowright.style.display = 'none';
                });
                oBtnNext1.style.display = 'none';

            };

            oBtnPrev1.onclick = function () {
                //left: -685px;
                myAnimate(oMovieListSelling, {left: 0}, 500, 5, function () {
                    oBtnNext1.style.display = 'block';
                    oShadowright.style.display = 'block';
                });

                oBtnPrev1.style.display = 'none';

            };

            //列表2按钮的左右切换
            var changes = 960; //变化的幅度
            var totalWidth = utils.css(oMovieListOnNext, 'width') - 1200;


            oBtnPrev2.onclick = function () {

                var targetWidth = utils.css(oMovieListOnNext, 'left') + changes;
                if (targetWidth >= 0) {
                    oBtnPrev2.style.display = 'none';
                    oShadowLeft2.style.display = 'none';
                    targetWidth = 0;
                } else {
                    oBtnNext2.style.display = 'block';
                    oShadowRight2.style.display = 'block';
                }

                myAnimate(oMovieListOnNext, {left: targetWidth}, 500, 5);
            };

            oBtnNext2.onclick = function () {
                var targetWidth = utils.css(oMovieListOnNext, 'left') - changes;
                if (targetWidth <= -totalWidth) {
                    targetWidth = -totalWidth;
                    oBtnNext2.style.display = 'none';
                    oShadowRight2.style.display = 'none';

                } else {
                    oBtnPrev2.style.display = 'block';
                    oShadowLeft2.style.display = 'block';
                }

                myAnimate(oMovieListOnNext, {left: targetWidth}, 500, 5);
            }


        })();


        //回到顶部
        (function () {
            var oMtimeBar = document.getElementById('mtimebar');
            var oSearch = utils.getElesByClass(oMtimeBar, 'searchbar')[0];
            var oTopBar = utils.getElesByClass(oMtimeBar, 'topbar')[0];

            var winH = null;
            var nScrollH = null;
            document.onscroll = function () {
                winH = utils.getWin('clientHeight');
                nScrollH = utils.getWin('scrollTop');
                if (nScrollH > winH) {
                    oMtimeBar.style.display = 'block';
                } else {
                    oMtimeBar.style.display = 'none';
                }
            };

            oTopBar.onclick = function () {
                utils.getWin('scrollTop', 0);
            }

        })();

        //点击搜索框
        (function () {
            var oSearchTool = document.getElementById('headtool'); //顶部搜索小图标
            var oSearchBox = document.getElementById('searchbox'); //搜索长条
            var oSearchBar = document.getElementById('searchbar'); //右下角搜索按钮
            var oSearchToolBtn = document.getElementById('searchtoolbtn'); //右下角搜索按钮

            oSearchBar.onclick = function () {
                if (utils.hasClass(oSearchToolBtn, 'cancel')) {
                    oSearchBox.style.display = 'none';
                    utils.addClass(oSearchTool, 'select');
                    oSearchToolBtn.className = 'zoom';
                } else {
                    oSearchBox.style.display = 'block';
                    utils.addClass(oSearchTool, 'select');
                    oSearchToolBtn.className = 'cancel';
                }
            }


        })();

        //热门影评的轮播图
        (function(){
            var oCommentsTop = document.getElementById('commentsTop');
            var aSingle = oCommentsTop.getElementsByTagName('dd');
            var oBtnL = utils.getElesByClass(oCommentsTop,'lastpic')[0];
            var oBtnR = utils.getElesByClass(oCommentsTop,'nextpic')[0];
            var oCarouselCommet = new packUtils.Carousel(oCommentsTop,aSingle,2000,null,oBtnL,oBtnR);
        })();

        //电影票房的选项卡
        (function(){
            var oRankList = document.getElementById('rank-list');
            var oRankListTop = utils.getElesByClass(oRankList,'mboxofficetab')[0];
            var aItem = oRankListTop.getElementsByTagName('dd');
            var aContent = utils.getElesByClass(oRankList,'boxofficelist');
            var oTab = new packUtils.TabControl(aItem,aContent,'onmouseenter','cur');
        })();


        //输入框中输入文字，调用百度jsonp实现搜索
        var oInput = document.getElementById('searchInput');
        var oSearchBar = document.getElementById('searchbtn');
        var oUl = document.getElementById('hotSearch');
        packUtils.jsonpBaiduSearch(oInput, oSearchBar, oUl, 'bg');

    });


})();
