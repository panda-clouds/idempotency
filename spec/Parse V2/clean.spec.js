const PCParseRunner = require('@panda-clouds/parse-runner');
const PCIdempotency = require('../../src/PCIdempotency.js');
const Parse = require('parse/node');


describe('test PCIdempotency', () => {
	const parseRunner = new PCParseRunner();

	parseRunner.parseVersion('2.8.4');
	const cloud =
`
const PCIdempotency = require(__dirname + '/PCIdempotency.js');

Parse.Cloud.beforeSave('AnyBlock', (request, response) => {
	return Parse.Promise.as()
	.then(()=>{
	  return PCIdempotency.checkOnCreate(request, Parse)
	})
	.then(()=>{
		response.success('yay');
	},(error)=>{
		response.error(error);
	})
})
Parse.Cloud.define('pruneKeys', (request, response) => {
	return Parse.Promise.as()
	.then(()=>{
	  return PCIdempotency.pruneExpiredKeys(request, Parse)
	})
	.then(()=>{
		response.success('yay');
	},(error)=>{
		response.error(error);
	})
})
`;

	parseRunner.injectCode(cloud);
	parseRunner.projectDir(__dirname + '/../..');
	parseRunner.main('./src/main.js');


	beforeAll(async () => {
		await parseRunner.startParseServer();
	}, 1000 * 60 * 2);

	afterAll(async () => {
		await parseRunner.cleanUp();
	});

	beforeEach(async () => {
		await parseRunner.dropDB();
	}, 1000 * 60 * 2);


	it('should not remove non-expired keys', async () => {
		expect.assertions(3);

		try {
			const obj = new Parse.Object('AnyBlock');

			obj.set('idempotencyKey', 'Foo');
			// if we leave out the await
			// it throws an error in the env
			// because its released from the block
			const updateObj = await obj.save();

			updateObj.set('updated', 'yuppers');
			await updateObj.save();
		} catch (e) {
			// console.log('error');
		}

		const obj2 = await Parse.Cloud.run('pruneKeys');

		expect(results).toBe('yay');


		try {
			// If the prune keys removed our key this would succeed
			const obj3 = new Parse.Object('AnyBlock');

			obj3.set('idempotencyKey', 'Foo');
			await obj3.save();
		} catch (e) {
			// console.log('error');
		}

		const query = new Parse.Query('AnyBlock');
		const results = await query.find();

		expect(results).toHaveLength(1);

		const first = results[0];

		expect(first.has('updated')).toBe(true);
		expect(first.get('updated')).toBe('yuppers');
	}, 1000 * 20);

	it('should remove expired keys', async () => {
		expect.assertions(3);

		try {
			const obj = new Parse.Object('AnyBlock');

			obj.set('idempotencyKey', 'Foo');
			// if we leave out the await
			// it throws an error in the env
			// because its released from the block
			const updateObj = await obj.save();

			updateObj.set('updated', 'yuppers');
			await updateObj.save();
		} catch (e) {
			// console.log('error');
		}

		const obj2 = await Parse.Cloud.run('pruneKeys');

		expect(results).toBe('yay');


		try {
			// If the prune keys removed our key this would succeed
			const obj3 = new Parse.Object('AnyBlock');

			obj3.set('idempotencyKey', 'Foo');
			await obj3.save();
		} catch (e) {
			// console.log('error');
		}

		const query = new Parse.Query('AnyBlock');
		const results = await query.find();

		expect(results).toHaveLength(1);

		const first = results[0];

		expect(first.has('updated')).toBe(true);
		expect(first.get('updated')).toBe('yuppers');
	}, 1000 * 20);
});
