/* eslint-disable */

/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*
* Modification: Allow to add escaped text [like this]
*/

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|\[.*?\]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;

    var flags = {
      d: date.getDate(),
      dd: pad(date.getDate()),
      ddd: dF.i18n.dayNames[date.getDay()],
      dddd: dF.i18n.dayNames[date.getDay() + 7],
      m: date.getMonth() + 1,
      mm: pad(date.getMonth() + 1),
      mmm: dF.i18n.monthNames[date.getMonth()],
      mmmm: dF.i18n.monthNames[date.getMonth() + 12],
      yy: String(date.getFullYear()).slice(2),
      yyyy: date.getFullYear(),
      h: date.getHours() % 12 || 12,
      hh: pad(date.getHours() % 12 || 12),
      H: date.getHours(),
      HH: pad(date.getHours()),
      M: date.getMinutes(),
      MM: pad(date.getMinutes()),
      s: date.getSeconds(),
      ss: pad(date.getSeconds()),
      l: pad(date.getMilliseconds(), 3),
      L: pad(Math.round(date.getMilliseconds() / 10)),
      t: date.getHours() < 12 ? "a" : "p",
      tt: date.getHours() < 12 ? "am" : "pm",
      T: date.getHours() < 12 ? "A" : "P",
      TT: date.getHours() < 12 ? "AM" : "PM",
      Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o: (utc ? 0 : date.getTimezoneOffset()),
      S: ["th", "st", "nd", "rd"][date.getDate() % 10 > 3 ? 0 : (date.getDate() % 100 - date.getDate() % 10 != 10) * date.getDate() % 10]
    };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some necessary i18n settings
dateFormat.masks = {
  "default": "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};