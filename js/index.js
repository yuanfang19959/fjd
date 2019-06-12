$(document).ready(function () {
    /*发送内容模块 */
    //  发送框三个小图标动画及事件
    // 使用此方式添加事件只能用闭包，否则作用域链中的i会被替换。只有一个图片能实现功能；
    var imgArr = $('.inputBox_top img'),
        len = imgArr.length;
    for (var i = 0; i < len; i++) {
        function a(i) {
            bindEvent(imgArr[i], 'mouseover', function () {
                getSRC(imgArr[i], i, 0);
            });
            bindEvent(imgArr[i], 'mouseout', function () {
                getSRC(imgArr[i], i, 1);
            });
            if (i != 0) {
                //当表情框显示的情况下，点击其他两个小图标 关闭表情框；
                bindEvent(imgArr[i], 'click', function () {
                    $('.emojstext').hide();
                });
                $('.upload').on('click', function () {
                    $('.emojstext').hide();
                })
            }
        }
        a(i);
    }

    // 先获取输入内容，并发送消息
    var btn1 = document.getElementById('dd');
    bindEvent(btn1, 'click', function () {
        var words = $('.textarea').text(), 
            showContent;
        if (words.length > 0 && words.length < 150) {
            sendMes(0,words); //发送消息
        } else if (words.length <= 0) {
            alert('请输入内容！');
        } else {
            console.log(words.length)
            alert('内容过长！')
        }
    });

    //点击表情显示表情框
    bindEvent(imgArr[0], 'click', function () {
        $('.emojstext').toggle();
    });

    //点击输入框关闭emoj表情
    $('.textarea').on('click', function () {
        $('.emojstext').hide();
    })

    //点击单个emoj表情，将其获取到输入框中
    var emoj = document.getElementById("emoj");
    eventProxy(emoj, 'click', 'span', function (e) {
        var e = e || event,
            target = e.target || e.srcElement;
            t = target.innerText;
        $('.textarea').text($('.textarea').text() + t);
        $("#emoj").hide();
    })

    // 获取图片并发送
    var file = $(".upload");
    file.change(function () {
        sendMes(1,getObjectURL(file[0].files[0]));
    });

    /*左侧联系人模块 */
    //ajax动态加载渲染联系人
    $.ajax({
        url: "http://106.14.135.233:8080/buyCar/Give",
        type: 'get',
        //ie10以下跨域，无法请求数据。需要设置；
        crossDomain: true == !(document.all),
        success: function (res) {
            var result = $.parseJSON(res);
            $.each(result, function (index, obj) {
                var dom = "";
                dom += '<div class="perMessage" id=' + obj.id + '>';
                dom += '<img src =' + obj.pic + '>';
                dom += '<span class="name fontCommon">' + obj.name + '</span>';
                dom += '</div >'
                $('.jimi-left-content').append(dom);
            })
            $('.jimi-left-content').on('click', '.perMessage', function () {
                var id = $(this).attr("id");
                chatWith(id);
            })
        }
    })

    //点击联系人改变样式
    $(".jimi-left-content").on("click", "div", function () {
        $(".jimi-left-content div").eq($(this).index())
            .attr("style", "background:#D2E6F9")
            .siblings().removeAttr("style");
    });


    /*最右侧切换标签模块*/
    // 默认载入第一个子标签的样式
    $(".bodyright_nav span:first-child")
        .attr("style", "color:#94c4f1;border-bottom:none;border-top:2px solid #94c4f1");

    // 点击标签事件
    $(".bodyright_nav").on("click", "span", function () {
        $(".bodyright_nav span").eq($(this).index())
            .attr("style", "color:#94c4f1;border-bottom:none;border-top:2px solid #94c4f1")
            .siblings().removeAttr("style");
    });

    //点击我的订单隐藏浏览历史记录
    $('#myOrder').on('click', function () {
        $('.bodyright_latest,.bodyright_content,.talkAbout').hide();
    })

    // 点击正在浏览显示浏览历史
    $('#chatNow').on('click', function () {
        if ($(".talkAbout").children('.goodsLatest').length != 0) {
            $('.bodyright_latest,.bodyright_content,.talkAbout').show();
        } else {
            $('.bodyright_latest,.bodyright_content').show();
            console.log($(".talkAbout").children('.goodsLatest'));
        }
    })

    $.ajax({
        url: "http://106.14.135.233:8080/buyCar/Give",
        type: 'get',
        //ie10以下跨域，无法请求数据。需要设置；
        crossDomain: true == !(document.all),
        success: function (res) {
            var result = $.parseJSON(res);
            $.each(result, function (index, obj) {
                var dom = "";
                dom += '<div style="overflow: hidden">';
                dom += '<div class="goodsLatest">';
                dom += '<img src=' + obj.pic + ' alt="h">';
                dom += '<div class="goodBottom">';
                dom += '<span class="name fontCommon">' + obj.name + '</span>';
                dom += '<span class="price"> ¥ ' + obj.price + '</span>';
                dom += '<span class="btn fontCommon">发送</span>';
                dom += '</div>';
                dom += '</div>';
                dom += '</div>';
                $('.bodyright_content').append(dom);
            })
            // 标题大于15字后面部分用省略号代替
            $('.goodBottom .name').each(function () {
                var words = $(this).text().length;
                if (words > 20) {
                    $(this).text($(this).text().slice(0, 20) + "...");
                }
            });

            //点击发送商品，显示正在资讯的商品块。具体看操作
            var num = 0; //用于函数内代码只执行一次
            $('.btn').on('click', function () {
                var c = $(this).parents(".goodsLatest"),
                    divHeight = $('.bodyright_content').height(),
                    dom = "";
                $('.talkAbout').show();
                if ($(".talkAbout").children('.goodsLatest').length != 0) {
                    $('.talkAbout').empty(); //先清清空子节点
                }
                $(c).clone(true).appendTo('.talkAbout');
                var cloneObj = $(c).html();
                 sendMes(2,cloneObj);

                // 一下代码只执行一次，否则每点击一次会减少一次高度
                if (!num) { //0的时候为false，1为真
                    $('.bodyright_content').height(divHeight - 74);
                    num++; //作用全局作用域num
                }
            })
        }
    })


});