
PCIdempotency
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCIdempotency` provides a clean way to ensure that multiple save attempts only result in a single object.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save @panda-clouds/idempotency
```

Usage
-----

### Node.js

```javascript
const PCIdempotency = require('@panda-clouds/idempotency');

// example "beforeSave" usage

// example generic ussage with Parse
await PCIdempotency.check('Foo', Parse); // pass
await PCIdempotency.check('Bar', Parse); // pass
await PCIdempotency.check('Bar', Parse); // throws because 456 has already been given

// example generic ussage without Parse
// Note: without parse we only remember the last 500 keys
await PCIdempotency.check('123'); // pass
await PCIdempotency.check('456'); // pass
await PCIdempotency.check('456'); // throws because 456 has already been given
```

You can replace PCIdempotency with any variable.


Methods
-------

[Unit Tests] are an additional resource for learning functionality.

### - checkOnCreate(key, Parse)

will throw an error if the object contains a duplicate value for the key "idempotencyKey"

Example:

// Parse Server v3.x
```javascript
Parse.Cloud.beforeSave('MyObject', async request => {
	await PCIdempotency.checkOnCreate(request, Parse)
})
```
// Parse Server v2.x
```javascript
Parse.Cloud.beforeSave('MyObject', (request, response) => {
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
```

### - check(key, Parse)

will throw an error if we have used that key before

Example:

```javascript
await PCIdempotency.check('myKey')
// better yet, to add persistance, use
await PCIdempotency.check('myKey', Parse)
```



Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCIdempotency.js`
- add unit tests in `PCIdempotency.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCIdempotency.spec.js
