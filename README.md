### 虽是简单的一个小页面，但收获也挺多的。由于好久没有接触过PC端页面开发，然后此次需要兼容至ie8；摸索了一天半，上周四下午开始写页面；
## 调用了毕业设计的后台接口，写了一些方法。
* indexLibary.js 为index.js中调用的方法；
* ie8.css 为ie8下的样式（由于不支持媒体查询，本想使用jq判断浏览器为ie8且屏幕高度小于一定尺寸就触发改变高度，现统一ie8就减小高度）

# 兼容性（已踩的坑）
## 样式方面
1. ie8- 不支持部分css3样式，如常见的flex布局, border-radius, rgba, last-child等；
### 解决方案
### border-radius
* 引用PIE.js至index文件中，然后获取要使用圆角属性的元素并且初始化；
* css中引入 behavior：url(PIE.htc) 使用的路径是相对于index.html的路径； 

### rgba透明度
*  background: rgba(255,255,255,0.1);
   filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#19ffffff,endColorstr=#19ffffff);
*  当上一行的透明度不起作用的时候执行。这句话的意思本来是用来做渐变的。但是这个地方不需要渐变。所以两个颜色都设置成了相同的颜色。

### last-child 在部分ie下会失效；
* 元素少的情况下可使用 li:first-child + li + li 表示第三个li

2. border-box 和 content-box
### 区别
* border-box：元素内容的宽高等于：元素的宽高 - （ border + padding ）
* content-box ：元素宽高不受padding和margin影响
* 在网页的顶部加上 doctype 声明。假如不加 doctype 声明，那么各个浏览器会根据自己的行为去理解网页

3. ie8不支持媒体查询
### 解决方案
<!--[if IE 8]>
    <link rel="stylesheet" href="css/ie8.css">
<![endif]-->

4. ie部分版本不支持svg格式图片；

5. 曾经面试题碰到过外边距重叠的问题，这次遇到了
### 解决方案
* 外层元素padding代替
* 内层元素透明边框 border:1px solid transparent;
* 内层元素绝对定位 postion:absolute:
* 外层元素 overflow:hidden;
* 内层元素 加float:left;或display:inline-block;
* 内层元素padding:1px;

6. pre标签可替代常见的textarea
* <pre contenteditable="true" class="textarea" id="cc"></pre>
* contenteditable="true" 设置为true表示可以输入
* white-space: pre-wrap; // 保留空白符序列，但是正常地进行换行
* word-break: break-all; //允许在单词内换行。

7. 部分父元素最好不要把高度定死，可由子元素来撑开；可设置max-height；或者min-height来解决没有子元素的情况；
--------------------------------------------------------------

## CSS规范方面
1.结构命名方面相对以前进步一点点；
2.CSS代码 按照一定的顺序写，提高可读性；按照如下顺序：
    * 布局方式、位置，相关属性(position, left, right, top, bottom, z-index)
    * 盒模型，相关属性包括(display, float, width, height, margin, padding, border, border-radius)
    * 文本排版，相关属性(font, color, background, line-height, text-align)
    * 视觉外观，相关属性(color, background, list-style, transform, animation)
--------------------------------------------------------------

## js方面
1. 某些上古浏览器不支持matches()方法
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

2. ie9及以下不支持input file[0].files[0]方式获取图片

3. ie不支持e替代event
var e = e || event;
var target = e.target || e.srcElement;

4. ie10以下不支持jq ajax跨域请求
 crossDomain: true == !(document.all)

5. 封装通用事件函数的时候，没有考虑到ie不支持addEventListener
// 通用事件处理函数
function bindEvent(elem, type, fn) {
    if (window.addEventListener) {
        return elem.addEventListener(type, fn);
    } else {
        // ie8
        return elem.attachEvent("on" + type, fn);
    }
}

6. 若使用replaceWith()将A(A是直接使用$('#A')获取的对象)替换B节点，A节点将会从源节点移除；
$('#B父节点').empty('#B');
$('#A').clone(true).appendTo('B父节点');
clone(true)时复制 $('#A')，源节点不受影响；
