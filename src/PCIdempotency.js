
const kIdempotencyError = 'That object was already created.'; // DO NOT CHANGE: clients block alerts that start with this phrase
const cache = [];
// const PCPromise = require('@panda-clouds/promise');
// const PCString = require('@panda-clouds/string');

class PCIdempotency {
	constructor() {
		// Empty Constructor
	}

	static existsInCache(key) {
		if (cache.indexOf(key) !== -1) {
			return true;
		}

		return false;
	}

	static async existsInParse(key, Parse) {
		if (Parse) {
			// 2. Deeper check in database IF Parse was provided
			const query = new Parse.Query('IdempotencyKey');

			query.equalTo('key', key);

			const object = await query.first({ useMasterKey: true });

			if (object) {
				return true;
			}
		}

		return false;
	}

	// the Parse variable is optional
	static async keyExists(key, Parse) {
		if (!key || key === '' || key === null) {
			return false; // no key = doesn't exist
		}

		// 1. shallow check on this instance only
		//    designed to protect from two requests milliseconds apart
		if (this.existsInCache(key)) {
			return true;
		}

		// 2. Deeper check in database
		//    designed for multi server setups and long term memory
		if (await this.existsInParse(key, Parse)) {
			return true;
		}

		return false;
	}

	static addKeyToCache(key) {
		cache.push(key);

		if (cache.length > 500) {
			cache.shift();
		}
	}

	static async addKeyToParse(key, Parse, expirationDateOverride) {
		let expirationDate;

		if (expirationDateOverride) {
			expirationDate = expirationDateOverride;
		} else {
			expirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
		}

		if (Parse) {
			const saveObject = new Parse.Object('IdempotencyKey');

			saveObject.set('key', key);
			saveObject.set('expires', expirationDate);
			await saveObject.save(null, { useMasterKey: true });
		}

		return false;
	}

	// the Parse variable is optional
	static async addKey(key, Parse) {
		if (!key || key === '' || key === null) {
			return false; // no key = doesn't exist
		}

		// 1. shallow check on this instance only
		//    designed to protect from two requests milliseconds apart
		this.addKeyToCache(key)

		// 2. Deeper check in database
		//    designed for multi server setups and long term memory
		await this.addKeyToParse(key, Parse)

		this.removeKeyFromCache(key)


		return false;
	}

	static removeKeyFromCache(key) {
		let index = cache.indexOf(key)

		// loop to remove all instances
		while (index !== -1) {
			cache.splice(index, 1);
			index = cache.indexOf(key)
		}
	}

	static async removeKeyFromParse(key, Parse) {
		if (Parse) {
			// 2. Deeper check in database IF Parse was provided
			const query = new Parse.Query('IdempotencyKey');

			query.equalTo('key', key);

			await query.each((keyToRemove)=>{
				await keyToRemove.destroy({ useMasterKey: true })
			},{ useMasterKey: true });

			if (object) {
				return true;
			}
		}

		return false;
	}

	// the Parse variable is optional
	static async keyExists(key, Parse) {
		if (!key || key === '' || key === null) {
			return false; // no key = doesn't exist
		}

		// 1. shallow check on this instance only
		//    designed to protect from two requests milliseconds apart
		if (this.existsInCache(key)) {
			return true;
		}

		// 2. Deeper check in database
		//    designed for multi server setups and long term memory
		if (await this.existsInParse(key, Parse)) {
			return true;
		}

		return false;
	}

	static async pruneExpiredKeys(Parse) {
		if (Parse) {
			const query = new Parse.Query('IdempotencyKey');

			query.greaterThanOrEqualTo('expires', new Date());

			await query.each(async expiredKey => {
				await expiredKey.destroy({ useMasterKey: true });
			},{ useMasterKey: true } );
		}

		return false;
	}


	static async throwIfKeyExistsOnCreate(request, Parse, disableInstanceCheck) {
		const obj = request.object;

		if (obj && obj.isNew() && obj.has('idempotencyKey')) {
			const key = obj.get('idempotencyKey');

			await PCIdempotency.throwIfKeyExists(key, Parse, disableInstanceCheck);
			obj.unset('idempotencyKey');
		}
	}


	static async checkOnCreate(request, Parse, disableInstanceCheck) {
		const obj = request.object;

		if (obj && obj.isNew() && obj.has('idempotencyKey')) {
			const key = obj.get('idempotencyKey');

			await PCIdempotency.check(key, Parse, disableInstanceCheck);
			obj.unset('idempotencyKey');
		}
	}

	// static async checkOnCreateAndRetry(request, Parse, timeout, disableInstanceCheck, originalTime) {
	// 	let startDate;

	// 	if (originalTime) {
	// 		startDate = originalTime;
	// 	} else {
	// 		startDate = new Date();
	// 	}

	// 	try {
	// 		const value = await this.checkOnCreate(request, Parse, disableInstanceCheck);

	// 		return value;
	// 	} catch (e) {
	// 		console.log('timeout' + (new Date().getTime() - startDate.getTime()) / 1000);

	// 		if ((new Date().getTime() - startDate.getTime()) / 1000 > timeout) {
	// 			// we timed out
	// 			throw e;
	// 		}

	// 		await PCPromise.wait(1000);
	// 	}

	// 	const returnValue = await this.checkOnCreateAndRetry(request, Parse, timeout, disableInstanceCheck, startDate);

	// 	return returnValue;
	// }

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

			const object = await query.first({ useMasterKey: true });

			if (object) {
				if (object.get('done') && object.has('success')) {
					return object.get('success');
				} else if (object.get('done') && object.has('error')) {
					throw Error(object.get('error'));
				} else {
					throw Error(kIdempotencyError + ' (id: ' + object.id + ')');
				}
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

	// // Never throws, silently fails
	// static async resolveKey(key, response) {
	// 	if (!response || !PCString.isString(response)) {
	// 		// must be a valid string
	// 		return;
	// 	}

	// 	const query = new Parse.Query('IdempotencyKey');

	// 	query.equalTo('key', key);
	// 	query.limit(1);

	// 	const results = await query.find({ useMasterKey: true });

	// 	if (results && results.length > 0) {
	// 		const object = results[0];

	// 		object.set('done', true);
	// 		object.set('results', response);
	// 	}
	// }

	// // Never throws, silently fails
	// static async rejectKey(key, error) {
	// 	if (!error || !PCString.isString(error)) {
	// 		// must be a valid string
	// 		return;
	// 	}

	// 	const query = new Parse.Query('IdempotencyKey');

	// 	query.equalTo('key', key);
	// 	query.limit(1);

	// 	const results = await query.find({ useMasterKey: true });

	// 	if (results && results.length > 0) {
	// 		const object = results[0];

	// 		object.set('done', true);
	// 		object.set('error', error);
	// 	}
	// }

	static _cacheLength() {
		return cache.length;
	}

	static _cache() {
		return cache;
	}
}

module.exports = PCIdempotency;
