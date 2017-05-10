/**
 * h5share_fixed.js
 *
 * 1.0.1
 *
 * 2015-05-12
 *
 * Fixed by MapleRecall.
 *
 * 也不知道是谁写的这个之前会发生jQuery和Zepto冲突的问题，而且初始化后不再次能修改分享内容……
 * 没有源文件只能凑合着改了，现在看起来是已经解决了这两个问题，jQuery可以和Zepto一起使用了，然后h5share.init()也可以重复调用了~
 *
 * **/
! function(e, n) {
	var t = n || {
			each: function(e, n) {
				for (var t = 0; t < e.length; t++) n(t, e[t])
			},
			map: function(e, n) {
				for (var t = 0; t < e.length; t++) e[t] = n(e[t], t)
			}
		},
		o = function(e, n) {
			var o = {};
			return t.each(("" + e).match(/([^=&#\?]+)=[^&#]+/g) || [], function(e, n) {
				var t = n.split("="),
					r = decodeURIComponent(t[1]);
				void 0 !== o[t[0]] ? o[t[0]] += "," + r : o[t[0]] = r
			}), n ? o[n] || "" : o
		},
		r = {
			getUrlPara: function(n) {
				var t = e.location.search.replace(/^\?/g, ""),
					r = t;
				try {
					r = decodeURI(t)
				} catch (i) {
					r = t.replace(/"%26"/g, "&")
				}
				return o(r, n)
			},
			removeUrlPara: function(e, n) {
				var o = e.split("#"),
					r = o[0].split("?"),
					i = r[0],
					a = r.length > 1 ? r[1] : "",
					c = o.length > 1 ? "#" + o[1] : "",
					p = "string" == typeof n && n ? [n] : n.join ? n : [];
				return p.length && a ? (t.map(p, function(e) {
					return e.replace(/([\\\(\)\{\}\[\]\^\$\+\-\*\?\|])/g, "\\$1")
				}), (i + "?" + a.replace(new RegExp("(?:^|&)(?:" + p.join("|") + ")=[^&$]+", "g"), "").replace(/^&/, "")).replace(/\?$/, "") + c) : i.replace(/\?.+$/, "") + c
			},
			format: function(e) {
				var n = /\{([\w\.]+)\}/g,
					t = /^\d+$/,
					o = n.compile ? n.compile(n.source, "g") || n : n,
					r = Object.prototype.toString,
					i = Array.prototype.slice;
				return function(n, a) {
					if (a === e || null === a) return n;
					var c = !0,
						p = r.call(a),
						l = "[object Object]" === p ? (c = !1, a) : "[object Array]" === p ? a : i.call(arguments, 1),
						u = c ? l.length : 0;
					return String(n).replace(o, function(n, o) {
						var r, i, a, p = t.test(o);
						if (p && c) return r = parseInt(o, 10), u > r ? l[r] : n;
						i = o.split("."), a = l;
						for (var d = 0; d < i.length; d++) a = a[i[d]];
						return a === e ? n : a
					})
				}
			}()
		};
	n ? (n.extend(n, r), n.extend(e.AppCore ? AppCore.helper : {}, r)) : e.AppCoreTools = r
}(window, window.Zepto||window.jQuery),
function(e) {
	var n = function(e, n) {
			var t = document.getElementsByTagName("head")[0] || document.documentElement || document.body,
				o = document.createElement("script");
			o.type = "text/javascript", o.charset = "UTF-8";
			var r = !1;
			o.onload = o.onreadystatechange = function() {
				r || this.readyState && !{
					loaded: 1,
					complete: 1
				}[this.readyState] || (r = !0, o.onload = o.onreadystatechange = null, this.parentNode.removeChild(this), n && n(), t = o = null)
			}, o.src = e, t.appendChild(o, t.lastChild)
		},
		t = function() {
			AppCore.helper.loadTextCss("@media screen and (min-width:240px){#wapShareWrap a{font-size:9px}}@media screen and (min-width:320px){#wapShareWrap a{font-size:12px}}@media screen and (min-width:380px){#wapShareWrap a{font-size:14px}}@media screen and (min-width:420px){#wapShareWrap a{font-size:16px}}@media screen and (min-width:450px){#wapShareWrap a{font-size:18px}}@media screen and (min-width:480px){#wapShareWrap a{font-size:18px}}@media screen and (min-width:540px){#wapShareWrap a{font-size:20.25px}}@media screen and (min-width:600px){#wapShareWrap a{font-size:22px}}@media screen and (min-width:640px){#wapShareWrap a{font-size:24px}}")
		},
		o = "http://pimg1.126.net/mail/AppCore/min/";
	document.addEventListener("DOMContentLoaded", function() {
		return window.AppCore ? void t() : void window.setTimeout(function() {
			if (e) n(o + "share.js?k35", t);
			else {
				var r = window.$;
				n(o + "h5.zepto.js?v3", function() {
					r && (window.$ = r), e = window.Zepto, n(o + "share.js?k35", t)
				})
			}
		}, 10)
	}, !1);
	var r = {
		conf: {},
		fixNewsAppInfo: function(n) {
			var t = {};
			e.each("text photourl wxtitle wxtext wxurl wxthumburl".split(" "), function(n, o) {
				var r = e("#__newsapp_share" + o);
				r[0] && (t[o] = r.text(), r.remove())
			});
			var o = n || {};
			return o.title = o.title || t.wxtitle || "", o.desc = o.desc || t.wxtext || "", o.url = o.url || t.wxurl || "", o.img = o.img || t.wxthumburl || "", o
		},
		getConf: function() {
			var e = r.conf || {};
			return e.wxtitle = e.title, e.notice = window.__shareNotice, e
		},
		fireCallback: function() {
			(r.conf.callback || window.__shareCallback || function() {}).apply(this, arguments)
		},
		ready: function(e, n) {
			window.AppCore && r.__inited ? e() : window.AppCore ? window.setTimeout(function() {
				r.__inited ? e() : window.console && n && console.log(n)
			}, 50) : window.setTimeout(function() {
				r.ready(e, n)
			}, 50)
		}
	};
	window.h5Share = {
		init: function(e) {
			window.AppCore ? (r.conf = r.fixNewsAppInfo(e), r.getConf.initOnly = 1, AppCore.weixin.changeTitle = !1, AppCore.share(r.getConf, r.fireCallback), r.__inited = 1, h5Share.init = h5Share.init) : window.setTimeout(function() {
				h5Share.init(e)
			}, 50)
		},
		conf: function(e) {
			r.ready(function() {
				var n = e || {};
				for (var t in n) r.conf[t] = n[t] || r.conf[t];
				var o = AppCore.getAppName();
				({
					newsapp: 1
				})[o] && AppCore[o].updateShareInfo()
			}, "[h5Share] conf\u65b9\u6cd5\u9700\u8981\u5728init\u4e4b\u540e\u8c03\u7528")
		},
		share: function() {
			r.ready(function() {
				AppCore.shareNow()
			}, "[h5Share] share\u65b9\u6cd5\u9700\u8981\u5728init\u4e4b\u540e\u8c03\u7528")
		},
		confAndBind: function(e) {
			window.AppCore ? (AppCore.share(e, window.__shareCallback), this.__inited = 1) : window.setTimeout(function() {
				h5Share.confAndBind(e)
			}, 50)
		}
	}
}(window.Zepto||window.jQuery);