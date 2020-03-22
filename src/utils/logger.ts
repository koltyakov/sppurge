export const enum LogLevel {
  Debug = 5,
  Verbose = 4,
  Info = 3,
  Warning = 2,
  Error = 1,
  Off = 0
}

export class Logger {

  constructor(public level: LogLevel | number = LogLevel.Info) { /**/ }

  public debug(...args: any[]) {
    const suppressLogs = `${process.env.SPPURGE_SILENT}` === 'true';
    if (this.level >= LogLevel.Debug) {
      if (!suppressLogs) console.log(...args);
    }
  }

  public verbose(...args: any[]) {
    const suppressLogs = `${process.env.SPPURGE_SILENT}` === 'true';
    if (this.level >= LogLevel.Verbose) {
      if (!suppressLogs) console.log(...args);
    }
  }

  public info(...args: any[]) {
    const suppressLogs = `${process.env.SPPURGE_SILENT}` === 'true';
    if (this.level >= LogLevel.Info) {
      if (!suppressLogs) console.log(...args);
    }
  }

  public warning(...args: any[]) {
    const suppressLogs = `${process.env.SPPURGE_SILENT}` === 'true';
    if (this.level >= LogLevel.Warning) {
      if (!suppressLogs) console.log(...args);
    }
  }

  public error(...args: any[]) {
    const suppressLogs = `${process.env.SPPURGE_SILENT}` === 'true';
    if (this.level >= LogLevel.Error) {
      if (!suppressLogs) console.log(...args);
    }
  }

}

export const logger = new Logger(parseInt(process.env.LOG_LEVEL || '3', 10));
