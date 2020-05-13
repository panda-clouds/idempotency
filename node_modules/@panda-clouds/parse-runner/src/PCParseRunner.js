/* global Promise */
const fs = require('fs');
const notBothError = 'Only set projectDir OR cloud, Not Both.';
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');

fs.readFileAsync = filename => {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve(buffer.toString());
			}
		});
	});
};

const PCBash = require('@panda-clouds/parse-bash');
const Parse = require('parse/node');
const exampleAppId = 'example-app-id';
const exampleJavascriptKey = 'example-javascript-key';
const exampleMasterKey = 'example-master-key';

class PCParseRunner {
	constructor() {
		this.seed = PCParseRunner.randomIntFromInterval(0, 99999);
		// these random port are opened to the public to health check the services
		// actual container to container communication happens over the network bridge
		this.mongoPort = PCParseRunner.randomPort(); // 27017;
		this.parsePort = PCParseRunner.randomPort(); // 1337;
		this.parseVersionValue = '3.4.4'; // change to the latest version when it comes out
		this.mainPath = 'src/main.js';
		this.networkName = 'network-' + this.seed;
		this.networkFlag = '--network ' + this.networkName;
		this.serverConfigObject = {};
		this.timeoutValue = 20; // default to 20 tries for parse server to start each a 1 second apart
		this.collectCoverageValue = true;
	}

	async getClock() {
		// could also pass classname HelperClassPath: './NumberHelper.js',
		const result = await Parse.Cloud.run('specGetCurrentTime');

		return result;
	}

	async setClock(time) {
		let currentTime;

		if (!currentTime && time.getTime) {
			currentTime = time.getTime();
		}

		console.log('currentTimeA: ' + currentTime);

		if (!currentTime && time.toDate) {
			currentTime = time.toDate().getTime();
		}

		console.log('currentTimeB: ' + currentTime);
		// could also pass classname HelperClassPath: './NumberHelper.js',
		const result = await Parse.Cloud.run('specSetCurrentTime', { currentTime: currentTime });

		return result;
	}

	async resetClock() {
		// could also pass classname HelperClassPath: './NumberHelper.js',
		const result = await Parse.Cloud.run('specResetCurrentTime');

		return result;
	}

	verbose(input) {
		this.verboseValue = input;
	}

	collectCoverage(bool) {
		this.collectCoverageValue = bool;
	}

	parseVersion(version) {
		this.parseVersionValue = version;
	}

	runNpmInstall(bool) {
		this.shouldNPMInstall = bool;
	}

	main(path) {
		this.mainPath = path;
	}

	prefillMongo(fillMongo) {
		this.prefillMongoValue = fillMongo;
	}

	projectDir(userPath) {
		if (this.cloudPage) {
			throw new Error(notBothError);
		}

		if (userPath.split('/')[0] === '.') {
			throw new Error('projectDir needs a full path, you provided a local one. Please use "parseRunner.projectDir(__dirname);" or something like "parseRunner.projectDir(__dirname + \'/../src/full-project\');"');
		}

		let myPath = userPath;

		if (/\s/.test(userPath)) {
			// the user path has some spaces
			// escape them
			myPath = userPath.replace(/ /g, '\\ ');
		}

		this.projectDirValue = myPath;
	}

	injectCode(codeToInject) {
		if (this.cloudPage) {
			throw new Error(notBothError);
		}

		this.injectCodeValue = codeToInject;
	}

	cloud(cloudPage) {
		if (this.projectDirValue) {
			throw new Error(notBothError);
		}

		this.mainPath = 'main.js';
		this.cloudPage = cloudPage;
	}

	static defaultDBName() {
		return 'parse-test';
	}

	static manyMongoToParseObjects(objects) {
		const returnArray = [];

		for (let i = objects.length - 1; i >= 0; i--) {
			const anObject = objects[i];

			returnArray.push(PCParseRunner.mongoToParseObject(anObject));
		}

		return returnArray;
	}

	static isISO8601withTimeZone(string) {
		if (string &&
			string.length &&
			string.length > 23 &&
			string.length < 30 &&
			moment(string, ['YYYY-MM-DDTHH:mm:ss.SSS', 'YYYY-MM-DDTHH:mm:ss.SSSZ']).isValid()
		) {
			return true;
		}

		// if (
		// 	moment(string, 'YYYY-MM-DDTHH:MM:SS.MMM').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH:MM:SS.MMMZ').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH:MM:SS.MMM+-HH:mm').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH:MM:SS.MMM+-HH').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH:MM:SS').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH:MM').isValid() ||
		// 	moment(string, 'YYYY-MM-DDTHH').isValid() ||
		// 	moment(string, 'YYYY-MM-DD').isValid()
		// ) {
		// 	return true;
		// }

		return false;
	}

