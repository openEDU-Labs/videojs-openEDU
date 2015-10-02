/*! videojs-openEDU - v0.0.0 - 2015-10-1
 * Copyright (c) 2015 rgw3d
 * Licensed under the Apache-2.0 license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      openEDU;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  openEDU = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;

    window.alert("wow");
  };

  // register the plugin
  videojs.plugin('openEDU', openEDU);
})(window, window.videojs);
