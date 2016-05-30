/**
 * Created by wx on 2016/5/27.
 */
window.onload = function () {

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
        var imgW = utils.css(oCarousel, 'width'); //轮播图显示窗口的大小，即每次切换change的距离

        carouselInit();
        function carouselInit() {

//1、AJAX获取数据
            getData();
//2、绑定数据
            bind();
            oImgWrap.style.width = utils.css(oImgWrap, 'width') * aDiv.length + 'px';
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
            str1 += '<div><img src="" realImg="' + data[0].imgSrc + '" alt=""></div>'; //想末尾追加第一张，用来实现无缝滚动
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

        }

        function autoMove() {
            if (step >= aImg.length - 1) //图片到达最后一张时，瞬间拉回第一张位置，由于两张图片一样，所以用户不会察觉
            {
                step = 0;
                utils.css(oImgWrap, 'left', 0);
            }
            step++;
            //调用动画库函数--实现切换
            myAnimate(oImgWrap, {"left": -step * imgW}, 800, 2);
            focusTip();
        }

        function focusTip() {
            //解决最后那张图，焦点不设置为第一个的问题
            var tmpStep = step % aLi.length;
            for (var i = 0; i < aLi.length; i++) {
                var curLi = aLi[i];
                i === tmpStep ? utils.addClass(curLi, 'bg') : utils.removeClass(curLi, 'bg');
            }
        }


        function stopStart() {
            oCarousel.onmouseover = function () {
                clearInterval(autoTimer);
            }

            oCarousel.onmouseout = function () {
                autoTimer = setInterval(autoMove, interval);
            }
        }

        function focusChange() {
            for (var i = 0; i < aLi.length; i++) {
                var curLi = aLi[i];
                curLi.index = i;
                curLi.onclick = function () {
                    //通过更改step的值实现：点击焦点，切换到对应图片，且设置对应焦点选中，
                    step = this.index;
                    myAnimate(oImgWrap, {"left": -step * imgW}, 800);
                    focusTip();
                }
            }
        }

        function btnChange() {
            //点击左侧按钮实现图片右移
            oBtnLeft.onclick = function () {
                if (step <= 0) //当已经是第一张了，瞬间拉回到最后一张
                {
                    step = aImg.length - 1;
                    utils.css(oImgWrap, 'left', -step * imgW);
                }
                step--;
                myAnimate(oImgWrap, {"left": -step * imgW}, 800);
                focusTip();
            }

            oBtnRight.onclick = autoMove;
        }


    })()


}
