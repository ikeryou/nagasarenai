(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Animation, Contents, DisplayTransform, TweetMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DisplayTransform = require('./libs/display/DisplayTransform');

Animation = require('./libs/animation/Animation');

TweetMgr = require('./TweetMgr');

Contents = (function() {
  function Contents() {
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this.init = bind(this.init, this);
    this._tweet;
    this._con;
    this._anm;
    this._changeCnt = 0;
  }

  Contents.prototype.init = function() {
    this._con = new DisplayTransform({
      id: "tweetText",
      height: "auto"
    });
    this._con.init();
    this._tweet = new TweetMgr();
    this._tweet.onComplete = (function(_this) {
      return function() {
        var o;
        o = _this._tweet.getTweet();
        _this._con.elm().html("@" + o.user.screen_name + "<br>" + o.text);
        return _this._resize();
      };
    })(this);
    this._tweet.get();
    this._anm = new Animation();
    $(window).on("orientationchange", (function(_this) {
      return function() {
        if (_this._changeCnt > 0) {
          _this._anm.set({
            z: {
              from: _this._anm.get("z"),
              to: _this._anm.get("z") - 180
            },
            frame: 31,
            delay: 0,
            ease: "sineInOut"
          });
          _this._anm.start();
        }
        return _this._changeCnt++;
      };
    })(this));
    MY.resize.add(this._resize, true);
    return MY.update.add(this._update);
  };

  Contents.prototype._resize = function(w, h) {
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    this._con.width(w * 0.8);
    this._con.x(w * 0.5 - this._con.width() * 0.5);
    this._con.render();
    this._con.y(h * 0.5 - this._con.elm().height() * 0.5);
    return this._con.render();
  };

  Contents.prototype._update = function() {
    this._anm.update();
    this._con.rotate(0, 0, this._anm.get("z"));
    return this._con.render();
  };

  return Contents;

})();

module.exports = Contents;


},{"./TweetMgr":3,"./libs/animation/Animation":5,"./libs/display/DisplayTransform":8}],2:[function(require,module,exports){
var Contents, Main, ResizeMgr, UpdateMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateMgr = require('./libs/mgr/UpdateMgr');

ResizeMgr = require('./libs/mgr/ResizeMgr');

Utils = require('./libs/Utils');

Contents = require('./Contents');

Main = (function() {
  function Main() {
    this._hideAbout = bind(this._hideAbout, this);
    this._showAbout = bind(this._showAbout, this);
    this.init = bind(this.init, this);
  }

  Main.prototype.init = function() {
    var c;
    window.MY = {};
    window.MY.u = new Utils();
    window.MY.update = new UpdateMgr();
    window.MY.resize = new ResizeMgr();
    window.showAbout = this._showAbout;
    window.hideAbout = this._hideAbout;
    c = new Contents();
    return c.init();
  };

  Main.prototype._showAbout = function() {
    $(".mainContent").css({
      display: "none"
    });
    $(".siteAbout").css({
      display: "block"
    });
    return $("body").addClass("bodyAbout");
  };

  Main.prototype._hideAbout = function() {
    $(".mainContent").css({
      display: "block"
    });
    $(".siteAbout").css({
      display: "none"
    });
    return $("body").removeClass("bodyAbout");
  };

  return Main;

})();

$(window).ready((function(_this) {
  return function() {
    var app;
    app = new Main();
    return app.init();
  };
})(this));


},{"./Contents":1,"./libs/Utils":4,"./libs/mgr/ResizeMgr":10,"./libs/mgr/UpdateMgr":11}],3:[function(require,module,exports){
var TweetMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TweetMgr = (function() {
  function TweetMgr() {
    this.getTweet = bind(this.getTweet, this);
    this._eComplete = bind(this._eComplete, this);
    this.get = bind(this.get, this);
    this._data;
    this.onComplete;
  }

  TweetMgr.prototype.get = function() {
    return $.getJSON("http://twitcher.steer.me/user_timeline/sonicjam_inc?key=27xt4rh3", this._eComplete);
  };

  TweetMgr.prototype._eComplete = function(e) {
    this._data = e;
    if (this.onComplete != null) {
      return this.onComplete();
    }
  };

  TweetMgr.prototype.getTweet = function() {
    var o;
    o = MY.u.arrRand(this._data);
    return o;
  };

  return TweetMgr;

})();

module.exports = TweetMgr;


},{}],4:[function(require,module,exports){
var Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = (function() {
  function Utils() {
    this.price = bind(this.price, this);
    this.getHexColor = bind(this.getHexColor, this);
    this.scrollTop = bind(this.scrollTop, this);
    this.windowHeight = bind(this.windowHeight, this);
    this.numStr = bind(this.numStr, this);
    this._A = Math.PI / 180;
  }

  Utils.prototype.random = function(min, max) {
    if (min < 0) {
      min--;
    }
    return ~~(Math.random() * ((max + 1) - min) + min);
  };

  Utils.prototype.hit = function(range) {
    return this.random(0, range - 1) === 0;
  };

  Utils.prototype.range = function(val) {
    return this.random(-val, val);
  };

  Utils.prototype.arrRand = function(arr) {
    return arr[this.random(0, arr.length - 1)];
  };

  Utils.prototype.map = function(num, resMin, resMax, baseMin, baseMax) {
    var p;
    if (num < baseMin) {
      return resMin;
    }
    if (num > baseMax) {
      return resMax;
    }
    p = (resMax - resMin) / (baseMax - baseMin);
    return ((num - baseMin) * p) + resMin;
  };

  Utils.prototype.radian = function(degree) {
    return degree * this._A;
  };

  Utils.prototype.degree = function(radian) {
    return radian / this._A;
  };

  Utils.prototype.decimal = function(num, n) {
    var i, pos;
    num = String(num);
    pos = num.indexOf(".");
    if (n === 0) {
      return num.split(".")[0];
    }
    if (pos === -1) {
      num += ".";
      i = 0;
      while (i < n) {
        num += "0";
        i++;
      }
      return num;
    }
    num = num.substr(0, pos) + num.substr(pos, n + 1);
    return num;
  };

  Utils.prototype.floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  Utils.prototype.strReverse = function(str) {
    var i, len, res;
    res = "";
    len = str.length;
    i = 1;
    while (i <= len) {
      res += str.substr(-i, 1);
      i++;
    }
    return res;
  };

  Utils.prototype.shuffle = function(arr) {
    var i, j, k, results;
    i = arr.length;
    results = [];
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      if (i === j) {
        continue;
      }
      k = arr[i];
      arr[i] = arr[j];
      results.push(arr[j] = k);
    }
    return results;
  };

  Utils.prototype.sliceNull = function(arr) {
    var i, l, len1, newArr, val;
    newArr = [];
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  Utils.prototype.replaceAll = function(val, org, dest) {
    return val.split(org).join(dest);
  };

  Utils.prototype.sort = function(arr, para, desc) {
    if (desc === void 0) {
      desc = false;
    }
    if (desc) {
      return arr.sort(function(a, b) {
        return b[para] - a[para];
      });
    } else {
      return arr.sort(function(a, b) {
        return a[para] - b[para];
      });
    }
  };

  Utils.prototype.unique = function() {
    return new Date().getTime();
  };

  Utils.prototype.numStr = function(num, keta) {
    var i, len, str;
    str = String(num);
    if (str.length >= keta) {
      return str;
    }
    len = keta - str.length;
    i = 0;
    while (i < len) {
      str = "0" + str;
      i++;
    }
    return str;
  };

  Utils.prototype.buttonMode = function(flg) {
    if (flg) {
      return $("body").css("cursor", "pointer");
    } else {
      return $("body").css("cursor", "default");
    }
  };

  Utils.prototype.getQuery = function(key) {
    var qs, regex;
    key = key.replace(/[€[]/, "€€€[").replace(/[€]]/, "€€€]");
    regex = new RegExp("[€€?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return "";
    } else {
      return qs[1];
    }
  };

  Utils.prototype.hash = function() {
    return location.hash.replace("#", "");
  };

  Utils.prototype.isSmt = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
  };

  Utils.prototype.isAndroid = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('BlackBerry') > 0 || u.indexOf('Android') > 0 || u.indexOf('Windows Phone') > 0;
  };

  Utils.prototype.isIos = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  };

  Utils.prototype.isPs3 = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PLAYSTATION 3') > 0;
  };

  Utils.prototype.isVita = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PlayStation Vita') > 0;
  };

  Utils.prototype.isIe8Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 8 && msie !== 0;
  };

  Utils.prototype.isIe9Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 9 && msie !== 0;
  };

  Utils.prototype.isIe = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') !== -1 || ua.indexOf('trident/7') !== -1;
  };

  Utils.prototype.isIpad = function() {
    return navigator.userAgent.indexOf('iPad') > 0;
  };

  Utils.prototype.isTablet = function() {
    return this.isIpad() || (this.isAndroid() && navigator.userAgent.indexOf('Mobile') === -1);
  };

  Utils.prototype.isWin = function() {
    return navigator.platform.indexOf("Win") !== -1;
  };

  Utils.prototype.isChrome = function() {
    return navigator.userAgent.indexOf('Chrome') > 0;
  };

  Utils.prototype.isFF = function() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  };

  Utils.prototype.isIOSUiView = function() {
    var a;
    a = window.navigator.userAgent.toLowerCase();
    return (this.isIos() && a.indexOf('safari') === -1) || (this.isIos() && a.indexOf('crios') > 0) || (this.isIos() && a.indexOf('gsa') > 0);
  };

  Utils.prototype.getCookie = function(key) {
    var a, arr, i, l, len1, val;
    if (document.cookie === void 0 || document.cookie === null) {
      return null;
    }
    arr = document.cookie.split("; ");
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      a = val.split("=");
      if (a[0] === key) {
        return a[1];
      }
    }
    return null;
  };

  Utils.prototype.setCookie = function(key, val) {
    return document.cookie = key + "=" + val;
  };

  Utils.prototype.windowHeight = function() {
    return $(document).height();
  };

  Utils.prototype.scrollTop = function() {
    return Math.max($(window).scrollTop(), $(document).scrollTop());
  };

  Utils.prototype.getHexColor = function(r, g, b) {
    var str;
    str = (r << 16 | g << 8 | b).toString(16);
    return "#" + new Array(7 - str.length).join("0") + str;
  };

  Utils.prototype.price = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  return Utils;

})();

