avalonPlayer = function(id, opts) {
  function Player(el) {
    var _opts = {};
    var _element = el;
    var _playerType;

    this.init = function(opts) {
      _opts = opts;
      $.each(_opts, function(index, val) {
        if (_opts.flash && swfobject.hasFlashPlayerVersion("9")) {
          _element.html("Here, have a Flesh vid!"); // Pulls in Engage
          _playerType = "Flash";
        } else if (_opts.hls && canPlayHlsH264()) {
          _element.html('<video><source src="' + _opts.hls + '"/></video>');
          _playerType = "HLS";
        } else {
          _element.html('Please install/update your Flash player');
        }
      });
      
      return this;
    }

    this.switchStream = function(opts) {
      // Change source and reinitialize player based on _playerType
      return this;
    }

    this.print = function() {
      console.log(_sources);
    }

    // Player helpers
    function canPlayHlsH264() {
      return (isiOS() || isSafariMac()); // Should also check for Android 4.0 here
    }

    var uaLC = navigator.userAgent.toLowerCase();
    function isiOS() {
      var isiPad = uaLC.indexOf('safari') > -1 && uaLC.indexOf('ipad') > -1;
      var isiPhone = uaLC.indexOf('safari') > -1 && (uaLC.indexOf('iphone') > -1 || uaLC.indexOf('itouch') > -1);
      return (isiPad || isiPhone);
    }

    function isSafariMac() {
      return uaLC.indexOf('safari') > -1 && uaLC.indexOf('mac') > -1;
    }
  } 

  var el = $(id);
  if (el) {
    return new Player(el).init(opts);
  } else {
    return null;
  }
};


