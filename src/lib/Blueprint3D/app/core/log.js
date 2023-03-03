export const ELogContext = {
  /** Log nothing. */
  None: "None",

  /** Log all. */
  All: "All",

  /** 2D interaction */
  Interaction2d: "Interaction2d",

  /** Interior items */
  Item: "Item",

  /** Wall (connectivity) */
  Wall: "Wall",

  /** Room(s) */
  Room: "Room",
};

export const ELogLevel = {
  /** An information. */
  Information: "Information",

  /** A warning. */
  Warning: "Warning",

  /** An error. */
  Error: "Error",

  /** A fatal error. */
  Fatal: "Fatal",

  /** A debug message. */
  Debug: "Debug",
};

/** The current log context. To be set when initializing the Application. */
export const logContext = ELogContext.None;

/** Pre-check if logging for specified context and/or level is enabled.
 * This may be used to avoid compilation of complex logs.
 * @param context The log context to be verified.
 * @param level The log level to be verified.
 * @returns If this context/levels is currently logged.
 */
export function isLogging(context, level) {
  return (
    logContext === ELogContext.All ||
    logContext === context ||
    level === ELogLevel.Warning ||
    level === ELogLevel.Error ||
    level === ELogLevel.Fatal
  );
}

/** Log the passed message in the context and with given level.
 * @param context The context in which the message should be logged.
 * @param level The level of the message.
 * @param message The messages to be logged.
 */
export function log(context, level, message) {
  if (isLogging(context, level) === false) {
    return;
  }

  let tPrefix = "";
  switch (level) {
    case ELogLevel.Information:
      tPrefix = "[INFO_] ";
      break;
    case ELogLevel.Warning:
      tPrefix = "[WARING] ";
      break;
    case ELogLevel.Error:
      tPrefix = "[ERROR] ";
      break;
    case ELogLevel.Fatal:
      tPrefix = "[FATAL] ";
      break;
    case ELogLevel.Debug:
      tPrefix = "[DEBUG] ";
      break;
    default:
      break;
  }
  return tPrefix;
}