module.exports = Utils;


},{}],5:[function(require,module,exports){
var Animation, Easing,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Easing = require('./Easing');

Animation = (function() {
  function Animation() {
    this.to = bind(this.to, this);
    this.get = bind(this.get, this);
    this.rate = bind(this.rate, this);
    this.update = bind(this.update, this);
    this.isCompleted = bind(this.isCompleted, this);
    this.isSet = bind(this.isSet, this);
    this.isComplete = bind(this.isComplete, this);
    this.isStart = bind(this.isStart, this);
    this.start = bind(this.start, this);
    this.set = bind(this.set, this);
    this.reset = bind(this.reset, this);
    this.dispose = bind(this.dispose, this);
    this._init = bind(this._init, this);
    this._cnt = 0;
    this._delay = 0;
    this._frame = 0;
    this._param;
    this._onStart;
    this._onComplete;
    this._isUpdate = false;
    this._isStart = false;
    this._isComplete = false;
    this._isSet = false;
    this._isCompleted = false;
    this._init();
  }

  Animation.prototype._init = function() {};

  Animation.prototype.dispose = function() {
    return this.reset();
  };

  Animation.prototype.reset = function() {
    this._isUpdate = false;
    this._isStart = false;
    this._isComplete = false;
    this._isSet = false;
    this._isCompleted = false;
    this._param = null;
    this._onStart = null;
    return this._onComplete = null;
  };

  Animation.prototype.set = function(param) {
    var key, results, val;
    this.reset();
    if (param.ease == null) {
      param.ease = "linear";
    }
    this._isSet = true;
    this._cnt = 0;
    this._delay = param.delay == null ? 0 : param.delay;
    this._frame = param.frame == null ? 0 : param.frame;
    this._onStart = param.onStart;
    this._onComplete = param.onComplete;
    this._param = {};
    results = [];
    for (key in param) {
      val = param[key];
      if (key !== "delay" && key !== "frame" && key !== "onStart" && key !== "onComplete" && key !== "ease") {
        val.val = val.from;
        val.easing = new Easing();
        val.easeMethod = val.easing[param.ease];
        val.easeSpeed = 1 / this._frame;
        results.push(this._param[key] = val);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Animation.prototype.start = function() {
    return this._isUpdate = true;
  };

  Animation.prototype.isStart = function() {
    return this._isStart;
  };

  Animation.prototype.isComplete = function() {
    return this._isComplete;
  };

  Animation.prototype.isSet = function() {
    return this._isSet;
  };

  Animation.prototype.isCompleted = function() {
    return this._isCompleted;
  };

  Animation.prototype.update = function() {
    var key, rate, ref, val;
    if (!this._isUpdate) {
      return;
    }
    if (!this._isComplete && ++this._cnt > this._delay) {
      if (!this._isStart) {
        if (this._onStart != null) {
          this._onStart();
        }
        this._isStart = true;
      }
      ref = this._param;
      for (key in ref) {
        val = ref[key];
        val.easing.val += val.easeSpeed;
        val.easing.val = this._floor(val.easing.val, 0, 1);
        val.easing.t = val.easing.val;
        rate = val.easing.val >= 1 ? 1 : val.easeMethod();
        val.val = (val.from * (1 - rate)) + (val.to * rate);
        if (rate >= 1) {
          this._isComplete = true;
        }
      }
      if (this._isComplete) {
        if (this._onComplete != null) {
          return this._onComplete();
        }
      }
    }
  };

  Animation.prototype.rate = function(r) {
    var key, rate, ref, results, val;
    r = this._floor(r, 0, 1);
    ref = this._param;
    results = [];
    for (key in ref) {
      val = ref[key];
      val.easing.val = r;
      val.easing.t = val.easing.val;
      rate = val.easing.val >= 1 ? 1 : val.easeMethod();
      results.push(val.val = (val.from * (1 - rate)) + (val.to * rate));
    }
    return results;
  };

  Animation.prototype.get = function(key) {
    if (this._isComplete) {
      this._isCompleted = true;
    }
    if ((this._param != null) && (this._param[key] != null)) {
      return this._param[key].val;
    } else {
      return 0;
    }
  };

  Animation.prototype.to = function(key) {
    if ((this._param != null) && (this._param[key] != null)) {
      return this._param[key].to;
    } else {
      return null;
    }
  };

  Animation.prototype._floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  return Animation;

})();

module.exports = Animation;


},{"./Easing":6}],6:[function(require,module,exports){
var Easing,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Easing = (function() {
  function Easing() {
    this.bounceOut = bind(this.bounceOut, this);
    this.elasticOut = bind(this.elasticOut, this);
    this.circInOut = bind(this.circInOut, this);
    this.circOut = bind(this.circOut, this);
    this.circIn = bind(this.circIn, this);
    this.expoInOut = bind(this.expoInOut, this);
    this.expoOut = bind(this.expoOut, this);
    this.expoIn = bind(this.expoIn, this);
    this.sineInOut = bind(this.sineInOut, this);
    this.sineOut = bind(this.sineOut, this);
    this.sineIn = bind(this.sineIn, this);
    this.quintInOut = bind(this.quintInOut, this);
    this.quintOut = bind(this.quintOut, this);
    this.quintIn = bind(this.quintIn, this);
    this.quartInOut = bind(this.quartInOut, this);
    this.quartOut = bind(this.quartOut, this);
    this.quartIn = bind(this.quartIn, this);
    this.cubicInOut = bind(this.cubicInOut, this);
    this.cubicOut = bind(this.cubicOut, this);
    this.cubicIn = bind(this.cubicIn, this);
    this.quadInOut = bind(this.quadInOut, this);
    this.quadOut = bind(this.quadOut, this);
    this.quadIn = bind(this.quadIn, this);
    this.linear = bind(this.linear, this);
    this.reset = bind(this.reset, this);
    this.dispose = bind(this.dispose, this);
    this._init = bind(this._init, this);
    this.t = 0;
    this.b = 0;
    this.c = 1;
    this.d = 1;
    this.s = 1.70158;
    this.p = 0;
    this.a = this.c;
    this.val = 0;
    this._init();
  }

  Easing.prototype._init = function() {};

  Easing.prototype.dispose = function() {};

  Easing.prototype.reset = function() {
    this.t = 0;
    this.val = 0;
    this.s = 1.70158;
    this.p = 0;
    return this.a = this.c;
  };

  Easing.prototype.linear = function() {
    return this.c * this.t / this.d + this.b;
  };

  Easing.prototype.quadIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t + this.b;
  };

  Easing.prototype.quadOut = function() {
    this.t /= this.d;
    return -this.c * this.t * (this.t - 2) + this.b;
  };

  Easing.prototype.quadInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t + this.b;
    }
    this.t--;
    return -this.c / 2 * (this.t * (this.t - 2) - 1) + this.b;
  };

  Easing.prototype.cubicIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.cubicOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * (this.t * this.t * this.t + 1) + this.b;
  };

  Easing.prototype.cubicInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t * this.t + this.b;
    }
    this.t -= 2;
    return this.c / 2 * (this.t * this.t * this.t + 2) + this.b;
  };

  Easing.prototype.quartIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.quartOut = function() {
    this.t /= this.d;
    this.t--;
    return -this.c * (this.t * this.t * this.t * this.t - 1) + this.b;
  };

  Easing.prototype.quartInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t * this.t * this.t + this.b;
    }
    this.t -= 2;
    return -this.c / 2 * (this.t * this.t * this.t * this.t - 2) + this.b;
  };

  Easing.prototype.quintIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.quintOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * (this.t * this.t * this.t * this.t * this.t + 1) + this.b;
  };

  Easing.prototype.quintInOut = function() {
    this.t /= this.d / 2.0;
    if (this.t < 1) {
      return this.c / 2.0 * this.t * this.t * this.t * this.t * this.t + this.b;
    }
    this.t = this.t - 2;
    return this.c / 2.0 * (this.t * this.t * this.t * this.t * this.t + 2) + this.b;
  };

  Easing.prototype.sineIn = function() {
    return -this.c * Math.cos(this.t / this.d * (Math.PI / 2)) + this.c + this.b;
  };

  Easing.prototype.sineOut = function() {
    return this.c * Math.sin(this.t / this.d * (Math.PI / 2)) + this.b;
  };

  Easing.prototype.sineInOut = function() {
    return -this.c / 2 * (Math.cos(Math.PI * this.t / this.d) - 1) + this.b;
  };

  Easing.prototype.expoIn = function() {
    return this.c * Math.pow(2, 10 * (this.t / this.d - 1)) + this.b;
  };

  Easing.prototype.expoOut = function() {
    return this.c * (-Math.pow(2, -10 * this.t / this.d) + 1) + this.b;
  };

  Easing.prototype.expoInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * Math.pow(2, 10 * (this.t - 1)) + this.b;
    }
    this.t--;
    return this.c / 2 * (-Math.pow(2, -10 * this.t) + 2) + this.b;
  };

  Easing.prototype.circIn = function() {
    this.t /= this.d;
    return -this.c * (Math.sqrt(1 - this.t * this.t) - 1) + this.b;
  };

  Easing.prototype.circOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * Math.sqrt(1 - this.t * this.t) + this.b;
  };

  Easing.prototype.circInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return -this.c / 2 * (Math.sqrt(1 - this.t * this.t) - 1) + this.b;
    }
    this.t -= 2;
    return this.c / 2 * (Math.sqrt(1 - this.t * this.t) + 1) + this.b;
  };

  Easing.prototype.elasticOut = function() {
    if (this.t === 0) {
      return this.b;
    }
    if ((this.t /= this.d) === 1) {
      return this.b + this.c;
    }
    if (!this.p) {
      this.p = this.d * 0.3;
    }
    if (this.a < Math.abs(this.c)) {
      this.a = this.c;
      this.s = this.p / 4;
    } else {
      this.s = this.p / (2 * Math.PI) * Math.asin(this.c / this.a);
    }
    return this.a * Math.pow(2, -10 * this.t) * Math.sin((this.t * this.d - this.s) * (2 * Math.PI) / this.p) + this.c + this.b;
  };

  Easing.prototype.bounceOut = function() {
    if ((this.t /= this.d) < (1 / 2.75)) {
      return this.c * (7.5625 * this.t * this.t) + this.b;
    }
    if (this.t < (2 / 2.75)) {
      return this.c * (7.5625 * (this.t -= 1.5 / 2.75) * this.t + 0.75) + this.b;
    }
    if (this.t < (2.5 / 2.75)) {
      return this.c * (7.5625 * (this.t -= 2.25 / 2.75) * this.t + 0.9375) + this.b;
    } else {
      return this.c * (7.5625 * (this.t -= 2.625 / 2.75) * this.t + 0.984375) + this.b;
    }
  };

  return Easing;

})();

