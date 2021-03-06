

# ---------------------------------------------------
# 
# ---------------------------------------------------
class TweetMgr
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    
    @_data;
    
    
    @onComplete;
  
  
  
  # -----------------------------------------------
  # 取得開始
  # -----------------------------------------------
  get: =>
    
    $.getJSON("http://twitcher.steer.me/user_timeline/sonicjam_inc?key=27xt4rh3", @_eComplete);
  
  
  
  # -----------------------------------------------
  # イベント 取得完了
  # -----------------------------------------------
  _eComplete: (e) =>
    
    @_data = e;
    if @onComplete?
      @onComplete();
  
  
  
  # -----------------------------------------------
  # ランダムでツイート取得
  # -----------------------------------------------
  getTweet: =>
    
    o = MY.u.arrRand(@_data);
    return o;








module.exports = TweetMgr;