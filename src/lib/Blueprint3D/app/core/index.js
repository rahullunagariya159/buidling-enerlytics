import * as Configuration from './configuration';
import * as Dimensioning from './dimensioning';
import * as Log from './log';
import * as Utils from './utils';
import * as Version from './version';
import * as Events from './customEvents';

const Core = {
  ...Configuration,
  ...Dimensioning,
  ...Log,
  ...Utils,
  ...Version,
  ...Events
};
export default Core;
