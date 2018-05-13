function VideoSphereViewer(options) {
  // return instance if called as a function
  if (!(this instanceof VideoSphereViewer)) {
    return new VideoSphereViewer(options);
  }

  PhotoSphereViewer.call(this, options);

  /**
   * @member {HTMLVideoElement}
   * @private
   */
  this.video = null;

  if (this.config.video) {
    this.setVideo(this.config.video);
  }

  this.on('before-render', this.needsUpdate.bind(this));
}

VideoSphereViewer.prototype = Object.create(PhotoSphereViewer.prototype);
VideoSphereViewer.prototype.constructor = VideoSphereViewer;

VideoSphereViewer.prototype.destroy = function() {
  if (this.video) {
    this.video.stop();
  }

  delete this.video;

  PhotoSphereViewer.prototype.destroy.apply(this);
};

VideoSphereViewer.prototype.setVideo = function(path, position) {
  if (this.prop.loading_promise !== null) {
    throw new PSVError('Loading already in progress');
  }

  this.config.video = path;

  this.loader.show();
  if (this.canvas_container) {
    this.canvas_container.style.opacity = 0;
  }

  this.prop.loading_promise = this._loadVideo(this.config.video)
    .then(function(texture) {
      this._setTexture(texture);

      if (position) {
        this.rotate(position);
      }
    }.bind(this))
    .ensure(function() {
      this.loader.hide();
      this.canvas_container.style.opacity = 1;

      this.prop.loading_promise = null;
    }.bind(this))
    .rethrow();

  return this.prop.loading_promise;
};

VideoSphereViewer.prototype._loadVideo = function(path) {
  if (this.video) {
    this.video.stop();
  }

  this.video = document.createElement('video');
  this.video.crossorigin = 'anonymous';
  this.video.src = path;
  this.video.muted = true;

  this.video.play();

  var texture = new THREE.VideoTexture(this.video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  return D.resolved(texture);
};

PhotoSphereViewer.Video = VideoSphereViewer;
