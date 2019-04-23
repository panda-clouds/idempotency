const PCParseRunner = require('@panda-clouds/parse-runner');
const PCIdempotency = require('../src/PCIdempotency.js');
const Parse = require('parse/node');


describe('test PCIdempotency', () => {
	const parseRunner = new PCParseRunner();

	parseRunner.parseVersion('3.1.3');
	const cloud =
`
const PCIdempotency = require(__dirname + '/PCIdempotency.js');
Parse.Cloud.beforeSave('Nada', async request => {
	await PCIdempotency.checkOnCreate(request, Parse)
})
Parse.Cloud.beforeSave('AnyBlock', async request => {
	await PCIdempotency.checkOnCreate(request, Parse)
})
Parse.Cloud.beforeSave('ForceParse', async request => {
	await PCIdempotency.checkOnCreate(request, Parse, true)
})
`;

	parseRunner.cloud(cloud);
	parseRunner.loadFile('./src/PCIdempotency.js', 'PCIdempotency.js');


	beforeAll(async () => {
		await parseRunner.startParseServer();
	}, 1000 * 60 * 2);

	afterAll(async () => {
		await parseRunner.cleanUp();
	});

	beforeEach(async () => {
		await parseRunner.dropDB();
	}, 1000 * 60 * 2);

	it('should do nothing without idempotencyKey', async () => {
		expect.assertions(1);

		try {
			const obj = new Parse.Object('Nada');

			obj.set('random', 'Foo');
			// if we leave out the await
			// it throws an error in the env
			// because its released from the block
			await obj.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj2 = new Parse.Object('Nada');

			obj2.set('random', 'Foo');
			await obj2.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj3 = new Parse.Object('Nada');

			obj3.set('random', 'Foo');
			await obj3.save();
		} catch (e) {
			// console.log('error');
		}

		const query = new Parse.Query('Nada');
		const number = await query.count();

		expect(number).toBe(3);
	}, 1000 * 20);

	it('should block double save', async () => {
		expect.assertions(1);

		try {
			const obj = new Parse.Object('AnyBlock');

			obj.set('idempotencyKey', 'Foo');
			// if we leave out the await
			// it throws an error in the env
			// because its released from the block
			await obj.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj2 = new Parse.Object('AnyBlock');

			obj2.set('idempotencyKey', 'Foo');
			await obj2.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj3 = new Parse.Object('AnyBlock');

			obj3.set('idempotencyKey', 'Foo');
			await obj3.save();
		} catch (e) {
			// console.log('error');
		}

		const query = new Parse.Query('AnyBlock');
		const number = await query.count();

		expect(number).toBe(1);
	}, 1000 * 20);

	it('should block double save forcing Parse', async () => {
		expect.assertions(1);

		try {
			const obj = new Parse.Object('ForceParse');

			obj.set('idempotencyKey', 'Bar');
			// if we leave out the await
			// it throws an error in the env
			// because its released from the block
			await obj.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj2 = new Parse.Object('ForceParse');

			obj2.set('idempotencyKey', 'Bar');
			await obj2.save();
		} catch (e) {
			// console.log('error');
		}

		try {
			const obj3 = new Parse.Object('ForceParse');

			obj3.set('idempotencyKey', 'Bar');
			await obj3.save();
		} catch (e) {
			// console.log('error');
		}

		const query = new Parse.Query('ForceParse');
		const number = await query.count();

		expect(number).toBe(1);
	}, 1000 * 20);

	it('should block with parse', async () => {
		expect.assertions(1);

		let total = 0;

		try {
			await PCIdempotency.check('Baz', Parse);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		try {
			await PCIdempotency.check('Baz', Parse);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		try {
			await PCIdempotency.check('Baz', Parse);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		expect(total).toBe(1);
	}, 1000 * 20);

	it('should block with only parse', async () => {
		expect.assertions(1);

		let total = 0;

		try {
			await PCIdempotency.check('ABC', Parse, true);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		try {
			await PCIdempotency.check('ABC', Parse, true);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		try {
			await PCIdempotency.check('ABC', Parse, true);
			total ++;
		} catch (e) {
			// console.log('error');
		}

		expect(total).toBe(1);
	}, 1000 * 20);

	it('should block without parse', async () => {
		expect.assertions(1);
		let total = 0;

		try {
			await PCIdempotency.check('DEF');
			total ++;
		} catch (e) {
			// console.log('icsondcs error' + JSON.stringify(e) + e);
		}

		try {
			await PCIdempotency.check('DEF');
			total ++;
		} catch (e) {
			// console.log('error');
		}

		try {
			await PCIdempotency.check('DEF');
			total ++;
		} catch (e) {
			// console.log('error');
		}

		expect(total).toBe(1);
	}, 1000 * 20);

	it('should handle last 500', async () => {
		expect.assertions(2);

		// creates an array of 1...500
		for (let i = 500; i >= 1; i--) {
			await PCIdempotency.check('' + i);
		}

		try {
			// should fail because we remember 500 back
			await PCIdempotency.check('500');
		} catch (e) {
			expect(1).toBe(1);
		}

		// still an array of 1...500
		await PCIdempotency.check('bump');

		// now an array of bump,1...499
		// 500 should be allowed
		await PCIdempotency.check('500');

		expect(PCIdempotency._cacheLength()).toBe(500);
	}, 1000 * 20);
});
