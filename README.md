# Video.js Open Edu

A better way to learn online with openEDU

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="video.js"></script> //import Video.js
<script src="videojs-openEDU.js"></script>//import videojs-openEDU
<script>
    var video = videojs('video');//get the Video.js player
    video.openEDU('options');//fire up the plugin
</script>
```

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### option
options coming soon
## Release History
 - 12-01-15     0.1.5: Re-write with additional functionality. CSS updated. Fixed bad 0.1.4 updated
 - 11-18-15     0.1.4: Re-write with additional functionality. CSS updated
 - 10-20-15     0.1.3: Non-Crappy CSS for quizes
 - 10-17-15     0.1.2: Small changes to get everything working with Bower
 - 10-17-15     0.1.0: Start of initial development
