/**
 * @typedef {Object} VideoSphereViewer.Video
 * @summary Video source definition
 * @property {string} source
 * @property {string} [type]
 * @property {string} [resolution]
 */

function VideoSphereViewer(options) {
  // return instance if called as a function
  if (!(this instanceof VideoSphereViewer)) {
    return new VideoSphereViewer(options);
  }

  options = PSVUtils.deepmerge(PSVUtils.clone(VideoSphereViewer.DEFAULTS), options);

  PhotoSphereViewer.call(this, options);

  /**
   * @member {HTMLVideoElement}
   * @private
   */
  this.video = null;

  this.progressbar = null;

  /**
   * @property {VideoSphereViewer.Video} prop.resolutions
   */
  this.prop.resolutions = [];

  this.video = document.createElement('video');
  this.video.crossorigin = 'anonymous';
  this.video.loop = true;

  this.progressbar = new VSVProgressbar(this);

  this._bindVideoEvents();

  // this.loader.show();

  if (this.config.muted) {
    this.setMute(true);
  }

  if (this.config.video) {
    this.setVideo(this.config.video);
  }

  this.on('before-render', this.needsUpdate.bind(this));

  this.on('click', this.playPause.bind(this));
}

VideoSphereViewer.prototype = Object.create(PhotoSphereViewer.prototype);
VideoSphereViewer.prototype.constructor = VideoSphereViewer;

PhotoSphereViewer.Video = VideoSphereViewer;