module.exports = Easing;


},{}],7:[function(require,module,exports){
var Display,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {
  function Display(option) {
    this.elm = bind(this.elm, this);
    this.id = bind(this.id, this);
    this.dispose = bind(this.dispose, this);
    this._isUpdateCss = bind(this._isUpdateCss, this);
    this.css = bind(this.css, this);
    this.visible = bind(this.visible, this);
    this.mask = bind(this.mask, this);
    this.opacity = bind(this.opacity, this);
    this.bgColor = bind(this.bgColor, this);
    this.right = bind(this.right, this);
    this.bottom = bind(this.bottom, this);
    this.y = bind(this.y, this);
    this.x = bind(this.x, this);
    this.xy = bind(this.xy, this);
    this.height = bind(this.height, this);
    this.width = bind(this.width, this);
    this.size = bind(this.size, this);
    this.render = bind(this.render, this);
    this.add = bind(this.add, this);
    this.init = bind(this.init, this);
    this._option = option || {};
    this._id = this._option.id || "";
    this._elm;
    this._css = {
      position: this._option.position || "absolute",
      top: 0,
      left: 0,
      width: this._option.width || 0,
      height: this._option.height || 0
    };
    this._oldCss = {};
  }

  Display.prototype.init = function() {
    if (window.MY_DISPLAY_ID == null) {
      window.MY_DISPLAY_ID = 0;
    }
    if (this._id === "") {
      this._id = "display" + String(window.MY_DISPLAY_ID++);
    }
    if ($("#" + this._id).length > 0) {
      this._elm = $("#" + this._id);
    } else {
      $("body").append("<div id='" + this._id + "'></div>");
      this._elm = $("#" + this._id);
    }
    return this.render();
  };

  Display.prototype.add = function(display) {
    return display.elm().appendTo("#" + this.id());
  };

  Display.prototype.render = function() {
    var key, ref, results, value;
    if (this._isUpdateCss()) {
      this._elm.css(this._css);
    }
    ref = this._css;
    results = [];
    for (key in ref) {
      value = ref[key];
      results.push(this._oldCss[key] = value);
    }
    return results;
  };

  Display.prototype.size = function(width, height) {
    this._css.width = width;
    return this._css.height = height;
  };

  Display.prototype.width = function(width) {
    if (width != null) {
      return this._css.width = width;
    } else {
      return this._css.width;
    }
  };

  Display.prototype.height = function(height) {
    if (height != null) {
      return this._css.height = height;
    } else {
      return this._css.height;
    }
  };

  Display.prototype.xy = function(x, y) {
    this._css.top = y;
    return this._css.left = x;
  };

  Display.prototype.x = function(x) {
    if (x != null) {
      return this._css.left = x;
    } else {
      return this._css.left;
    }
  };

  Display.prototype.y = function(y) {
    if (y != null) {
      return this._css.top = y;
    } else {
      return this._css.top;
    }
  };

  Display.prototype.bottom = function() {
    return this.y() + this.height();
  };

  Display.prototype.right = function() {
    return this.x() + this.width();
  };

  Display.prototype.bgColor = function(color) {
    if (color != null) {
      return this._css.backgroundColor = color;
    } else {
      return this._css.backgroundColor;
    }
  };

  Display.prototype.opacity = function(val) {
    if (val != null) {
      return this._css.opacity = val;
    } else {
      return this._css.opacity;
    }
  };

  Display.prototype.mask = function(val) {
    return this._css.overflow = val ? "hidden" : "visible";
  };

  Display.prototype.visible = function(bool) {
    if (bool) {
      return this._css.display = "block";
    } else {
      return this._css.display = "none";
    }
  };

  Display.prototype.css = function() {
    return this._css;
  };

  Display.prototype._isUpdateCss = function() {
    var key, ref, value;
    ref = this._css;
    for (key in ref) {
      value = ref[key];
      if (value !== this._oldCss[key]) {
        return true;
      }
    }
    return false;
  };

  Display.prototype.dispose = function() {
    var i, len;
    if ((this._elm != null) && this._elm.length > 0) {
      i = 0;
      len = this._elm.queue().length;
      while (i < len) {
        this._elm.stop();
        i++;
      }
    }
    if (this._elm != null) {
      this._elm.off();
      if ((this._option.isRemove == null) || this._option.isRemove) {
        this._elm.remove();
      } else {
        this._elm.removeAttr('style');
      }
      this._elm = null;
    }
    this._css = null;
    this._option = null;
    return this._oldCss = null;
  };

  Display.prototype.id = function() {
    return this._id;
  };

  Display.prototype.elm = function() {
    return this._elm;
  };

  return Display;

})();

module.exports = Display;


},{}],8:[function(require,module,exports){
var Display, DisplayTransform,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Display = require('./Display');

DisplayTransform = (function(superClass) {
  extend(DisplayTransform, superClass);

  function DisplayTransform(option) {
    this._isUpdateTransform = bind(this._isUpdateTransform, this);
    this.perspective = bind(this.perspective, this);
    this.pivot = bind(this.pivot, this);
    this.render = bind(this.render, this);
    this.rotate = bind(this.rotate, this);
    this.scale = bind(this.scale, this);
    this.translate = bind(this.translate, this);
    this.dispose = bind(this.dispose, this);
    this.init = bind(this.init, this);
    DisplayTransform.__super__.constructor.call(this, option);
    this._transform = {
      dx: 0,
      dy: 0,
      dz: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotX: 0,
      rotY: 0,
      rotZ: 0
    };
    this._oldTransform = {};
  }

  DisplayTransform.prototype.init = function() {
    DisplayTransform.__super__.init.call(this);
    return this.perspective();
  };

  DisplayTransform.prototype.dispose = function() {
    this._oldTransform = null;
    this._transform = null;
    return DisplayTransform.__super__.dispose.call(this);
  };

  DisplayTransform.prototype.translate = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      this._transform.dx = x;
      this._transform.dy = y;
      return this._transform.dz = z;
    }
  };

  DisplayTransform.prototype.scale = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 1;
      y = y || 1;
      z = z || 1;
      this._transform.scaleX = x;
      this._transform.scaleY = y;
      return this._transform.scaleZ = z;
    }
  };

  DisplayTransform.prototype.rotate = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      this._transform.rotX = x;
      this._transform.rotY = y;
      return this._transform.rotZ = z;
    }
  };

  DisplayTransform.prototype.render = function() {
    var key, ref, results, value;
    DisplayTransform.__super__.render.call(this);
    if (this._isUpdateTransform()) {
      this._elm.css(this._getVendorCss("transform", this._translate3d(this._transform.dx, this._transform.dy, this._transform.dz) + " " + this._rotateX(this._transform.rotX) + " " + this._rotateY(this._transform.rotY) + " " + this._rotateZ(this._transform.rotZ) + " " + this._scale3d(this._transform.scaleX, this._transform.scaleY, this._transform.scaleZ)));
    }
    ref = this._transform;
    results = [];
    for (key in ref) {
      value = ref[key];
      results.push(this._oldTransform[key] = value);
    }
    return results;
  };

  DisplayTransform.prototype.pivot = function(val) {
    val = val || "50% 50%";
    return this.elm().css(this._getVendorCss("transform-origin", val));
  };

  DisplayTransform.prototype.perspective = function(val) {
    val = val || 1500;
    return this.elm().css(this._getVendorCss("transform-style", "preserve-3d")).css(this._getVendorCss("perspective", val));
  };

  DisplayTransform.prototype._isUpdateTransform = function() {
    var key, ref, value;
    ref = this._transform;
    for (key in ref) {
      value = ref[key];
      if (value !== this._oldTransform[key]) {
        return true;
      }
    }
    return false;
  };

  DisplayTransform.prototype._getVendorCss = function(prop, val) {
    var res;
    res = {};
    res["-webkit-" + prop] = val;
    res["-o-" + prop] = val;
    res["-khtml-" + prop] = val;
    res["-ms-" + prop] = val;
    res[prop] = val;
    return res;
  };

  DisplayTransform.prototype._translate3d = function(x, y, z) {
    y = y || 0;
    z = z || 0;
    return 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
  };

  DisplayTransform.prototype._rotateX = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(1,0,0,' + val + 'deg)';
  };

  DisplayTransform.prototype._rotateY = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(0,1,0,' + val + 'deg)';
  };

  DisplayTransform.prototype._rotateZ = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(0,0,1,' + val + 'deg)';
  };

  DisplayTransform.prototype._scale3d = function(x, y, z) {
    if (x === void 0) {
      x = 1;
    }
    if (y === void 0) {
      y = 1;
    }
    if (z === void 0) {
      z = 1;
    }
    return 'scale3d(' + x + ',' + y + ',' + z + ')';
  };

  return DisplayTransform;

})(Display);

