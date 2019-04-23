
PCDate
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCDate` is a lightweight JavaScript library for Node.js that provides additional Date methods.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save @panda-clouds/date
```

Usage
-----

### Node.js

```javascript
const PCDate = require('@panda-clouds/date');

// example usage
PCDate.isDate(new Date()); // => true;
PCDate.addTime(new Date(), 1, 'hour'); // => a date object that is 1 hour in the future;
```

You can replace PCDate with any variable.


Methods
-------

[Unit Tests] are an additional resource for learning functionality.

### - isDate(date)

Returns whether a given object is a Date.

Example:

```javascript
PCDate.isDate(new Date()) // => true
PCDate.isDate('ABC') // => false
PCDate.isDate(5) // => false
PCDate.isDate({}) // => false
PCDate.isDate([]) // => false
```

### - addTime(date,number,unit)

returns a date object offset by the number and unit

units can be
- years
- months
- weeks
- days
- hours
- minutes
- seconds

Example:

```javascript
PCDate.addTime(new Date(), 5, 'seconds') // => 5 seconds in the future
PCDate.addTime(new Date(), -3, 'hours') // => 3 hours in the past
PCDate.addTime(new Date(), 1, 'week') // => 1 week in the future
```


Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCDate.js`
- add unit tests in `PCDate.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCDate.spec.js
