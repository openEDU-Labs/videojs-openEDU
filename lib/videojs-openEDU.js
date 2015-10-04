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
      nextBreakpoint = getNextBreakpoint(testSettings.breakpoints);
    }

  }


  function createPause(breakpoint){
    player.pause();
    player.getChild('controlBar').hide();
    breakpoint.resolved = true;
    var div = createEl('div',{'class':'vjs-text-track-display'});
    var title = createEl('p',{},div);
    title.innerHTML = "wow this is such test text";
    var button = createEl('button',{"onclick":"continuePlay()"},div);
    button.innerHTML = "continue";
    button.style.zIndex = '40';
  } 
 
  function initBreakpoints(breakpoints){
    breakpoints.forEach(function(breakpoint){
      breakpoint.resolved = false; 
    });
  }

  function getNextBreakpoint(breakpoints){
    for(let i = 0; i<breakpoints.length; i++){
      if(!breakpoints[i].resolved){
        return breakpoints[i];
      }
    };
    return null;
  }

  function continuePlay(){
    console.log("play");
  }

  function createEl(tagName,attributes, base){
    let el = document.createElement(tagName);

    let parentEl = base || player.el();
    parentEl.appendChild(el);
    
    Object.getOwnPropertyNames(attributes).forEach(function(attrName){
      el.setAttribute(attrName, attributes[attrName]);
    });
    
    return el;   

  }


  /**
   * Initialize the plugin.
   * 'this' will be the video player when this method is called
   * @param options (optional) {object} configuration for the plugin
   */
  var openEDU = function(options) {
    player = this;
    //var settings = videojs.util.mergeOptions(testSettings, options);

    initBreakpoints(testSettings.breakpoints);

    player.on('play', function(){ 
      console.log('playback has started');
    });
    player.on('timeupdate', control);
  };

  videojs.plugin('openEDU', openEDU); // register the plugin
})(window, document, window.videojs);

