/**
 * Created by wx on 2016/7/1.
 */
(function(){
    //jsonp调用次数计数器，实现每次向后台传递的回调函数名不同
    var counter = 1;

    /**
     * jsonp 跨域请求接口
     * @param url jsonp地址
     * @param objData 参数对象 例如：搜索词wd
     * @param jsonCallback 后台接收用户传递的回调函数名的变量
     * @param callback 用户传递的回调函数
     */
    function jsonp(url,objData,jsonCallback,callback){

        var callName = 'cb' + counter++;
        var callbcakName =  'window.jsonp.' + callName;
        window.jsonp[callName] = function(data){
            try{
                callback(data);
            }finally {
                document.body.removeChild(oScript);
                delete window.jsonp[callName];
            }
        };

        var strUrl = tools.addUrlData(url,objData);
        strUrl = tools.addUrlData(strUrl,jsonCallback+'='+callbcakName);
        //拼接url，在创建script标签
        var oScript = document.createElement('script');
        oScript.src = strUrl;
        oScript.async = 'async';
        oScript.type = 'text/javascript';
        document.body.appendChild(oScript);

    }


    //工具集
    var tools = (function(){

        //把数据格式化为URI格式
        function formatURI(objData){
            if(typeof objData == 'string'){
                return window.encodeURIComponent(objData);
            }

            var ary = [];
            if(Object.prototype.toString.call(objData) == '[object Object]'){
                for(var key in objData){
                    if(objData.hasOwnProperty(key)){
                        ary.push(key+ '=' +window.encodeURIComponent(objData[key]));
                    }
                }
            }

            return ary.join('&');
        }


        //将数据添加到url末尾
        function addUrlData(url,data){
            if(!data){
                return url;
            }

            var res = null;
            var strData = null;

            if(typeof data == 'string'){
                strData = data;
            }else if(Object.prototype.toString.call(data) == '[object Object]'){
                strData = formatURI(data);
            }else {
                return url;
            }

            if(/\?/.test(url)){
                res = url + '&'+strData;
            }else {
                res = url + '?'+strData;
            }

            return res;
        }

        return {
            formatURI:formatURI,
            addUrlData:addUrlData
        };

    })();

    window.jsonp = jsonp;

})();