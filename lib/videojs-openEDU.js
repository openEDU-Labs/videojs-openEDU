(function(videojs) {
  'use strict';
  var player;
  var settings;
  var breakpoints = [];
  var breakIndx = 0;
  var parentDiv;


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

  /**
   * Initialize breakpoints into breakpoints[] array.
   * This will set the time of the prior breakpoint (or 0, if there is not one)
   * and it will set "completed" value of the breakpoint to false
   */
  var initBreakpoints = function(breakpointList) {
      for (var i = 0; i < breakpointList.length; i++){
          breakpoints.push(breakpointList[i]);

          breakpoints[i].inProgress = false;
          breakpoints[i].completed = false;
          if(i>0) {
              breakpoints[i].lastBreak = breakpoints[i-1].breakpoint;
          }
          else {
              breakpoints[i].lastBreak = 0;
          }
      }
  };

  var onTimeUpdate = function() {
      var currentTime = player.currentTime();
      console.log(currentTime);

      //Check if indx is in bounds && breakpoint at that index is less than current time => trigger breakpoint
      if(breakIndx < breakpoints.length && breakpoints[breakIndx].breakpoint < currentTime) {
          if (!breakpoints[breakIndx].inProgress) {
              console.log('breakpoint reached');
              console.log(breakpoints[breakIndx]);
              breakpoints[breakIndx].inProgress = true;
              onBreakpoint();
          }
      }
      
  };

  var onBreakpoint = function() {
      jumpToEarliestBreakpoint();
      pause();
      if (parentDiv === undefined){
          parentDiv = createEl('div', {'class': 'vjs-openEDU', 'style': 'display:block'});
      }

      showParent();
      createBreakpointContent(breakpoints[breakIndx].fields, parentDiv);
      submitBehavior(function() {
          play();
      });
  };

  var submitBehavior = function(callback) {
    $('#form').submit(function(event) {
        event.preventDefault();
        /*var breakpointNumber = breakIndx;
        var selected = $("input[type=radio]:checked","#form");
        var selectedQuestion = parseInt(selected.attr("id").replace("id",""));
        console.log(breakpointNumber);
        console.log(selectedQuestion);
        
        var data = {
            //'video' = 'url' //or other sort of id
            'breakpointNumber' = breakpointNumber,//
            'answer' = selectedQuestion
            //'student' = some identification
        }

        $.ajax({
            type:       'POST',
            url:        'url',
            data:       data,
            dataType:   'json',
            encode:     true
        })
            .done(function(data) {
                console.log(data);
            });

        */
        callback();
    });
  };

  var jumpToEarliestBreakpoint = function() {
      var earliestNotCompleted = 0;//indx of earliest breakpoint not completed
      //this indx should be equal to breakIndx.
      //if not, then set breakIndx to this
      for (var i = 0; i < breakpoints.length; i++){
          if (!breakpoints[i].completed) {
              earliestNotCompleted = i;
              break;
          }
      }
      breakIndx = earliestNotCompleted;//should be equal already, but fixing it if otherwise
      player.currentTime(breakpoints[breakIndx].breakpoint);
  };

  var pause = function() {
      player.pause();
      player.getChild('controlBar').hide();
  };

  var play = function() {
      breakpoints[breakIndx++].completed = true;
      player.play();
      player.getChild('controlBar').show();
      hideParent();
  };

  var createBreakpointContent = function(elements, context){
      elements.forEach(function(tag){
          var el = createEl(tag.tag, tag.attr, context);
            if (typeof tag.content === 'object') { //there are internal tags
                createBreakpointContent(tag.content, el);
            }
            else { //there are not internal tags 
                el.innerHTML = tag.content;
          }
      });
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

  var hideParent = function() {
      $(parentDiv).css('display','none').html('');
  };
  var showParent = function() {
      $(parentDiv).css('display','block');
  };

})(window.videojs);
