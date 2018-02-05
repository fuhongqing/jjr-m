// selectChage 模拟select
// copy 复制
// isPhoneNo 验证手机号
// checkpw 密码一致
// isNumber 正整数
// isName 姓名
// GetUrlParms
// rootURL
//$ajax和$ajax2区别，域名不同
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}

function isNumber(number) {
    var pattern = /^[1-9]\d*$/;
    return pattern.test(number);
}

function isName(name) {
    var pattern = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
    return pattern.test(name);
}

function checkpw(password, password2) {
    var password1 = $(password);
    var password2 = $(password2);
    if (password2.val() !== password1.val()) {
        $.toast("两次输入的密码不同");
    }
}

function copy(toCopyBtn) {
    var clipboard = new Clipboard(toCopyBtn);
    clipboard.on('success', function (e) {
        $.toast("复制成功");
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

var rootURL = 'http://192.168.1.186/efangmem/';

function $ajax(url, data, callBack) {
    $.ajax({
        type: "POST",
        url: rootURL + url,
        data: data,
        dataType: "json",
        success: function (data) {
            callBack(data)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function GetUrlParms() {
    var args = new Object();
    var query = location.search.substring(1);//获取查询串
    var pairs = query.split("&");//在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');//查找name=value
        if (pos == -1) return;//如果没有找到就跳过
        var argname = pairs[i].substring(0, pos);//提取name
        var value = pairs[i].substring(pos + 1);//提取value
        args[argname] = decodeURI(value);//存为属性
    }
    return args;
}

function GetUrlParms2() {
    var query = location.search.substring(1);//获取查询串
    if (query === "") return;
    var pairs = query.split("&");//在逗号处断开
    return pairs;
}

function myCase(n) {
    switch (n) {
        case 1:
            return "预售";
            break;
        case 2:
            return "在售";
            break;
        case 3:
            return "现房";
            break;
        case 4:
            return "售完";
            break;
    }
}

function caseMemberUserType(n) {
    switch (n) {
        case 1:
            return "个人";
            break;
        case 2:
            return "经纪人";
            break;
        case 3:
            return "一级经纪人";
            break;
        case 4:
            return "二级经纪人";
            break;
        case 5:
            return "三级经纪人";
            break;
        case 6:
            return "总公司";
            break;
        case 99:
            return "经理/店长";
            break;
        case 100:
            return "法人";
            break;
        case null:
            return "未设置";
            break;

    }
}

function goBack(time) {
    setTimeout(function () {
        window.history.go(-1)
    }, 2000)
}
