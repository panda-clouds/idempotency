
const kIdempotencyError = 'That object was already created.'; // DO NOT CHANGE: clients block alerts that start with this phrase
const cache = [];
// const PCDate = require('@panda-clouds/date');

class PCIdempotency {
	constructor() {
		// Empty Constructor
	}
	static async checkOnCreate(request, Parse, disableInstanceCheck) {
		const obj = request.object;

		if (obj && obj.isNew() && obj.has('idempotencyKey')) {
			const key = obj.get('idempotencyKey');

			await PCIdempotency.check(key, Parse, disableInstanceCheck);
			obj.unset('idempotencyKey');
		}
	}

	// the Parse variable is optional
	// disableInstanceCheck forces Parse Query. (debug only)
	static async check(key, Parse, disableInstanceCheck) {
		if (!key || key === '' || key === null) {
			return;
		}

		if (!disableInstanceCheck) {
			// 1. shallow check on this instance only
			if (cache.indexOf(key) !== -1) {
				throw Error(kIdempotencyError + ' (key: ' + key + ')');
			}

			cache.push(key);
		}

		if (Parse) {
			// 2. Deeper check in database IF Parse was provided
			const query = new Parse.Query('IdempotencyKey');

			query.equalTo('key', key);
			query.limit(1);

			const results = await query.find({ useMasterKey: true });

			if (results && results.length > 0) {
				const object = results[0];

				throw Error(kIdempotencyError + ' (id: ' + object.id + ')');
			}

			const saveObject = new Parse.Object('IdempotencyKey');

			saveObject.set('key', key);
			const tomorrow = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);

			saveObject.set('expires', tomorrow);
			await saveObject.save(null, { useMasterKey: true });
			// remove from cache to keep the size down

			if (cache.indexOf(key) !== -1) {
				cache.splice(cache.indexOf(key), 1);
			}
		} else if (cache && cache.length > 500 && !disableInstanceCheck) {
			// we don't use parse
			// so only keep the last 500
			// if we have 500 remove the oldest
			cache.shift();
		}
	}

	static _cacheLength() {
		return cache.length;
	}

	static _cache() {
		return cache;
	}
}

module.exports = PCIdempotency;
