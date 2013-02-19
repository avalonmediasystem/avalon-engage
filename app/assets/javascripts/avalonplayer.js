window.AvalonPlayer = {
    _opts: null,
    _element: null,
    _playerType: null,
    
    init: function(el, opts) {
      _opts = opts;
      _element = el;
      _playerType = null;
      
      if (_opts.flash && swfobject.hasFlashPlayerVersion("9")) {
        // Pulls in Engage, renders the first stream
        this.generateEngagePlayer(_opts.flash[0]);
        _playerType = "flash";
      } else if (_opts.hls) {
        var player = this.generateHTML5Player(_opts.hls[0]);
        _playerType = "hls";
        this.generateQualitySelector();
      } else if (_opts.flash && !swfobject.hasFlashPlayerVersion("9")) {
        _element.html('<p>Please install/update your Flash player</p>');
      }
      
      return this;
    },

    switchStream: function(opts) {
      _opts = opts;
      // Change source and reinitialize player based on _playerType
      if (_playerType == "flash") {
        Opencast.Player.doPause();
        Opencast.Player.setCurrentTime('00:00:00');
        Opencast.Player.setPlayhead(0);
 
        _setEngageStream(_opts.flash[0]);
        Opencast.Initialize.initme();
      } else if (_playerType == "hls") {
        generateHTML5Player(_opts.hls[0]);
        _generateQualitySelector();
      }
      return this;
    },

    /*
     * Assemble HTML snippets to create an HTML5 multimedia player. To change 
     * the appearance modify the segments at the end of the source file
     */
    generateHTML5Player: function(stream) {
      var container = $(AvalonPlayer.html5container);
      alert("HTML : " + AvalonPlayer.html5container);

      if ("audio" == stream.format) {
        var player = $(this.html5audioplayer);
        var source = $(this.html5audiosource).attr('src', stream.url);
        container.append(player).append(source);
      } else if ("video" == stream.format) {    
        var source = $(this.html5videosource).attr('src', stream.url);    
        var player = $(this.html5videoplayer).attr('poster', _opts.poster).append(source);
        container.append(player);
      } else {
        /* Do nothing */
      }
      container.append(this.unsupportedMessage);
      alert('Container : ' + container.html());
      
      return container.append(this.unsupportedMessage);
    },

    setEngageStream: function(stream) {
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
    },

    // This whole thing is horrible, needs fixing
    generateEngagePlayer: function(stream) {
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
                    AvalonPlayer.setEngageStream(stream);
                    Opencast.Initialize.initme();
                    AvalonPlayer.cleanupEngage();
                    AvalonPlayer.generateQualitySelector();
                    if (stream.format == "audio") {
                      $("#oc_flash-player").addClass("audio");
                    }
                  }
          );
        });
      });
    },

    generateQualitySelector: function() {      
      var selector = $('<select id="oc_quality"></select>');
      if ($("#oc_quality").length > 0) {
        selector = $("#oc_quality");
        selector.html("");
        selector.unbind();
      }
      if (_playerType == "flash") {
        this.appendQualityOptions(_opts.flash, selector);
      } else if (_playerType == "hls") {
        this.appendQualityOptions(_opts.hls, selector);
      }

      selector.change(function() {
        var newQual = $(this).val();
        // Repopulates player with the selected stream
        if (_playerType == "flash") {
          var streamInfo = getStreamByQuality(_opts.flash, newQual);
          Opencast.Player.doPause();
          this.setEngageStream(streamInfo);
          Opencast.Initialize.initme();
        } else if (_playerType == "hls") {
          var streamInfo = getStreamByQuality(_opts.hls, newQual);
          generateHTML5Player(streamInfo);
        }
      });

      _element.append(selector);
    },

    appendQualityOptions: function(streamArray, selector) {
      $.each(streamArray, function(index, stream) {
        var opt = $('<option/>').attr('value', stream.quality).text(stream.quality);
        selector.append(opt);
      });
    },

    // Gets a stream info hash of a specific quality
    getStreamByQuality: function(streamArray, quality) {
      for (var i = 0; i < streamArray.length; i++) {
        if (quality == streamArray[i].quality) {
          return streamArray[i];
        }
      }
    },

    cleanupEngage: function() {
      $("#oc_btn-description").parent().hide();
      $("#oc_btn-slidetext").parent().hide();
      $("#oc_btn-slides").parent().hide();
      
      $("#oc_btn-description").detach();
      $("#oc_btn-slidetext").detach();
      $("#oc_btn-slides").detach();
    },

    /*
     * Stubs for the audio and video players. Before placing in the page
     * it is suggested to switch out attributes like the poster image
     */
    html5container: '<div class="span8" id="html5_multimedia"></div>',
    html5videoplayer: "<video poster='placeholder.png' controls='controls' class='span8'></video>",
    html5videosource: "<source src='placeholder' type='video/mp4'>" ,

    html5audioplayer: "<audio controls='controls'></audio>",
    html5audiosource: "<source src='placeholder' type='audio/mp3'>",
  
    unsupportedMessage: "<p>Your browser does not appear to support HTML5 video or audio content.</p>"    
}

/**
 * TO DO : Put this into a proper loading block
$().ready(function() {
  container = $('
  if (container) {
  new AvalonPlayer.init(container, opts);
}
*/
