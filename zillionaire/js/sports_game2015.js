(function ($){
	var num = null ; //记录踢球点数
    var step = 0; //记录现在的步伐
    var breakPoint = [8,14,15,17,20,22,27];//地图上拐点
    var totalMoney = sportGameData.initialMoney; //初始金钱
    var tagArr = [];
    var breakI = 1;
    var breakPointArr = [];
    var randomIndex = [];
   /* var stepObj = [
    	{
    		"startPlace":1,	
    		"endPlace":7,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_left.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_left.gif",	
    	},
    	{
    		"startPlace":8,	
    		"endPlace":13,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.gif",	
    	},
    	{
    		"startPlace":14,	
    		"endPlace":14,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif",	
    	},
    	{
    		"startPlace":15,	
    		"endPlace":16,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.gif",	
    	},
    	{
    		"startPlace":17,	
    		"endPlace":19,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif",	
    	},
    	{
    		"startPlace":20,	
    		"endPlace":21,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.gif",	
    	},
    	{
    		"startPlace":22,	
    		"endPlace":26,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif",	
    	},
    	{
    		"startPlace":27,	
    		"endPlace":31,
    		"pngUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.png",
    		"gifUrl":"http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.gif",	
    	}
    ];*/

    //节点转身  stepNum:节点编号
    function  _turnAround(stepNum){
    	var $man_go = $("#man_go");
    	switch(stepNum)
		{
		case 8:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.gif");
			break;
		case 14:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif");
			break;
		case 15:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_front.gif");
			break;
		case 17:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif");
			break;
		case 20:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.gif");
			break;
		case 22:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_right.gif");
			break;
		case 27:	
			$man_go.attr("src","http://img2.cache.netease.com/f2e/sports/sports_game2015/images/man_back.gif");
			break;						
		}		
    }1

    //求区间内的数字 lower:下界,upper:上届,arr:待筛选的数组
    function _specialPoint(lower,upper,arr){
    	var breakPointArr = [];
    	breakPointArr = arr.filter(function(item, index, array){
			return (item > lower && item <= upper);
		});
		return breakPointArr;
    }

    //金钱格式化 moneyNum:钱数目,decimalPlace:小数点位数。
    function _fmoney(moneyNum, decimalPlace){
		if(decimalPlace < 0 || decimalPlace > 20 ){
			decimalPlace = 0;
		}  
	    moneyNum = parseFloat((moneyNum + "").replace(/[^\d\.-]/g, "")).toFixed(decimalPlace) + ""; 
	    var integerArr = moneyNum.split(".")[0].split("").reverse();
			decimals = moneyNum.split(".")[1]; 	    
	    var moneyFormat = "";   
	    for(var i = 0; i < integerArr.length; i ++ )   
	    {   
	        moneyFormat += integerArr[i] + ((i + 1) % 3 == 0 && (i + 1) != integerArr.length ? "," : "");   
	    }   
	    if(decimalPlace>0){
	   		return moneyFormat.split("").reverse().join("") + "." + decimals;
	    }else{
	    	return moneyFormat.split("").reverse().join("");
	    }   
	} 

	//数字money换为dom节点
	function _moneyDom(num){
		var money = _fmoney(num),
		    moneyArr = money.split("");
		var moneyDom = "";    
		for(var i=0; i<moneyArr.length; i++)
		{
			switch(moneyArr[i])
			{
			case "0":	
				moneyDom = moneyDom+"<span class='digit0'></span>";
				break;
			case "1":	
				moneyDom = moneyDom+"<span class='digit1'></span>";
				break;
			case "2":	
				moneyDom = moneyDom+"<span class='digit2'></span>";
				break;
			case "3":	
				moneyDom = moneyDom+"<span class='digit3'></span>";
				break;	
			case "4":	
				moneyDom = moneyDom+"<span class='digit4'></span>";
				break;
			case "5":	
				moneyDom = moneyDom+"<span class='digit5'></span>";
				break;
			case "6":	
				moneyDom = moneyDom+"<span class='digit6'></span>";
				break;
			case "7":	
				moneyDom = moneyDom+"<span class='digit7'></span>";
				break;
			case "8":	
				moneyDom = moneyDom+"<span class='digit8'></span>";
				break;
			case "9":	
				moneyDom = moneyDom+"<span class='digit9'></span>";
				break;
			case ",":	
				moneyDom = moneyDom+"<span class='digitcomma'></span>";
				break;
			case "-":	
				moneyDom = moneyDom+"<span class='minus'></span>";
				break;
			case "+":	
				moneyDom = moneyDom+"<span class='add'></span>";
				break;						
			}
		} 
		return  moneyDom;
	}

    //人物3d移动时大小变化，top与scale成正比例函数关系：top = 1480* scale -1044
    function _scale(obj,top){
    	var $obj = obj,t=top;
    	var scale = (1044+t)/1480,
    	    widthNew = 130*scale,
		    heightNew = 176*scale;
		$(obj).css({"width":widthNew+"px","height":heightNew+"px"});
    }

    //获得屏幕尺寸
    function _getPageSize() {
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight) { 
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { 
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		var windowWidth, windowHeight;
		if (self.innerHeight) { 
			if (document.documentElement.clientWidth) {
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { 
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { 
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}
		var pageWidth, pageHeight;
		
		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}
		
		if (xScroll < windowWidth) {
			pageWidth = xScroll;
		} else {
			pageWidth = windowWidth;
		}
		
		var arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
		return arrayPageSize;
	}

	//透明黑色背景渐入与渐出
	function _overlay(tag){
		var $overlay = $("#overlay");
		if(tag){		
			var arrPageSize = _getPageSize();
			$overlay.css({"width":arrPageSize[0]+"px","height":arrPageSize[1]+"px","z-index":"10"});
			_fade($overlay[0],true,60);
		}else{
			_fade($overlay[0],false,60);
			$overlay.css({"z-index":"5"});
		}
	}

    //渐入与渐出
	function _fade(obj, flag,alpha){ 
		var target = obj;
		var alphaValue = alpha;
		target.alpha = flag?0:alphaValue; 
		target.style.opacity = (target.alpha / 100); 
		target.style.filter = 'alpha(opacity=' + target.alpha + ')'; 
		var value = target.alpha; 
		(function(){ 
			target.style.opacity = (value / 100); 
			target.style.filter = 'alpha(opacity=' + value + ')'; 
			if (flag) { 
				value = value+2; 
				if (value <= alphaValue) { 
				  setTimeout(arguments.callee, 1);
				} 
			} 
			else { 
				value = value-2; 
				if (value >= 0) { 
				setTimeout(arguments.callee, 1);
				} 
			} 
		})(); 
	}

    //按钮GO点击函数
	function _goClick(){
		$("#go").unbind("click",_goClick);
		var $ball = $("#ball"),
		    ballStartX =  parseInt($ball.css("left")),
		    ballStartY =  parseInt($ball.css("top")); 	
		var numXYarray = [];		
		$("img.num").each(function(i){
    		var numStartX = parseInt($(this).css("left")),
    			numStartY = parseInt($(this).css("top"));
    		numXYarray.push({x:numStartX,y:numStartY});
    	});
    		//randomIndex=5;
		    randomIndex = Math.ceil(Math.random() * numXYarray.length);
			num = randomIndex;
		var offsetX = numXYarray[randomIndex-1].x-ballStartX,
			offsetY = numXYarray[randomIndex-1].y-ballStartY;
		var goInterval = window.setInterval(function(){
			var $man1 = $("img.man1"),
			 	$man2 = $("img.man2"),
				$man3 = $("img.man3");
			var man1_d = $man1.css("display"),
    			man2_d = $man2.css("display"),
    			man3_d = $man3.css("display");
    		if(man1_d == "block"){
    			$man1.css({"display":"none"});
				$man2.css({"display":"block"});
    		}else if(man2_d == "block"){
    			$man2.css({"display":"none"});
    			$man3.css({"display":"block"});
    			_ballMove(offsetX,offsetY);
    		}else{
    			$man3.css({"display":"none"});
    			$man1.css({"display":"block"});
    			clearTimeout(goInterval);
    		}
		},300)				
	}

    //GO！踢球
	function _ballXY(){
		$("#go").bind("click",_goClick);
	}	

	//踢球动画,x为球移动的水平距离，y为球移动的竖直距离
	function _ballMove(x,y){
		var ballMove = new Parabola({
	        el: "#ball",
	        offset: [x, y],
	        curvature: 0.005,
	        duration: 500,
	        callback:function(){
	        	var $ball = this.$el;
	        	var ballEndX =  $ball.css("left"),
					ballEndY =  $ball.css("top"); 
				var backX = 547-parseInt(ballEndX),
					backY = 277-parseInt(ballEndY),
					markX = parseInt(ballEndX)-4+"px",
					markY = parseInt(ballEndY)-6+"px";
	            $("#ball_mark").css({"top":markY,"left":markX});
	            $("#ball_mark").show();
	            $("#crash")[0].play();
	            var ball_back = new Parabola({
            	    el: "#ball",
        			offset: [backX, backY],
        			curvature: 0.003,
        			duration: 300,
        			callback:function(){
        				var src1 = $("#man_go").attr("src");
		            	src1 = src1.substring(0,src1.length-3);
	                	src1 = src1+"gif";
	            		$("#man_go").attr("src",src1); 
        				_callbackMoving(num);
        			}
	            }).start();        
	        },
	        stepCallback:function(x,y){
	           
	        }
	    }).start();    
	}                 

    //踢完球后小人走动,num:1-6随机数字
	function _callbackMoving(num){
		var $man_go = $("#man_go"),
			$ballfield = $("#ballfield");
		var manStartX =  parseInt($man_go.css("left")),
			manStartY =  parseInt($man_go.css("top")); 
		var stepPre = step;
		if(step+num>32){
			step = 32;
			num = 32-stepPre;
		}else{
			step = step+num;
		}
		breakPointArr = _specialPoint(stepPre,step,breakPoint);
		if(breakPointArr.length == 0){
			var $step = $ballfield.find("area").eq(step-1);
			var left = $step.data("left"),top = $step.data("top");
			var moveX = left-manStartX,moveY = top - manStartY;
			var manGoing = new Parabola({
	    	    el: "#man_go",
				offset: [moveX, moveY],
				curvature: 0,
				duration: 700*num,
				callback:function(){
					if(step == 32){
						_gameover();
						$("#go").unbind("click",_goClick);
					}else{		
						_callbackPop();	
			            window.setTimeout(function(){
			            	$("#ball").css({"top":"314px","left":"654px"});
			    			$("#ball_mark").hide();
			    			$("#go").bind("click",_goClick);			    			
			            },500);	           
			        }		       
		            var src = $man_go.attr("src");
		            	src = src.substring(0,src.length-3);
		                src = src+"png";
		            	$man_go.attr("src",src);    
		            if($.inArray(step, breakPoint) !== -1){
						_turnAround(step);
					}
		            $("#step")[0].pause();
				},
				stepCallback:function(x,y){
					$("#step")[0].play();					
		            var movingTop = parseInt($man_go.css("top"));
		            var src1 = $("#man_go").attr("src");
		            if(src1.substring(src1.length-3,src1.length) == "png"){
		            	src1 = src1.substring(0,src1.length-3);
	                	src1 = src1+"gif";
	            		$man_go.attr("src",src1); 
		            }            	
		            _scale($man_go,movingTop);
		        }
	        }).start();
		}else{
			breakPointArr.unshift(stepPre);
			breakPointArr.push(step);
			//console.log(breakPointArr);
			var length = breakPointArr.length;
			_animate(breakI,breakPointArr);
			
		}
	}

	function _animate(i,array){
		var length = array.length;
		if( i>=length ){
			return;
		}	
		var lastTag = i == length-1 ? 1 : 0;				
		//console.log(array[i-1]+","+array[i]+","+lastTag);		
		_walking(array[i-1],array[i],lastTag);
	}

    //拐点行走动画 step1:起步位置,step2:终止位置,tag:是否是最后一次循环
	function _walking(step1,step2,tag){
		var $man_go = $("#man_go");
		if($.inArray(step1, breakPoint) !== -1){
			_turnAround(step1);
		}
		if(step1 == step2){
			window.setTimeout(function(){
            	$("#ball").css({"top":"314px","left":"654px"});
    			$("#ball_mark").hide();
            },1000);
            _callbackPop();	    
            var src = $man_go.attr("src");
            	src = src.substring(0,src.length-3);
                src = src+"png";
            	$man_go.attr("src",src);  
            breakPointArr = [];
            breakI = 1;
            $("#go").bind("click",_goClick);
            return;
		}
		var $ballfield = $("#ballfield");
		var $step1 = $ballfield.find("area").eq(step1-1),
			$step2 = $ballfield.find("area").eq(step2-1);
		var left1 = $step1.data("left"),top1 = $step1.data("top"),
			left2 = $step2.data("left"),top2 = $step2.data("top");
		var moveX = left2-left1,moveY = top2 - top1,num = step2-step1;
		var manGoing = new Parabola({
    	    el: "#man_go",
			offset: [moveX, moveY],
			curvature: 0,
			duration: 700*num,
			callback:function(){
				if(tag){
					if(step == 32){
						$("#go").unbind("click",_goClick);
						_gameover();
					}else{
						_callbackPop();	  
						window.setTimeout(function(){
			            	$("#ball").css({"top":"314px","left":"654px"});
			    			$("#ball_mark").hide();	
			    			$("#go").bind("click",_goClick);	    			
			            },1000);	
					}		           
		            $("#step")[0].pause();
		                       
		            var src = $man_go.attr("src");
		            	src = src.substring(0,src.length-3);
		                src = src+"png";
		            	$man_go.attr("src",src);  
		            breakPointArr = [];
		            breakI = 1;
		            
		        }else{
		        	breakI++;	
		        	_animate(breakI,breakPointArr);
		        }
			},
			stepCallback:function(x,y){
				var $man_go = $("#man_go");
	            var movingTop = parseInt($man_go.css("top"));
	            var src1 = $man_go.attr("src");
		    	if(src1.substring(src1.length-3,src1.length) == "png"){
	            	src1 = src1.substring(0,src1.length-3);
                	src1 = src1+"gif";
            		$man_go.attr("src",src1); 
	            }   
	            _scale($man_go,movingTop);
	            $("#step")[0].play();
	        }
        }).start();
	}

    //走动后弹框,step:现在停留的格子
    function _callbackPop(){
    	var placeObj = sportGameData.place[step-1],
    	    stepsObj = {stepNum:num};
    	$.extend(placeObj, stepsObj); 
    	var $pop_start = $("#pop_start");
    	var pop_start_template = $("#pop_start_template").html();   
    	var ret = template("pop_start_template", placeObj);
    	$pop_start.html(ret);
    	_overlay(true);
    	$pop_start.show();
    	$pop_start.find("li.option").bind("click",_optionClick);
    }

    //点击选项
	function _optionClick(){
		var $m_money = $("#m_money");
		var expend = $(this).data("expend"),
			income = $(this).data("income"),
			tag = $(this).data("tag"),
			des = $(this).data("des"),
			move = $(this).data("move"),
			ending = $(this).data("ending"),
			title = $(this).data("title"),
			moveTag = move>0?1:0;	
		if(tag !== ""){
			var tagA = tag.split("，");
	    	for(var i=0; i<tagA.length;i++){
	    		tagArr.push(tagA[i]);
	    	}			
		}	    	
		var $pop_end = $("#pop_end"),
			$pop_start = $("#pop_start");
		if(expend>0){	
			totalMoney = totalMoney - expend;
			expend = "-"+_fmoney(expend);
			$("#change_money").html(_moneyDom(expend)).addClass("change_an");
            $m_money[0].play();	
            window.setTimeout(function(){
            	$("#money").html(_moneyDom(totalMoney));
            	$("#change_money").html("").removeClass("change_an");	
            },1000);	
        }    			
		var endingObj = {description:des,ending:ending,moveTag:moveTag,move:move,title:title};	
		var pop_end_template = $("#pop_end_template").html();   
    	var ret = template("pop_end_template", endingObj);
    	$pop_end.html(ret);
    	$pop_start.hide();
    	$pop_end.show();
    	$pop_end.find(".end_button").bind("click",function(){ 
    	    var moveStep = $(this).data('move');
    	    $pop_end.hide();
			_overlay(false);
    		if(moveStep>0){
    			num = moveStep;
    			$("#go").unbind("click",_goClick);
    			_callbackMoving(moveStep);
    		}	   			
			if(income>0){
				totalMoney = totalMoney + income;
				income = _fmoney(income);
				$("#change_money").html("<span class='add'></span>"+_moneyDom(income)).addClass("change_an");
	            $m_money[0].play();	
	            window.setTimeout(function(){	
	            	$("#money").html(_moneyDom(totalMoney));
	            	$("#change_money").html("").removeClass("change_an");	
	            },1000);	
	        }
	        //console.log(tagArr);
	        //console.log(totalMoney);
    	});
	}

	//找出现最多tag
	function _siftTag(arrayObj){
		var temp = "";
		var count = 0;
		var arrNew = [];
		var countArr = [];
		for(var i=0;i<arrayObj.length;i++){
			if(arrayObj[i]!=-1){
				temp=arrayObj[i];
				for(var j=0;j<arrayObj.length;j++){
					if(temp == arrayObj[j]){
						count++
						arrayObj[j] = -1;
					}
				}
				arrNew.push(temp);
				countArr.push(count);
				count = 0;
			}
		}
		var max = 0,tag;
		for(var k=0;k<countArr.length;k++){
			if(countArr[k]>max){
				max = countArr[k];
				tag = arrNew[k];
			}else if(countArr[k] == max){
				tag = tag+"&"+arrNew[k];
			}
		}
		return tag;
	}
 
	//游戏结束
	function _gameover(){
		//var tagArr =   ["冤大头", "理财家", "爱好者", "投机商", "资本家","资本家","投机商"];
		var conclusion='',bgUrl = "",tagDes= "";
		var resultMoney = sportGameData.resultMoney,resultTag = sportGameData.resultTag;
        var tag = _siftTag(tagArr);
        for(var j=0;j<resultTag.length;j++){
        	if(tag.indexOf(resultTag[j].tag) !== -1){
        		tag = resultTag[j].tag;
        		tagDes = resultTag[j].conclusion;	
        		break;
        	}
       	} 	
        for(var i=0;i<resultMoney.length;i++){
        	var rangeArr = resultMoney[i].range.split("~");
        	if(totalMoney>=rangeArr[0] && totalMoney<=rangeArr[1]){
        		conclusion = resultMoney[i].conclusion;
        		bgUrl = resultMoney[i].backgroundUrl;
        	}
        }
       	var wanTotalMoney = totalMoney/10000;	
        totalMoney = _fmoney(totalMoney); 
        var endingObj = {money:totalMoney,conclusion:conclusion,bgUrl:bgUrl,tagDes:tagDes,tag:tag};
       // console.log(endingObj);
        var $game_end = $("#game_end");
    	var game_end_template = $("#game_end_template").html();   
    	var ret = template("game_end_template", endingObj);
    	$("#game_over")[0].play();
    	$game_end.html(ret);
    	_overlay(true);
    	$game_end.show();
    	$("#restart").bind("click",function(){
			window.location.reload();
		});
		$("#restart").bind("click",function(){
			window.location.reload();
		});
		$("#share_weibo").bind("click",function(){
			sharethis('sina',location.href,"我赚了"+wanTotalMoney+"万,"+conclusion+"要不你也来玩《钱进吧！体育》试试吧："+location.href,bgUrl);
		});
	}

    //弹框事件集合
	function _handle(){
		$("#help").bind("click",function(){
			_overlay(true);
			$("#pop_help").show();
		});
		$("#help_botton").bind("click",function(){
			$("#pop_help").hide();
			_overlay(false);	
		});
		$("#phone").bind("click",function(){
			_overlay(true);
			$("#pop_phone").show();
		})
		$("#pop_phone .close").bind("click",function(){
			$("#pop_phone").hide();
			_overlay(false);	
		});
	}

	//适应屏幕
	function _bgAdjustScreen() {
		var screenHeight = $(window).height(),
		    bgHeight = $("div.bg").height(),
		    popHeigth = $("div.pop").height();    
		if(screenHeight>1080){
			screenHeight = 1080;
		}else if(screenHeight<700){
			screenHeight=700;
			$("body").css({"overflow":"auto"});
		}
		var bgMarginTop = (screenHeight-bgHeight)/2,
			popTop = (screenHeight-popHeigth)/2;
		$("div.bg").css({"margin-top":bgMarginTop+"px"});
		$("div.pop").css({"top":popTop+"px"});
	}

	function sharethis(type,url,title,newsPicture,description){  
		var type = type || '163',
			url = url || window.location.href,
			title = title || document.title,
			newsPicture = newsPicture || '',
			description = description || '';
		if(newsPicture != ''){
			if(description == ''){
				description = '<img src="'+newsPicture+'">';
			}else{
				description = '<img src="'+newsPicture+'">'+description;
			}
		}else{
			description = title;
		}
		var siteConf = {
			"auto":"网易汽车",
			"bbs":"网易论坛",
			"blog":"网易博客",
			"book":"网易读书",
			"daxue":"网易校园",
			"digi":"网易数码",
			"edu":"网易教育",
			"ent":"网易娱乐",
			"game":"网易游戏",
			"gongyi":"网易公益",
			"house":"网易房产",
			"jiu":"网易酒香",
			"lady":"网易女人",
			"love":"网易花田",
			"m":"网易应用",
			"media":"网易传媒",
			"mobile":"网易手机",
			"money":"网易财经",
			"news":"网易新闻",
			"nie":"网易游戏助手",
			"sports":"网易体育",
			"t":"网易微博",
			"tech":"网易科技",
			"travel":"网易旅游",
			"v":"网易视频"
		}
		var splitHost = location.host.split(".");
		var sitekey = splitHost[splitHost.length-3];
		var source = siteConf[sitekey] || '网易';
		var charset = 'utf-8';
		switch(type){
			case "163":
				url='http://t.163.com/article/user/checkLogin.do?link=http://'+ location.host+'/&source='+ encodeURIComponent(source) + '&info='+ encodeURIComponent(title)+' '+url + '&images=' + newsPicture + '&togImg=true';
			break;
			case "lofter":
				url='http://www.lofter.com/sharetext/?from=163&title='+encodeURIComponent(title)+'&source='+encodeURIComponent(source)+'&sourceUrl='+url+'&charset='+charset+'&content='+encodeURIComponent(description);
			break;
			case "sina":
				url="http://service.weibo.com/share/share.php?title=" + encodeURIComponent(title)+'&url='+url + '&pic=' + newsPicture;
			break;
			case "rr":
				url='http://widget.renren.com/dialog/share?resourceUrl=' + encodeURIComponent(url + '#sns_renren') + '&title=' +encodeURIComponent(title)+ '&images=' + newsPicture;
			break;
			case "ydCloud":
				url='http://note.youdao.com/memory/?url=' + url + '&title=' + encodeURIComponent(title) + '&images='+newsPicture+'&summary=&product='+encodeURIComponent(source);
			break;
			case "qqZone":
				url='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(url) + '#sns_qqZone&title=' + encodeURIComponent(title)+'&pics='+newsPicture;
			break;
			case "yx":
				url='http://news.163.com/special/yixin-share/?title='+encodeURIComponent(title)+'&desc='+encodeURIComponent(title)+'&image='+newsPicture+'&url='+url+'?from=yixin&source='+encodeURIComponent(source);
			break;
			default:
			break;
		}
		window.open(url);
	}

	//初始化
    function _init(){	
    	$("#money").html(_moneyDom(totalMoney));//初始化金钱
     	_handle();
    	_ballXY();
    	$("#help").trigger("click");
    	_bgAdjustScreen();
		$(window).resize(_bgAdjustScreen);
    }
    	
   _init();

})(jQuery);