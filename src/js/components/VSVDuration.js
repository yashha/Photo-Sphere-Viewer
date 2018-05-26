/**
 * Video duration class
 * @param {module:components.VideoSphereViewer} psv
 * @constructor
 * @extends module:components.PSVComponent
 * @extends PSVUtils.PSVSlider
 * @memberof module:components
 */
function VSVDuration(psv) {
  PSVComponent.call(this, psv);

  this.create();
}

VSVDuration.prototype = Object.create(PSVComponent.prototype);
VSVDuration.prototype.constructor = VSVDuration;

VSVDuration.id = 'duration';
VSVDuration.className = 'psv-duration';

PSVNavBar.registerButton(VSVDuration);

/**
 * @override
 */
VSVDuration.prototype.create = function() {
  PSVComponent.prototype.create.call(this);

  this.psv.on('video-loaded', this);
  this.psv.on('time-change', this);

  this._updateTime(0, 0);
};

/**
 * @override
 */
VSVDuration.prototype.destroy = function() {
  this.psv.off('video-loaded', this);
  this.psv.off('time-change', this);

  PSVComponent.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
VSVDuration.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'video-loaded': this._updateTime(); break;
    case 'time-change':  this._updateTime(); break;
    // @formatter:on
  }
};

/**
 * Moves the progress cursor
 * @private
 */
VSVDuration.prototype._updateTime = function() {
  this.container.innerHTML = PSVUtils.formatDuration(this.psv.getTime()) + ' / ' + PSVUtils.formatDuration(this.psv.getDuration());
};
