
const PCParseRunner = require('../src/PCParseRunner.js');

function runAllTests(version, cloud) {
	describe('check beforesave in v' + version, () => {
		const parseRunner = new PCParseRunner();

		parseRunner.parseVersion(version);
		parseRunner.cloud(cloud);
		parseRunner.loadFile('./src/PCTestClass.js', 'PCTestClass.js');

		it('should timeout', async () => {
			expect.assertions(1);

			try {
				await parseRunner.startParseServer();
				expect(1).toBe(2);
			} catch (e) {
				console.log('error: ' + JSON.stringify(e));
				await parseRunner.cleanUp();
				expect(1).toBe(1);
			}
		}, 1 * 60 * 1000);
	});
}


const cloudV2 =
`
const crash = bad value!
`;

runAllTests('2.8.4', cloudV2);

const cloudV3 =
`
const crash = bad value!
`;

runAllTests('3.1.3', cloudV3);
