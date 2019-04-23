const PCDate = require("../src/PCDate.js");

describe('PCDate.isDate', () => {

	it('returns false when given number', () => {
		const string = 5;
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns false when given a undefined', () => {
		const string = undefined;
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns false when given a null', () => {
		const string = null;
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns false when given an object', () => {
		const string = {};
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns false when given an array', () => {
		const string = [];
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns false when given a string', () => {
		const string = "hello";
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(false);
	});

	it('returns true when given a date', () => {
		const string = new Date();
		const boolResults = PCDate.isDate(string);
		expect(boolResults).toBe(true);
	});
});
describe('PCDate.addTime', () => {

	// We face a unique challenge writing unit tests for months and years
	// if we use "now" (ie when the test is actually run)
	// we will get varing results based on the current month or year.
	// therefor we have opted to use a fixed date

	const fixedDate = new Date(1545261511776);
	// December 19, 2018 at 4:19pm

	describe('PCDate.addTime (years)', () => {

		it('adds one year', () => {
			const newDate = PCDate.addTime(fixedDate,1,"year");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(31536000000);
		});

		it('subtracts year', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"year");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-31536000000);
		});

		it('adds two years', () => {
			const newDate = PCDate.addTime(fixedDate,2,"years");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(63158400000);
		});

		it('subtracts two years', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"years");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-63072000000);
		});

		it('adds 100 years', () => {
			const newDate = PCDate.addTime(fixedDate,100,"years");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(3155673600000);
		});

		it('subtracts 100 years', () => {
			const newDate = PCDate.subtractTime(fixedDate,100,"years");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-3155760000000);
		});

		it('adds zero years', () => {
			const newDate = PCDate.addTime(fixedDate,0,"years");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null year', () => {
			const newDate = PCDate.addTime(fixedDate,null,"year");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (months)', () => {

		it('adds one month', () => {
			const newDate = PCDate.addTime(fixedDate,1,"month");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(2678400000);
		});

		it('subtracts month', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"month");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-2592000000);
		});

		it('adds two months', () => {
			const newDate = PCDate.addTime(fixedDate,2,"months");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(5356800000);
		});

		it('subtracts two months', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"months");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-5270400000);
		});

		it('adds 500 months', () => {
			const newDate = PCDate.addTime(fixedDate,500,"months");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(1314921600000);
		});

		it('subtracts 500 months', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"months");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-1314921600000);
		});

		it('adds zero month', () => {
			const newDate = PCDate.addTime(fixedDate,0,"months");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null month', () => {
			const newDate = PCDate.addTime(fixedDate,null,"month");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (weeks)', () => {

		it('adds one week', () => {
			const newDate = PCDate.addTime(fixedDate,1,"week");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(604800000);
		});

		it('subtracts week', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"week");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-604800000);
		});

		it('adds two weeks', () => {
			const newDate = PCDate.addTime(fixedDate,2,"weeks");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(1209600000);
		});

		it('subtracts two weeks', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"weeks");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-1209600000);
		});

		it('adds 500 weeks', () => {
			const newDate = PCDate.addTime(fixedDate,500,"weeks");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(302400000000);
		});

		it('subtracts 500 weeks', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"weeks");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-302400000000);
		});

		it('adds zero weeks', () => {
			const newDate = PCDate.addTime(fixedDate,0,"weeks");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null week', () => {
			const newDate = PCDate.addTime(fixedDate,null,"week");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (days)', () => {

		it('adds one day', () => {
			const newDate = PCDate.addTime(fixedDate,1,"day");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(86400000);
		});

		it('subtracts day', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"day");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-86400000);
		});

		it('adds two days', () => {
			const newDate = PCDate.addTime(fixedDate,2,"days");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(172800000);
		});

		it('subtracts two days', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"days");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-172800000);
		});

		it('adds 500 days', () => {
			const newDate = PCDate.addTime(fixedDate,500,"days");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(43200000000);
		});

		it('subtracts 500 days', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"days");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-43200000000);
		});

		it('adds zero days', () => {
			const newDate = PCDate.addTime(fixedDate,0,"days");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null day', () => {
			const newDate = PCDate.addTime(fixedDate,null,"day");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (hours)', () => {

		it('adds one hour', () => {
			const newDate = PCDate.addTime(fixedDate,1,"hour");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(3600000);
		});

		it('subtracts hour', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"hour");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-3600000);
		});

		it('adds two hours', () => {
			const newDate = PCDate.addTime(fixedDate,2,"hours");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(7200000);
		});

		it('subtracts two hours', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"hours");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-7200000);
		});

		it('adds 500 hours', () => {
			const newDate = PCDate.addTime(fixedDate,500,"hours");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(1800000000);
		});

		it('subtracts 500 hours', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"hours");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-1800000000);
		});

		it('adds zero hours', () => {
			const newDate = PCDate.addTime(fixedDate,0,"hours");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null hour', () => {
			const newDate = PCDate.addTime(fixedDate,null,"hour");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (minutes)', () => {

		it('adds one minute', () => {
			const newDate = PCDate.addTime(fixedDate,1,"minute");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(60000);
		});

		it('subtracts minute', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"minute");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-60000);
		});

		it('adds two minutes', () => {
			const newDate = PCDate.addTime(fixedDate,2,"minutes");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(120000);
		});

		it('subtracts two minutes', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"minutes");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-120000);
		});

		it('adds 500 minutes', () => {
			const newDate = PCDate.addTime(fixedDate,500,"minutes");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(30000000);
		});

		it('subtracts 500 minutes', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"minutes");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-30000000);
		});

		it('adds zero minutes', () => {
			const newDate = PCDate.addTime(fixedDate,0,"minutes");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null minute', () => {
			const newDate = PCDate.addTime(fixedDate,null,"minute");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (seconds)', () => {

		it('adds one second', () => {
			const newDate = PCDate.addTime(fixedDate,1,"second");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(1000);
		});

		it('subtracts second', () => {
			const newDate = PCDate.subtractTime(fixedDate,1,"second");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-1000);
		});

		it('adds two seconds', () => {
			const newDate = PCDate.addTime(fixedDate,2,"seconds");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(2000);
		});

		it('subtracts two seconds', () => {
			const newDate = PCDate.subtractTime(fixedDate,2,"seconds");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-2000);
		});

		it('adds 500 seconds', () => {
			const newDate = PCDate.addTime(fixedDate,500,"seconds");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(500000);
		});

		it('subtracts 500 seconds', () => {
			const newDate = PCDate.subtractTime(fixedDate,500,"seconds");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(-500000);
		});

		it('adds zero seconds', () => {
			const newDate = PCDate.addTime(fixedDate,0,"seconds");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});

		it('subtracts null second', () => {
			const newDate = PCDate.addTime(fixedDate,null,"second");
			expect(newDate.getTime() - fixedDate.getTime()).toBe(0);
		});
	});

	describe('PCDate.addTime (invalid)', () => {

		it('should throw when passed an invalid unit', () => {
			expect(function(){ PCDate.addTime(fixedDate,1,"invalid"); }).toThrow("PCDate.addTime() error: Please select a valid unit.");
		});

		it('should throw when passed a null unit', () => {
			expect(function(){ PCDate.addTime(fixedDate,1,null); }).toThrow("PCDate.addTime() error: Please select a valid unit.");
		});

		it('should throw when passed a null date', () => {
			const newDate = PCDate.addTime(null,1,"second");
			expect(newDate).toBe(null);
		});

		it('should throw when passed a null date and unit', () => {
			const newDate = PCDate.addTime(null,1,null);
			expect(newDate).toBe(null);
		});
	});
});