	static mongoToParseObject(object) {
		const returnObject = {};
		const keys = Object.keys(object);

		for (let i = keys.length - 1; i >= 0; i--) {
			const thisKey = keys[i];
			const oldValue = object[thisKey];
			let newValue = oldValue;

			if (oldValue) {
				if (PCParseRunner.isISO8601withTimeZone(oldValue)) {
					newValue = new Date(oldValue);
				}

				if (oldValue.__type && oldValue.__type === 'Date' && oldValue.iso) {
					newValue = new Date(oldValue.iso);
				}

				if (oldValue.__type && oldValue.__type === 'Pointer' && oldValue.className && oldValue.objectId) {
					newValue = oldValue.className + '$' + oldValue.objectId;
				}
			}

			returnObject[thisKey] = newValue;
		}

		return returnObject;
	}
	// convience function
	async insertOne(className, object) {
		if (!object || typeof object !== 'object') {
			throw new Error('object must be of type object');
		}

		const connectionString = this.mongoURL();
		const client = await MongoClient.connect(connectionString,
			{ useNewUrlParser: true });

		const db = client.db(PCParseRunner.defaultDBName());

		let res = null;
		let err = null;


		try {
			res = await db.collection(className).insertOne(PCParseRunner.mongoToParseObject(object));
		} catch (e) {
			if (e.message !== null) {
				err = e.message;
			} else {
				err = 'insertOne Failed.';
			}
		} finally {
			client.close();
		}

		if (err !== null) {
			throw new Error(err);
		}

		return res;
	}

	async insertMany(className, objects) {
		if (!objects || !objects.length || !Array.isArray(objects)) {
			throw new Error('objects parameter must be an array');
		}

		for (let i = objects.length - 1; i >= 0; i--) {
			const object = objects[i];

			if (!object || typeof object !== 'object') {
				throw new Error('object must be of type object');
			}
		}

		const connectionString = this.mongoURL();
		const client = await MongoClient.connect(connectionString,
			{ useNewUrlParser: true });

		const db = client.db(PCParseRunner.defaultDBName());

		let res = null;
		let err = null;

		try {
			res = await db.collection(className).insertMany(PCParseRunner.manyMongoToParseObjects(objects));
		} catch (e) {
			if (e.message !== null) {
				err = e.message;
			} else {
				err = 'insertMany Failed.';
			}
		} finally {
			client.close();
		}

		if (err !== null) {
			throw new Error(err);
		}

		return res;
	}

	async find(className, query) {
		const connectionString = this.mongoURL();
		const client = await MongoClient.connect(connectionString,
			{ useNewUrlParser: true });

		const db = client.db(PCParseRunner.defaultDBName());

		let res = null;
		let err = null;

		try {
			res = await db.collection(className).find(query).toArray();
		} catch (e) {
			if (e.message !== null) {
				err = e.message;
			} else {
				err = 'find Failed.';
			}
		} finally {
			client.close();
		}

		if (err !== null) {
			throw new Error(err);
		}

		return res;
	}

	// used for injecting data into mongo before testing
	mongoURL() {
		return 'mongodb://localhost:' + this.mongoPort;
	}

	static tempDir() {
		// This failed because we use Jenkins in docker.
		// the 'write' would go into the jenkins container
		// and the 'read' would go to the host through the docker.sock
		// also we couldn't match the jenkins volume (which would work)
		// because the new one kept saying 'invalid username/password'

		// A: https://github.com/jenkinsci/docker/issues/174
		// basically, you can't just move the dir
		// // we have a 'temp' directory in the root of this projects
		// var path = __dirname;

		// // Notice the double-backslashes on this following line
		// path = path.replace(/ /g, '\\ ');

		// // eslint-disable-next-line no-console
		// console.log('tempDir: ' + path)
		// return path;
		return '/tmp/testing';
	}

	static randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static randomPort() {
		return PCParseRunner.randomIntFromInterval(1024, 65535);
	}
	static test() {
		return 'hi';
	}

	prodImageAndTag() {
		return process.env.CI_PROD_IMAGE_AND_TAG;
	}

	serverConfig(config) {
		this.serverConfigObject = config;
	}

	timeout(value) {
		this.timeoutValue = value;
	}

	helperClass(input) {
		this.helperClassValue = input;
	}

	async callHelper(input, parameters) {
		// could also pass classname HelperClassPath: './NumberHelper.js',
		const result = await Parse.Cloud.run('callHelperClassFunction', { HelperFunction: input, parameters: parameters });

		return result;
	}

