UpdateMgr = require('./libs/mgr/UpdateMgr');
ResizeMgr = require('./libs/mgr/ResizeMgr');
Utils = require('./libs/Utils');
Contents = require('./Contents');


# ------------------------------------
# メイン
# ------------------------------------
class Main
  
  # ------------------------------------
  # コンストラクタ
  # ------------------------------------
  constructor: ->
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    # app専用オブジェクト
    window.MY = {};
    
    # ユーティリティー
    window.MY.u = new Utils();
    
    # 画面更新管理
    window.MY.update = new UpdateMgr();
    
    # リサイズ管理
    window.MY.resize = new ResizeMgr();
    
    
    # このサイトについてのリンク押したら開く
    window.showAbout = @_showAbout;
    window.hideAbout = @_hideAbout;
    
    
    c = new Contents();
    c.init();
  
  
  # ------------------------------------
  # このサイトについてを表示
  # ------------------------------------
  _showAbout: =>
    
    $(".mainContent").css({
      display:"none"
    });
    
    $(".siteAbout").css({
      display:"block"
    });
    
    $("body").addClass("bodyAbout");
  
  
  # ------------------------------------
  # このサイトについてを非表示
  # ------------------------------------
  _hideAbout: =>
    
    $(".mainContent").css({
      display:"block"
    });
    
    $(".siteAbout").css({
      display:"none"
    });
    
    $("body").removeClass("bodyAbout");























$(window).ready(=>
  app = new Main();
  app.init();
);