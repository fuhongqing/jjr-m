$(function(){
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
    //客户列表统计
    var userType=localStorage.getItem('userType');//用户类型：1为法人，2为分行经理
    var agencyID,branchId;
    if(userType==1){
        agencyID=localStorage.getItem('agencyID');//5886;//公司id
        branchId='';
    }else{
        branchId=localStorage.getItem('branchID');//5886;//分行id
        agencyID='';
    }
    function customCount(){
        $.ajax({
            type:'POST',
            url:initUrl+'customer/customerCount',
            data:{
                agencyID:agencyID,//	是	string	公司id 5886
                branchID:branchId	//是	string	门店id
            },
            success:function(data){
                //console.log(data);
                var customData=data.data;
                if(customData){
                    $('#today').html(customData.todaybaobei+'组');//今日报备
                    $('#total').html(parseFloat(customData.noDK)+parseFloat(customData.noCJ)+parseFloat(customData.dfy)+parseFloat(customData.fy));//总报备
                    $('#noDK').html(customData.noDK);//未带看
                    $('#noCJ').html(customData.noCJ);//未成交
                    $('#dfy').html(customData.dfy);//未发佣
                    $('#fy').html(customData.fy);//已发佣
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    customCount();
    //客户列表
    var pageNum=1,search='';
    var pageSum;//列表数
    var pageData=[];//列表数据
    // 加载flag
    var loading = false;
    var isMore=0;//定义一个变量，用来判断无限滚动时是客户列表的还是30天报备的
    function customLists(){
        $.ajax({
            type:'POST',
            url:initUrl+'customer/allCustomerList',
            data:{
                agencyID:agencyID,//	是	string	公司id 5886
                pageNum:pageNum,//	是	string	当前页 首页 1
                search:search,//	否	string	搜索词
                branchID:branchId	//是	string	门店id
            },
            success:function(data){
                //console.log(data);
                $('#search').val('');
                var customHtml='';
                loading=false;//重置，准备下次无限滚动请求
                pageSum=data.data.pageSum;//总页数
                pageData=pageData.concat(data.data.page);//列表内容
                if(pageData.length>=pageSum){
                    $('#scrollUpdate').hide();
                    $('.infinite-scroll-preloader').hide();//隐藏加载提示动图
                }else{
                    $('#scrollUpdate').show();//上拉加载更多显示
                    $('.infinite-scroll-preloader').show();
                }
                if(pageData.length>0){
                    $.each(pageData,function(i){
                        if(!pageData[i].PhoneNum){
                            pageData[i].PhoneNum='';
                        }
                        if(!pageData[i].FullName){
                            pageData[i].FullName='';
                        }
                        if(!pageData[i].PropertyName){
                            pageData[i].PropertyName='';
                        }
                        if(!pageData[i].memberName){
                            pageData[i].memberName='';
                        }
                        if(!pageData[i].Createtime){
                            pageData[i].Createtime='';
                        }
                        if(!pageData[i].houseName){
                            pageData[i].houseName='';
                        }
                        if(!pageData[i].lookcount){
                            pageData[i].lookcount=0;
                        }
                        if(!pageData[i].cjCustomerName){
                            pageData[i].cjCustomerName='';
                        }
                        if(!pageData[i].cjCustomerPhone){
                            pageData[i].cjCustomerPhone='';
                        }
                        if(!pageData[i].CommissionAmount){
                            pageData[i].CommissionAmount=0;
                        }
                        if(pageData[i].HouseSaleType==0&pageData[i].Shuttle==0){
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].FullName}</span><span>${pageData[i].PhoneNum}</span></div>
                            <div class="col-50 text-right"><a class="bus">班车</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span><span>${pageData[i].houseName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                        `;
                        }else if(pageData[i].HouseSaleType==1){
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].FullName}</span><span>${pageData[i].PhoneNum}</span></div>
                            <div class="col-50 text-right"><a class="twice">${pageData[i].lookcount}访</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span><span>${pageData[i].houseName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                        `;
                        }else if(pageData[i].HouseSaleType==3){
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].cjCustomerName}</span><span>${pageData[i].cjCustomerPhone}</span></div>
                            <div class="col-50 text-right"><a class="achieved">大定</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span><span>${pageData[i].houseName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                        `;
                        }else if(pageData[i].HouseSaleType>3&pageData[i].HouseSaleType!=9&pageData[i].
                                ReviewState==null){
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].cjCustomerName}</span><span>${pageData[i].cjCustomerPhone}</span></div>
                            <div class="col-50 text-right"><a class="deal">签约</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span><span>${pageData[i].houseName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                        `;
                        }else if(pageData[i].HouseSaleType>3&pageData[i].HouseSaleType!=9&pageData[i].
                                ReviewState==6){
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].cjCustomerName}</span><span>${pageData[i].cjCustomerPhone}</span></div>
                            <div class="col-50 text-right"><a class="send">已发</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span><span>佣${pageData[i].CommissionAmount}元</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].yjcreatTime}</span></div>
                        </div>
                    </li>
                        `;
                        }else{
                            customHtml+=`
                    <li class="${pageData[i].Customerid} grid-demo" id="${pageData[i].houseProcessid}">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].FullName}</span><span>${pageData[i].PhoneNum}</span></div>
                            <div class="col-50 text-right"><a>自驾</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                        `;
                        }
                    });
                    $('#customList').html(customHtml);
                }else{
                    $('#customList').html('');
                }
            },
            error:function(){
                pageNum--;//复原页码
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    customLists();
    //头部搜索框
    $('header').on('click','img',function(){
        pageData=[];
        search=$('#search').val();
        customLists();
    });
    //点击列表跳转详情
    var customerid,houseProcessid;
    //客户列表点击跳转详情
    $('#customList').on('click','li',function(e){
        customerid=parseFloat($(e.target).attr('class'));
        houseProcessid=$(e.target).attr('id');
        $(location).attr('href','customDetail.html?customerID='+customerid+'&houseProcessid='+houseProcessid);
    })
        .on('click','.row',function(e){
            e.stopPropagation();
            customerid=parseFloat($(e.target).parent().attr('class'));
            houseProcessid=$(e.target).parent().attr('id');
            $(location).attr('href','customDetail.html?customerID='+customerid+'&houseProcessid='+houseProcessid);
        })
        .on('click','.col-50',function(e){
            e.stopPropagation();
            customerid=parseFloat($(e.target).parent().parent().attr('class'));
            houseProcessid=$(e.target).parent().parent().attr('id');
            $(location).attr('href','customDetail.html?customerID='+customerid+'&houseProcessid='+houseProcessid);
        })
        .on('click','span',function(e){
            e.stopPropagation();
            customerid=parseFloat($(e.target).parent().parent().parent().attr('class'));
            houseProcessid=$(e.target).parent().parent().parent().attr('id');
            $(location).attr('href','customDetail.html?customerID='+customerid+'&houseProcessid='+houseProcessid);
        })
        .on('click','a',function(e){
            e.stopPropagation();
            customerid=parseFloat($(e.target).parent().parent().parent().attr('class'));
            houseProcessid=$(e.target).parent().parent().parent().attr('id');
            $(location).attr('href','customDetail.html?customerID='+customerid+'&houseProcessid='+houseProcessid);
        });
    //超过30天的报备
    function more(){
        $.ajax({
            type:'POST',
            url:initUrl+'customer/mouthAgoCustomerper',
            data:{
                agencyID:agencyID,//	是	string	公司id 5886
                pageNum:pageNum,//	是	string	当前页 首页 1
                search:search,//	否	string	搜索词
                branchID:branchId//	是	string	门店id
            },
            success:function(data){
                //console.log(data);
                loading=false;//重置，准备下次无限滚动请求
                pageData=pageData.concat(data.data.page);//列表内容
                pageSum=data.data.pageSum;
                $('#more').hide();//30报备隐藏
                if(pageData.length>=pageSum){
                    $('#scrollUpdate').hide();
                    $('.infinite-scroll-preloader').hide();//隐藏加载提示动图
                }else{
                    $('#scrollUpdate').show();//上拉加载更多显示
                    $('.infinite-scroll-preloader').show();
                }
                var moreHtml='';
                if(pageData.length>0){
                    $.each(pageData,function(i){
                        if(!pageData[i].phoneNum){
                            pageData[i].phoneNum='';
                        }
                        if(!pageData[i].FullName){
                            pageData[i].FullName='';
                        }
                        if(!pageData[i].PropertyName){
                            pageData[i].PropertyName='';
                        }
                        if(!pageData[i].memberName){
                            pageData[i].memberName='';
                        }
                        if(!pageData[i].Createtime){
                            pageData[i].Createtime='';
                        }
                        if(pageData[i].Shuttle==1){
                            moreHtml+=`
                        <li class="${pageData[i].customerID} grid-demo">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].FullName}</span><span>${pageData[i].phoneNum}</span></div>
                            <div class="col-50 text-right"><a>自驾</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                      `;
                        }else{
                            moreHtml+=`
                        <li class="${pageData[i].customerID} grid-demo">
                        <div class="row">
                            <div class="col-50 D3"><span>${pageData[i].FullName}</span><span>${pageData[i].phoneNum}</span></div>
                            <div class="col-50 text-right"><a>班车</a></div>
                        </div>
                        <div class="row">
                            <div class="col-50"><span>${pageData[i].PropertyName}</span></div>
                            <div class="col-50 text-right"><span>${pageData[i].memberName}</span><span>${pageData[i].Createtime}</span></div>
                        </div>
                    </li>
                      `;
                        }
                    });
                    $('#customList').html(moreHtml);
                }else{
                    return;
                }
            },
            error:function(){
                console.log('网络繁忙，请稍后重试！');
            }
        });
    }
    //超过30天报备点击事件
    $('#more').on('click',function(){
        pageData=[];
        search='';
        pageNum=1;
        isMore=1;
        more();
    });
    //渠道列表上拉加载
    // 注册'infinite'事件处理函数
    $(document).on('infinite',function(){
        $('.infinite-scroll-preloader').show();
        // 首先判断如果正在加载，则退出
        if (loading) return;
        var thisCL=pageData;
        pageNum++;
        //console.log(isMore);
        if(isMore>0){
            more();//更新30列表
        }else{
            customLists();//更新列表
        }
        loading=true;//此次无限滚动请求结束
        //无限滚动终止条件
        if (thisCL.length>=pageSum) {
            loading=false;
            // 加载完毕，则注销无限加载事件，以防不必要的加载
            $.detachInfiniteScroll($('.infinite-scroll'));
            // 删除加载提示符
            $('.infinite-scroll-preloader').remove();
            return;
        }
    });
    //初始化
    $.init();
});