'use strict';

const chalk = require('chalk');

// TODO:
// add file logging !low!

const log = console.log;

module.exports = {
	console: {
		message: (msg, tag = '') => {
			log(chalk.bgBlue.white.bold('MESSAGE'), `-${tag}-`, msg);
		},
		notification: (msg) => {
			log(chalk.black.bgWhite.bold('NOTIFICATION'), '-', msg);
		},
		success: (msg) => {
			log(chalk.black.bgGreenBright.bold('SUCCESS'), '-', msg);
		},
		warning: (msg) => {
			log(chalk.black.bgYellowBright.bold('WARNING'), '-', msg);
		},
		error: (msg) => {
			log(chalk.yellow.bgRed.bold('ERROR'), '-', msg);
		},
	},
	file : {},
};