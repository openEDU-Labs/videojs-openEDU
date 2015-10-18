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

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### option
options coming soon
## Release History

 - 10-17-15     0.1.0: Start of initial development
