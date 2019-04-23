const moment = require('moment-timezone')

class PCDate  {
	constructor(date) {
		//Empty Constructor
		if(date){
			this.date = date;
		}
	}

	static isDate(date){
		if(!date) return false;
		if(isNaN(date)) return false;
		return Object.prototype.toString.call(date) === "[object Date]";
	}

	static addTime(date,number,unit){
		const error = "PCDate.addTime() error: Please select a valid unit.";
		if(!date) return null;
		if(!unit) throw error;
		unit = unit.toLowerCase();
		var tempDate = new Date(date.getTime());
		if(unit == "years" || unit == "year"){
			tempDate.setFullYear(date.getFullYear() + number);
		}else if(unit == "months" || unit == "month"){

			tempDate.setMonth(date.getMonth() + number);
		}else if(unit == "weeks" || unit == "week"){
			tempDate.setDate(date.getDate() + (number * 7));
		}else if(unit == "days" || unit == "day"){
			tempDate.setDate(date.getDate() + number);
		}else if(unit == "hours" || unit == "hour"){
			tempDate.setHours(date.getHours() + number);
		}else if(unit == "minutes" || unit == "minute"){
			tempDate.setMinutes(date.getMinutes() + number);
		}else  if(unit == "seconds" || unit == "second"){
			tempDate.setSeconds(date.getSeconds() + number);
		}else{
			throw error;
		}

		return tempDate;
	}

	static subtractTime(date,number,unit){
		return PCDate.addTime(date,-number,unit);
	}

	static _dateFromInput(date){
		if(!(date instanceof Date)){
			// let the native constructor handle non-date objects.
			date = new Date(date);
		}
		if(!PCDate.isDate(date)) throw new Error("Please pass a date object to 'thisDate'")
		return date;
	}
	static thisDate(input){
		const date = PCDate._dateFromInput(input)
		const object = new PCDate(date);
		return object;
	}

	isAfter(input){
		const date = PCDate._dateFromInput(input);
		if(!this.date) throw new Error("Please specify a date by calling PCDate.thisDate(d1).isAfter(d2)");
		if(this.date > date)
			return true;
		else
			return false;
	}

	isBefore(input){
		const date = PCDate._dateFromInput(input);
		if(!this.date) throw new Error("Please specify a date by calling PCDate.thisDate(d1).isBefore(d2)");
		if(this.date < date)
			return true;
		else
			return false;
	}

	// returns a string that contains the elements of the date spelled out
	static searchString(input,timezone){
		if(!timezone) {
			timezone = 'UTC';
		}

		const tmpDate = PCDate._dateFromInput(input);
		const date = moment(tmpDate).tz(timezone);

		// outputs "monday january 5 2019"
		return date.format('dddd MMMM DD YYYY h:mma').toLowerCase();
	}
}

module.exports = PCDate;
