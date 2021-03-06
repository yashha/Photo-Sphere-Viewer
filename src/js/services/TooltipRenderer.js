import { Tooltip } from '../components/Tooltip';
import { getStyle } from '../utils';
import { AbstractService } from './AbstractService';

/**
 * @summary Tooltip renderer
 * @extends PSV.services.AbstractService
 * @memberof PSV.services
 */
export class TooltipRenderer extends AbstractService {

  /**
   * @param {PSV.Viewer} psv
   */
  constructor(psv) {
    super(psv);

    const testTooltip = new Tooltip(this.psv);

    /**
     * @summary Computed static sizes
     * @member {Object}
     * @package
     * @property {number} arrowSize
     * @property {number} offset
     */
    this.size = {
      arrow : parseInt(getStyle(testTooltip.arrow, 'borderTopWidth'), 10),
      offset: parseInt(getStyle(testTooltip.container, 'outlineWidth'), 10),
    };

    testTooltip.destroy();
  }

  /**
   * @override
   */
  destroy() {
    delete this.size;

    super.destroy();
  }

  /**
   * @summary Displays a new tooltip
   * @param {Tooltip.Config} config
   * @returns {PSV.components.Tooltip}
   */
  create(config) {
    const tooltip = new Tooltip(this.psv, this.size);
    tooltip.show(config);

    return tooltip;
  }

}
