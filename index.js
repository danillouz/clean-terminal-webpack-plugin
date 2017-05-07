'use strict';

function CleanTerminalPlugin(options = { }) {
	const {
		message
	} = options;

	this.message = message;
}

CleanTerminalPlugin.prototype.apply = function (compiler) {
	compiler.plugin(
		'emit',
		(_, done) => {
			if (process.env.NODE_ENV !== 'production') {
				const clear = '\x1B[2J\x1B[3J\x1B[H';
				const output = this.message ? clear + this.message + '\n\n' : clear;

				process.stdout.write(output);
			}

			done();
		}
	);
};

module.exports = CleanTerminalPlugin;