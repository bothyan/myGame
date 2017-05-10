/* function isPC() {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
	var bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os';
	var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
	var bIsUc = sUserAgent.match(/ucweb/i) == 'web';
	var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
	var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';

	if (bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
		return false;
	} else {
		return true;
	}
} */

function isPC() {

	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

/**
* 如果移动设备是高分屏及以下的设备，则进行相应的缩放 
**/
if(parseFloat(window.devicePixelRatio) < 2.0 && !isPC()){
	//alert("haha")
	var viewport = document.getElementById('viewport');
	viewport.content = "width=" + window.innerWidth;
	document.documentElement.style.zoom = window.innerWidth/640;
//	$('html').css({zoom: window.innerWidth/640});
//	alert(new Date() + window.devicePixelRatio + '--' + window.innerWidth);
}
