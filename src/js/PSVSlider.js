/**
 * @namespace PSVUtils
 */

/**
 * Utility methods for sliders
 * @constructor
 * @memberof PSVUtils
 */
function PSVSlider(parent, config) {
  this.mousedown = false;
  this.parent = parent;
  this.element = config.element;
  this.container = config.container;
  this.direction = config.direction || PSVSlider.HORIZONTAL;

  this.element.addEventListener('mousedown', this);
  this.element.addEventListener('touchstart', this);
  this.container.addEventListener('mousemove', this);
  this.container.addEventListener('touchmove', this);
  window.addEventListener('mouseup', this);
  window.addEventListener('touchend', this);

  if (config.mouseover) {
    this.element.addEventListener('mouseenter', this);
    this.element.addEventListener('mouseleave', this);
  }
}

PSVSlider.HORIZONTAL = 1;
PSVSlider.VERTICAL = 2;

PSVSlider.prototype.destroy = function() {
  this.element.removeEventListener('mousedown', this);
  this.element.removeEventListener('touchstart', this);
  this.container.removeEventListener('mousemove', this);
  this.container.removeEventListener('touchmove', this);
  window.removeEventListener('mouseup', this);
  window.removeEventListener('touchend', this);
  this.element.addEventListener('mouseenter', this);
  this.element.removeEventListener('mouseleave', this);

  delete this.parent;
  delete this.element;
  delete this.container;
};

PSVSlider.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'mousedown':  this._onMouseDown(e); break;
    case 'mouseenter': this._onMouseEnter(e); break;
    case 'touchstart': this._onTouchStart(e); break;
    case 'mousemove':  this._onMouseMove(e, true); break;
    case 'touchmove':  this._onTouchMove(e, true); break;
    case 'mouseup':    this._onMouseUp(e); break;
    case 'mouseleave': this._onMouseLeave(e); break;
    case 'touchend':   this._onTouchEnd(e); break;
    // @formatter:on
  }
};

/**
 * Method called to apply the new value.
 * Must be re-implemented by the super-class
 * @param {float} value
 * @param {boolean} moving
 * @private
 */
PSVSlider.prototype.isVertical = function() {
  return this.direction === PSVSlider.VERTICAL;
};

/**
 * @summary Handles mouse down events
 * @param {MouseEvent} evt
 * @private
 */
PSVSlider.prototype._onMouseDown = function(evt) {
  this.mousedown = true;
  this._onMouseMove(evt, true);
};

/**
 * @summary Handles mouse enter events
 * @param {MouseEvent} evt
 * @private
 */
PSVSlider.prototype._onMouseEnter = function(evt) {
  this.mousedown = true;
  this._onMouseMove(evt, true);
};

/**
 * @summary Handles touch events
 * @param {TouchEvent} evt
 * @private
 */
PSVSlider.prototype._onTouchStart = function(evt) {
  this.mousedown = true;
  this._onTouchMove(evt, true);
};

/**
 * @summary Handles mouse up events
 * @param {MouseEvent} evt
 * @private
 */
PSVSlider.prototype._onMouseUp = function(evt) {
  this._onMouseMove(evt, false);
  this.mousedown = false;
};

/**
 * @summary Handles mouse leave events
 * @param {MouseEvent} evt
 * @private
 */
PSVSlider.prototype._onMouseLeave = function(evt) {
  this._onMouseMove(evt, true);
  this.mousedown = false;
};

/**
 * @summary Handles touch end events
 * @param {TouchEvent} evt
 * @private
 */
PSVSlider.prototype._onTouchEnd = function(evt) {
  this._onTouchMove(evt, false);
  this.mousedown = false;
};

/**
 * @summary Handles mouse move events
 * @param {MouseEvent} evt
 * @param {boolean} moving
 * @private
 */
PSVSlider.prototype._onMouseMove = function(evt, moving) {
  if (this.mousedown) {
    evt.preventDefault();
    this._slide(evt[this.isVertical() ? 'clientY' : 'clientX'], moving);
  }
};

/**
 * @summary Handles touch move events
 * @param {TouchEvent} evt
 * @param {boolean} moving
 * @private
 */
PSVSlider.prototype._onTouchMove = function(evt, moving) {
  if (this.mousedown) {
    evt.preventDefault();
    this._slide(evt.changedTouches[0][this.isVertical() ? 'clientY' : 'clientX'], moving);
  }
};

/**
 * @summary Value change
 * @param {int} x - mouse/touch position
 * @param {boolean} moving
 * @private
 */
PSVSlider.prototype._slide = function(x, moving) {
  var user_input = this.isVertical() ?
    this.element.getBoundingClientRect().bottom - parseInt(x) :
    parseInt(x) - this.element.getBoundingClientRect().left;

  var value = user_input / this.element[this.isVertical() ? 'offsetHeight' : 'offsetWidth'];

  var event = {
    type: 'slide',
    value: PSVUtils.bound(value, 0, 1),
    moving: moving
  };

  this.parent.handleEvent(event);
};
