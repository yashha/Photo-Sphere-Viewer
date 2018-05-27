/**
 * Video progressbar class
 * @param {module:components.VideoSphereViewer} psv
 * @constructor
 * @extends module:components.PSVComponent
 * @extends PSVUtils.PSVSlider
 * @memberof module:components
 */
function VSVProgressbar(psv) {
  PSVComponent.call(this, psv);

  this.buffer = null;

  this.progress = null;

  this.handle = null;

  /**
   * @member {PSVSlider}
   * @readonly
   * @private
   */
  this.slider = null;

  this.prop = {
    update_reqid: null
  };

  this.create();
}

VSVProgressbar.prototype = Object.create(PSVComponent.prototype);
VSVProgressbar.prototype.constructor = VSVProgressbar;

VSVProgressbar.className = 'psv-progressbar';

/**
 * @override
 */
VSVProgressbar.prototype.create = function() {
  PSVComponent.prototype.create.call(this);

  var container = document.createElement('div');
  container.className = VSVProgressbar.className + '-container';
  this.container.appendChild(container);

  this.buffer = document.createElement('div');
  this.buffer.className = VSVProgressbar.className + '-buffer';
  container.appendChild(this.buffer);

  this.progress = document.createElement('div');
  this.progress.className = VSVProgressbar.className + '-progress';
  container.appendChild(this.progress);

  this.handle = document.createElement('div');
  this.handle.className = VSVProgressbar.className + '-handle';
  container.appendChild(this.handle);

  this.slider = new PSVSlider(this, {
    element: this.container,
    container: this.psv.container,
    mouseover: true
  });

  this.container.addEventListener('mousemove', this);
  this.container.addEventListener('touchmove', this);
  this.container.addEventListener('mouseleave', this);
  this.container.addEventListener('touchend', this);

  this._updateTime();

  this.psv.on('buffer', this);
};

/**
 * @override
 */
VSVProgressbar.prototype.destroy = function() {
  this.slider.destroy();

  this.psv.off('buffer', this);

  delete this.slider;
  delete this.buffer;
  delete this.progress;
  delete this.handle;

  if (this.prop.update_reqid) {
    window.cancelAnimationFrame(this.prop.update_reqid);
  }

  PSVComponent.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
VSVProgressbar.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'buffer':     this._onBuffer(); break;
    case 'slide':      this._onSlide(e.value, e.moving); break;
    case 'mousemove':  this._updateTooltip(e.clientX); break;
    case 'touchmove':  this._updateTooltip(e.changedTouches[0].clientX); break;
    case 'mouseleave': this._hideTooltip(); break;
    case 'touchend':   this._hideTooltip(); break;
    // @formatter:on
  }
};

/**
 * Moves the progress cursor
 * @private
 */
VSVProgressbar.prototype._updateTime = function() {
  var progress = this.psv.getProgress() * 100;

  this.progress.style.width = progress + '%';

  this.prop.update_reqid = window.requestAnimationFrame(this._updateTime.bind(this));
};

/**
 * Moves the buffer cursor
 * @private
 */
VSVProgressbar.prototype._onBuffer = function() {
  var progress = this.psv.getBufferProgress() * 100;

  this.buffer.style.width = progress + '%';
};

/**
 * Moves the
 * @param value
 * @param moving
 * @private
 */
VSVProgressbar.prototype._onSlide = function(value, moving) {
  if (moving) {
    this.handle.style.width = (value * 100) + '%';
  }
  else {
    this.psv.setProgress(value);
  }
};

VSVProgressbar.prototype._updateTooltip = function(x) {
  var value = (parseInt(x) - this.container.getBoundingClientRect().left) / this.container.offsetWidth;
  var time = PSVUtils.formatDuration(this.psv.video.duration * value);

  this.psv.tooltip.showTooltip({
    permanent: true,
    small: true,
    content: time,
    top: this.container.getBoundingClientRect().top + this.psv.config.tooltip.offset,
    left: x
  });
};

VSVProgressbar.prototype._hideTooltip = function() {
  this.handle.style.width = '0%';

  this.psv.tooltip.hideTooltip();
};
