VideoSphereViewer.prototype.destroy = function() {
  if (this.video) {
    this.video.stop();
  }

  delete this.video;

  PhotoSphereViewer.prototype.destroy.apply(this);
};

VideoSphereViewer.prototype.getDuration = function() {
  return this.video ? this.video.duration : NaN;
};

VideoSphereViewer.prototype.getTime = function() {
  return this.video ? this.video.currentTime : NaN;
};

VideoSphereViewer.prototype.isPlaying = function() {
  return this.video ? !this.video.paused : false;
};

VideoSphereViewer.prototype.playPause = function() {
  if (this.video.paused) {
    this.video.play();
  } else {
    this.video.pause();
  }
};

VideoSphereViewer.prototype.setVolume = function(volume) {
  if (volume <= 0) {
    this.setMute(true);
  } else {
    this.video.muted = false;
    this.video.volume = volume;
  }
};

VideoSphereViewer.prototype.setTime = function(time) {
  this.video.currentTime = time;
};

VideoSphereViewer.prototype.getProgress = function() {
  return this.video.currentTime / this.video.duration;
};

VideoSphereViewer.prototype.setProgress = function(progress) {
  this.video.currentTime = this.video.duration * progress;
};

VideoSphereViewer.prototype.setMute = function(mute) {
  this.video.muted = mute === undefined ? !this.video.muted : mute;
  this.trigger('volume-change', this.video.volume, this.video.muted);
};

VideoSphereViewer.prototype.getBufferProgress = function() {
  var maxBuffer = 0;

  var buffer = this.video.buffered;

  for (var i = 0, l = buffer.length; i < l; i++) {
    if (buffer.start(i) <= this.video.currentTime && buffer.end(i) >= this.video.currentTime) {
      maxBuffer = buffer.end(i);
      break;
    }
  }

  return Math.min(maxBuffer, this.video.currentTime) / this.video.duration;
};

VideoSphereViewer.prototype.setVideo = function(path, position) {
  if (this.prop.loading_promise !== null) {
    throw new PSVError('Loading already in progress');
  }

  this.prop.resolutions.length = 0;

  if (typeof path === 'string') {
    path = [{ source: path, type: null, resolution: null }];
  }

  if (!path || path.length === 0) {
    throw new PSVError('Missing video source');
  }

  var havingResolutions = !!path[0].resolution;

  path.forEach(function(video) {
    if (!video.source) {
      throw new PSVError('Missing video source');
    }

    var hasResolution = !!video.resolution;
    if (havingResolutions ^ hasResolution) {
      throw new PSVError('Cannot mix video sources with and without resolution');
    }

    if (!video.type) {
      video.type = VideoSphereViewer.TYPES[video.source.split('.').pop().toLowerCase()];
    }

    if (video.resolution && this.prop.resolutions.indexOf(video.resolution) === -1) {
      this.prop.resolutions.push(video.resolution);
    }
  }.bind(this));

  if (!this.config.default_resolution) {
    this.config.default_resolution = path[0].resolution;
  }

  this.config.video = path;

  this.setVideoResolution(this.config.default_resolution);

  var texture = new THREE.VideoTexture(this.video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  this._setTexture(texture);

  if (position) {
    this.rotate(position);
  }
};

VideoSphereViewer.prototype.setVideoResolution = function(resolution) {
  if (this.prop.resolutions.indexOf(resolution) === -1) {
    throw new PSVError('Resolution ' + resolution + ' unknown');
  }

  this.video.pause();

  while (this.video.hasChildNodes()) {
    this.video.removeChild(this.video.lastChild);
  }

  this.config.video
    .filter(function(video) {
      return video.resolution === resolution;
    })
    .forEach(function(video) {
      var source = document.createElement('source');
      source.src = video.source;

      if (video.type) {
        source.type = video.type;
      }

      this.video.appendChild(source);
    }.bind(this));

  if (this.config.autoplay) {
    this.video.load();
    this.video.play();
  }

  this.trigger('resolution-change', resolution);
};
