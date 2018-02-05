	$(function(){
		FastClick.attach(document.body);
		var dataSearch = (window.location.search).substr(1);

		var mySwiper;
		var mySwiper1;
		var imglist = "";
		var imglist1 = "";
		var bannerStr = "";
		var bannerStr1 = "";
		$("#detailsBack").on("click",function(){
			window.history.back();
		})

		$.post("http://192.168.1.186/efangmem/indexPag/getPropertyInfo",dataSearch, function(data){


			$.each(check(data.midimglist), function(i){
				if (data.midimglist[i]) {
					bannerStr = "<img src='"+imgurlStr+ check(data.midimglist[i])+ "' />";
				} else{
					bannerStr = "<img src='img/picture1.png' />";
				}
				
				imglist += "<div class='swiper-slide'><div class='bannerBg'></div>"+ bannerStr +"</div>";
			});
			$.each(check(data.imglist), function(i){
				if (data.imglist[i]) {
					bannerStr1 = "<img src='"+imgurlStr+ check(data.imglist[i])+ "' />";
				} else{
					bannerStr1 = "<img src='img/picture1.png' />";
				}
				
				imglist1 +=  "<div class='swiper-slide'><div class='swiper-zoom-container'> "+ bannerStr1 +"</div></div>";
			});
			$(".banner").html(imglist);
			//$(".swiper02").html(imglist1);
			
			mySwiper = new Swiper ('.swiper01 .swiper-container', {
			    direction: 'horizontal',
			    loop: false,
			    
			    // 如果需要分页器
			    pagination: '.swiper01 .swiper-pagination',
			    //paginationType : 'fraction'
		 	});
			
			$(".bannerBack").click(function(){
				$("#list").show();
				$(".bannerBox").fadeOut();
				
			})
			$(".banner").click(function(){
				$("#list").hide();
				$(".swiper02").html(imglist1);
				$(".bannerBox1").fadeIn();

				mySwiper1 = new Swiper ('.bannerBox1 .swiper-container', {
					zoom : true,
					zoomToggle :true,
				    // 如果需要分页器
				    pagination: '.bannerBox1 .swiper-pagination',
				    //paginationType : 'fraction'
			 	});
			})
			
            function buildMark(t){
 				switch(t)
				{
				case "1":
				  return t = "住宅";
				  break;
				case "2":
				  return t = "别墅";
				  break;
				case "3":
				  return t = "公寓";
				  break;
				case "4":
				  return t = "商铺";
				  break;
				case "5":
				  return t = "写字楼";
				  break;
				case "6":
				  return t = "洋房";
				  break;
				default:
				  return t = "";
				}
            }
            
				var typeShare = "";
            
		    if(check(data.mess[0])){
			document.title = data.mess[0].PropertyName;
		        $(".detailstop").append(check(data.mess[0].PropertyName));        
	            var x = check(data.mess[0].BuildingType).split(",");	                    
	            if(x[0] == "0"){
	            	x.shift();			                    	
	            }
	
				var typeHTML = "";
				for (var i=0;i<x.length;i++) {
					typeHTML += "<span>"+ buildMark(x[i]) +"</span>";
				}
				
				for (var i=0;i<x.length;i++) {
					typeShare +=  buildMark(x[i]) +",";
					typeShare = typeShare.substr(0, typeShare.length - 1);
				}
				
				
//房屋基本信息		

				$(".proTit").html(
					"<div>"+
						"<b>"+check(data.mess[0].PropertyName)+"</b>"+
						"<b>"+ checkprice(data.mess[0].AveragePrice) +"</b>"+
					"</div>"+
					"<div>"+check(data.mess[0].Address)+"</div>"+
					"<div>"
						+ typeHTML +
					"</div>"+
					"<div>"+
						"<span>合作经纪人<b>"+ check(data.mess[0].AgentMemberCount)+"</b></span>"+
						"<span>意向客户<b>"+ check(data.mess[0].ReportCustomer)+"</b></span>"+
						"<span>最近成交<b>"+ check(data.mess[0].TotalHouse) +"</b></span>"+
					"</div>"
				);
			}else{
				$(".proTit").html("<p style='margin-top:2.5rem;text-align:center;'>暂无信息</p>");
			}

			
//优惠方案
				if(check(data.tgxq[0])){	
					var tgStr = "";
					$(".groupCase").css("display","block");
					$.each(data.tgxq, function(i) {
						tgStr += "<div>"+ check(data.tgxq[i].BuildingType)+"："+ check(data.tgxq[i].DetailName) +"</div>"
					});
					$(".caseList").html(tgStr);
				}else{
					$(".groupCase").css("display","none");
				}
	
//主力户型		
			function typeMark(t){
				switch(t)	
				{
				case 1:return t = "住宅";break;
				case 101:return t = "普通住宅";break;
				case 2:return t = "别墅";break;
				case 201:return t = "联排别墅";break;
				case 202:return t = "独栋别墅";break;
				case 203:return t = "双拼别墅";break;
				case 204:return t = "叠加别墅";break;
				case 205:return t = "串联别墅";break;
				case 206:return t = "亲水别墅";break;
				case 207:return t = "类独栋别墅";break;
				case 208:return t = "Mini墅";break;
				case 209:return t = "合院别墅";break;
				case 210:return t = "商用别墅";break;
				case 3:return t = "公寓";break;
				case 301:return t = "酒店式公寓";break;
				case 4:return t = "商铺";break;
				case 401:return t = "商铺";break;
				case 5:return t = "写字楼";break;
				case 501:return t = "写字楼";break;
				case 6:return t = "洋房";break;
				case 601:return t = "洋房";break;
				default:return t = "";
				}
            }
			
			
		    	
		    	if(check(data.zlhx[0])){
				    var typeStr = "";
				    var houseimg = ""
					$(".houseType").css("display","block");
					$.each(data.zlhx, function(i) {
						if (check(data.zlhx[i].minurlList[0])) {
							houseimg = "<img src='"+ imgurlStr + check(data.zlhx[i].minurlList[0])+ "' />";
						
						} else{
							houseimg = "<img src='img/picture1.png' />";
						}
						typeStr +="<dl class='clearfix'>"+
							"<h5>"+ check(data.zlhx[i].HouseModel) +"</h5>"+
							"<dt class='houseimg' value='"+ i +"'>"+ houseimg +"</dt>"+
							"<dd>"+parseInt(check(data.zlhx[i].SalePrice))+"万起</dd>"+
							"<dd>"+ check(data.zlhx[i].Room1) +"室"+ check(data.zlhx[i].Room2) +"厅"+ check(data.zlhx[i].Room3) +"卫<b>|</b>"+ check(data.zlhx[i].Decoration) +"</dd>"+
							"<dd><span>"+ check(data.zlhx[i].Acreage) +"m&sup2;</span><span>"+ typeMark(check(data.zlhx[i].HouseType)) +"</span></dd>"+
						"</dl>";
					});	
				    $(".houseType div").html(typeStr);
				}else{
					$(".houseType").css("display","none");
				}	
				$(".houseimg").click(function(){
					var _this=$(this).attr("value");
					typeimg =  "<div class='swiper-slide'> <div class='swiper-zoom-container'><img src='"+ imgurlStr+ check(data.zlhx[_this].bigurlList[0])+ "' /></div></div>";
					$(".swiper03").html(typeimg);
					//$("#list").hide();
					$("body").css("overflow","hidden");
					$(".bannerBox2").fadeIn();
					mySwiper1 = new Swiper ('.bannerBox2 .swiper-container', {
						//allowSwipeToNext : false,
						zoom : true,
						zoomToggle :true,
					    // 如果需要分页器
					    pagination: '.bannerBox2 .swiper-pagination',
					    paginationType : 'fraction'
				 	});

				})
				$(".bannerBack").on("click",function(){
					//$("#list").show();
					$(".swiper03").html("");
					$("body").css("overflow","scroll");
					$(".bannerBox2").fadeOut()
					$(".imgBox").html("");
				})
		    	
		    	
//				$(".houseimg").on("click",function(){
//					$("#list").hide();
//					$("body").css("overflow","hidden");
//					$(".houseTypeImg").fadeIn();
//					$(".imgBox").html($(this).html()+"<b></b>");
//				})
//				$(".imgBack").on("click",function(){
//					$("#list").show();
//					$("body").css("overflow","scroll");
//					$(".houseTypeImg").fadeOut()
//					$(".imgBox").html("");
//				})
			
//楼盘信息	

			function checkprice(num){
                if((num == "")||(!num)&&(num!=0)){
                	return num = "暂无报价";
                }else{
                	return num+"<i>元/m&sup2;</i>";
                }
				
			}
			function checkprice2(num){
                if((num == "")||(!num)&&(num!=0)){
                	return num = "暂无报价";
                }else{
                	return num+"元/m&sup2";
                }
				
			}
			
			function checkMsg(Num){
		    	if ((!Num)&&(Num!=0)||(Num.length ==0)) {
		    		return Num = "暂无";
		    	}else{
		    		return Num;
		    	}
		    }
			if(check(data.xmxq)){	

				function toLocaleString(date) {
			        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			    };//获取日期标签;
				var unixTimestamp = new Date( check(data.xmxq[0].CheckTime) ) ;
				commonTime = toLocaleString(unixTimestamp);
			
	            var x = check(data.xmxq[0].BuildingType).split(",");	                    
	            if(x[0] == "0"){
	            	x.shift();			                    	
	            }
	
				var typeHTML = "";
				for (var i=0;i<x.length;i++) {
					typeHTML +=  buildMark(x[i]) +"、";
				}
				$(".buildMsg").html("<div><p><b>开发商</b>"+checkMsg(data.xmxq[0].Developer)
					+"</p><p><span>物业公司</span>"+checkMsg(data.xmxq[0].PropertyCorp)
					+"</p><p><span>建筑类型</span>"+typeHTML
					+"</p><p><b>物业费</b>"+checkMsg(data.xmxq[0].OverheadCost)
					+"</p><p><b>停车位</b>"+checkMsg(data.xmxq[0].ParkingSpace)
					+"</p><p><span>装修情况</span>"+checkMsg(data.xmxq[0].Decoration)
					+"</p></div><div><p><span>占地面积</span>"+check(data.xmxq[0].Acreage2)
					+"平米</p><p><span>建筑面积</span>"+check(data.xmxq[0].Acreage1)
					+"平米</p><p><span>栋楼总数</span>"+checkMsg(data.xmxq[0].BuildingTotal)
					+"</p><p><b>绿化率</b>"+checkMsg(data.xmxq[0].VirescenceRatio)
					+"</p><p><b>容积率</b>"+checkMsg(data.xmxq[0].CubageRatio)
					+"</p></div><div><p><span>开盘时间</span>"+checkMsg(data.xmxq[0].OpenTime)
					+"</p><p><span>竣工时间</span>"+checkMsg(data.xmxq[0].FinishTime)
					+"</p><p><span>交房时间</span>"+commonTime
					+"</p></div><div><p><span style='float: left;'>配套设施</span><p style='width:10.5rem;float: left;'>"+checkMsg(data.xmxq[0].Equipment)
					+"</p></p><p style='clear:both;'><span>周围商圈</span>"+checkMsg(data.xmxq[0].ShoppingArea)
					+"</p><p><span>交通出行</span>"+checkMsg(data.xmxq[0].Traffic)
					+"</p><div><p><span>楼盘地址</span>"+checkMsg(data.xmxq[0].Address)
					+"</p><div id='mapbox'></div></div>"
				);
			}
			
			
		});

	});