	async startParseServer() {
		process.env.TESTING = true;


		// if (process.env.SPEC_USE_EXTERNAL_SERVER) {
		// 	Parse.initialize(exampleAppId, exampleJavascriptKey, exampleMasterKey);
		// 	Parse.serverURL = 'http://localhost:' + this.parsePort + '/1';

		// 	return Parse;
		// }

		await PCBash.runCommandPromise('docker network create ' + this.networkName);

		await PCBash.runCommandPromise('mkdir -p ' + PCParseRunner.tempDir());

		const makeMongo = 'docker run --rm -d ' + this.networkFlag + ' ' +
				'--name mongo-' + this.seed + ' ' +
				'-p ' + this.mongoPort + ':27017 ' +
				'mongo ' +
				'';

		await PCBash.runCommandPromise(makeMongo);

		const config = {};

		config.allowInsecureHTTP = true;
		const app = {};

		app.appId = exampleAppId;
		app.masterKey = exampleMasterKey;
		app.javascriptKey = exampleJavascriptKey;
		app.port = 1337; // this.parsePort;
		app.mountPath = '/1';
		app.verbose = this.verboseValue;
		// app.databaseName = PCParseRunner.defaultDBName();
		// we hardcode 27017 because all C2C communication is linked with a bridge
		app.databaseURI = 'mongodb://mongo-' + this.seed + ':27017/' + PCParseRunner.defaultDBName();
		app.publicServerURL = 'http://localhost:' + app.port + app.mountPath;
		app.serverURL = 'http://localhost:1337' + app.mountPath;

		// cloud page we don't need to set the mainPath
		if ((this.projectDirValue && this.mainPath && this.mainPath !== '') || this.cloudPage || this.prodImageAndTag()) {
			app.cloud = '/parse-server/cloud/' + this.mainPath;
		}

		const combinedApp = { ...app, ...this.serverConfigObject };

		config.apps = [combinedApp];

		await PCBash.putStringInFile(config, PCParseRunner.tempDir() + '/config-' + this.seed);

		// wait for mongo to come up so we don't get a connection error
		try {
			await PCBash.runCommandPromise(
				'export PC_RUNNER_MONGO_TRIES=10\n' +
				'until $(curl --output /dev/null --silent --fail http://localhost:' + this.mongoPort + '); do\n' +
				'    printf \'Waiting for Mongo to come up...\n\'\n' +
				'    sleep 1\n' +
				'    ((PC_RUNNER_MONGO_TRIES--))\n' +
				'    if [ "$PC_RUNNER_MONGO_TRIES" -eq "0" ]; then\n' +
				'        echo "Timed out";\n' +
				'        exit 1;\n' +
				'    fi\n' +
				'done'
			);
		} catch (e) {
			throw new Error('Mongo is in a crash loop. Please try again');
		}

		if (this.prefillMongoValue) {
			await this.prefillMongoValue(this);
		}


		// This is where CI and Dev testing split
		// Dev- uses a volume where we transfer the files manually
		// Prod- we build a docker image once and use the image (containg code) for testing.
		if (this.prodImageAndTag()) {
			// in prod we use the prebundled image with the code inside
			let makeParse = 'docker run -d ' + this.networkFlag + ' ' +
				'-v ' + PCParseRunner.tempDir() + '/config-' + this.seed + ':/parse-server/configuration.json ';

			// no code coverage for prod images coverageDirValue

			makeParse = makeParse + '--name parse-' + this.seed + ' ' +
				'-p ' + this.parsePort + ':1337 ' +
				this.prodImageAndTag() + ' ' +
				'/parse-server/configuration.json';

			await PCBash.runCommandPromise(makeParse);
		} else {
			// In development we use volumes to copy files over
			await PCBash.runCommandPromise('mkdir -p ' + PCParseRunner.tempDir() + '/cloud-' + this.seed);

			if (this.projectDirValue) {
				await PCBash.runCommandPromise('cp -r ' + this.projectDirValue + '/. ' + PCParseRunner.tempDir() + '/cloud-' + this.seed);

				let finalInjection = '';
				const clockFunction = `
							var MockDate = require('mockdate');
							
							Parse.Cloud.define('specGetCurrentTime', request => {
								return new Date().getTime();
							});

							Parse.Cloud.define('specSetCurrentTime', request => {
								const time = request.params.currentTime
								MockDate.set(new Date(time))
							});

							Parse.Cloud.define('specResetCurrentTime', request => {
								MockDate.reset();
							});
							`;
				const helperFunction = `
						const RunnerHelperClass = require('` + this.helperClassValue + `');
						Parse.Cloud.define('callHelperClassFunction', request => {
							const functionName = request.params.HelperFunction;
							if (request.params.parameters) {
								const p = request.params.parameters;
								return RunnerHelperClass[functionName](...p);
							} else {
								return RunnerHelperClass[functionName]();
							}
							
						});
						`;

				if (this.injectCodeValue && this.helperClassValue) {
					// passing as a paramter would also work request.params.HelperClassPath
					finalInjection = clockFunction + this.injectCodeValue + helperFunction;
				} else if (this.helperClassValue) {
					// passing as a paramter would also work request.params.HelperClassPath
					finalInjection = clockFunction + helperFunction;
				} else if (this.injectCodeValue) {
					finalInjection = clockFunction + this.injectCodeValue;
				} else {
					finalInjection = clockFunction;
				}

				let pathToMain = this.mainPath.split('/');

				pathToMain.pop();
				pathToMain = pathToMain.join('/');
				await PCBash.putStringInFile(finalInjection, PCParseRunner.tempDir() + '/cloud-' + this.seed + '/' + pathToMain + '/specInjection.js');
				await PCBash.runCommandPromise('echo \'require("./specInjection.js");\' >> ' + PCParseRunner.tempDir() + '/cloud-' + this.seed + '/' + this.mainPath);

				if (this.shouldNPMInstall) {
					await PCBash.runCommandPromise('cd ' + PCParseRunner.tempDir() + '/cloud-' + this.seed + '; npm install');
				}
			} else if (this.cloudPage) {
				await PCBash.putStringInFile(this.cloudPage, PCParseRunner.tempDir() + '/cloud-' + this.seed + '/main.js');
			}

			let makeParse = 'docker run -d ' + this.networkFlag + ' ' +
				'--name parse-' + this.seed + ' ' +
				'-v ' + PCParseRunner.tempDir() + '/config-' + this.seed + ':/parse-server/configuration.json ' +
				'-v ' + PCParseRunner.tempDir() + '/cloud-' + this.seed + ':/parse-server/cloud/ ';

			if (this.collectCoverageValue && this.projectDirValue) {
				// ubuntu fails without this manual command
				await PCBash.runCommandPromise('mkdir -p ' + this.projectDirValue + '/.nyc_output/processinfo');

				makeParse = makeParse + '-v ' + this.projectDirValue + '/coverage:/parse-server/coverage ';
				makeParse = makeParse + '-v ' + this.projectDirValue + '/.nyc_cache:/parse-server/.nyc_cache ';
				makeParse = makeParse + '-v ' + this.projectDirValue + '/.nyc_output:/parse-server/.nyc_output ';
			}

			makeParse = makeParse + '-p ' + this.parsePort + ':1337 ' +
				'pandaclouds/parse-coverage:' + this.parseVersionValue + ' ' +
				'/parse-server/configuration.json';

			await PCBash.runCommandPromise(makeParse);
		}

		try {
			await PCBash.runCommandPromise(
				'export PC_RUNNER_PARSE_TRIES=' + this.timeoutValue + '\n' +
				'until $(curl --output /dev/null --silent --head --fail http://localhost:' + this.parsePort + '/1/health); do\n' +
				'    printf \'Waiting for Parse Server to come up...\n\'\n' +
				'    sleep 1\n' +
				'    ((PC_RUNNER_PARSE_TRIES--))\n' +
				'    if [ "$PC_RUNNER_PARSE_TRIES" -eq "0" ]; then\n' +
				'        echo "Timed out. here are logs:";\n' +
				'        docker logs parse-' + this.seed + ';\n' +
				'        exit 1;\n' +
				'    fi\n' +
				'done'
			);
		} catch (e) {
			throw new Error('Parse Server crashed. Please check logs to debug cloud or configuration issues.');
		}

		Parse.initialize(exampleAppId, exampleJavascriptKey, exampleMasterKey);
		Parse.serverURL = 'http://localhost:' + this.parsePort + '/1';
		// eslint-disable-next-line no-console
		console.log('Parse Server up and running');

		return Parse;
	}

	async dropDB() {
		await PCBash.runCommandPromise('docker exec mongo-' + this.seed + ' mongo ' + PCParseRunner.defaultDBName() + ' --eval "db.dropDatabase()"');
	}

	async cleanUp() {
		try {
			await this.dropDB();
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker logs parse-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('rm ' + PCParseRunner.tempDir() + '/config-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker stop parse-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker rm parse-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker stop mongo-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker network rm ' + this.networkName);
		} catch (e) {
			// Disregard failures
		}

		// This must be after "docker stop parse-seed" for code coverage to work.
		try {
			if (this.projectDirValue || this.cloudPage) {
				await PCBash.runCommandPromise('rm -r ' + PCParseRunner.tempDir() + '/cloud-' + this.seed);
			}
		} catch (e) {
			// Disregard failures
		}
	}
}

module.exports = PCParseRunner;
