/**
 * Created by wx on 2016/6/22.
 */
window.onload = function(){

    //手机注册和邮箱注册切换
    (function(){
        var oRegisterTab = document.getElementById('registerTab');
        console.log(oRegisterTab);
        var aItem = oRegisterTab.getElementsByTagName('dd');
        var oRegisterContent = document.getElementById('registerContent');
        var aContent = oRegisterContent.getElementsByTagName('dl');

        var oTab = new packUtils.TabControl(aItem,aContent,'onclick','on');
    })();

    //选择按钮的选中状态切换
    (function(){

        var tools = (function(){
            /**
             * bind 绑定点击事件，实现多框选一，或单个框的选中/取消的切换
             * @param aEles 一个元素或一组元素
             * @param selectClass 表示选中的类名
             */
            function bind(aEles,selectClass){
                //aEles是数组，表示多个选一个
                if(aEles.length>1){
                    for(var i=0; i<aEles.length; i++)
                    {
                        aEles[i].index = i;
                        aEles[i].onclick = function(e){
                            changeSelect(aEles,this.index,selectClass);
                        }
                    }
                }


                //如果是对象，表示只有一个，即多次点击实现选中和取消的切换
                console.log(Object.prototype.toString.call(aEles));
                var reg  =  /\[object \w+Element\]/i;
                if(reg.test(aEles))
                {
                    aEles.onclick = function(){
                        if(utils.hasClass(this, selectClass)){
                            utils.removeClass(this,selectClass)
                        }else{
                            utils.addClass(this,selectClass)
                        }

                    }
                }

            }

            function changeSelect(aEles, num,selectClass){
                for(var i=0; i<aEles.length; i++)
                {
                    if(i === num){
                        utils.addClass(aEles[i],selectClass)
                    }else{
                        utils.removeClass(aEles[i],selectClass)
                    }
                }
            }

            return{
                bind:bind
            }
        })();

        //性别的对勾
        var oSexRegion = document.getElementById('sexRegion');
        var aCheckboxSex = utils.getElesByClass(oSexRegion,'reg_checkbox');
        tools.bind(aCheckboxSex,'on');

        //性别的文字框
        var aSexSpan = oSexRegion.getElementsByTagName('span');
        tools.bind(aSexSpan,'checkend');

        //条约的蓝圈的选中切换
        var oPolicy = document.getElementById('reg_policy1');
        console.log(oPolicy);
        tools.bind(oPolicy, 'on');

        //“下次自动登入”的蓝圈
        var oAutoSign = document.getElementById('isAutoSign');
        tools.bind(oAutoSign, 'on');



    })();

    //实现输入框的正则验证和报错提示
    (function(){
        var tools = (function(){
            function bindInput(curEle,regExp,callback){
                curEle.onfocus = function(){
                    //增加选中样式
                    utils.addClass(this, 'init-field-focus');

                };
                //失去焦点
                curEle.onblur = function(){
                    //去除选中状态
                    utils.removeClass(this, 'init-field-focus');
                    regExp = regExp||/^$/;
                    var inn = this.value;


                    if(!reg.test(inn)){ //正则验证输入内容错误
                        utils.addClass(this, 'reg_txtfalse')
                    }
                }
            }

            return{
                bindInput:bindInput
            };

            })();

        //手机注册--手机号
        var oRegMobile1 = document.getElementById('reg_mobile1');
        tools.bindInput(oRegMobile1,null,null);
        //手机注册--密码1
        var oRegPassword11 = document.getElementById('reg_password11');
        tools.bindInput(oRegPassword11,null,null);
        //手机注册--确认密码
        var oRegPassword12 = document.getElementById('reg_password12');
        tools.bindInput(oRegPassword12,null,null);
        //手机注册--验证码
        var oRegSmscode1 = document.getElementById('reg_smscode1');
        tools.bindInput(oRegSmscode1,null,null);

        //邮箱验证--邮箱
        var oRegMobile2 = document.getElementById('reg_email2');
        tools.bindInput(oRegMobile2,null,null);
        //邮箱验证--密码1
        var oRegPassword21 = document.getElementById('reg_password21');
        tools.bindInput(oRegPassword21,null,null);
        //邮箱验证--确认密码
        var oRegPassword22 = document.getElementById('reg_password22');
        tools.bindInput(oRegPassword22,null,null);
        //邮箱验证--验证码
        var oRegVcode2 = document.getElementById('reg_vcode2');
        tools.bindInput(oRegVcode2,null,null);

        //会员登入--账号
        var oLoginEmailText = document.getElementById('loginEmailText');
        tools.bindInput(oLoginEmailText,null,null);
        //邮箱验证--密码1
        var oLoginPasswordText = document.getElementById('loginPasswordText');
        tools.bindInput(oLoginPasswordText,null,null);



    })();


};