describe('PCDate.thisDate', () => {

	it('returns PCDate object when given date as number', () => {
		const string = 1545883207128;
		const thisDateResult = PCDate.thisDate(string);
		expect(thisDateResult).toBeDefined();
		expect(thisDateResult.date).toBeDefined();
		expect(thisDateResult.date.getTime()).toBe(1545883207128);
	});

	it('returns now when given undefined', () => {
		const string = undefined;
		expect(()=>{ PCDate.thisDate(string); }).toThrowError("Please pass a date object to 'thisDate'");
	});

	it('returns now when given null', () => {
		const string = null;
		const thisDateResult = PCDate.thisDate(string);
		expect(thisDateResult).toBeDefined();
		expect(thisDateResult.date).toBeDefined();
	});

	it('throws when given an object', () => {
		const string = {};
		expect(()=>{ PCDate.thisDate(string); }).toThrowError("Please pass a date object to 'thisDate'");
	});

	it('throws when given an array', () => {
		const string = [];
		expect(()=>{ PCDate.thisDate(string); }).toThrowError("Please pass a date object to 'thisDate'");
	});

	it('handles string date', () => {
		const string = "October 13, 2014 11:13:00";
		const thisDateResult = PCDate.thisDate(string);
		expect(thisDateResult).toBeDefined();
		expect(thisDateResult.date).toBeDefined();
	});

	it('handles when given a date', () => {
		const string = new Date();
		const thisDateResult = PCDate.thisDate(string);
		expect(thisDateResult).toBeDefined();
		expect(thisDateResult.date).toBeDefined();
	});
});

describe('PCDate.thisDate(d1).isAfter(d2)', () => {

	const yesterday = 1545883207128;
	const today = 1545883207129;

	it('false when d1 is Not after d2', () => {
		const boolResults = PCDate.thisDate(yesterday).isAfter(today);
		expect(boolResults).toBe(false);
	});

	it('true when d1 is After d2', () => {
		const boolResults = PCDate.thisDate(today).isAfter(yesterday);
		expect(boolResults).toBe(true);
	});

	// fringe cases
	it('returns false when same date', () => {
		const boolResults = PCDate.thisDate(yesterday).isAfter(yesterday);
		expect(boolResults).toBe(false);
	});
});

describe('PCDate.thisDate(d1).isBefore(d2)', () => {

	const yesterday = 1545883207128;
	const today = 1545883207129;

	it('false when d1 is Not after d2', () => {
		const boolResults = PCDate.thisDate(yesterday).isBefore(today);
		expect(boolResults).toBe(true);
	});

	it('true when d1 is After d2', () => {
		const boolResults = PCDate.thisDate(today).isBefore(yesterday);
		expect(boolResults).toBe(false);
	});

	// fringe cases
	it('returns false when same date', () => {
		const boolResults = PCDate.thisDate(yesterday).isBefore(yesterday);
		expect(boolResults).toBe(false);
	});
});

describe('PCDate.searchString(d)', () => {

	const today = 1545883207129;

	it('should fomat correctly without timezone', () => {
		const results = PCDate.searchString(today);
		expect(results).toBe('thursday december 27 2018 4:00am');
	});

	it('should fomat correctly with timezone', () => {
		const results = PCDate.searchString(today, 'America/Phoenix');
		expect(results).toBe('wednesday december 26 2018 9:00pm');
	});
});
