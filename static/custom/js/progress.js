$(function(){
    /*=== 默认为 standalone ===*/
    var myPhotoBrowserStandalone = $.photoBrowser({
        photos : ['static/custom/img/print.png']
    });
//点击时打开图片浏览器
    $('#visit').on('click','.pb-standalone',function (e) {
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
            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>业务进程</div>");
        });
    });
    $('#yfy').on('click','.pb-standalone',function (e) {
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
            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>业务进程</div>");
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
    //头部返回图标的点击事件
    $('header').click('img',function(e){
        history.go(-1);
    });
    var customerID=location.search.slice(12);//获取客户id
    var dataId,dataType;
    //加载客户产生交易变化接点(按时间倒序排列,最新时间排第一)
    var customData;//列表数据
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
    function send(){
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
                    var imgSrcSD,imgHtmlSD='';
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
                        imgSrcSD=sendData.fyImageUrl.split(',');
                        $.each(imgSrcSD,function(i){
                            imgHtmlSD+=`
                <img class="pb-standalone" src="${imgSrcSD[i]}" alt=""/>
                            `;
                        });
                    }else{
                        imgHtmlSD=`
                <img class="pb-standalone" src="${sendData.fyImageUrl}" alt=""/>
                        `;
                    }
                    var sendHtml=`
                        <div class="progressBar">
                            <span>发佣</span><span>${sendData.reviewState}</span>
                        </div>
                        <ul class="progressContent">
                            <li><span>原始佣金：</span><span>${sendData.rewardTotal}元</span></li>
                            <li><span>折佣：</span><span>${sendData.discount}元</span></li>
                            <li><span>佣金奖励：</span><span>${sendData.cashPrice}元</span></li>
                            <li><span>提供发票：</span><span>${sendData.isInvoice}</span></li>
                            <li><span>应发佣金：</span><span>${sendData.rewardActual}元</span></li>
                            <li><span>实发佣金：</span><span>${sendData.amount}元</span></li>
                            <li class="proof out">出款凭证:</li>
                            <li class="out"></li>
                        </ul>
                    `;
                    $('#yfy').html(sendHtml);
                    $('#yfy>ul>li:last-child').html(imgHtmlSD);
                    if(sendData.reviewState!='已发佣'){
                        $('#yfy li.out').hide();//财务出款后才显示
                    }
                    /*=== 默认为 standalone ===*/
                    var myPhotoBrowserStandalone = $.photoBrowser({
                        photos : imgSrcSD||[sendData.fyImageUrl]
                    });
//点击时打开图片浏览器
                    $('#yfy').on('click','.pb-standalone',function (e) {
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
                            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>业务进程</div>");
                        });
                    });
                }else{
                    $('#yfy').hide();
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
                        <div class="progressBar sign">
                            <span>${signData.dataTypeStr}</span>
                        </div>
                        <ul class="progressContent signBar">
                            <li><span>签约时间：</span><span>${signData.signTime}</span></li>
                            <li><span>案场销售：</span><span>${signData.salesUserName}</span></li>
                            <li><span>签约总价：</span><span>${signData.signMoney}元</span></li>
                            <li><span>签约面积：</span><span>${signData.dealArea}㎡</span></li>
                            <li><span>优惠方案：</span><span>${signData.groupStateTitle}</span></li>
                            <li><span>应收定金：</span><span>${signData.groupShouldpay}元</span></li>
                            <li><span>实收定金：</span><span>${signData.groupActualpay}元</span></li>
                            <li class="remark">备注: ${signData.remark}</li>
                        </ul>
                    `;
                    $('#qy').html(signHtml);
                }else{
                    $('#qy').hide();
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
                        <div class="progressBar achieved">
                            <span>${daData.dataTypeStr}</span>
                        </div>
                        <ul class="progressContent achievedBar">
                            <li><span>大定时间：</span><span>${daData.signTime}</span></li>
                            <li><span>案场销售：</span><span>${daData.salesUserName}</span></li>
                            <li><span>大定总价：</span><span>${daData.signMoney}元</span></li>
                            <li><span>已付大定金额：</span><span>${daData.rewardActual*1000}元</span></li>
                            <li><span>优惠方案：</span><span>${daData.groupStateTitle}</span></li>
                            <li><span>应收定金：</span><span>${daData.groupShouldpay}元</span></li>
                            <li><span>实收定金：</span><span>${daData.groupActualpay}元</span></li>
                            <li><span>签约时间：</span><span>${daData.nexttradeTime}</span></li>
                            <li class="remark">备注: ${daData.remark}</li>
                        </ul>
                    `;
                    $('#dd').html(daHtml);
                }else{
                    $('#dd').hide();
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
                <img class="pb-standalone" src="${imgSrc[i]}" alt=""/>
                            `;
                        });
                    }else{
                        imgHtml=`
                <img class="pb-standalone" src="${visitData.dkImageUrl}" alt=""/>
                        `;
                    }
                    visitHtml+=`
                        <div class="progressBar visit">
                            <span>${visitData.visitorsNumber}访</span><span>客户意向：${visitData.customerEnjoy}</span>
                        </div>
                        <ul class="progressContent visitBar">
                            <li><span>来访时间：</span><span>${visitData.lookTime}</span></li>
                            <li><span>案场销售：</span><span>${visitData.salesUserName}</span></li>
                            <li><span>来访人数：</span><span>${visitData.visitorsNumber}人</span></li>
                            <li><span>出价金额：</span><span>${visitData.givenPrice}元</span></li>
                            <li><span>落座：</span><span>${visitData.luozuo}</span></li>
                            <li><span>落位：</span><span>${visitData.houseNameArr}</span></li>
                            <li class="proof">带看确认单</li>
                            <li id="imgLi"></li>
                            <li class="remark">备注: ${visitData.remark}</li>
                        </ul>
                    `;
                    $('#visit').html(visitHtml);
                    $('#imgLi').html(imgHtml);
                    /*=== 默认为 standalone ===*/
                    var myPhotoBrowserStandalone = $.photoBrowser({
                        photos : imgSrc||[visitData.dkImageUrl]
                    });
//点击时打开图片浏览器
                    $('#visit').on('click','.pb-standalone',function (e) {
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
                            $('header.clear').html("<img class='lf' src='static/custom/img/back_left.png'/>"+"<div>业务进程</div>");
                        });
                    });
                }else{
                    $('#visit').hide();
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
                        <div class="progressBar report">
                            <span>报备</span>
                        </div>
                        <ul class="progressContent reportBar">
                            <li><span>报备时间：</span><span>${reportData.createtime}</span></li>
                            <li><span>来访时间：</span><span>${reportData.lookHomeDate}</span></li>
                            <li><span>预约案场：</span><span>${reportData.salesUserName}</span></li>
                            <li><span>来访方式：</span><span>${thisShuttle(Number(reportData.shuttle))}</span></li>
                            <li><span>上车时间：</span><span>${reportData.lookTime}:${reportData.lookTimeMinute}</span></li>
                            <li><span>上车地点：</span><span>${reportData.houseValuation}</span></li>
                            <li class="remark">备注: ${reportData.decoration}</li>
                        </ul>
                    `;
                    $('#bb').html(reportHtml);
                }else{
                    $('#bb').hide();
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    function loadCustomerNode(){
        $.ajax({
            type:'POST',
            url:initUrl+'customerinfo/loadCustomerNode',
            data:{
                customerID:customerID//197999//customerID//	是	int	客户ID(例:197999)
            },
            success:function(data){
                var thisSend=send;
                var thisSigns=signs;
                var thisDading=dading;
                var thisVisitv=visitv;
                var thisReportr=reportr;
                //console.log(data);
                customData=data.data;
                //console.log(customData);
                if(data.status==1&&customData.length>0){
                    if(customData[0].dataType==401){
                        var cusDataId=customData[0].dataID;
                        customData[0].dataID=customData[1].dataID;
                        customData[1].dataID=cusDataId;
                        customData[0].dataType=5;
                        customData[1].dataType=4;
                    }
                    switch (customData[0].dataType){
                        case 5:
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            thisSend();
                            if(customData[1]){
                                dataId=customData[1].dataID;dataType=customData[1].dataType;
                                thisSigns();
                            }else{
                                $('#qy').remove();
                                $('#steps>.sign').remove();
                            }
                            if(customData[2]){
                                dataId=customData[2].dataID;dataType=customData[2].dataType;
                                thisDading();
                            }else{
                                $('#dd').remove();
                                $('#steps>.achieved').remove();
                            }
                            if(customData[3]){
                                dataId=customData[3].dataID;dataType=customData[3].dataType;
                                thisVisitv();
                            }else{
                                $('#visit').remove();
                                $('#steps>.visit').remove();
                            }
                            if(customData[4]){
                                dataId=customData[4].dataID;dataType=customData[4].dataType;
                                thisReportr();
                            }else{
                                $('#bb').remove();
                                $('#steps>.report').remove();
                            }
                            break;
                        case 4:
                            $('#yfy').remove();//发佣隐藏
                            $('#steps>div:first-child').remove();//第一个步骤条隐藏
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            thisSigns();
                            if(customData[1]){
                                dataId=customData[1].dataID;dataType=customData[1].dataType;
                                thisDading();
                            }else{
                                $('#dd').remove();
                                $('#steps>.achieved').remove();
                            }
                            if(customData[2]){
                                dataId=customData[2].dataID;dataType=customData[2].dataType;
                                thisVisitv();
                            }else{
                                $('#visit').remove();
                                $('#steps>.visit').remove();
                            }
                            if(customData[3]){
                                dataId=customData[3].dataID;dataType=customData[3].dataType;
                                thisReportr();
                            }else{
                                $('#bb').remove();
                                $('#steps>.report').remove();
                            }
                            break;
                        case 3:
                            $('#yfy,#qy').remove();//隐藏
                            $('#steps>div:first-child,#steps>.sign').remove();//步骤条隐藏
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            thisDading();
                            if(customData[1]){
                                dataId=customData[1].dataID;dataType=customData[1].dataType;
                                thisVisitv();
                            }else{
                                $('#visit').remove();
                                $('#steps>.visit').remove();
                            }
                            if(customData[2]){
                                dataId=customData[2].dataID;dataType=customData[2].dataType;
                                thisReportr();
                            }else{
                                $('#bb').remove();
                                $('#steps>.report').remove();
                            }
                            break;
                        case 1:
                            $('#yfy,#qy,#dd').remove();//隐藏
                            $('#steps>div:first-child,#steps>.sign,#steps>.achieved').remove();//步骤条隐藏
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            thisVisitv();
                            if(customData[1]){
                                dataId=customData[1].dataID;dataType=customData[1].dataType;
                                thisReportr();
                            }else{
                                $('#bb').remove();
                                $('#steps>.report').remove();
                            }
                            break;
                        case 0:
                            $('#yfy,#qy,#dd,#visit').remove();//隐藏
                            $('#steps>div:not(.report)').remove();//步骤条隐藏
                            dataId=customData[0].dataID;dataType=customData[0].dataType;
                            thisReportr();
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
    //初始化
    $.init();
});