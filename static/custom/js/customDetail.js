$(function(){
    /*=== 默认为 standalone ===*/
    var myPhotoBrowserStandalone = $.photoBrowser({
        photos : ['static/custom/img/print.png']
    });
//点击时打开图片浏览器
    $('#sendDetail').on('click','.pb-standalone',function (e) {
        e.preventDefault();
        $('.photo-browser').show();
        try{
            myPhotoBrowserStandalone.open();
        }catch(e){
            console.log(e);
        }
        $('.bar-nav').html("<img src='static/custom/img/back.png' />");
        $('.bar-nav').on('click','img',function(){
            $('.photo-browser').hide();
            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>客户详情</div>");
        });
    });
    //页面底部导航跳转
    $('footer').on('click','div',function(e){
        if($(e.target).children('p').html()=='首页'){
            $(location).attr('href','index.html');
        }else if($(e.target).children('p').html()=='客户'){
            $(location).attr('href','custom.html');
        }else if($(e.target).children('p').html()=='我的'){
            $(location).attr('href','userIndex.html');
        }
    })
        .on('click','span',function(e){
            e.stopPropagation();
            if($(e.target).next().html()=='首页'){
                $(location).attr('href','index.html');
            }else if($(e.target).next().html()=='客户'){
                $(location).attr('href','custom.html');
            }else if($(e.target).next().html()=='我的'){
                $(location).attr('href','userIndex.html');
            }
        })
        .on('click','p',function(e){
            e.stopPropagation();
            if($(e.target).html()=='首页'){
                $(location).attr('href','index.html');
            }else if($(e.target).html()=='客户'){
                $(location).attr('href','custom.html');
            }else if($(e.target).html()=='我的'){
                $(location).attr('href','userIndex.html');
            }
        });
    var customerID=location.search.slice(1).split('&')[0].split('=')[1];//获取客户id
    var houseProcessid=location.search.slice(1).split('&')[1].split('=')[1];//交易过程id
    var dataId,dataType;
    //来访方式
    function shuttle(t){
        switch(t)
        {
            case 0:
                return t = "班车";
                break;
            case 1:
                return t = "自驾";
                break;
            default:
                return t = "其他";
                break;
        }
    }
    //发佣节点
    function sends(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/detailedInfo',
            data:{
                dataID:dataId,//	是	int	数据信息ID(通过”客户交易进度-接口”获取)
                dataType:dataType//	是	int	交易过程节点类型(通过”客户交易进度-接口”获取;0报备1来访3大定4签约5发佣)
            },
            success:function(data){
                var sendData=data.data;
                if(data.status==1&&sendData!=null){
                    var imgSrc,imgHtml='';
                    if(!sendData.amount){
                        sendData.amount=0;
                    }
                    if(!sendData.fyImageUrl){
                        sendData.fyImageUrl='static/custom/img/print.png';
                    }
                    if(!sendData.reviewState){
                        sendData.reviewState='';
                    }
                    if(!sendData.rewardTotal){
                        sendData.rewardTotal=0;
                    }
                    if(!sendData.discount){
                        sendData.discount=0;
                    }
                    if(!sendData.cashPrice){
                        sendData.cashPrice=0;
                    }
                    if(!sendData.isInvoice){
                        sendData.isInvoice='';
                    }
                    if(!sendData.rewardActual){
                        sendData.rewardActual=0;
                    }
                    if(!sendData.amount){
                        sendData.amount=0;
                    }
                    if(sendData.fyImageUrl.indexOf(',')!=-1){
                        imgSrc=sendData.fyImageUrl.split(',');
                        $.each(imgSrc,function(i){
                            imgHtml+=`
                <img class="pb-standalone" src="${sendData.fyImageUrl}" alt=""/>
                            `;
                        });
                    }else{
                        imgHtml=`
                <img class="pb-standalone" src="${sendData.fyImageUrl}" alt=""/>
                        `;
                    }
                    var sendHtml=`
                        <li><span>原始佣金：</span><span>${sendData.rewardTotal}元</span></li>
                            <li><span>折佣：</span><span>${sendData.discount}元</span></li>
                            <li><span>佣金奖励：</span><span>${sendData.cashPrice}元</span></li>
                            <li><span>提供发票：</span><span>${sendData.isInvoice}</span></li>
                            <li><span>应发佣金：</span><span>${sendData.rewardActual}元</span></li>
                            <li class="isSended"><span>实发佣金：</span><span>${sendData.amount}元</span></li>
                            <li class="proof isSended"><span id="imgLi">出款凭证：</span></li>
                    `;
                    $('#sendDetail').html(sendHtml);
                    $('#imgLi').after(imgHtml);
                    if(sendData.reviewState=='已发佣'){
                        $('#sendDetail>.isSended').show();
                    }
                    /*=== 默认为 standalone ===*/
                    var myPhotoBrowserStandalone = $.photoBrowser({
                        photos : imgSrc||[sendData.fyImageUrl]
                    });
//点击时打开图片浏览器
                    $('#sendDetail').on('click','.pb-standalone',function (e) {
                        e.preventDefault();
                        $('.photo-browser').show();
                        try{
                            myPhotoBrowserStandalone.open();
                        }catch(e){
                            console.log(e);
                        }
                        $('.bar-nav').html("<img src='static/custom/img/back.png' />");
                        $('.bar-nav').on('click','img',function(){
                            $('.photo-browser').hide();
                            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>客户详情</div>");
                        });
                    });
                }else{
                    $('#sendDetail').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //签约节点
    function signs(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/detailedInfo',
            data:{
                dataID:dataId,//	是	int	数据信息ID(通过”客户交易进度-接口”获取)
                dataType:dataType//	是	int	交易过程节点类型(通过”客户交易进度-接口”获取;0报备1来访3大定4签约5发佣)
            },
            success:function(data){
                var signData=data.data;
                var signHtml='';
                if(data.status==1&&!signData!=null){
                    if(!signData.groupActualpay){
                        signData.groupActualpay=0;
                    }
                    if(!signData.dataTypeStr){
                        signData.dataTypeStr='';
                    }
                    if(!signData.signTime){
                        signData.signTime='';
                    }
                    if(!signData.salesUserName){
                        signData.salesUserName='';
                    }
                    if(!signData.signMoney){
                        signData.signMoney=0;
                    }
                    if(!signData.dealArea){
                        signData.dealArea=0;
                    }
                    if(!signData.groupStateTitle){
                        signData.groupStateTitle='';
                    }
                    if(!signData.groupShouldpay){
                        signData.groupShouldpay=0;
                    }
                    if(!signData.remark){
                        signData.remark='';
                    }
                    signHtml+=`
                        <li><span>签约时间：</span><span>${signData.signTime}</span></li>
                            <li><span>案场销售：</span><span>${signData.salesUserName}</span></li>
                            <li><span>签约总价：</span><span>${signData.signMoney}元</span></li>
                            <li><span>签约面积：</span><span>${signData.dealArea}㎡</span></li>
                            <li><span>优惠方案：</span><span>${signData.groupStateTitle}</span></li>
                            <li><span>应收定金：</span><span>${signData.groupShouldpay}元</span></li>
                            <li><span>实收定金：</span><span>${signData.groupActualpay}元</span></li>
                            <li class="remark">备注: ${signData.remark}</li>
                    `;
                    $('#sendDetail').html(signHtml);
                }else{
                    $('#sendDetail').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //大定节点
    function dading(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/detailedInfo',
            data:{
                dataID:dataId,//	是	int	数据信息ID(通过”客户交易进度-接口”获取)
                dataType:dataType//	是	int	交易过程节点类型(通过”客户交易进度-接口”获取;0报备1来访3大定4签约5发佣)
            },
            success:function(data){
                var daData=data.data;
                var daHtml='';
                if(data.status==1&&!daData!=null){
                    if(!daData.salesUserName){
                        daData.salesUserName='';
                    }
                    if(!daData.dataTypeStr){
                        daData.dataTypeStr='';
                    }
                    if(!daData.signTime){
                        daData.signTime='';
                    }
                    if(!daData.signMoney){
                        daData.signMoney=0;
                    }
                    if(!daData.rewardActual){
                        daData.rewardActual=0;
                    }
                    if(!daData.groupStateTitle){
                        daData.groupStateTitle='';
                    }
                    if(!daData.groupShouldpay){
                        daData.groupShouldpay=0;
                    }
                    if(!daData.groupActualpay){
                        daData.groupActualpay=0;
                    }
                    if(!daData.nexttradeTime){
                        daData.nexttradeTime='';
                    }
                    if(!daData.remark){
                        daData.remark='';
                    }
                    daHtml+=`
                        <li><span>大定时间：</span><span>${daData.signTime}</span></li>
                            <li><span>案场销售：</span><span>${daData.salesUserName}</span></li>
                            <li><span>大定总价：</span><span>${daData.signMoney}元</span></li>
                            <li><span>已付大定金额：</span><span>${daData.rewardActual*1000}元</span></li>
                            <li><span>优惠方案：</span><span>${daData.groupStateTitle}</span></li>
                            <li><span>应收定金：</span><span>${daData.groupShouldpay}元</span></li>
                            <li><span>实收定金：</span><span>${daData.groupActualpay}元</span></li>
                            <li><span>签约时间：</span><span>${daData.nexttradeTime}</span></li>
                            <li class="remark">备注: ${daData.remark}</li>
                    `;
                    $('#sendDetail').html(daHtml);
                }else{
                    $('#sendDetail').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //来访节点
    function visitv(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/detailedInfo',
            data:{
                dataID:dataId,//	是	int	数据信息ID(通过”客户交易进度-接口”获取)
                dataType:dataType//	是	int	交易过程节点类型(通过”客户交易进度-接口”获取;0报备1来访3大定4签约5发佣)
            },
            success:function(data){
                var visitData=data.data;
                var visitHtml='';
                if(data.status==1&&!visitData!=null){
                    var imgSrc,imgHtml='';
                    if(!visitData.visitorsNumber){
                        visitData.visitorsNumber=0;
                    }
                    if(!visitData.customerEnjoy){
                        visitData.customerEnjoy='';
                    }
                    if(!visitData.lookTime){
                        visitData.lookTime='';
                    }
                    if(!visitData.salesUserName){
                        visitData.salesUserName='';
                    }
                    if(!visitData.visitorsNumber){
                        visitData.visitorsNumber=0;
                    }
                    if(!visitData.givenPrice){
                        visitData.givenPrice=0;
                    }
                    if(!visitData.luozuo){
                        visitData.luozuo='';
                    }
                    if(!visitData.houseNameArr){
                        visitData.houseNameArr='';
                    }
                    if(!visitData.dkImageUrl){
                        visitData.dkImageUrl='static/custom/img/print.png';
                    }
                    if(!visitData.remark){
                        visitData.remark='';
                    }
                    if(visitData.dkImageUrl.indexOf(',')!=-1){
                        imgSrc=visitData.dkImageUrl.split(',');
                        $.each(imgSrc,function(i){
                            imgHtml+=`
                <img class="pb-standalone" src="${visitData.dkImageUrl}" alt=""/>
                            `;
                        });
                    }else{
                        imgHtml=`
                <img class="pb-standalone" src="${visitData.dkImageUrl}" alt=""/>
                        `;
                    }
                    visitHtml+=`
                        <li><span>来访时间：</span><span>${visitData.lookTime}</span></li>
                            <li><span>案场销售：</span><span>${visitData.salesUserName}</span></li>
                            <li><span>来访人数：</span><span>${visitData.visitorsNumber}人</span></li>
                            <li><span>出价金额：</span><span>${visitData.givenPrice}元</span></li>
                            <li><span>落座：</span><span>${visitData.luozuo}</span></li>
                            <li><span>落位：</span><span>${visitData.houseNameArr}</span></li>
                            <li class="proof"><span>带看确认单：</span><span id="imgHtmlV"></span></li>
                            <li class="remark">备注: ${visitData.remark}</li>
                    `;
                    $('#sendDetail').html(visitHtml);
                    $('#imgHtmlV').html(imgHtml);
                    /*=== 默认为 standalone ===*/
                    var myPhotoBrowserStandalone = $.photoBrowser({
                        photos : imgSrc||[visitData.dkImageUrl]
                    });
//点击时打开图片浏览器
                    $('#sendDetail').on('click','.pb-standalone',function (e) {
                        e.preventDefault();
                        $('.photo-browser').show();
                        try{
                            myPhotoBrowserStandalone.open();
                        }catch(e){
                            console.log(e);
                        }
                        $('.bar-nav').html("<img src='static/custom/img/back.png' />");
                        $('.bar-nav').on('click','img',function(){
                            $('.photo-browser').hide();
                            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>客户详情</div>");
                        });
                    });
                }else{
                    $('#sendDetail').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //报备节点
    function reportr(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/detailedInfo',
            data:{
                dataID:dataId,//	是	int	数据信息ID(通过”客户交易进度-接口”获取)
                dataType:dataType//	是	int	交易过程节点类型(通过”客户交易进度-接口”获取;0报备1来访3大定4签约5发佣)
            },
            success:function(data){
                var reportData=data.data;
                var reportHtml='';
                var thisShuttle=shuttle;
                if(data.status==1&&!reportData!=null){
                    if(!reportData.createtime){
                        reportData.createtime='';
                    }
                    if(!reportData.lookHomeDate){
                        reportData.lookHomeDate='';
                    }
                    if(!reportData.salesUserName){
                        reportData.salesUserName='';
                    }
                    if(!reportData.shuttle){
                        reportData.shuttle='';
                    }
                    if(!reportData.lookTime){
                        reportData.lookTime='';
                    }
                    if(!reportData.lookTimeMinute){
                        reportData.lookTimeMinute='';
                    }
                    if(!reportData.houseValuation){
                        reportData.houseValuation='';
                    }
                    if(!reportData.decoration){
                        reportData.decoration='';
                    }
                    reportHtml+=`
                        <li><span>报备时间：</span><span>${reportData.createtime}</span></li>
                            <li><span>来访时间：</span><span>${reportData.lookHomeDate}</span></li>
                            <li><span>预约案场：</span><span>${reportData.salesUserName}</span></li>
                            <li><span>来访方式：</span><span>${thisShuttle(Number(reportData.shuttle))}</span></li>
                            <li><span>上车时间：</span><span>${reportData.lookTime}:${reportData.lookTimeMinute}</span></li>
                            <li><span>上车地点：</span><span>${reportData.houseValuation}</span></li>
                            <li class="remark">备注: ${reportData.decoration}</li>
                    `;
                    $('#sendDetail').html(reportHtml);
                }else{
                    $('#sendDetail').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //客户信息
    function customInfo(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/customerInfo',
            data:{
                customerID:customerID,//214717,//customerID,//	是	int	客户ID
                dataType:dataType,//	是	int	客户当前状态(0报备1来访2交易)
                houseProcessID:houseProcessid//	否	int	交易过程ID(当dataType的值不为0或1时,houseProcessID不能为空)
            },
            success:function(data){
                //console.log(data);
                var cusData=data.data;
                var cusHtml='',afterHtml='',custNames,custPhones;
                if(data.status==1&&cusData!=null){
                    //房源
                    if(dataType>1){
                        $('#house').html(cusData.houseName);
                    }else{
                        $('#house').html('');
                    }
                    if(!cusData.bb_customerName){
                        cusData.bb_customerName='';
                    }
                    if(!cusData.bb_customerPhone){
                        cusData.bb_customerPhone='';
                    }
                    if(!cusData.customerName){
                        cusData.customerName='';
                    }
                    if(!cusData.customerPhone){
                        cusData.customerPhone='';
                    }
                    cusHtml+=`
                       <li id="cusInfo"><span>${cusData.bb_customerName}</span><span>${cusData.bb_customerPhone}</span></li>

                <li class="fold"><img src="static/custom/img/back_down.png" alt=""/></li>
                    `;
                    $('#contact').html(cusHtml);
                    if(cusData.customerName.indexOf(',')!=-1&&cusData.customerPhone.indexOf(',')!=-1){
                        custNames=cusData.customerName.split(',');
                        custPhones=cusData.customerPhone.split(',');
                        $.each(custNames,function(i){
                            afterHtml+=`
                    <li class="call">
                    <span>${custNames[i]}</span>
                    <button class="${custPhones[i]}">${custPhones[i]}<img class="${custPhones[i]}" src="static/custom/img/phone.png" alt=""/></button>
                    </li>
                    `;
                        });
                        $('#cusInfo').after(afterHtml);
                        $('#contact>li:gt(1)').hide();
                    }else{
                        afterHtml+=`
                    <li class="call">
                    <span>${cusData.customerName}</span>
                    <button class="${cusData.customerPhone}">${cusData.customerPhone}<img class="${cusData.customerPhone}" src="static/custom/img/phone.png" alt=""/></button>
                    </li>
                    `;
                        $('#cusInfo').after(afterHtml);
                        $('#contact>li.fold').css("cssText", "display:none !important;");
                    }
                    if(!cusData.customerPhone){
                        $('#contact>li.call').hide();
                        $('#contact>li.fold').css("cssText", "display:none !important;");
                        $('#cusInfo').css('margin-bottom','0');
                    }
                    //点击电话及图表进行拨号
                    $('#contact').on('click','button',function(e){
                        try{
                            if(!(/^1[34578]\d{9}$/.test($(e.target).attr('class')))){
                                $.toast("手机号无效");
                            }else{
                                phone($(e.target).attr('class'));
                            }
                        }catch(e){
                            console.log(e);
                        }
                        try{
                            if(!(/^1[34578]\d{9}$/.test($(e.target).attr('class')))){
                                return false;
                            }else{
                                AndroidWebView.call($(e.target).attr('class'));
                            }
                        }catch(e){
                            console.log(e);
                        }
                    });
                }else{
                    $('#contact').html('');
                }
            },
            error:function(){
                alert('网络繁忙，请稍后尝试！');
            }
        });
    }
    //加载客户产生交易变化接点(按时间倒序排列,最新时间排第一)
    function loadCustomerNode(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/loadCustomerNode',
            data:{
                customerID:customerID//197999//customerID//	是	int	客户ID(例:197999)
            },
            success:function(data){
                //console.log(data);
                var customData=data.data;
                var thisCustomInfo=customInfo;
                if(data.status==1&&customData.length>0){
                    var dataTypeStr=customData[0].dataTypeStr;//最近节点的信息类型
                    if(customData[0].dataType==401){
                        customData[0].dataType=4;
                    }
                    $('#ywProgress .send').html(dataTypeStr);
                    switch (customData[0].dataType){
                        case 5:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            sends();
                            dataType=2;
                            thisCustomInfo();
                            break;
                        case 4:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            signs();
                            dataType=2;
                            thisCustomInfo();
                            break;
                        case 3:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            dading();
                            dataType=2;
                            thisCustomInfo();
                            break;
                        case 1:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            visitv();
                            dataType=1;
                            houseProcessid='';
                            thisCustomInfo();
                            break;
                        case 0:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            reportr();
                            dataType=0;
                            houseProcessid='';
                            thisCustomInfo();
                            break;
                        default :
                            break;
                    }
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    loadCustomerNode();
    //客户跟进
    function follow(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/loadCustomerTrack',
            data:{
                customerID:customerID//214717//customerID//	是	int	客户ID(例:214717)
            },
            success:function(data){
                //console.log(data);
                var followData=data.data;
                var followHtml='';
                if(data.status==1&&followData.length>0){
                    $.each(followData,function(i){
                        if(!followData[i].typeStr){
                            followData[i].typeStr=' ';
                        }
                        if(!followData[i].trackUserName){
                            followData[i].trackUserName='';
                        }
                        if(!followData[i].trackTime){
                            followData[i].trackTime='';
                        }
                        if(!followData[i].userRemark){
                            followData[i].userRemark='';
                        }
                        followHtml+=`
                <div class="row">
                    <div class="col-50">
                        <span class="circle">${followData[i].typeStr.slice(0,1)}</span><span class="name">${followData[i].trackUserName}</span>
                    </div>
                    <div class="col-50 text-right">${followData[i].trackTime}</div>
                </div>
                <div class="dataInfo">
                    <div class="caret"></div>
                    <div>${followData[i].userRemark}</div>
                </div>
                        `;
                    });
                    $('#follow').html(followHtml);
                }else{
                    $('#follow').html('');
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    follow();
    $('#contact').on('click','.fold>img',function(e){
        e.stopPropagation();
        if($(e.target).attr('src').indexOf('down')!=-1){
            $(e.target).attr('src','static/custom/img/top.png');
            $('#contact>li:gt(1)').show();
        }else{
            $(e.target).attr('src','static/custom/img/back_down.png');
            $('#contact>li:gt(1)').hide();
        }
    })
        .on('click','.fold',function(e){
            if($(e.target).children('img').attr('src').indexOf('down')!=-1){
                $(e.target).children('img').attr('src','static/custom/img/top.png');
                $('#contact>li:gt(1)').show();
            }else{
                $(e.target).children('img').attr('src','static/custom/img/back_down.png');
                $('#contact>li:gt(1)').hide();
            }
        });
    //头部返回列表
    $('header').click('img',function(e){
        history.go(-1);
    });
//业务进度‘查看更多’点击事件
    $('#ywProgress').on('click','.text',function(e){
        $(location).attr('href','progress.html?customerID='+customerID);
    })
        .on('click','.more',function(e){
            e.stopPropagation();
            $(location).attr('href','progress.html?customerID='+customerID);
        })
        .on('click','img',function(e){
            e.stopPropagation();
            $(location).attr('href','progress.html?customerID='+customerID);
        });
    //初始化
    $.init();
});