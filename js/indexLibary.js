// 主要为index.js中调用的函数
// 通用事件处理函数
function bindEvent(elem, type, fn) {
    if (window.addEventListener) {
        return elem.addEventListener(type, fn);
    } else {
        // ie8
        return elem.attachEvent("on" + type, fn);
    }
}

//事件代理,用于后面点击单个表情
function eventProxy(elem, type, selector, fn) {
    if (fn == null) {
        fn = selector;
        selector = null;
    }
    bindEvent(elem, type, function (e) {
        var e = e || event;
        var target = e.target || e.srcElement;
        //兼容ie8及以下浏览器event
        if (selector) {
            if (matchesSelector(target, selector)) {
                fn.call(target, e);
            }
        } else {
            fn(e);
        }
    })
}

//切换图片地址obj:dom对象 index:索引，对应哪个元素 type:0（背景） 1（背景2）
function getSRC(obj, index, type) {
    var src = "";
    if (type === 0) {
        if (index === 0) {
            src = "img/smileB.png";
        } else if (index === 1) {
            src = "img/pictureB.png"
        } else {
            src = "img/heartB.png"
        }
    } else {
        if (index === 0) {
            src = "img/simile.png";
        } else if (index === 1) {
            src = "img/picture.png"
        } else {
            src = "img/heart.png"
        }
    }
    obj.src = src;
}

//发送消息函数，后面可封装成客服和用户类型，以及发送类型的功能
function sendMes(type,obj) {
    var dom = "";
    dom += '<div class="personB">';
    dom += '<div class="personNameB fontCommon">郑方形</div>';
    dom += '<div class="clearFloat"></div>';
    dom += '<div class="personContentB">';
    dom += '<img src="img/head.jpg">';
    dom += '<span class="talkContentB fontCommon">'
    if(type === 0){
        dom += obj;
    }else if(type === 1){
        dom += '<img src=' + obj + '>'
    }else{
        dom += '<div class = "goodsLatest">'
        dom +=  obj;
        dom += '</div>'
    }
    dom += '</span>';
    dom += '<span class="triangleB"></span>';
    dom += '</div>';
    dom += '<div class="clearFloat"></div>';
    dom += '</div>';
    //插入节点之后清空dom，否则干扰下一次运行
    $('.chatBox').append(dom);
    dom = "";  
    //发送完毕消息后，清空输入框；
    $('.textarea').text(''); 
    //发送内容后重新获取高度，使其保持在最底部
    showContent = $(".chatBox");  
    showContent[0].scrollTop = showContent[0].scrollHeight;
}

//由于部分浏览器对matcher() 方法不支持
function matchesSelector(element, selector) {
    if (element.matches) {
        return element.matches(selector);
    } else if (element.matchesSelector) {
        return element.matchesSelector(selector);
    } else if (element.webkitMatchesSelector) {
        return element.webkitMatchesSelector(selector);
    } else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector) {
        return element.mozMatchesSelector(selector);
    } else if (element.oMatchesSelector) {
        return element.oMatchesSelector(selector);
    } else if (element.querySelectorAll) {
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
            i = 0;
        while (matches[i] && matches[i] !== element) i++;
        return matches[i] ? true : false;
    }
    throw new Error('不支持您的上古浏览器！');
}

// 获取图片
function getObjectURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    console.log(url);
    return url;
}

//请求客服详情
function chatWith(id) {
    $.ajax({
        url: "http://106.14.135.233:8080/buyCar/getProFlex",
        type: 'get',
        data: {
            spID: id
        },
        //ie10以下跨域，无法请求数据。需要设置；
        crossDomain: true == !(document.all),
        success: function (res) {
            var result = $.parseJSON(res);
            $('.head span').text(result[0].pName);
            console.log(result[0].p1)
            $('.head img').attr('src', result[0].p1);
            $('.personNameA').text(result[0].pName);
            $('.personA img').attr('src', result[0].p1);
            $('.personNameA').each(function () {
                var words = $(this).text().length;
                if (words > 20) {
                    $(this).text($(this).text().slice(0, 10) + "...");
                }
            });
        }
    })
}
