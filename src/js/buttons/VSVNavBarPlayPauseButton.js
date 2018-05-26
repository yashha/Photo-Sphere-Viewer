/**
 * Navigation bar playpause button class
 * @param {module:components.PSVNavBar} navbar
 * @constructor
 * @extends module:components/buttons.PSVNavBarButton
 * @memberof module:components/buttons
 */
function VSVNavBarPlayPauseButton(navbar) {
  PSVNavBarButton.call(this, navbar);

  this.create();
}

VSVNavBarPlayPauseButton.prototype = Object.create(PSVNavBarButton.prototype);
VSVNavBarPlayPauseButton.prototype.constructor = VSVNavBarPlayPauseButton;

VSVNavBarPlayPauseButton.id = 'playpause';
VSVNavBarPlayPauseButton.className = 'psv-button psv-button--hover-scale psv-playpause-button';
VSVNavBarPlayPauseButton.icon = 'video-play.svg';
VSVNavBarPlayPauseButton.iconActive = 'video-pause.svg';

PSVNavBar.registerButton(VSVNavBarPlayPauseButton);

/**
 * @override
 */
VSVNavBarPlayPauseButton.prototype.create = function() {
  PSVNavBarButton.prototype.create.call(this);

  this.psv.on('playpause', this);
};

/**
 * @override
 */
VSVNavBarPlayPauseButton.prototype.destroy = function() {
  this.psv.off('playpause', this);

  PSVNavBarButton.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
VSVNavBarPlayPauseButton.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'playpause': this.toggleActive(e.args[0]); break;
    // @formatter:on
  }
};

/**
 * @override
 * @description Toggles autorotate
 */
VSVNavBarPlayPauseButton.prototype._onClick = function() {
  this.psv.playPause();
};
