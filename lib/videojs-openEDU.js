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
  
  /*var jsonTest = '
    { "breakpoints":[     
        {       
          "breakpoint": 2,                      
          "fields":[                            
            {                                   
              "tag":"h1",                       
              "attr": "",                       
              "content": "Breakpoint 1 Title"   
            },                                  
            {                                   
              "tag": "form",                    
              "attr": "",                       
              "content": [
                { "tag": "p",
                  "attr": "",
                  "content": "Description Description Description"
                },
                { "tag": "input",
                  "attr": {"type":"radio"},
                  "content": "example answer 0"
                },
                { "tag": "input",
                  "attr": {"type": "radio"},
                  "content": "example answer 1"
                },
                { "tag": "input",
                  "attr": {"type": "radio"},
                  "content": "example answer 2"
                }
              ]
            }                                     
          ]                                       
        },                                        
        {                                         
          "breakpoint": 4,                        
          "fields":[                              
            {                                     
              "tag":"h1",                        
              "attr": "",                       
              "content": "Breakpoint 2 Title"      
            },                                     
            {                                    
              "tag": "input",                  
              "attr": "",                         
              "content": [                        
                { "tag": "p",                       
                  "attr": "",                       
                  "content": "Description Description Description"  
                },                                    
                { "tag": "input",                     
                  "attr": {"type":"text", "name":"example field", "value":"example" }, 
                  "content": ""                    
                },                                
                { "tag": "input",                 
                  "attr": {"type":"submit", "value":"Submit"},     
                  "content": ""                                 
                }                                   
              ]                                     
            }                                       
          ]                                        
        }                                         
      ]                                            
  }';
  */
  var testSettings;// = JSON.parse(jsonTest);
  
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
    pauseSettings(breakpoint);

    var div = createEl('div',{'class':'vjs-custom-overlay-display'});
    createContent(breakpoint.fields,div);
    //var title = createEl('p',{},div);
    //title.innerHTML = "wow this is such test text";
    var button = createEl('button',{},div);
    button.innerHTML = "continue";
    

    button.addEventListener('click', function(e) {
      playSettings(div);
    });
  }

  /**
   * elements is an array
   * context is the dom conext
   * both are required 
   */
  function createContent(elements, context){
    //loop through all of the elements, if "content" is not empty, then 
    //recursivly call this function
    elements.forEach(function(tag){
    console.log(tag);
    console.log(tag.content);
      var el = createEl(tag.tag, tag.attr,context);
      if(typeof tag.content === 'object'){//there are internal tags
        createContent(tag.content, el);
      }
      else{//there are not internal tags 
        el.innerHTML = tag.content;
      }

    });
    
  }

  function pauseSettings(breakpoint){
    player.pause();
    player.getChild('controlBar').hide();
    //breakpoint.resolved = true;
    breakpoint.resolved = true;
  }

  function playSettings(div){
    player.play();
    player.getChild('controlBar').show();
    player.el().removeChild(div);
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

  /**
   * Pass the tag - String
   * attributes to add to the tag in the form of an object
   * the parent to attatch the tag to (opitonal)
   *
   */
  function createEl(tagName, attributes, base){
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
    testSettings = JSON.parse(options);    
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

