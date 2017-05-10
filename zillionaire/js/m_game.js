(function ($){
   
/*	function drag(obj){
		var disX = 0;
		var disY = 0;
		obj.onmousedown = function(ev){
			var ev = ev || window.event;
			disX = ev.clientX - obj.offsetLeft;
			disY = ev.clientY - obj.offsetTop;
			
			document.onmousemove = function(ev){
				var ev = ev || window.event;
				
				var L = ev.clientX - disX;
				var T = ev.clientY - disY;
				
				obj.style.left = L + 'px';
				obj.style.top = T + 'px';
				_scale($(obj),T);
			};
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		};
	}*/

	var num = null ; //记录踢球点数
    var step = 0; //记录现在的步伐
    var breakPoint = [6,8,11,16,22,24,28];//地图上拐点
    var totalMoney = sportGameData.initialMoney; //初始金钱
    var tagArr = [];
    var breakI = 1;
    var breakPointArr = [];
    var randomIndex = [];

    function _isNetEaseApp() {
		//return true;
		var ua = window.navigator.userAgent;//返回浏览器类型、版本、操作系统类型、浏览器引擎等信息。
		if(/netease_news/gi.test(ua) || /NewsApp/gi.test(ua)){
			return true;
		}
		return false;
	}

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
				moneyDom = moneyDom+"<span class='money0'></span>";
				break;
			case "1":	
				moneyDom = moneyDom+"<span class='money1'></span>";
				break;
			case "2":	
				moneyDom = moneyDom+"<span class='money2'></span>";
				break;
			case "3":	
				moneyDom = moneyDom+"<span class='money3'></span>";
				break;	
			case "4":	
				moneyDom = moneyDom+"<span class='money4'></span>";
				break;
			case "5":	
				moneyDom = moneyDom+"<span class='money5'></span>";
				break;
			case "6":	
				moneyDom = moneyDom+"<span class='money6'></span>";
				break;
			case "7":	
				moneyDom = moneyDom+"<span class='money7'></span>";
				break;
			case "8":	
				moneyDom = moneyDom+"<span class='money8'></span>";
				break;
			case "9":	
				moneyDom = moneyDom+"<span class='money9'></span>";
				break;
			case ",":	
				moneyDom = moneyDom+"<span class='money_comma'></span>";
				break;
			case "-":	
				moneyDom = moneyDom+"<span class='money_minus'></span>";
				break;
			case "+":	
				moneyDom = moneyDom+"<span class='money_add'></span>";
				break;						
			}
		} 
		return  moneyDom;
	}

	//GO！
	function _go(){
		$("#go").bind("click",_goClick);
	}	

	//按钮GO点击函数
	function _goClick(){
		$("#go").unbind("click",_goClick);
		//randomIndex=6;
		var inter = window.setInterval(function(){
		    randomIndex = Math.ceil(Math.random() * 6);
			$("#go_num").html("<span class='go"+randomIndex+"'></span>");
		},80)
		window.setTimeout(function(){
			clearInterval(inter);
			num = randomIndex;
			_callbackMoving(randomIndex); 
		},1200)	
	}

    //踢完球后小人走动,num:1-6随机数字
	function _callbackMoving(num){
		var $head = $("#head"),
			$gridUl = $("#grid");
		var stepPre = step;
		if(step+num>32){
			step = 32;
			num = 32-stepPre;
		}else{
			step = step+num;
		}
		var	$li = $gridUl.find("li").eq(step-1);
		breakPointArr = _specialPoint(stepPre,step,breakPoint);
		if(breakPointArr.length == 0){
			var x = parseInt($li.css("left"))+6;
			var y = parseInt($li.css("top"))+6;
			$("#step")[0].play();	
			$head.animate({
				left:x+"px",
				top:y+"px"					  					
				},{
				duration: 500*num, 
				complete: function(){
					$("#step")[0].pause();	
					if(step == 32){
						_gameover();
					}else{
						_stepMsg();
					}
				}
			});
		}else{
			breakPointArr.unshift(stepPre);
			breakPointArr.push(step);
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
		_walking(array[i-1],array[i],lastTag);
	}

	 //拐点行走动画 step1:起步位置,step2:终止位置,tag:是否是最后一次循环
	function _walking(step1,step2,tag){
		var $head = $("#head");
		if(step1 == step2){   
            breakPointArr = [];
            $("#step")[0].pause();
            _stepMsg(); 
            breakI = 1;
            return;
		}
		var num = step2-step1;
		var	$li = $("#grid").find("li").eq(step2-1);
		var x = parseInt($li.css("left"))+6;
		var y = parseInt($li.css("top"))+6;
		$("#step")[0].play();
		$head.animate({
			left:x+"px",
			top:y+"px"					  					
			},{
			duration: 500*num, 
			complete: function(){
				if(tag){
					if(step == 32){
						_gameover();
					} else{
						_stepMsg();  
					}
					$("#step")[0].pause();						     
		            breakPointArr = [];
		            breakI = 1;		            
		        }else{
		        	breakI++;	
		        	_animate(breakI,breakPointArr);
		        }
			}
		});
	}

	function _stepMsg(){
		var placeObj = sportGameData.place[step-1],
    	    stepsObj = {stepNum:num};
    	$.extend(placeObj, stepsObj); 
    	var $move_start = $("#move_start");
    	var move_start_template = $("#move_start_template").html();   
    	var ret = template("move_start_template", placeObj);
    	$("#gesture").hide();
    	$move_start.html(ret);
    	$move_start.fadeIn(300);
    	$move_start.find("li.option").bind("click",_optionClick);
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
		var $move_end = $("#move_end"),
			$move_start = $("#move_start");
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
		var move_end_template = $("#move_end_template").html();   
    	var ret = template("move_end_template", endingObj);
    	$move_end.html(ret);
    	$move_start.hide();
    	$move_end.show();
    	$move_end.find(".button").bind("click",function(){ 
    	    var moveStep = $(this).data('move');
    	    $move_end.fadeOut(300);
    		if(moveStep>0){
    			num = moveStep;
    			$("#go").unbind("click",_goClick);
    			_callbackMoving(moveStep);
    		}else{
    			$("#gesture").show();
    			$("#go").bind("click",_goClick);
    		}	   			
			if(income>0){
				totalMoney = totalMoney + income;
				income = _fmoney(income);
				$("#change_money").html("<span class='money_add'></span>"+_moneyDom(income)).addClass("change_an");
	            $m_money[0].play();	
	            window.setTimeout(function(){	
	            	$("#money").html(_moneyDom(totalMoney));
	            	$("#change_money").html("").removeClass("change_an");	
	            },1000);	
	        }
	        	       
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
		var conclusion='',bgUrl = "",tagDes= "",sharePic="";
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
        		sharePic = resultMoney[i].sharepicUrl;
        	}
        }
        var wanTotalMoney = totalMoney/10000;
        var endingObj = {sharePic:sharePic,conclusion:conclusion,bgUrl:bgUrl,tagDes:tagDes,tag:tag};
       // console.log(endingObj);
        var $game_end = $("#game_end");
    	var game_end_template = $("#game_end_template").html(); 
    	var ret = template("game_end_template", endingObj);
    	$game_end.html(ret);   
    	$("#money,.box,.gesture,.go,#head").hide();
    	$("img.dim").show();
    	$("#end_money").html(_moneyDom(totalMoney));
		$("img.end_img").animate({
			width:"397px",
			height:"384px",
			left:"121px",
			top:"0px"					  					
			},{
			duration: 500, 
			complete: function(){
				var $game_end = $("#game_end");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    			$game_end.fadeIn(300);
    			$("#end_money").fadeIn(300);
    			$("#game_over")[0].play();
    			$("#restart").bind("click",function(){
					window.location.reload();
				});
				$("#share").bind("click",function(){
					h5Share.init({
							title: "我赚了"+wanTotalMoney+"万,"+conclusion,
							desc: "原来我是个"+tag+","+tagDes,
							url: location.href,
							img:sharePic
						});
					h5Share.share();
				});
			}
		});  	
	}

	function _handle(){
		$("#start").bind("click", function(){
   			$(".light,.state,.logo_t").fadeOut(1000,function(){
   				$("img.logo").animate({
					width:"184px",
					height:"113px",
					left:"445px",
					top:"10px"					  					
   				},{
					duration: 2000, 
					complete: function(){
						$("#main_map").fadeIn(500);
					}
				});
   			});	
   		});	
	}

    function _init(){
    	$("#money").html(_moneyDom(totalMoney));//初始化金钱
    	$("#step")[0].pause();	
    	_go();
    	_handle();
   		//drag($("#head")[0]);	
    }
    	
   _init();

})(jQuery);