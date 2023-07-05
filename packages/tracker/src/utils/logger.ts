/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isUndefined } from "./util";

// Console override
export const logger = {
	log: function (...args: any[]) {
		const config = window.llc;
		if (config.debug && !isUndefined(window.console) && window.console) {
			const log =
				"__rrweb_original__" in window.console.log
					? (window.console.log as any)["__rrweb_original__"]
					: window.console.log;
			try {
				log.apply(window.console, args);
			} catch (err) {
				args.forEach((arg) => {
					log(arg);
				});
			}
		}
	},
	error: function (..._args: any[]) {
		const config = window.llc;
		if (config.debug && !isUndefined(window.console) && window.console) {
			const args = ["LogLib error:", ..._args];
			const error = window.console.error;
			try {
				error.apply(window.console, args);
			} catch (err) {
				args.forEach(function (arg) {
					error(arg);
				});
			}
		}
	},
	critical: function (..._args: any[]) {
		if (!isUndefined(window.console) && window.console) {
			const args = ["LogLib error:", ..._args];
			const error = window.console.error;
			try {
				error.apply(window.console, args);
			} catch (err) {
				args.forEach(function (arg) {
					error(arg);
				});
			}
		}
	},
};
