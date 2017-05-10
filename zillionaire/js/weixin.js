function getCookie(sKey) {
	return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function userLogin(){
	var user_iframe = "<iframe style='display: none' id='loginIframe' name='login'></iframe>";
	$("body").append(user_iframe);
	user_iframe = $("#loginIframe")[0];
	var UserLogin = {
		_getUserinfo : function(){
			user_iframe = $("#loginIframe")[0];
			user_iframe.src="userinfo://"
		},
		_login : function(){
			user_iframe = $("#loginIframe")[0];
			user_iframe.src="login://"
		},
		_check : function(){
			if(getCookie("NTES_SESS")!=""){
				user_iframe = $("#loginIframe")[0];
				user_iframe.src="login://";
			};
			if(getCookie("P_OINFO")!=""){
				user_iframe = $("#loginIframe")[0];
				user_iframe.src="login://";
			};
		},
		_main : function(){
				var login_flag = 0;
				var __userinfo = {
					isLogin : false,
					loginType : "",
					name : "",
					nickname : "",
					head : ""
				};

				function setUserinfo(rs){
					if(rs){
						__userinfo.isLogin = true;
						__userinfo.loginType = rs.loginType;
						__userinfo.name = rs.name;
						__userinfo.nickname = rs.nickname;
						__userinfo.head = rs.head;
					}
					return __userinfo
				}
				window.__newsapp_userinfo_done = function(rs){
					if(rs){
						var rs = setUserinfo(rs);
						typeof __logincallback=="function"&&__logincallback(rs);
				  	}else{
				  		typeof __logincallback=="function"&&__logincallback({isLogin:false});
				  	}
				}
				window.__newsapp_login_done = function(rs){
					if(rs&&login_flag==0){
						var rs = setUserinfo(rs);
						typeof __logincallback=="function"&&__logincallback(rs);
						login_flag=1;
				  	}
				}
				window.onload = function(){
					setTimeout(function(){
						if((/NewsApp/ig).test(navigator.userAgent)){
							user_iframe.src="userinfo://"
						}else if(getCookie("P_INFO")){
							var P_INFO = getCookie('P_INFO'),
				            P_INFO = P_INFO && P_INFO.split('|');
				            if(P_INFO[2]==1||P_INFO[2]==0){
				            	var userinfo = {
									isLogin : true,
									loginType : "netease",
									name : P_INFO[0],
									nickname : "小易",
									head : ""
								}
								typeof __logincallback=="function"&&__logincallback(userinfo)
				            }
						}else if(typeof userinfo !== "undefined"){
							typeof __logincallback=="function"&&__logincallback(userinfo)
						}
					},500);
				}
		}
	};
	UserLogin._main();
}

function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

function initWeixinShare(){
	//分享
	$("#__newsapp_sharewxurl").html(window.location.href);
	var WeiXinConfig = {
		"imgUrl": $("#__newsapp_sharewxthumburl").text(),
		"link": $("#__newsapp_sharewxurl").text(),
		"desc": $("#__newsapp_sharewxtext").text(),
		"title": $("#__newsapp_sharewxtitle").text()
	};
	WeixinApi.ready(function(Api) {
		// 微信分享的数据
		var wxData = WeiXinConfig;
		// 分享的回调
		var wxCallbacks = {
			// 收藏操作不执行回调，默认是开启(true)的
			favorite: false,
			async: true,
			// 分享操作开始之前
			ready: function() {
			},
			// 分享被用户自动取消
			cancel: function(resp) {
				// 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
			},
			// 分享失败了
			fail: function(resp) {
				// 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
			},
			// 分享成功
			confirm: function(resp) {
				// 分享成功了，我们是不是可以做一些分享统计呢？
				window.shareSuccess();
			},
			// 整个分享过程结束
			all: function(resp, shareTo) {
				// 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
			}
		};
		// 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
		Api.shareToFriend(wxData, wxCallbacks);
		// 点击分享到朋友圈，会执行下面这个代码
		Api.shareToTimeline(wxData, wxCallbacks);
		// 点击分享到腾讯微博，会执行下面这个代码
		Api.shareToWeibo(wxData, wxCallbacks);
		// iOS上，可以直接调用这个API进行分享，一句话搞定
		Api.generalShare(wxData, wxCallbacks);
	});
}

function shareWX(){
	//if(isWeiXin()){
	if(true){
		initWeixinShare();
		$("[href='share://']").on("click",function(){
			if($(".sharewx").length === 0){
				$("body").append("<div class='sharewx'></div>");
			}
			$(".sharewx").show();
			return false;
		});
		$(document).on("click",".sharewx",function(){
			$(".sharewx").hide();
		})
	}

}

function main(){
	userLogin();
	shareWX();
}
main();