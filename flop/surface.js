/*
 依赖 jquery
*/
function percentNUMF(self,parent){
    return self/parent*100+"%";
}
function percentNUM(self, parent) {
    if (self == null) return self;
   
    if (self.substring) {
        //ld表达式
        if (self.charAt(0) == "L") {
            var funBody = self.slice(1).replace(/parent/g, parent);
            return (new Function("return" +funBody ))();
        }
    }
    if (self.substring && (self.slice(-1) == "%")) {
        return parent * (parseFloat(self) / 100);
       
    }
    return self;
}

function layer(setting) {
    var self = this;
    self.x = setting.x || 0;
    self.y = setting.y || 0;
    self.text = setting.text || "";
    self.html = setting.html || null;
    self.bottom = setting.bottom || null;
    self.right = setting.right || null;
    self.width = setting.width || null;
    self.height = setting.height || null;
    self.baseColor = setting.baseColor || "none";
    /*创建dom*/
    self.dom = document.createElement(setting.elem || "div");
    if (!setting.elem) {
        self.dom.innerHTML = setting.html || "";
        if (setting.text) {
            $(self.dom).text(setting.text);
        }
        if (setting.html) {
            $(self.dom).html(setting.html);
        }
       
        
       
    }
    self.dom.getLayer = function () { return self;};
    self.dom.config = setting.config || {};
    self.dom.src = setting.imgsrc || false;
    self.cls = setting.cls || [];
    $(self.dom).addClass("layer");
    self.events = {};
    self.domEvents = {};
    self.addEventListener = function (type, fn) {
        if (self.events[type]) {

        } else {
            self.events[type] = [];
        }
        self.events[type].push(fn);
    };
    self.fireEventByType = function (type, args) {
        if (self.events[type]) {
            for (var i = 0; i < self.events[type].length; i++) {
                if (!$.isArray(args)) {
                    self.events[type][i].call(self, args);
                } else {
                    self.events[type][i].apply(self, args);
                }

            }
        }
    };
    self.addDOMEventListener = function (type, fn) {
        if (self.domEvents[type]) {

        } else {
            self.domEvents[type] = [];
        }
        self.domEvents[type].push(fn);
    };
    self.render = function () {      
        $selfDOM =$(self.dom);
        var sup = self.getSuper();
        //百分比转换
        var x = percentNUM(self.x, sup.width);
        var y = percentNUM(self.y, sup.height);
        var width = percentNUM(self.width, sup.width);
        var height = percentNUM(self.height, sup.height);
        var bottom = percentNUM(self.bottom, sup.height);
        var right = percentNUM(self.right, sup.width);

        var changeObj = { top: y + "px", left: x + "px", width: width + "px", height: height + "px", "background-color": self.baseColor };
        
        $selfDOM.css(changeObj);
      

        for (var i = 0; i < self.cls.length; i++) {
            $selfDOM.addClass(self.cls[i]);
        };
        //处理right 是x的反向引用 优先级高于y
        if (self.right !== null&&(!self.noRight)) {
            var left = sup.width - right - width;
            $(self.dom).css("left", left + "px");
        }
        //处理bottom bottom 是y的反向引用 优先级高于y
        if (self.bottom !== null && (!self.bottom)) {
            var top = sup.height - bottom - height;
            $selfDOM.css("top", top + "px");
        };
        self.lx = percentNUMF(x, sup.width);
        self.ly = percentNUMF(y, sup.height);
        self.lwidth = percentNUMF(width, sup.width);
        self.lheight = percentNUMF(height, sup.height);
        self.lbottom =percentNUMF(bottom, sup.height);
        self.lright = percentNUMF(right, sup.width);


        self.x = x; //percentNUMF(x, sup.width);
        self.y = y; //percentNUMF(y, sup.height);
        self.width = width; //percentNUMF(width, sup.width);
        self.height = height;//percentNUMF(height, sup.height);
        self.bottom = bottom;//percentNUMF(bottom, sup.height);
        self.right = right; //percentNUMF(right, sup.width);

       

    };
    self.hide = function () {
        $(self.dom).hide();
    };
    self.show = function () {
        $(self.dom).show();
    };
    self.setPosition = function (x, y) {
        self.x = x;
        self.y = y;
        self.render();
    };
    self.setWidAndHei = function (w, h) {
        self.width = w;
        self.height = h;
        self.render();
    };
    self.setBaseColor = function (baseColor) {
        self.baseColor = baseColor;
        self.render();
    };
    self.domHelper = function (fn) {
        fn(self.dom);
    };
    self.addCls = function (classname) {
        $(self.dom).addClass(classname);
    };
    self.removeCls = function (classname) {
        $(self.dom).removeClass(classname);
    };
    self.autosize = function () {
        var sup = self.getSuper();
        var $supdom = $(sup.dom);
        //百分比转换
        var x = percentNUM(self.lx, $supdom.width());
        var y = percentNUM(self.ly, $supdom.height());
        var width = percentNUM(self.lwidth, $supdom.width());
        var height = percentNUM(self.lheight, $supdom.height());
        var bottom = percentNUM(self.lbottom, $supdom.height());
        var right = percentNUM(self.lright, $supdom.width());

        var changeObj = { top: y + "px", left: x + "px", width: width + "px", height: height + "px", "background-color": self.baseColor };

        $(self.dom).css(changeObj);
    };    
}
function surface(elem) {
    this.layerIndex = 0;
    var self = this;
    this.dom = elem || document.createElement("div");
    var $dom = $(self.dom);
    $dom.addClass("surface");
    this.layers = [];
    this.height = $dom.height();
    this.width = $dom.width();
    this.layersEnterfame = function (age) {
        for (var i = 0; i < self.layers.length; i++) {
            if (!self.layers[i].pause) {
                self.layers[i].fireEventByType("enterframe", age);
            }
            
        }
    };
    this.layersAutoSise = function () {
        for (var i = 0; i < self.layers.length; i++) {
            if (!self.layers[i].pause) {
                self.layers[i].autosize();
            }

        }
    };
    this.addLayer = function (ly) {
        self.dom.appendChild(ly.dom);
        ly.getSuper = function () {
            return self;
        };
        ly.render();
        for (var i in ly.domEvents) {
            ly.dom["on" + i] = function (e) {
                for (var j = 0; j < ly.domEvents[i].length; j++) {
                    ly.domEvents[i][j].call(ly,e);
                }
            };
        }
        $(ly.dom).css("z-index",self.layerIndex++);
        self.layers.push(ly);

    };
    this.setup = function () {
        //自动格式化基于dom的layer
    };
    this.eachLayers = function (fn) {
        for (var i = 0; i < self.layers.length; i++) {
            fn(self.layers[i]);
        }
    };
    this.removeLayer = function (lay) {
        for (var i = 0; i < self.layers.length; i++) {
            if (self.layers[i] == lay) {
                self.layers[i] = null;
                break;
            }
        };
        var temp = self.layers.slice();
        self.layers.length = 0;
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] !== null) {
                self.layers.push(temp[i]);
            }
        }
    };
    this.removeAll = function () {
        $(self.dom).find('.layer').remove();
        self.layers.length = 0;
    };
}
function game(surface) {
    this.surface = surface;
    this.fps = 24;
    var self = this;
    self.pause = true;
    self.ontime = new Date();
    self.nowtime = 0;
    this.animate = function () {
        if (!self.pause) {
            self.nowtime = (new Date());
            surface.layersEnterfame(self.nowtime - self.ontime);
            setTimeout(self.animate, 1000 / self.fps);
        }

    }
    this.start = function () {
        self.pause = false;
        self.ontime = (new Date());
        setTimeout(self.animate);
    }
    this.end = function () {
        self.pause = true;
    };
}
surface.prototype.martixMap = function (layoutMartix, lmfObj, dpi) {
    var martixObj = {};
    var hasP=false;
    var _wdp, _hdp;
    if (dpi) {
        _wdp = dpi[0];
        _hdp = dpi[1];
    } else {
        _wdp = (100/layoutMartix[0].length);
        _hdp = (100/layoutMartix.length);
        hasP=true;
    }
    for (var y = 0; y < layoutMartix.length; y++) {
        var arr = layoutMartix[y];
        for (var x = 0; x < arr.length; x++) {
            if (!martixObj[arr[x]]) {
                martixObj[arr[x]] = { name: arr[x], xy: [] };
            }
            martixObj[arr[x]].xy.push({ x: x, y: y });
        }
    }
    var max_x = layoutMartix[0].length;
    var max_y = layoutMartix.length;
    for (var name in martixObj) {
        var arr = martixObj[name].xy;
        for (var i = 0; i < arr.length; i++) {
            var point = arr[i];
            var x = point.x;
            var y = point.y;
            var ly;
            if (hasP) {
                ly = new layer({ x: x * _wdp+"%", y: y * _wdp+"%", width: _wdp+"%", height: _hdp+"%" });
            } else {
                ly = new layer({ x: x * _wdp, y: y * _wdp, width: _wdp, height: _hdp });
            }
            this.addLayer(ly);
            if (lmfObj && lmfObj[name]) {
                lmfObj[name].call(ly);
            }
        }
    }
}
surface.prototype.martixLy = function (layoutMartix, lmfObj) {
    var martixObj = {};
    for (var y = 0; y < layoutMartix.length; y++) {
        var arr = layoutMartix[y];
        for (var x = 0; x < arr.length; x++) {
            if (!martixObj[arr[x]]) {
                martixObj[arr[x]] = { name: arr[x], xy: [] };
            }
            martixObj[arr[x]].xy.push({ x: x, y: y });
        }
    }
    var max_x = layoutMartix[0].length;
    var max_y = layoutMartix.length;
    for (var name in martixObj) {
        var arr = martixObj[name].xy;
        var start = arr[0];
        var end = arr.slice(-1)[0];
        if ((end.x >= start.x) && (end.y >= start.y)) {
            var x = (start.x / max_x) * 100 + "%";
            var y = (start.y / max_y) * 100 + "%";
            var width = ((end.x + 1 - start.x) / max_x) + 100 + "%";
            var height = ((end.y + 1 - start.y) / max_y) + 100 + "%";
            var t = new layer({ x: x, y: y, width: width, height: height });
            this.addLayer(t);
            if (lmfObj) {
                lmfObj[name]();
            }
        }
    }
}