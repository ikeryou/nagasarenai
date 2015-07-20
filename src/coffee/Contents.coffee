DisplayTransform = require('./libs/display/DisplayTransform');
Animation = require('./libs/animation/Animation');
TweetMgr = require('./TweetMgr');


# ---------------------------------------------------
# コンテンツ
# ---------------------------------------------------
class Contents
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_tweet;
    @_con;
    @_anm;
    @_changeCnt = 0;
    
    
    
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    @_con = new DisplayTransform({
      id:"tweetText",
      height:"auto"
    });
    @_con.init();
    
    # つぶやきを取得
    @_tweet = new TweetMgr();
    @_tweet.onComplete = =>
      o = @_tweet.getTweet();
      @_con.elm().html("@"+o.user.screen_name+"<br>"+o.text);
      @_resize();
    ;
    @_tweet.get();
    
    # 画面回転時のイベント設定
    @_anm = new Animation();
    $(window).on("orientationchange", =>
      if @_changeCnt > 0
        @_anm.set({
          z:{from:@_anm.get("z"), to:@_anm.get("z") - 180},
          frame:31,
          delay:0,
          ease:"sineInOut"
        });
        @_anm.start();
      @_changeCnt++;
    );
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
  
  
  
  # -----------------------------------
  # resize
  # -----------------------------------
  _resize: (w, h) =>
    
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    
    @_con.width(w*0.8);
    @_con.x(w*0.5-@_con.width()*0.5);
    @_con.render();
    
    @_con.y(h*0.5-@_con.elm().height()*0.5);
    @_con.render();
  
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
  
    @_anm.update();
    @_con.rotate(0, 0, @_anm.get("z"));
    @_con.render();










module.exports = Contents;