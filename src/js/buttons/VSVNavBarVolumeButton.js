/**
 * Navigation bar volume button class
 * @param {module:components.PSVNavBar} navbar
 * @constructor
 * @extends module:components/buttons.PSVNavBarButton
 * @memberof module:components/buttons
 */
function VSVNavBarVolumeButton(navbar) {
  PSVNavBarButton.call(this, navbar);

  this.range = null;

  this.slider = null;

  this.create();
}

VSVNavBarVolumeButton.prototype = Object.create(PSVNavBarButton.prototype);
VSVNavBarVolumeButton.prototype.constructor = VSVNavBarVolumeButton;

VSVNavBarVolumeButton.id = 'volume';
VSVNavBarVolumeButton.className = 'psv-button psv-volume-button';
VSVNavBarVolumeButton.icon = 'volume.svg';

PSVNavBar.registerButton(VSVNavBarVolumeButton);

/**
 * @override
 */
VSVNavBarVolumeButton.prototype.create = function() {
  PSVNavBarButton.prototype.create.call(this);

  var range_bg = document.createElement('div');
  range_bg.className = 'psv-volume-button-range';
  this.container.appendChild(range_bg);

  this.range = document.createElement('div');
  this.range.className = 'psv-volume-button-line';
  range_bg.appendChild(this.range);

  this.slider = new PSVSlider(this, {
    element: range_bg,
    container: this.psv.container
  });

  range_bg.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  this.container.querySelector('svg').addEventListener('click', this);

  this.psv.on('volume-change', this);

  this._setVolume(1, false);
  this.psv.once('ready', function() {
    this._setVolume(this.psv.video.volume, this.psv.video.muted);
  }.bind(this));
};

/**
 * @override
 */
VSVNavBarVolumeButton.prototype.destroy = function() {
  this.slider.destroy();

  this.psv.off('volume-change', this);

  delete this.slider;
  delete this.range;

  PSVNavBarButton.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
VSVNavBarVolumeButton.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'volume-change': this._setVolume(e.args[0], e.args[1]); break;
    case 'slide':         this.psv.setVolume(e.value); break;
    case 'click':         this.psv.setMute(); break;
    // @formatter:on
  }
};

/**
 * @override
 * @description Toggles autorotate
 */
VSVNavBarVolumeButton.prototype._setVolume = function(volume, muted) {
  var level;
  if (muted) level = 0;
  else if (volume < 0.333) level = 1;
  else if (volume < 0.666) level = 2;
  else level = 3;

  PSVUtils.removeClasses(this.container, 'psv-volume-button--0 psv-volume-button--1 psv-volume-button--2 psv-volume-button--3');

  PSVUtils.addClasses(this.container, 'psv-volume-button--' + level);

  this.range.style.width = (volume * 100 * !muted) + '%';
};