module.exports = DisplayTransform;


},{"./Display":7}],9:[function(require,module,exports){
var BaseMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../Utils');

BaseMgr = (function() {
  function BaseMgr() {
    this._init = bind(this._init, this);
    this._u = new Utils();
  }

  BaseMgr.prototype._init = function() {};

  return BaseMgr;

})();

module.exports = BaseMgr;


},{"../Utils":4}],10:[function(require,module,exports){
var BaseMgr, ResizeMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

ResizeMgr = (function(superClass) {
  extend(ResizeMgr, superClass);

  function ResizeMgr() {
    this.sh = bind(this.sh, this);
    this.sw = bind(this.sw, this);
    this._setStageSize = bind(this._setStageSize, this);
    this._eResize = bind(this._eResize, this);
    this.refresh = bind(this.refresh, this);
    this._init = bind(this._init, this);
    ResizeMgr.__super__.constructor.call(this);
    this._resizeList = [];
    this.ws = {
      w: 0,
      h: 0,
      oldW: -1,
      oldH: -1
    };
    this._init();
  }

  ResizeMgr.prototype._init = function() {
    ResizeMgr.__super__._init.call(this);
    $(window).bind("resize", this._eResize);
    return this._setStageSize();
  };

  ResizeMgr.prototype.add = function(func, isCall) {
    this._resizeList.push(func);
    if ((isCall != null) && isCall) {
      return func(this.ws.w, this.ws.h);
    }
  };

  ResizeMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._resizeList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._resizeList = arr;
  };

  ResizeMgr.prototype.refresh = function() {
    return this._eResize();
  };

  ResizeMgr.prototype._eResize = function(e) {
    var i, j, len, ref, results, val;
    this._setStageSize();
    ref = this._resizeList;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val(this.ws.w, this.ws.h));
    }
    return results;
  };

  ResizeMgr.prototype._setStageSize = function() {
    var h, w;
    if (this._u.isSmt()) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      if (this._u.isIe8Under()) {
        w = $(window).width();
        h = $(window).height();
      } else {
        w = $(window).width();
        h = window.innerHeight;
      }
    }
    this.ws.oldW = this.ws.w;
    this.ws.oldH = this.ws.h;
    this.ws.w = w;
    return this.ws.h = h;
  };

  ResizeMgr.prototype.sw = function() {
    return this.ws.w;
  };

  ResizeMgr.prototype.sh = function() {
    return this.ws.h;
  };

  return ResizeMgr;

})(BaseMgr);

module.exports = ResizeMgr;


},{"./BaseMgr":9}],11:[function(require,module,exports){
var BaseMgr, UpdateMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

UpdateMgr = (function(superClass) {
  extend(UpdateMgr, superClass);

  function UpdateMgr(isRAF) {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    UpdateMgr.__super__.constructor.call(this);
    this._isRAF = isRAF || true;
    this._updateList = [];
    this._init();
  }

  UpdateMgr.prototype._init = function() {
    UpdateMgr.__super__._init.call(this);
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    } else {
      return setInterval(this._update, 1000 / 60);
    }
  };

  UpdateMgr.prototype.add = function(func) {
    return this._updateList.push(func);
  };

  UpdateMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._updateList = arr;
  };

  UpdateMgr.prototype._update = function() {
    var i, j, len, ref, val;
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      val();
    }
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    }
  };

  return UpdateMgr;

})(BaseMgr);

module.exports = UpdateMgr;


},{"./BaseMgr":9}]},{},[2]);
