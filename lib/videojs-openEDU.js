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
          "breakpoint": 1,                      
          "fields":[                            
            {                                   
              "tag": "form",                    
              "attr": {"id":"form"},                       
              "content": [
                {                                   
                  "tag":"h1",                       
                  "attr": "",                       
                  "content": "Breakpoint 1 Title"   
                },                                  
                { 
                  "tag": "p",
                  "attr": "",
                  "content": "Description Description Description"
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type":"radio", "name":"question", "id":"id1"},
                      "content": ""
                    },
                    { "tag": "label",
                      "attr": {"for":"id1"},
                      "content": "example 1 description"
                    }
                  ]
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type": "radio", "name":"question", "id":"id2"},
                      "content": "example answer 1"
                    },
                    { 
                      "tag": "label",
                      "attr": {"for":"id2"},
                      "content": "example 2 description"
                    }
                  ]
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type": "radio", "name":"question", "id":"id3"},
                      "content": "example answer 2"
                    },
                    { "tag": "label",
                      "attr": {"for":"id3"},
                      "content": "example 3 description"
                    }
                  ]
                },
                {
                  "tag": "div",
                  "attr": "",
                  "content": [
                    { "tag": "input",                 
                      "attr": {"type":"submit", "value":"Submit and Continue"},     
                      "content": ""                                 
                    }                                   
                  ]
                }
              ]
            }                                     
          ]                                       
        },                                        
        {       
          "breakpoint": 4,                      
          "fields":[                            
            {                                   
              "tag": "form",                    
              "attr": {"id":"form"},                       
              "content": [
                {                                   
                  "tag":"h1",                       
                  "attr": "",                       
                  "content": "Breakpoint 2 Title"   
                },                                  
                { 
                  "tag": "p",
                  "attr": "",
                  "content": "Description Description Description"
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type":"radio", "name":"question", "id":"id1"},
                      "content": ""
                    },
                    { "tag": "label",
                      "attr": {"for":"id1"},
                      "content": "example 1 description"
                    }
                  ]
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type": "radio", "name":"question", "id":"id2"},
                      "content": "example answer 1"
                    },
                    { 
                      "tag": "label",
                      "attr": {"for":"id2"},
                      "content": "example 2 description"
                    }
                  ]
                },
                { 
                  "tag": "div",
                  "attr": "",
                  "content":[
                    { "tag": "input",
                      "attr": {"type": "radio", "name":"question", "id":"id3"},
                      "content": "example answer 2"
                    },
                    { "tag": "label",
                      "attr": {"for":"id3"},
                      "content": "example 3 description"
                    }
                  ]
                },
                {
                  "tag": "div",
                  "attr": "",
                  "content": [
                    { "tag": "input",                 
                      "attr": {"type":"submit", "value":"Submit and Continue"},     
                      "content": ""                                 
                    }                                   
                  ]
                }
              ]
            }                                     
          ]                                       
        },                                        
        {                                         
          "breakpoint": 9,                        
          "fields":[                              
            {                                    
              "tag": "form",                  
              "attr": "",                         
              "content": [                        
                {                                     
                  "tag":"h1",                        
                  "attr": "",                       
                  "content": "Breakpoint 2 Title"      
                },                                     
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
  
  var settings;
  var nextBreakpoint;
  var SUBMIT_BUTTON;

  var onTimeUpdate  = function(){
    let currentTime = this.currentTime();
    console.log(currentTime);

    if(nextBreakpoint === undefined){
      nextBreakpoint = getNextBreakpoint(settings.breakpoints); 
    }

    if(nextBreakpoint && currentTime > nextBreakpoint.breakpoint){
      onBreakpoint(nextBreakpoint);
      nextBreakpoint = getNextBreakpoint(settings.breakpoints);
    }

  }

  var onBreakpoint = function(breakpoint){
    onPause(breakpoint);
    let parentDiv = createEl('div',{'class':'vjs-openEDU'});
    createBreakpointContent(breakpoint.fields, parentDiv);
    defineSubmitBehavior(function(){
      onPlay(parentDiv);  
    });
  }

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
  }

  /**
   * elements is an array
   * context is the dom conext
   * both are required 
   */
  var createBreakpointContent = function(elements, context){
    elements.forEach(function(tag){
      let el = createEl(tag.tag, tag.attr, context);
      if(typeof tag.content === 'object') //there are internal tags
        createBreakpointContent(tag.content, el);
      else //there are not internal tags 
        el.innerHTML = tag.content;
    });
    
  }

  var onPause = function(breakpoint){
    player.pause();
    player.getChild('controlBar').hide();
    breakpoint.resolved = true;
  }

  var onPlay = function(parentDiv){
    player.play();
    player.getChild('controlBar').show();
    player.el().removeChild(parentDiv);
  } 
 
  var initBreakpoints = function(breakpoints){
    breakpoints.forEach(function(breakpoint){
      breakpoint.resolved = false; 
    });
  }

  var getNextBreakpoint = function(breakpoints){
    for(let i = 0; i<breakpoints.length; i++){
      if(!breakpoints[i].resolved)
        return breakpoints[i];
    };
    return null;
  }

  /**
   * Pass the tag - String
   * attributes to add to the tag in the form of an object
   * the parent to attatch the tag to (opitonal)
   *
   */
  var createEl  = function(tagName, attributes, base){
    let el = document.createElement(tagName);

    let parentEl = base || player.el();
    parentEl.appendChild(el);
    
    Object.getOwnPropertyNames(attributes).forEach(function(attrName){
      if(attrName != 'length' && attributes[attrName] != '0')//would set length="0" 
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
    settings = JSON.parse(options);    
    player = this;
    //var settings = videojs.util.mergeOptions(testSettings, options);
    initBreakpoints(settings.breakpoints);
    player.on('timeupdate', onTimeUpdate);
  }

  videojs.plugin('openEDU', openEDU); // register the plugin

})(window, document, window.videojs);
