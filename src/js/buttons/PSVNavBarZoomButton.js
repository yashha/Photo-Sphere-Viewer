/**
 * Navigation bar zoom button class
 * @param {module:components.PSVNavBar} navbar
 * @constructor
 * @extends module:components/buttons.PSVNavBarButton
 * @extends PSVUtils.PSVSlider
 * @memberof module:components/buttons
 */
function PSVNavBarZoomButton(navbar) {
  PSVNavBarButton.call(this, navbar);

  /**
   * @member {HTMLElement}
   * @readonly
   * @private
   */
  this.zoom_range = null;

  /**
   * @member {HTMLElement}
   * @readonly
   * @private
   */
  this.zoom_value = null;

  /**
   * @member {PSVSlider}
   * @readonly
   * @private
   */
  this.slider = null;

  /**
   * @member {Object}
   * @private
   */
  this.prop = {
    buttondown: false,
    longPressInterval: null,
    longPressTimeout: null
  };

  this.create();
}

PSVNavBarZoomButton.prototype = Object.create(PSVNavBarButton.prototype);
PSVNavBarZoomButton.prototype.constructor = PSVNavBarZoomButton;

PSVNavBarZoomButton.id = 'zoom';
PSVNavBarZoomButton.className = 'psv-button psv-zoom-button';

PSVNavBar.registerButton(PSVNavBarZoomButton);

/**
 * @override
 */
PSVNavBarZoomButton.prototype.create = function() {
  PSVNavBarButton.prototype.create.call(this);

  var zoom_minus = document.createElement('div');
  zoom_minus.className = 'psv-zoom-button-minus';
  zoom_minus.title = this.psv.config.lang.zoomOut;
  this._setIcon('zoom-out.svg', zoom_minus);
  this.container.appendChild(zoom_minus);

  var zoom_range_bg = document.createElement('div');
  zoom_range_bg.className = 'psv-zoom-button-range';
  this.container.appendChild(zoom_range_bg);

  this.zoom_range = document.createElement('div');
  this.zoom_range.className = 'psv-zoom-button-line';
  zoom_range_bg.appendChild(this.zoom_range);

  this.zoom_value = document.createElement('div');
  this.zoom_value.className = 'psv-zoom-button-handle';
  this.zoom_range.appendChild(this.zoom_value);

  var zoom_plus = document.createElement('div');
  zoom_plus.className = 'psv-zoom-button-plus';
  zoom_plus.title = this.psv.config.lang.zoomIn;
  this._setIcon('zoom-in.svg', zoom_plus);
  this.container.appendChild(zoom_plus);

  this.slider = new PSVSlider(this, {
    element: zoom_range_bg,
    container: this.psv.container
  });

  window.addEventListener('mouseup', this);
  window.addEventListener('touchend', this);
  zoom_minus.addEventListener('mousedown', this._zoomOut.bind(this));
  zoom_plus.addEventListener('mousedown', this._zoomIn.bind(this));

  this.psv.on('zoom-updated', this);

  this.psv.once('ready', function() {
    this._moveZoomValue(this.psv.prop.zoom_lvl);
  }.bind(this));
};

/**
 * @override
 */
PSVNavBarZoomButton.prototype.destroy = function() {
  this._stopZoomChange();

  this.slider.destroy();

  window.removeEventListener('mouseup', this);
  window.removeEventListener('touchend', this);

  this.psv.off('zoom-updated', this);

  delete this.slider;
  delete this.zoom_range;
  delete this.zoom_value;

  PSVNavBarButton.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
PSVNavBarZoomButton.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'mouseup':      this._stopZoomChange(e); break;
    case 'touchend':     this._stopZoomChange(e); break;
    case 'zoom-updated': this._moveZoomValue(e.args[0]); break;
    case 'slide':        this.psv.zoom(e.value * 100); break;
    // @formatter:on
  }
};

/**
 * @summary Moves the zoom cursor
 * @param {int} level
 * @private
 */
PSVNavBarZoomButton.prototype._moveZoomValue = function(level) {
  this.zoom_value.style.left = level + '%';
};

/**
 * @summary Handles click events
 * @description Zooms in and register long press timer
 * @private
 */
PSVNavBarZoomButton.prototype._zoomIn = function() {
  if (!this.enabled) {
    return;
  }

  this.prop.buttondown = true;
  this.psv.zoomIn();
  this.prop.longPressTimeout = window.setTimeout(this._startLongPressInterval.bind(this, 1), 200);
};

/**
 * @summary Handles click events
 * @description Zooms out and register long press timer
 * @private
 */
PSVNavBarZoomButton.prototype._zoomOut = function() {
  if (!this.enabled) {
    return;
  }

  this.prop.buttondown = true;
  this.psv.zoomOut();
  this.prop.longPressTimeout = window.setTimeout(this._startLongPressInterval.bind(this, -1), 200);
};

/**
 * @summary Continues zooming as long as the user presses the button
 * @param value
 * @private
 */
PSVNavBarZoomButton.prototype._startLongPressInterval = function(value) {
  if (this.prop.buttondown) {
    this.prop.longPressInterval = window.setInterval(function() {
      this.psv.zoom(this.psv.prop.zoom_lvl + value);
    }.bind(this), 50);
  }
};

/**
 * @summary Handles mouse up events
 * @private
 */
PSVNavBarZoomButton.prototype._stopZoomChange = function() {
  if (!this.enabled) {
    return;
  }

  window.clearInterval(this.prop.longPressInterval);
  window.clearTimeout(this.prop.longPressTimeout);
  this.prop.longPressInterval = null;
  this.prop.longPressTimeout = null;
  this.prop.buttondown = false;
};
