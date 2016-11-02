    var spanArr = []; //地图中的span
	var sign = [];    //记录span是否属于蛇体
	var speArr = [];  //蛇体的span
	var direction = [[0, -1], [-1, 0], [0, 1], [1, 0]];//左，上，右，下方向数组
	var speed = 200;  //定时器速度
    var dnum = 0;     //按方向键
	var flag = false;
	var timeHandle = null; //定时器
	var length = 0;
	document.onkeydown = function(evt) {	// 按键监听	
	    evt.preventDefault(); 
		if (evt.which === 32) { // 空格暂停
			pause();
			return;
		}		
		var keyNum = evt.which - 37;
		if (keyNum < 0 || keyNum > 4) return; //监听左上右下（37、38、39、40）
		if (Math.abs(dnum - keyNum) !== 2){
			dnum = keyNum;                       
		}	
	}	
    function init(){
	    var mainBox = document.getElementById("mainBox");
        for(var i=0;i<30*30;i++){	 
          var tagSpan = document.createElement("span");
		  tagSpan.className = "span0";
          mainBox.appendChild(tagSpan);		  
		  spanArr.push(tagSpan);		  
		  sign[i] = false;		  
		}			    
	    var a, row, col;
		while(true) {
			a = parseInt(Math.random() * 600);
			row = Math.floor(a / 30) + 1;
			col = a - (row - 1) * 30 + 1;
			if (Math.abs(row - 1) < 5 || Math.abs(row - 30) < 5 || Math.abs(col - 1) < 5 || Math.abs(col - 30) < 5) continue;
            break;  
		}
	    dnum = Math.floor(Math.random() * 4);	// 左上右下
		var middleR = row + direction[dnum][0];
		var middleC = col + direction[dnum][1];
		var frontR = row + direction[dnum][0]+direction[dnum][0];
		var frontC = col + direction[dnum][1]+direction[dnum][1];
		var ma = (middleR - 1) * 30 + middleC - 1;
		var fa = (frontR - 1) * 30 + frontC - 1;
		spanArr[a].className = spanArr[ma].className = spanArr[fa].className = "span1";
		sign[a] = sign[ma] = sign[fa] = true;	
		speArr.push(fa,ma, a);
		createFood();
        timeHandle = window.setInterval(function() {move()},speed);		
        pause();		
	}
	
	function move(){
	    var firstIndex = speArr[0];	
		var row = Math.floor(firstIndex / 30) + 1;
		var col = firstIndex - (row - 1) * 30 + 1;
		var frontR = row + direction[dnum][0];
		var frontC = col + direction[dnum][1];
	    if (frontR < 1 || frontR > 30 || frontC < 1 || frontC > 30) {
			clearInterval(timeHandle);			
			alert("呵呵,撞墙了！成绩为"+document.getElementById("grade").innerHTML+"分");
			return;
			}
		switch (dnum){ 
			case 0 : firstIndex -= 1;break; 
			case 1 : firstIndex -= 30;break;            
			case 2 : firstIndex += 1;break; 			
			case 3 : firstIndex += 30; break; 
		} 	
		if(spanArr[firstIndex].className == "span1"){
		    if(sign[firstIndex] === true){		
               clearInterval(timeHandle);			
			   alert("呵呵，撞到自己了！成绩为"+document.getElementById("grade").innerHTML+"分");
			   return;
			}else{
			   sign[firstIndex] = true;	
			   speArr.unshift(firstIndex);
			   var grade = document.getElementById("grade").innerHTML;
			   document.getElementById("grade").innerHTML =  parseInt(grade)+1;
			   createFood();
			}
		}else{
			var lastIndex = speArr.pop();		
			sign[lastIndex] = false;
			spanArr[lastIndex].className = "span0";
			speArr.unshift(firstIndex);
			sign[firstIndex] = true;
			spanArr[firstIndex].className = "span1";
        }		
	}	
	function createFood(){
	    while(true) {
			var food = parseInt(Math.random() * 600);
			if (sign[food] === true) continue;			
			spanArr[food].className = "span1";
            break;  
		}
	}

    function pause() {
		if (flag == false) {
			flag = true;
			clearInterval(timeHandle);
		}
		else{
			flag = false;
			timeHandle = window.setInterval(function() {move()}, speed);
		}
	}
	
	init();