avalonPlayer = function(id, opts) {

  var instance = function(el) {
    var _opts = {};
    var _element = el;
    var _playerType;

    this.init = function(opts) {
      _opts = opts;
      if (_opts.flash && swfobject.hasFlashPlayerVersion("9")) {
        // Pulls in Engage, renders the first stream
        _generateEngagePlayer(_opts.flash[0]);
        _playerType = "flash";
      } else if (_opts.hls) {
        _generateHTML5Player(_opts.hls[0]);
        _playerType = "hls";
        _generateQualitySelector();
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
 
        _setEngageStream(_opts.flash[0]);
        Opencast.Initialize.initme();
      } else if (_playerType == "hls") {
        _generateHTML5Player(_opts.hls[0]);
        _generateQualitySelector();
      }
      return this;
    }

    function _generateHTML5Player(stream) {
      _element.html('<' + stream.format + ' poster= "' + _opts.poster + '" controls="controls" width="320" height="240">'
                  + '  <source src="' + stream.hls + '"/><p>Your browser does not support our videos</p>'
                  + '</' + stream.format + '>');
    }

    function _setEngageStream(stream) {
      // Overrides to return custom values instead of URL Params
      var origGetURLParameterFn = $.getURLParameter;
      $.getURLParameter = function (name) { 
        if (name == "id") {
          return _opts.mediaPackageId;
        } else if (name == "mediaUrl1") {
          return stream.url;
        } else if (name == "mimetype1") {
          return stream.mimetype;
        } else { 
          return origGetURLParameterFn(name);
        }  
      }
    }

    // This whole thing is horrible, needs fixing
    function _generateEngagePlayer(stream) {
      var styles = ["/engage/ui/css/player-multi-hybrid/player-multi-hybrid.css",
                    "/engage/ui/css/player-multi-hybrid/player-multi-hybrid-icons.css",
                    "/engage/ui/css/player/shared.css",
                    "/engage/ui/css/player/jquery.wysiwyg.css",
                    "/engage/ui/css/oc.segments.css",
                    "/engage/ui/css/player/watch.css",
                    "/assets/avalonplayer.css"];
      $.each(styles, function(i, val) {
        // Needs IE fix: document.createStyleSheet();
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', val) );
      });
      
      // Don't try this at home!
      _element.load("/video_player.htm", function(){ 
        $.getScript("https://github.com/headjs/headjs/raw/v0.99/dist/head.min.js", function() {
          head.js("/engage/ui/js/jquery/plugins/jquery.utils.js",
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
                  "/engage/ui/js/player/player-multi-hybrid-flash.js", 
                  function() { 
                    _setEngageStream(stream);
                    Opencast.Initialize.initme();
                    _cleanupEngage();
                    _generateQualitySelector();
                  }
          );
        });
      });
    }

    function _generateQualitySelector() {
      var selector = $('<select id="oc_quality"></select>');
      if ($("#oc_quality").length > 0) {
        selector = $("#oc_quality");
        selector.html("");
        selector.unbind();
      }
      if (_playerType == "flash") {
        _appendQualityOptions(_opts.flash, selector);
      } else if (_playerType == "hls") {
        _appendQualityOptions(_opts.hls, selector);
      }

      selector.change(function() {
        var newQual = $(this).val();
        // Repopulates player with the selected stream
        if (_playerType == "flash") {
          var streamInfo = _getStreamByQuality(_opts.flash, newQual);
          Opencast.Player.doPause();
          _setEngageStream(streamInfo);
          Opencast.Initialize.initme();
        } else if (_playerType == "hls") {
          var streamInfo = _getStreamByQuality(_opts.hls, newQual);
          _generateHTML5Player(streamInfo);
        }
      });

      _element.append(selector);
    }

    function _appendQualityOptions(streamArray, selector) {
      for (var i = 0; i < streamArray.length; i++) {
        var quality = streamArray[i].quality;
        var opt = $('<option/>').attr('value', quality).text(quality);
        selector.append(opt);
      }
    }

    // Gets a stream info hash of a specific quality
    function _getStreamByQuality(streamArray, quality) {
      for (var i = 0; i < streamArray.length; i++) {
        if (quality == streamArray[i].quality) {
          return streamArray[i];
        }
      }
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
