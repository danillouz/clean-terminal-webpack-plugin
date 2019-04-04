'use strict';

class CleanTerminalPlugin {
  constructor(options = {}) {
    const { message, onlyInWatchMode = true } = options;

    this.message = message;
    this.onlyInWatchMode = onlyInWatchMode;
  }

  apply(compiler) {
    /*
     * Depending on the API available, we either use compiler hooks
     * or compiler events (compiler events are supported for backwards compatibility)
     */
    if (compiler.hooks) {
      this.useCompilerHooks(compiler);
    } else {
      this.useCompilerEvents(compiler);
    }
  }

  shouldClearConsole(compiler) {
    if (this.onlyInWatchMode) {
      return Boolean(compiler.watchMode);
    }

    const isNodeEnvProduction = process.env.NODE_ENV === 'production';
    const isOptionsModeProduction = Boolean(
      compiler.options && compiler.options.mode === 'production'
    );

    return !isNodeEnvProduction && !isOptionsModeProduction;
  }

  useCompilerHooks(compiler) {
    compiler.hooks.afterCompile.tap('CleanTerminalPlugin', () => {
      if (this.shouldClearConsole(compiler)) {
        this.clearConsole();
      }
    });
  }

  useCompilerEvents(compiler) {
    compiler.plugin('emit', (_, done) => {
      if (this.shouldClearConsole(compiler)) {
        this.clearConsole();
      }
      done();
    });
  }

  clearConsole() {
    const clear = '\x1B[2J\x1B[3J\x1B[H';
    const output = this.message ? `${clear + this.message}\n\n` : clear;

    process.stdout.write(output);
  }
}

module.exports = CleanTerminalPlugin;
