/*! videojs-openedu - v0.0.1 - 2015-10-17
* Copyright (c) 2015 Richard Wendel; Licensed Apache-2.0 */
/*! videojs-openEDU - v0.0.0 - 2015-10-1
 * Copyright (c) 2015 rgw3d
 * Licensed under the Apache-2.0 license. */
(function(window, document, videojs) {
  'use strict';
  var player;
  var settings;
  var nextBreakpoint;

  var onTimeUpdate  = function(){
    var currentTime = this.currentTime();
    console.log(currentTime);
    if(nextBreakpoint === undefined){
      nextBreakpoint = getNextBreakpoint(settings.breakpoints);
    }

    if(nextBreakpoint && currentTime > nextBreakpoint.breakpoint){
      onBreakpoint(nextBreakpoint);
      nextBreakpoint = getNextBreakpoint(settings.breakpoints);
    }

  };

  var onBreakpoint = function(breakpoint){
    onPause(breakpoint);
    var parentDiv = createEl('div',{'class':'vjs-openEDU'});
    createBreakpointContent(breakpoint.fields, parentDiv);
    defineSubmitBehavior(function(){
      onPlay(parentDiv);
    });
  };

  var defineSubmitBehavior = function(callback){
    $('#form').submit(function(event) {
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        // work on this later, process it someway
        /*var formData = {
            'name'              : $('input[name=name]').val(),
            'email'             : $('input[name=email]').val(),
            'superheroAlias'    : $('input[name=superheroAlias]').val()
        };
        */


        /*
        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'process.php', // the url where we want to POST//TODO
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })
            .done(function(data) {// using the done promise callback

                // log data to the console so we can see
                console.log(data); 
                
                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        */
        event.preventDefault();
        callback();
    });
  };

  /**
   * elements is an array
   * context is the dom conext
   * both are required 
   */
  var createBreakpointContent = function(elements, context){
    elements.forEach(function(tag){
      var el = createEl(tag.tag, tag.attr, context);
      if(typeof tag.content === 'object'){ //there are internal tags
        createBreakpointContent(tag.content, el);
      }
      else{ //there are not internal tags 
        el.innerHTML = tag.content;
      }
    });
    
  };

  var onPause = function(breakpoint){
    player.pause();
    player.getChild('controlBar').hide();
    breakpoint.resolved = true;
  };

  var onPlay = function(parentDiv){
    player.play();
    player.getChild('controlBar').show();
    player.el().removeChild(parentDiv);
  };
 
  var initBreakpoints = function(breakpoints){
    breakpoints.forEach(function(breakpoint){
      breakpoint.resolved = false;
    });
  };

  var getNextBreakpoint = function(breakpoints){
    for(var i = 0; i<breakpoints.length; i++){
      if(!breakpoints[i].resolved){
        return breakpoints[i];
      }
    }
    return null;
  };

  /**
   * Pass the tag - String
   * attributes to add to the tag in the form of an object
   * the parent to attatch the tag to (opitonal)
   *
   */
  var createEl  = function(tagName, attributes, base){
    var el = document.createElement(tagName);

    var parentEl = base || player.el();
    parentEl.appendChild(el);
    
    Object.getOwnPropertyNames(attributes).forEach(function(attrName){
      if(attrName !== 'length' && attributes[attrName] !== '0'){//would set length="0" 
        el.setAttribute(attrName, attributes[attrName]);
      }
    });
    
    return el;
  };


  /**
   * Initialize the plugin.
   * 'this' will be the video player when this method is called
   * @param options (optional) {object} configuration for the plugin
   */
  var openEDU = function(options) {
    settings = JSON.parse(options);
    player = this;
    //var settings = videojs.util.mergeOptions(testSettings, options);
    initBreakpoints(settings.breakpoints);
    player.on('timeupdate', onTimeUpdate);
  };

  videojs.plugin('openEDU', openEDU); // register the plugin

})(window, document, window.videojs);
