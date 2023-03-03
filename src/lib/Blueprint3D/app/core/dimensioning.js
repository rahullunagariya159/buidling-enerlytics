import Core from ".";

export const dimInch = "inch";
export const dimFeet = "ft";
export const dimMeter = "m";
export const dimCentiMeter = "cm";
export const dimMilliMeter = "mm";

export const unitScale = 1;

/** Dimensioning functions. */
export class Dimensioning {
  /** Converts cm to dimensioning string.
   * @param cm Centi meter value to be converted.
   * @returns String representation.
   */
  static getUnit() {
    switch (Core.Configuration.getStringValue(Core.configDimUnit)) {
      case dimInch:
        return `in`;
      case dimMilliMeter:
        return `mm`;
      case dimCentiMeter:
        return `cm`;
      case dimMeter:
      default:
        return `m`;
    }
  }
  static cmToMeasure(cm, pow = 1) {
    switch (Core.Configuration.getStringValue(Core.configDimUnit)) {
      case dimInch:
        return `${Math.round(cm / Math.pow(2.54, pow))} in`;
      case dimMilliMeter:
        return `${Math.round(cm * Math.pow(10, pow))} mm`;
      case dimCentiMeter:
        return `${Math.round(10 * cm) / 10} cm`;
      case dimMeter:
      default:
        return `${Math.round((cm / Math.pow(100, pow)) * 100) / 100} m`;
    }
  }

  static cmToMeasureWithoutUnit(cm, pow = 1) {
    switch (Core.Configuration.getStringValue(Core.configDimUnit)) {
      case dimInch:
        return Math.round(cm / Math.pow(2.54, pow));
      case dimMilliMeter:
        return Math.round(cm * Math.pow(10, pow));
      case dimCentiMeter:
        return Math.round(10 * cm) / 10;
      case dimMeter:
      default:
        return Math.round((cm / Math.pow(100, pow)) * 100) / 100;
    }
  }

  static measureToCm(measure, pow = 1) {
    switch (Core.Configuration.getStringValue(Core.configDimUnit)) {
      case dimInch:
        return measure * Math.pow(2.54, pow);
      case dimMilliMeter:
        return measure / Math.pow(10, pow);
      case dimCentiMeter:
        return measure;
      case dimMeter:
      default:
        return measure * Math.pow(100, pow);
    }
  }
}
