/*! videojs-openEDU - v0.0.0 - 2015-10-1
 * Copyright (c) 2015 rgw3d
 * Licensed under the Apache-2.0 license. */
(function(window, videojs) {
  'use strict';

  var defaults = {option: true};
  
  
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
  
  var jsonTest =  '{ "settings": {\
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
    }                                              \
  }';
  var settings = JSON.parse(jsonTest);





  

  var control  = function(){
   console.log(this);
   if(this.currentTime()<6 && this.currentTime()>5)
     this.pause(); 
  } 

  /**
   * Initialize the plugin.
   * 'this' will be the video player when this method is called
   * @param options (optional) {object} configuration for the plugin
   */
  var openEDU = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;
    this.on('play', function(){ 
     console.log(this.buffered());
     console.log(this.currentTime());
     console.log(this.ended());
     console.log(this.networkState());
     console.log(this.remainingTime());
     console.log(this.volume());
     console.log(this.children());
     console.log(this.muted());
     this.currentTime(10); 
     console.log('playback has started')
    });
    this.on('timeupdate', control);
    this.on(['seeking','volumechange'], function(){ console.log('seeking or volume change')});
        
  //      function(){
  //    var test;
  //    console.log(test.a);
  //    console.log(this.currentTime());
  //    if(this.currentTime()<6 && this.currentTime()>5)
  //      this.pause(); 
  //  });
  };

  videojs.plugin('openEDU', openEDU); // register the plugin
})(window, window.videojs);


