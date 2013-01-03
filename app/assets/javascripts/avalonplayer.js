avalonPlayer = function(id, opts) {

  var instance = function(el) {
    var _opts = {};
    var _element = el;
    var _playerType;

    this.init = function(opts) {
      _opts = opts;
      if (_opts.flash && swfobject.hasFlashPlayerVersion("9")) {
        // Pulls in Engage
        _generateEngagePlayer();
        _playerType = "flash";
      } else if (_opts.hls) {
        _generateHTML5Player(opts);
        _playerType = "hls";
      } else if (_opts.flash && !swfobject.hasFlashPlayerVersion("9")) {
        _element.html('<p>Please install/update your Flash player</p>');
      }
      
      return this;
    }

    this.switchStream = function(opts) {
      _opts = opts;
      // Change source and reinitialize player based on _playerType
      if (_playerType == "flash") {
        Opencast.Player.doPause();
        Opencast.Player.setCurrentTime('00:00:00');
        Opencast.Player.setPlayhead(0);
 
        _setEngageStream(opts);
        Opencast.Initialize.initme();
      } else if (_playerType == "hls") {
        _generateHTML5Player(opts);
      }
      return this;
    }

    function _generateHTML5Player(opts) {
      _element.html('<' + opts.format + ' poster= "' + opts.poster + '" controls="controls" width="320" height="240">'
                  + '  <source src="' + _opts.hls + '"/><p>Your browser does not support our videos</p>'
                  + '</' + opts.format + '>');
    }

    function _setEngageStream(opts) {
      // Overrides to return custom values instead of URL Params
      var origGetURLParameterFn = $.getURLParameter;
      $.getURLParameter = function (name) { 
        if (name == "id") {
          return opts.mediaPackageId;
        } else if (name == "mediaUrl1") {
          return opts.flash;
        } else if (name == "mimetype1") {
          return opts.mimetype;
        } else { 
          return origGetURLParameterFn(name);
        }  
      }
    }

    // This whole thing is horrible, needs fixing
    function _generateEngagePlayer() {
      var styles = ["/engage/ui/css/player-multi-hybrid/player-multi-hybrid.css",
                    "/engage/ui/css/player-multi-hybrid/player-multi-hybrid-icons.css",
                    "/engage/ui/css/player/shared.css",
                    "/engage/ui/css/player/jquery.wysiwyg.css",
                    "/engage/ui/css/oc.segments.css",
                    "/engage/ui/css/player/watch.css",
                    "/assets/stylesheets/avalonplayer.css"];
      $.each(styles, function(i, val) {
        // Needs IE fix: document.createStyleSheet();
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', val) );
      });
      
      // Don't try this at home!
      _element.load("/video_player.htm", function(){ 
        var scripts = [ "/engage/ui/js/jquery/plugins/jquery.utils.js",
                        "/engage/ui/js/bridge/lib/FABridge.js",
                        "/engage/ui/js/bridge/Videodisplay.js",
                        "/engage/ui/js/jquery/plugins/jARIA.js",
                        "/engage/ui/js/jquery/plugins/jquery.cookie.js",
                        "/engage/ui/js/jquery/plugins/jquery.corners.js",
                        "/engage/ui/js/jquery/plugins/jquery.identicon5.js",
                        "/engage/ui/js/jquery/plugins/jquery.crypt.js",
                        "/engage/ui/js/player/init-watch.js",
                        "/engage/ui/js/player/player-multi-hybrid-scubber.js",
                        "/engage/ui/js/player/player-multi-hybrid.js",
                        "/engage/ui/js/player/ariaSpinbutton.js",
                        "/engage/ui/js/jquery/plugins/jquery.wysiwyg.js",
                        "/engage/ui/js/jquery/plugins/jquery.client.js",
                        "/engage/ui/js/jquery/plugins/jquery.sparkline.min.js",
                        "/engage/ui/js/engage-ui.js",
                        "/engage/ui/js/jquery/plugins/jquery.timers-1.2.js",
                        "/engage/ui/js/engage_plugins/plugin-controller.js",
                        "/engage/ui/js/engage_plugins/description.js",
                        "/engage/ui/js/engage_plugins/download.js",
                        "/engage/ui/js/engage_plugins/description-plugin.js",
                        "/engage/ui/js/engage_plugins/segments_ui.js",
                        "/engage/ui/js/engage_plugins/segments_ui-plugin.js",
                        "/engage/ui/js/engage_plugins/segments_ui_slider-plugin.js",
                        "/engage/ui/js/engage_plugins/segments.js",
                        "/engage/ui/js/engage_plugins/segments-plugin.js",
                        "/engage/ui/js/engage_plugins/segments_text.js",
                        "/engage/ui/js/engage_plugins/segments_text-plugin.js",
                        "/engage/ui/js/engage_plugins/series-plugin.js",
                        "/engage/ui/js/engage_plugins/series.js",
                        "/engage/ui/js/engage_plugins/logging.js",
                        "/engage/ui/js/player/player-multi-hybrid-initialize.js",
                        "/engage/ui/js/ext/trimpath.js",
                        "/engage/ui/js/player/watch.js",
                        "/engage/ui/js/player/player-multi-hybrid-flash.js" ];
        $.each(scripts, function(index, url){
          var script = document.createElement('script');
          script.src = url;
          _element.append(script);
        });

        _setEngageStream(_opts);
        Opencast.Initialize.initme();
        _cleanupEngage();
      });
    }

    function _cleanupEngage() {
      $("#oc_btn-description").parent().hide();
      $("#oc_btn-slidetext").parent().hide();
      $("#oc_btn-slides").parent().hide();
      
      $("#oc_btn-description").detach();
      $("#oc_btn-slidetext").detach();
      $("#oc_btn-slides").detach();
    }
  }
  var el = $(id);
  if (el) {
    return new instance(el).init(opts);
  } else {
    return null;
  }
};
