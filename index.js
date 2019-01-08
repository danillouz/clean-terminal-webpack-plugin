'use strict';

class CleanTerminalPlugin {
  constructor(options = {}) {
    const { message, onlyInWatchMode = true } = options;

    this.message = message;
    this.onlyInWatchMode = onlyInWatchMode;
  }

  apply(compiler) {
    // Backwards compatible version of compiler.hooks
    if (!compiler.hooks) {
      compiler.plugin('emit', (_, done) => {
        if (this.shouldClearConsole()) {
          this.clearConsole();
        }

        done();
      });

      return;
    }

    compiler.hooks.afterCompile.tap('CleanTerminalPlugin', () => {
      if (this.shouldClearConsole(compiler)) {
        this.clearConsole();
      }
    });
  }

  shouldClearConsole(compiler) {
    if (this.onlyInWatchMode) {
      return compiler.watchMode;
    }

    return (
      process.env.NODE_ENV !== 'production' &&
      process.env.options.mode !== 'production'
    );
  }

  clearConsole() {
    const clear = '\x1B[2J\x1B[3J\x1B[H';
    const output = this.message ? `${clear + this.message}\n\n` : clear;

    process.stdout.write(output);
  }
}

module.exports = CleanTerminalPlugin;
