/**
 * Navigation bar resolution button class
 * @param {module:components.PSVNavBar} navbar
 * @constructor
 * @extends module:components/buttons.PSVNavBarButton
 * @memberof module:components/buttons
 */
function VSVNavBarResolutionButton(navbar) {
  PSVNavBarButton.call(this, navbar);

  this.value = null;

  this.menu = null;

  this.create();
  this.hide();
}

VSVNavBarResolutionButton.prototype = Object.create(PSVNavBarButton.prototype);
VSVNavBarResolutionButton.prototype.constructor = VSVNavBarResolutionButton;

VSVNavBarResolutionButton.id = 'resolution';
VSVNavBarResolutionButton.className = 'psv-button psv-resolution-button';
VSVNavBarResolutionButton.icon = 'resolution.svg';

PSVNavBar.registerButton(VSVNavBarResolutionButton);

/**
 * @override
 */
VSVNavBarResolutionButton.prototype.create = function() {
  PSVNavBarButton.prototype.create.call(this);

  this.value = document.createElement('span');
  this.value.className = 'psv-resolution-button-value';
  this.container.appendChild(this.value);

  this.menu = document.createElement('ul');
  this.menu.className = 'psv-resolutions-list';
  this.container.appendChild(this.menu);

  this.menu.addEventListener('click', this);

  this.psv.on('video-change', this);
  this.psv.on('resolution-change', this);
};

/**
 * @override
 */
VSVNavBarResolutionButton.prototype.destroy = function() {
  this.psv.off('video-change', this);
  this.psv.off('resolution-change', this);

  delete this.value;
  delete this.menu;

  PSVNavBarButton.prototype.destroy.call(this);
};

/**
 * @summary Handles events
 * @param {Event} e
 * @private
 */
VSVNavBarResolutionButton.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'video-change':      this._buildMenu(); break;
    case 'resolution-change': this._updateResolution(e.args[0]); break;
    case 'click':             this._onClickItem(e); break;
    // @formatter:on
  }
};

/**
 * @summary Updates the resolutions list
 * @private
 */
VSVNavBarResolutionButton.prototype._buildMenu = function() {
  var resolutions = this.psv.prop.resolutions;

  if (!resolutions.length) {
    this.hide();
  }
  else {

    this.menu.innerHTML = resolutions
      .map(function(resolution) {
        return '<li data-psv-resolution="' + resolution + '" class="psv-resolutions-list-item">' + resolution + '</li>';
      })
      .join('');

    this.show();
  }
};

/**
 * @summary Changes the selected resolution
 * @param {string} resolution
 * @private
 */
VSVNavBarResolutionButton.prototype._updateResolution = function(resolution) {
  this.value.innerHTML = resolution || '';

  this.menu.querySelectorAll('.psv-resolutions-list-item').forEach(function(item) {
    PSVUtils.toggleClass(item, 'psv-resolutions-list-item--active', item.dataset.psvResolution === resolution);
  });
};

/**
 * @summary Toggles list on click
 * @private
 */
VSVNavBarResolutionButton.prototype._onClick = function() {
  PSVUtils.toggleClass(this.menu, 'psv-resolutions-list--open');
};

/**
 * @summary Changes resolution on item click
 * @param {ClickEvent} e
 * @private
 */
VSVNavBarResolutionButton.prototype._onClickItem = function(e) {
  var li;
  if (e.target && (li = PSVUtils.getClosest(e.target, 'li')) && li.dataset.psvResolution) {
    this.psv.setVideoResolution(li.dataset.psvResolution);
  }
};
