$(function () {
    var maisur = new surface(document.getElementById("main"));
    var CARDHEIGHT = 90;
    var CARDWIDTH = 70;
    playAginUI = new layer({ x: 60, y: 215, width: 200, height: 50, baseColor: "rgba(255,255,255)", text: "再来一局", cls: ["startButton"] });
    function drawCardAndColor2Background(x, y, Gnumber) {
        var cardLayer = new layer({ x: x, y: y, width: 70, height: 90, cls: ['card'], text: "H" });
        maisur.addLayer(cardLayer);
        cardLayer.dom.Gnumber = Gnumber;
        return cardLayer;
    }
    function ran_Arr(oArr) {
        var temp_x; //临时交换数 
        var tArr = oArr.slice(0);//新数组,复制原数组
        var random_x;
        for (var i = oArr.length; i > 0; i--) {
            random_x = Math.floor(Math.random() * i); //   取得一个随机数
            temp_x = tArr[random_x];
            tArr[random_x] = tArr[i - 1];
            tArr[i - 1] = temp_x;
        }
        return tArr; //返回新数组
    }
    var arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
      var totalScore=8;
    var randArr = [];
    function createRandArr() {
        randArr = ran_Arr(arr);
    }
      var row=4;
    function drawAllCardAnd2writeNumber() {
        var y = 0;
        var count = 0;
        for (var i = 1; i < 5; i++) {
            drawCardAndColor2Background((i - 1) * 80 + 5, 96 * y + 3+80, randArr[count]);
        count++;
        if (i == 4 && y == 3) {
            break;
        }
        if (i == 4) {
            i = 0;
            y++;
        }

    }
}
function drawTimer(x, y) {
    var timer = new layer({ x: x, y: y, width: 100, height: 50, cls: ["timer"] });
    maisur.addLayer(timer);
    return timer.dom;
}
//drawHV();
var timerDOM;
function drawHideMask() {
    var hidenmask = new layer({ x: 0, y: 0, height: "100%", width: "100%", cls: ['hidenMask'] });
    maisur.addLayer(hidenmask);
    hidenmask.dom.style.display = "none";
    return hidenmask.dom;
}
var hm;
var LASTDOM;
var recard = true;
var c_num = 0;
function drawScroPad(x, y) {
    var sp = new layer({ x: x, y: y, width: 100, height: 50, cls: ["timer"] });
    maisur.addLayer(sp);
    return sp.dom;
}

function clacAdd() {
    c_num++;
    spDom.innerText = c_num;
				if(c_num>=totalScore){
				   window.clearInterval(st);
					 alert("恭喜")
     overUI.show();
     playAginUI.show();
				}
}
function init() {
    $('.card').remove();
    $(overUI.dom).remove();
    $(playAginUI.dom).remove();
    hm = null;
    LASTDOM = null;
    recard = true;
    c_num = 0;
    createRandArr();
    drawAllCardAnd2writeNumber();
    timerDOM = drawTimer(100, 10);
    var t = 60;
    st = setInterval(function () {
        timerDOM.innerText = t--;
        if (t < 0) {
            window.clearInterval(st);
            if (c_num < totalScore) {
                overUI.show();
                playAginUI.show();
            } else {
										  alert("恭喜")
                overUI.show();
                playAginUI.show();
            }
        }
    }, 1000);
    spDom = drawScroPad(200, 10);
    hm = drawHideMask();
    spDom.innerText = 0;
    var resetButton = new layer({ x: 10, y: 10, width: 100, height: 50, cls: ["timer"], text: "重新开始" });
    maisur.addLayer(resetButton);
    $(resetButton.dom).click(function () {
        window.clearInterval(st);
        init();
    });
    $(".card").click(function () {
        //document.body.style.backgroundColor = "red";
        (function (dom) {
            dom.classList.remove("resetflip");
            dom.classList.add("flip");
            dom.style.backgroundColor = "red";
            dom.innerText = dom.Gnumber;
            if (LASTDOM) {
                if (LASTDOM == dom) return false;
                //显示遮盖层防止快速点击
                hm.style.display = "block";
                (function (dLast) {
                    setTimeout(function () {
                        if (dLast.Gnumber) {
                            if (dLast.Gnumber == dom.Gnumber) {
                                dLast.style.display = "none";
                                dom.style.display = "none";
                                //加分
                                clacAdd();
                            }
                        }
                        dLast.classList.add("resetflip");
                        dLast.style.backgroundColor = "blue";
                        dLast.innerText = "H";
                        dom.classList.add("resetflip");
                        dom.style.backgroundColor = "blue";
                        dom.innerText = "H";
                        recard = true;
                        LASTDOM = null;
                        setTimeout(function () {
                            //继续游戏
                            hm.style.display = "none";
                        }, 700);
                    }, 1000);
                })(LASTDOM);
            } else {
                if (recard) {
                    LASTDOM = dom;
                } else {
                    LASTDOM = false;
                    recard = true;
                }
            }
        })(this);

    });
    maisur.addLayer(overUI);
    overUI.dom.style.display = "none";
    maisur.addLayer(playAginUI);
    playAginUI.dom.style.display = "none";
    $(playAginUI.dom).click(function () {
        overUI.hide();
        playAginUI.hide();
        init();
    });
}

var startUI = new layer({ x: 0, y: 0, width: "100%", height: "100%", baseColor: "rgba(0,0,0,0.5)" });
var overUI = new layer({ x: 0, y: 0, width: "100%", height: "100%", baseColor: "rgba(0,0,0,0.5)" });
maisur.addLayer(startUI);
var startButton = new layer({ x: 60, y: 215, width: 200, height: 50, baseColor: "rgba(0,0,0)", text: "开始", cls: ["startButton"] });
maisur.addLayer(startButton);
$(startButton.dom).click(function () {
    startUI.hide();
    startButton.hide();
    init();
});


});