export class Version {
  /** The informal version. */
  static getInformalVersion() {
    return "1.1";
  }

  /** The technical version. */
  static getTechnicalVersion() {
    return "1.1.0.0";
  }
}

// console.log(
//   `Blueprint3D ${Version.getInformalVersion()} (${Version.getTechnicalVersion()})`
// );
