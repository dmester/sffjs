/**
 * String.format for JavaScript
 * Copyright (c) Daniel Mester Pirttijärvi 2013
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 
 * 3. This notice may not be removed or altered from any source distribution.
 * 
 * -- END OF LICENSE --
 * 
 */

var msf = {};

(function() {

    // ***** Shortcuts *****
    var _Number = Number,
        _String = String;
    
    // ***** Private Methods *****
    
    // Minimization optimization 
    function toUpperCase(s) {
        return s.toUpperCase();
    }
    
    // Converts a number to a string and ensures the number has at 
    // least two digits.
    function numberPair(n) {
        return (n < 10 ? "0" : "") + n;
    }

    // Returns true if value is not null or undefined
    function hasValue(value) {
        return !(value === null || typeof value === "undefined");
    }

    // This method generates a culture object from a specified IETF language code
    function getCulture(lcid) {
        lcid = toUpperCase(lcid);
        
        // Common format strings
        var t = {
            name: "en-GB",
            d: "dd/MM/yyyy",
            D: "dd MMMM yyyy",
            t: "HH:mm",
            T: "HH:mm:ss",
            M: "d MMMM",
            Y: "MMMM yyyy",
            s: "yyyy-MM-ddTHH:mm:ss",
            _m: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            _d: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            _r: ".", // Radix point
            _t: ",", // Thounsands separator
            _c: "£#,0.00", // Currency format string
            _ct: ",", // Currency thounsands separator
            _cr: ".",  // Currency radix point
            _am: "AM",
            _pm: "PM"
        };
        
        var language = lcid.substr(0, 2);
        var europeanNumbers;
        
        // Culture specific strings
        if (language == "SV") {
            t.name = "sv";
            t.d = "yyyy-MM-dd";
            t.D = "'den 'd MMMM yyyy";
            t._m = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
            t._d = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
            t._r = t._cr = ",";
            t._t = " ";
            t._ct = ".";
            t._c = "#,0.00 kr";
        } else if (language == "DE") {
            t.name = "de";
            t.M = "d. MMMM";
            t.d = "yyyy-MM-dd";
            t.D = "dddd, d. MMMM yyyy";
            t._m = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
            t._d = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
            europeanNumbers = 1;
        } else if (language == "ES") {
            t.name = "es";
            t.M = "d' de 'MMMM";
            t.d = "dd/MM/yyyy";
            t.Y = "MMMM' de 'yyyy";
            t.D = "dddd, d' de 'MMMM' de 'yyyy";
            t._m = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
            t._d = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
            europeanNumbers = 1;
        } else if (language == "FR") {
            t.name = "fr";
            t._r = t._cr = ",";
            t._t = t._ct = " ";
            t._c = "#,0.00 €";
            t.M = "";
            t.d = "dd/MM/yyyy";
            t.D = "dddd d MMMM yyyy";
            t._m = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            t._d = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
            europeanNumbers = 1;
        } else if (lcid != "EN-GB") {
            t.name = "en-US";
            t.t = "h:mm tt";
            t.T = "h:mm:ss tt";
            t.d = "M/d/yyyy";
            t.D = "dddd, MMMM d, yyyy";
            t.M = "MMMM d";
            t._c = "$#,0.00";
        }
        
        if (europeanNumbers) {
            t._r = t._cr = ",";
            t._t = t._ct = ".";
            t._c = "#,0.00 €";
        }
        
        // Composite formats
        t.f = t.D + " " + t.t;
        t.F = t.D + " " + t.T;
        t.g = t.d + " " + t.t;
        t.G = t.d + " " + t.T;
        t.m = t.M;
        t.y = t.Y;
        
        return t;
    }
    
    // This function resolves a path on the format <membername>(.<membername>|[<index>])*
    // and evaluates the value.
    function resolvePath(path, value) {
        // Validate path
        if (!/^([a-zA-Z_$]\w+|\d+)(\.[a-zA-Z_$]\w+|\[\d+\])*$/.test(path)) {
            throw "Invalid path";
        }

        // Parse and evaluate path
        if (hasValue(value)) {
            var followingMembers = /(\.([a-zA-Z_$]\w+)|\[(\d+)\])/g,
                match = /^[a-zA-Z_$]\w+/.exec(path);
                
            value = value[match[0]];
            
            // Evaluate path until we reach the searched member or the value is undefined/null
            while (hasValue(value) && (match = followingMembers.exec(path))) {
                value = value[match[2] || _Number(match[3])];
            }
        }
        
        return value;
    };
    
    // Maths
    function round(number, decimals) {
        var roundingFactor = Math.pow(10, decimals || 0);
        return (Math.round(Math.abs(number) * roundingFactor) / roundingFactor).toString();
    }
    
    function numberOfIntegralDigits(numberString) {
        var point = numberString.indexOf(".");
        return point < 0 ? numberString.length : point;
    }
    
    function numberOfDecimalDigits(numberString) {
        var point = numberString.indexOf(".");
        return point < 0 ? 0 : numberString.length - point - 1;
    }
    
    // Formatting helpers
    function groupedAppend(out, value) {
        for (var i = 0; i < value.length; i++) {
            // Write number
            out.push(value.charAt(i));

            // Begin a new group?
            if (out.g > 1 && out.g-- % 3 == 1) {
                out.push(out.t);
            }
        }
    }
    
    // Handles formatting of standard format strings
    function basicNumberFormatter(number, minIntegralDigits, minDecimals, maxDecimals, radixPoint, thousandSeparator) {
        var out = [];
        out.t = thousandSeparator;
        
        if (number < 0) {
            out.push("-");
        }
        
        number = round(number, maxDecimals);
        
        var integralDigits = numberOfIntegralDigits(number),
            decimals = numberOfDecimalDigits(number);
        
        minIntegralDigits -= (out.g = integralDigits);
        
        // Pad with zeroes
        while (minIntegralDigits-- > 0) {
            groupedAppend(out, "0");
        }
        
        // Add integer part
        groupedAppend(out, number.substr(0, integralDigits));
        
        // Add decimal point
        if (minDecimals || decimals) {
            out.push(radixPoint);
            
            minDecimals -= decimals;
            groupedAppend(out, number.substr(integralDigits + 1));

            // Pad with zeroes
            while (minDecimals-- > 0) {
                groupedAppend(out, "0");
            }
        }
        
        return out.join("");
    }
    
    // Handles formatting of custom format strings
    function customNumberFormatter(input, format, radixPoint, thousandSeparator) {
        var digits = 0,
            forcedDigits = -1,
            integralDigits = -1,
            decimals = 0,
            forcedDecimals = -1,
            atDecimals = 0, // Bool
            inString = 0, // Bool
            unused = 1, // Bool, True until a digit has been written to the output
            c, i, f,
            out = [];

        // Analyse format string
        // Count number of digits, decimals, forced digits and forced decimals.
        for (i = 0; i < format.length; i++) {
            c = format.charAt(i);
            
            // Check if we are within a literal
            if (c == "'") {
                inString = !inString;
            } else if (!inString) {
            
                // Only 0 and # are digit placeholders, skip other characters in analyzing phase
                if (c == "0" || c == "#") {
                    decimals += atDecimals;

                    if (c == "0") {
                        // 0 is a forced digit
                        if (atDecimals) {
                            forcedDecimals = decimals;
                        } else if (forcedDigits < 0) {
                            forcedDigits = digits;
                        }
                    }

                    digits += !atDecimals;
                }

                // If the current character is ".", then we have reached the end of the integral part
                atDecimals = atDecimals || c == ".";
            }
        }
        forcedDigits = forcedDigits < 0 ? 1 : digits - forcedDigits;

        // Negative value? Begin string with a dash
        if (input < 0) {
            out.push("-");
        }

        // Round the input value to a specified number of decimals
        input = round(input, decimals);

        // Get integral length
        integralDigits = numberOfIntegralDigits(input);

        // Set initial input cursor position
        i = integralDigits - digits;

        // Initialize thousand grouping
        out.g = Math.max(integralDigits, forcedDigits);
        out.t = thousandSeparator;
        
        inString = 0;
        
        for (f = 0; f < format.length; f++) {
            c = format.charAt(f);
        
            // Check if we are within a literal
            if (c == "'") {
                inString = !inString;
            } else if (inString)  {
                out.push(c);
            
            // Digit placeholder
            } else if (c == "#" || c == "0") {
                if (i < integralDigits) {
                    // In the integral part
                    if (i >= 0) {
                        if (unused) {
                            groupedAppend(out, input.substr(0, i));
                        }
                        groupedAppend(out, input.charAt(i));

                        // Not yet inside the input number, force a zero?
                    } else if (i >= integralDigits - forcedDigits) {
                        groupedAppend(out, "0");
                    }

                    unused = 0;

                } else if (forcedDecimals-- > 0 || i < input.length) {
                    // In the fractional part
                    groupedAppend(out, i >= input.length ? "0" : input.charAt(i));
                }

                i++;

            // Radix point character according to current culture.
            } else if (c == ".") {
                if (input.length > ++i || forcedDecimals > 0) {
                    out.push(radixPoint);
                }

            // Other characters are written as they are, except from commas
            } else if (c !== ",") {
                out.push(c);
            }
        }
        
        return out.join("");
    }
    
    // ***** PUBLIC INTERFACE
    // ***** Number Formatting *****
    _Number.prototype.__Format = function(format) {
        /// <summary>
        ///     Formats this number according the specified format string.
        /// </summary>
        /// <param name="format">The formatting string used to format this number.</param>

        var number = _Number(this),
            radixPoint = msf.LC._r,
            thousandSeparator = msf.LC._t;
        
        if (!isFinite(number)) {
            return "" + number;
        }
        
        if (!format) {
            return basicNumberFormatter(number, 0, 0, 10, radixPoint);
        }
        
        var standardFormatStringMatch = format.match(/^([a-zA-Z])(\d*)$/);
        
        if (standardFormatStringMatch)
        {
            var standardFormatStringMatch_UpperCase = toUpperCase(standardFormatStringMatch[1]),
                precision = _Number(standardFormatStringMatch[2]);
            
            // Limit precision to max 15
            precision = precision > 15 ? 15 : precision;
            
            // Standard numeric format string
            switch (standardFormatStringMatch_UpperCase) {
                case "R":
                    return "" + number;
                
                case "X":
                    var result = Math.round(number).toString(16);
                    
                    if (standardFormatStringMatch[1] == "X") {
                        result = toUpperCase(result);
                    }
                    
                    // Add padding, remember precision might be NaN
                    precision -= result.length;
                    while (precision-- > 0) {
                        result = "0" + result;
                    }
                    
                    return result;
                
                case "C":
                    format = msf.LC._c;
                    radixPoint = msf.LC._cr;
                    thousandSeparator = msf.LC._ct;
                    break;
                    
                case "D":
                    return basicNumberFormatter(number, precision || 1, 0, 0);
                
                case "F":
                    thousandSeparator = "";
                    // Fall through to N, which has the same format as F, except no thousand grouping
                    
                case "N":
                    return basicNumberFormatter(number, 1, precision || 2, precision || 2, radixPoint, thousandSeparator);
                
                case "P":
                    return basicNumberFormatter(number * 100, 1, precision || 2, precision || 2, radixPoint, thousandSeparator) + " %";
                
                case "G":
                case "E":
                    // Determine coefficient and exponent for normalized notation
                    var exponent = 0, coefficient = Math.abs(number);
                    
                    while (coefficient >= 10) {
                        coefficient /= 10;
                        exponent++;
                    }
                    
                    while (coefficient < 1) {
                        coefficient *= 10;
                        exponent--;
                    }
                    
                    var exponentPrefix = standardFormatStringMatch[1],
                        exponentPrecision = 3,
                        minDecimals = precision || 6,
                        maxDecimals = precision || 6;
                    
                    if (standardFormatStringMatch_UpperCase == "G") {
                        if (exponent > -5 && (!precision || exponent < precision)) {
                            minDecimals = precision ? precision - (exponent > 0 ? exponent + 1 : 1) : 0;
                            maxDecimals = precision ? precision - (exponent > 0 ? exponent + 1 : 1) : 10;
                        
                            return basicNumberFormatter(number, 1, minDecimals, maxDecimals, radixPoint);
                        }
                    
                        exponentPrefix = exponentPrefix == "G" ? "E" : "e";
                        exponentPrecision = 2;
                        
                        // The precision of G is number of significant digits, not the number of decimals.
                        minDecimals = precision ? precision - 1 : 0;
                        maxDecimals = precision ? precision - 1 : 10;
                    }
                    
                    if (exponent >= 0) {
                        exponentPrefix += "+";
                    }
                    
                    if (number < 0) {
                        coefficient *= -1;
                    }
                    
                    return basicNumberFormatter("" + coefficient, 1, minDecimals, maxDecimals, radixPoint, thousandSeparator) + exponentPrefix + basicNumberFormatter(exponent, exponentPrecision, 0);
            }
        }
        
        // Custom numeric format string
                
        // Thousands
        if (format.indexOf(",.") !== -1) {
            number /= 1000;
        }

        // Percent
        if (format.indexOf("%") !== -1) {
            number *= 100;
        }

        // Split groups ( positive; negative; zero, where the two last ones are optional)
        var groups = format.split(";");
        if (number < 0 && groups.length > 1) {
            number *= -1;
            format = groups[1];
        } else {
            format = groups[!number && groups.length > 2 ? 2 : 0];
        }
        
        return customNumberFormatter(number, format, radixPoint, format.match(/^[^\.]*[0#],[0#]/) && thousandSeparator);
    };

    // ***** Date Formatting *****
    Date.prototype.__Format = function(format) {
        var date = this, culture = msf.LC;
            
        if (format.length == 1) {
            format = culture[format] || format;
        }
		
		return format.replace(/('[^']*'|d{1,4}|M{1,4}|yyyy|yy|HH?|hh?|mm?|ss?|tt?)/g, 
			function () { 
                var argument = arguments[0], getFullYear = "getFullYear", getMonth = "getMonth", getSeconds = "getSeconds", getMinutes = "getMinutes", getHours = "getHours";

                return argument == "dddd" ? culture._d[date.getDay()] :
                        argument == "ddd" ? culture._d[date.getDay()].substr(0, 3) :
                        argument == "dd" ? numberPair(date.getDate()) :
                        argument == "d" ? date.getDate() :
                        argument == "MMMM" ? culture._m[date[getMonth]()] :
                        argument == "MMM" ? culture._m[date[getMonth]()].substr(0, 3) :
                        argument == "MM" ? numberPair(date[getMonth]() + 1) :
                        argument == "M" ? date[getMonth]() + 1 :
                        argument == "yyyy" ? date[getFullYear]() :
                        argument == "yy" ? ("" + date[getFullYear]()).substr(2) :
                        argument == "HH" ? numberPair(date[getHours]()) :
                        argument == "H" ? date[getHours]() :
                        argument == "hh" ? numberPair((date[getHours]() - 1) % 12 + 1) :
                        argument == "h" ? (date[getHours]() - 1) % 12 + 1 :
                        argument == "mm" ? numberPair(date[getMinutes]()) :
                        argument == "m" ? date[getMinutes]() :
                        argument == "ss" ? numberPair(date[getSeconds]()) :
                        argument == "s" ? date[getSeconds]() :
                        argument == "tt" ? (date[getHours]() < 12 ? culture._am : culture._pm) : 
                        argument == "t" ? (date[getHours]() < 12 ? culture._am : culture._pm).charAt(0) :
                        argument.substr(1, argument.length - 2);
			});
    };
    
    function unescapeBrackets(brackets, consumedBrackets) {
        return brackets.substr(0, (brackets.length + 1 - (consumedBrackets || 0)) / 2);
    }

    _String.__Format = function(str, obj0, obj1, obj2) {
        /// <summary>
        ///     Formats a string according to a specified formatting string.
        /// </summary>
        /// <param name="str">The formatting string used to format the additional arguments.</param>
        /// <param name="obj0">Object 1</param>
        /// <param name="obj1">Object 2 [optional]</param>
        /// <param name="obj2">Object 3 [optional]</param>

        var outerArgs = arguments;
        
        return str.replace(/(\{+)((\d+|[a-zA-Z_$]\w+(?:\.[a-zA-Z_$]\w+|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*))?)(\}+)|(\{+)|(\}+)/g, function () {
            var innerArgs = arguments, value;
            
            // Handle escaped {
            if (innerArgs[7]) {
                value = unescapeBrackets(innerArgs[7]);
            }
            
            // Handle escaped }
            else if (innerArgs[8]) {
                value = unescapeBrackets(innerArgs[8]);
            }
            
            // Handle case when both { and } are present, but one or both of them are escaped
            else if (innerArgs[1].length % 2 == 0 || innerArgs[6].length % 2 == 0) {
                value = unescapeBrackets(innerArgs[1]) +
                    innerArgs[2] +
                    unescapeBrackets(innerArgs[6]);
            }
            
            else {
                
                // innerArgs[3] is the index/path
                if (/^\d+$/.test(innerArgs[3])) {
                    // Numeric mode
                    
                    // Read index and ensure it is within the bounds of the specified argument list
                    var index = _Number(innerArgs[3]);
                    if (index > outerArgs.length - 2) {
                        // Throw exception if argument is not specified (however undefined and null values are fine!)
                        throw "Missing argument";
                    }
                    
                    value = outerArgs[index + 1];
                } else {
                    // Object path mode
                    value = resolvePath(innerArgs[3], outerArgs[1]);
                }
                
                // If the object has a custom format method, use it,
                // otherwise use toString to create a string
                value = !hasValue(value) ? "" : value.__Format ? value.__Format(innerArgs[5]) : "" + value;
                
                // Add padding (if necessary)
                var align = _Number(innerArgs[4]) || 0,
                    paddingLength = Math.abs(align) - value.length,
                    padding = "";
                    
                while (paddingLength-- > 0) {
                    padding += " ";
                }
                
                // innerArgs[1] is the leading {'s
                value = unescapeBrackets(innerArgs[1], 1) +
                    (align > 0 ? value + padding : padding + value) +
                    unescapeBrackets(innerArgs[6], 1);
            }
            
            return value;
        });
    };

    
    // ***** Initialize msf object *****

    /// <summary>
    ///     The current culture used for culture specific formatting.
    /// </summary>
    msf.LC = null;

    msf.setCulture = function(languageCode) {
        /// <summary>
        ///     Sets the current culture, used for culture specific formatting.
        /// </summary>
        /// <param name="LCID">The IETF language code of the culture, e.g. en-US or en.</param>
        msf.LC = getCulture(languageCode) || getCulture(languageCode.substr(0, 2)) || getCulture();
    };
    
    // Initiate culture
    /*global navigator */// <- for JSLint, just ignore
    msf.setCulture(navigator.systemLanguage || navigator.language || "en-US");
    
    // Set Format methods
    var pr = Date.prototype;
    pr.format = pr.format || pr.__Format;
    pr = _Number.prototype;
    pr.format = pr.format || pr.__Format;
    _String.format = _String.format || _String.__Format;

//#IF DEBUG
    msf.resolve = resolvePath;
    
    msf.doBenchmark = function (format, arg) {
        /// <summary>
        ///     Tests the performance of the String.format script.
        /// </summary>
        /// <param name="str">The format string to test</param>
        /// <param name="arg">The value {0} to be used as an argument to
        /// the String.format method.</param>
        /// <returns>Returns the time in milliseconds to complete 
        /// one format operation for the specified format string.</returns>
        
        // Number of variables in the test format string
        var num = 5000;
        
        // Construct a long format string
        var longformat = "";
        for (var i = 0; i < num; i++) {
            longformat += format;
        }
        
        // Perform test
        var start, end;
        start = new Date().valueOf();
        String.__Format(longformat, arg);
        end = new Date().valueOf();
        
        return (end - start) / num;
    };

//#END IF
 
})();

