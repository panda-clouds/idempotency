
PCParseRunner
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCParseRunner` spins up dockerized "Parse Server" and "Mongo" instances for testing.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save-dev @panda-clouds/parse-runner
```

Usage
-----

### Node.js

```javascript
const PCParseRunner = require('@panda-clouds/parse-runner');


describe('a describe block', () => {

	const parseRunner = new PCParseRunner();

	parseRunner.parseVersion(version);

	// begin optional cloud code
	const cloud =
`
Parse.Cloud.define('myFunction', function(request, response) {
	return 'myResults';
});
`;
	parseRunner.cloud(cloud);
	// end optional cloud code

	beforeAll(async () => {
		await parseRunner.startParseServer();
	}, 1000 * 60 * 2);

	afterAll(async () => {
		await parseRunner.cleanUp();
	});

	it('should call a Parse function', async () => {
		const result = await Parse.Cloud.run('myFunction');

		expect(result).toBe('myResults');
		expect(result).not.toBe('superman');
	});
})
```

You can replace PCParseRunner with any variable.


Methods
-------

[Unit Tests] are the best resource for learning functionality.



Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCParseRunner.js`
- add unit tests in `PCParseRunner.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCParseRunner.spec.js
