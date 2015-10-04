/*! videojs-openEDU - v0.0.0 - 2015-10-1
 * Copyright (c) 2015 rgw3d
 * Licensed under the Apache-2.0 license. */
(function(window, document, videojs) {
  'use strict';

  var defaults = {option: true};
  var player;
  
  /**
   * Sample JSON that would contain all of the information that we
   * would need such that we can generate all of the breakpoints that we need
   *
   * holds an array within the root object settings called breakpoints
   * this array will hold all of the breakpoints in order for us to call
   *
   * within the array entryies, there are objects, these objects will hold
   * a few data points: title, which is the title
   * breakpoint, which is the actual time index of the breakpoint.
   * and then it will hold the data for what fields will be present
   */ 
  
  var jsonTest = '{\
      "breakpoints":[\
        {\
          "breakpoint": 5,\
          "fields":[\
            {\
              "type":"title",\
              "title": "breakpoint 1 title"\
            },\
            {\
              "type": "question",\
              "questions": [\
              { "description": "question1 description",\
                "answers": [\
                  { "answer": "example answer 1"}, \
                  { "answer": "example answer 2"}, \
                  { "answer": "example answer 3"}  \
                ]                                  \
              },                                   \
              { "description": "question2 description",\
                "answers": [                       \
                  { "answer": "example answer 1"}, \
                  { "answer": "example answer 2"}, \
                  { "answer": "example answer 3"}  \
                ]                                  \
              }                                    \
            ]}                                     \
          ]                                        \
        },                                         \
        {                                          \
          "breakpoint": 9,                         \
          "fields":[                               \
            {                                      \
              "type":"title",                      \
              "title": "breakpoint 2 title"        \
            },                                     \
            {                                      \
              "type": "question",                  \
              "questions": [                       \
              {                                    \
                "description": "question1 description",\
                "answers": [                       \
                  { "answer": "example answer 1"}, \
                  { "answer": "example answer 2"}, \
                  { "answer": "example answer 3"}  \
                ]                                  \
              },                                   \
              { "description": "question2 description",\
                "answers": [                       \
                  { "answer": "example answer 1"}, \
                  { "answer": "example answer 2"}, \
                  { "answer": "example answer 3"}  \
                ]                                  \
              }                                    \
            ]}                                     \
          ]                                        \
        }                                          \
      ]                                            \
  }';
  var testSettings = JSON.parse(jsonTest);
  
  var nextBreakpoint;

  var control  = function(){
    let currentTime = this.currentTime();
    console.log(currentTime);
    if(nextBreakpoint === undefined){
      nextBreakpoint = getNextBreakpoint(testSettings.breakpoints); 
    }

    if(nextBreakpoint && currentTime>nextBreakpoint.breakpoint){
      createPause(nextBreakpoint);
      nextBreakpoint = getNextBreakpoint();
    }

  }


  var createPause = function(breakpoint){
    player.pause();
    player.controls();
    player.getChild('controlBar').hide();
    breakpoint.resolved = true;
    
    
  } 
 
  var initBreakpoints = function(breakpoints){
    for(var i = 0; i<breakpoints.length; i++){
      breakpoints[i].resolved = false; 
    }
  }

  var getNextBreakpoint = function(breakpoints){
    for(var i = 0; i<breakpoints.length; i++){
      if(!breakpoints[i].resolved)
        return breakpoints[i];
    }
    return null;
  }


  var createEl = function(type,base){
    let root = player.el_;
    if(base !== 'undefined' ) {
      root = base;
    }
    let newEl = document.createElement(type);
    root.appendChild(newEl);

    return newEl;   

  }


  /**
   * Initialize the plugin.
   * 'this' will be the video player when this method is called
   * @param options (optional) {object} configuration for the plugin
   */
  var openEDU = function(options) {
    player = this;
    console.log(player.el());
    var settings = videojs.util.mergeOptions(testSettings, options);
    initBreakpoints(settings.breakpoints);
    this.on('play', function(){ 
      //this.currentTime(10); //I can set the time to whatever I want 
      console.log('playback has started');
    });
    this.on('timeupdate', control);
    //this.on(['seeking','volumechange'], function(){ console.log('seeking or volume change')});
        
  //      function(){
  //    var test;
  //    console.log(test.a);
  //    console.log(this.currentTime());
  //    if(this.currentTime()<6 && this.currentTime()>5)
  //      this.pause(); 
  //  });
  };

  videojs.plugin('openEDU', openEDU); // register the plugin
})(window, document, window.videojs);


