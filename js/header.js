/**
 * Created by wx on 2016/6/24.
 */
(function(){
    window.addEventListener('DOMContentLoaded',function(){
        //点击搜索框
        (function(){
            var oSearchTool = document.getElementById('headtool'); //顶部搜索小图标
            var oSearchBox = document.getElementById('searchbox'); //搜索长条
            var oSearchToolBtn = document.getElementById('searchtoolbtn'); //右下角搜索按钮

            oSearchTool.onclick = function(){
                if(utils.hasClass(oSearchToolBtn, 'cancel')){
                    oSearchBox.style.display = 'none';
                    utils.addClass(oSearchTool, 'select');
                    oSearchToolBtn.className = 'zoom';
                }else{
                    oSearchBox.style.display = 'block';
                    utils.addClass(oSearchTool, 'select');
                    oSearchToolBtn.className = 'cancel';
                }

            };


        })();



    }); //end addEventListener



})();
