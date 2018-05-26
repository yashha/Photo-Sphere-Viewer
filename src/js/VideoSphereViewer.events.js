VideoSphereViewer.prototype._bindVideoEvents = function() {
  this.video.addEventListener('play', this);
  this.video.addEventListener('pause', this);
  this.video.addEventListener('progress', this);
  this.video.addEventListener('volumechange', this);
  this.video.addEventListener('timeupdate', this);
  this.video.addEventListener('durationchange', this);
};

VideoSphereViewer.prototype.handleEvent = function(evt) {
  PhotoSphereViewer.prototype.handleEvent.call(this, evt);

  switch (evt.type) {
    // @formatter:off
    case 'play': this.trigger('playpause', true); break;
    case 'pause': this.trigger('playpause', false); break;
    case 'progress': this.trigger('buffer'); break;
    case 'volumechange': this.trigger('volume-change', this.video.volume, this.video.muted); break;
    case 'timeupdate': this.trigger('time-change', this.video.currentTime, this.video.duration); break;
    case 'durationchange': this.trigger('video-loaded'); break;
    // @formatter:on
  }
};
