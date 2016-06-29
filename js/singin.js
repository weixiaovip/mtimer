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

        //手机-条约的蓝圈的选中切换
        var oPolicy = document.getElementById('reg_policy1');
        tools.bind(oPolicy, 'on');
        //reg_policy2
        //邮箱-条约的蓝圈的选中切换
        var oPolicy2 = document.getElementById('reg_policy2');
        tools.bind(oPolicy2, 'on');

        //“下次自动登入”的蓝圈
        var oAutoSign = document.getElementById('isAutoSign');
        tools.bind(oAutoSign, 'on');



    })();

    //实现输入框的正则验证和报错提示
    (function(){

        var tools = (function(){
            /**
             * bindInput 输入框的绑定验证处理函数
             * @param curEle 当前的输入框
             * @param regExp 验证正则
             * @param focusFn 获得焦点时执行的函数
             * @param blurFn 失去焦点时执行的函数
             * @param isPw2 是否为第2个输入密码框
             */
            function bindInput(curEle,regExp,focusFn, blurFn, isPw2){

                curEle.onfocus = function(){
                    //增加选中样式
                    utils.addClass(this, 'init-field-focus');
                    utils.removeClass(this.parentNode, 'reg_txtfalse');
                    if(typeof focusFn === 'function')
                    {
                        focusFn.call(this);
                    }

                };
                //失去焦点
                curEle.onblur = function(){
                    //oP-错误提示框
                    //var oP =  utils.getChildren(this.parentNode,'p')[0];
                    //console.log(oP);

                    //去除选中状态
                    utils.removeClass(this, 'init-field-focus');

                    //判断是否为输入第二次密码框
                    if(isPw2)
                    {
                        regExp = new RegExp('^'+pw1Value+'$');
                    }else{
                        regExp = regExp||/^$/;
                    }

                    var inn = this.value;

                    if(regExp.test(inn)){ //正则验证输入内容正确
                        utils.removeClass(this.parentNode, 'reg_txtfalse');
                    }else{//正则验证输入内容错误
                        utils.addClass(this.parentNode, 'reg_txtfalse');
                    }

                    if(typeof blurFn === 'function')
                    {
                        blurFn.call(this);
                    }
                }
            }

            /**
             * handlePwFocus 输入密码1，获得焦点时执行的函数
             * @param oInput 密码输入框
             * @param oPwBox 密码强度提示框
             * @param oPwLevel 密码强度提示信息框
             */
            function handlePwFocus(oInput,oPwBox,oPwLevel){
                oInput.onkeyup = function(e){
                    var inn = oInput.value;
                    var num = 0;
                    //包含数字
                    if(/\d/.test(inn))
                    {
                        num++;
                    }

                    //包含字母
                    if(/[a-zA-Z_]/.test(inn))
                    {
                        num++;
                    }

                    //包含特殊字符
                    if(/\W/.test(inn))
                    {
                        num++;
                    }

                    if(inn.length < 6)
                    {
                        oPwBox.className = 'password_box password_l';
                        oPwLevel.innerHTML = '弱';
                    }else{
                        switch (num)
                        {
                            case 1:
                                oPwBox.className = 'password_box password_l';
                                oPwLevel.innerHTML = '弱';
                                break;
                            case 2:
                                oPwBox.className = 'password_box password_m';
                                oPwLevel.innerHTML = '中';
                                break;
                            case 3:
                                oPwBox.className = 'password_box password_h';
                                oPwLevel.innerHTML = '强';
                                break;
                            default:
                                oPwBox.className = 'password_box password_l';
                                oPwLevel.innerHTML = '弱';
                        }
                    }

                };
            }

            /**
             * handlePwBlur 输入密码1，失去焦点时执行的函数
             * @param oInput 密码输入框
             * @param oPwBox 密码强度提示框
             * @param oPwLevel 密码强度提示信息框
             */
            function handlePwBlur(oInput,oPwBox,oPwLevel){
                pw1Value = oInput.value;
                console.log(pw1Value.length);

                if(pw1Value.length === 0)
                {
                    oPwBox.className = 'password_box';
                    oPwLevel.innerHTML = '密码强度';
                }else if(pw1Value.length < 6) {
                    oPwBox.className = 'password_box  password_l';
                    oPwLevel.innerHTML = '弱';
                }
            }

            /**
             * changeVcode更换验证码gif图
             * @param oImg_changevcode 装载gif图的img标签
             */
            function  changeVcode(oImg_changevcode){
                var n = /.+(\d).gif$/.exec(oImg_changevcode.src)[1];
                switch((++n % 3))
                {
                    case 1:
                        oImg_changevcode.src = 'img/ValidateCode1.gif';
                        break;
                    case 2:
                        oImg_changevcode.src = 'img/ValidateCode2.gif';
                        break;
                    case 0:
                        oImg_changevcode.src = 'img/ValidateCode3.gif';
                        break;
                }
            }

            return{
                bindInput:bindInput,
                handlePwFocus:handlePwFocus,
                handlePwBlur:handlePwBlur,
                changeVcode:changeVcode
            };

            })();

        var pw1Value = null; //第一次输入的密码

        //手机注册--手机号
        var reg1 = /^1\d{10}$/;
        var oRegMobile1 = document.getElementById('reg_mobile1');
        tools.bindInput(oRegMobile1,reg1,null,null);
        //手机注册--密码1
        var oRegPassword11 = document.getElementById('reg_password11');
        var oLevelDiv1 = document.getElementById('levelDiv1');//密码强度提示框
        var oLevelTip1 = document.getElementById('levelTip1'); //密码强度提示信息p

        var reg2 = /^\S{6,20}$/;
        tools.bindInput(oRegPassword11,reg2,function(){
            tools.handlePwFocus(oRegPassword11,oLevelDiv1,oLevelTip1);
        },function(){
            tools.handlePwBlur(oRegPassword11,oLevelDiv1,oLevelTip1)
        });

        //手机注册--确认密码
        var oRegPassword12 = document.getElementById('reg_password12');
        tools.bindInput(oRegPassword12,/^\w{6,20}$/,null,null,true);

        //手机注册--验证码
        var oRegSmscode1 = document.getElementById('reg_smscode1');
        var reg4 = /\d{6}/;
        tools.bindInput(oRegSmscode1,reg4,null,null);

        //邮箱验证--邮箱
        var oRegMobile2 = document.getElementById('reg_email2');
        var reg5 = /^[a-zA-Z][\w-]*@[0-9a-zA-Z]+\.[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)?$/;
        tools.bindInput(oRegMobile2,reg5,null,null);

        //邮箱验证--密码1
        var oRegPassword21 = document.getElementById('reg_password21');
        var oLevelDiv2 = document.getElementById('levelDiv2');//密码强度提示框
        var oLevelTip2 = document.getElementById('levelTip2'); //密码强度提示信息p
        var reg6 = /^\S{6,20}$/;
        tools.bindInput(oRegPassword21,reg6,function(){
            tools.handlePwFocus(oRegPassword21,oLevelDiv2,oLevelTip2);
        },function(){
            tools.handlePwBlur(oRegPassword21,oLevelDiv2,oLevelTip2)
        });

        //邮箱验证--确认密码
        var oRegPassword22 = document.getElementById('reg_password22');
        tools.bindInput(oRegPassword22,reg6,null,null,true);

        //邮箱验证--验证码
        var oRegVcode2 = document.getElementById('reg_vcode2');
        var oVcodeRegion = document.getElementById('vcodeRegion');
        var oBtn_changevcode = document.getElementById('btn_changevcode');
        var oImg_changevcode = oVcodeRegion.getElementsByTagName('img')[0];
        var reg7 = /^\S{6}$/;
        tools.bindInput(oRegVcode2,reg7,function(){
            oVcodeRegion.style.display = 'block';
        },null);

        //给验证码和刷新绑定点击事件，实现点击换gif图
        oBtn_changevcode.onclick = function(){
            tools.changeVcode(oImg_changevcode);
        };
        oImg_changevcode.onclick = function(){
            tools.changeVcode(oImg_changevcode);
        };

        //会员登入--账号
        var oLoginEmailText = document.getElementById('loginEmailText');
        tools.bindInput(oLoginEmailText,/\w/,null,null);
        //邮箱验证--密码1
        var oLoginPasswordText = document.getElementById('loginPasswordText');
        tools.bindInput(oLoginPasswordText,/\w{6}/,null,null);


    })();


};

