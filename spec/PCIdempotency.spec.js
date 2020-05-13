const PCIdempotency = require('../src/PCIdempotency.js');
const Parse = require('parse/node');


describe('test PCIdempotency', () => {
	it('should NOT block nil, empty string, null, or undefined', async () => {
		expect.assertions(1);

		let nada;

		await PCIdempotency.check();
		await PCIdempotency.check();
		await PCIdempotency.check(nada);
		await PCIdempotency.check(nada);
		await PCIdempotency.check('');
		await PCIdempotency.check('');
		await PCIdempotency.check(null);
		await PCIdempotency.check(null);
		await PCIdempotency.check(undefined); // eslint-disable-line no-undefined
		await PCIdempotency.check(undefined); // eslint-disable-line no-undefined
		expect(1).toBe(1);
	});

	it('should NOT block nil, empty string, null, or undefined with Parse', async () => {
		expect.assertions(1);

		let nada;

		await PCIdempotency.check();
		await PCIdempotency.check();
		await PCIdempotency.check(nada, Parse);
		await PCIdempotency.check(nada, Parse);
		await PCIdempotency.check('', Parse);
		await PCIdempotency.check('', Parse);
		await PCIdempotency.check(null, Parse);
		await PCIdempotency.check(null, Parse);
		await PCIdempotency.check(undefined, Parse); // eslint-disable-line no-undefined
		await PCIdempotency.check(undefined, Parse); // eslint-disable-line no-undefined
		expect(1).toBe(1);
	});
});
