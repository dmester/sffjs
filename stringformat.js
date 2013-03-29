/**
 * String.format for JavaScript
 * Copyright (c) Daniel Mester Pirttijärvi 2012
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

    // ***** Private Methods *****
    
    // Minimization optimization 
    function toUpperCase(s)
    {
        return s.toUpperCase();
    }
    
    // Converts a number to a string and ensures the number has at 
    // least two digits.
    function numberPair(n) {
        return (n < 10 ? "0" : "") + n;
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
            _cr: "."  // Currency radix point
        };
        
        // Culture specific strings
        if (lcid.substr(0, 2) == "SV") {
            t.name = "sv-SE";
            t.d = "yyyy-MM-dd";
            t.D = "den dd MMMM yyyy";
            t._m = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
            t._d = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
            t._r = ",";
            t._t = " ";
            t._ct = ".";
            t._cr = ",";
            t._c = "#,0.00 kr";
        } else if (lcid != "EN-GB") {
            t.name = "en-US";
            t.t = "hh:mm tt";
            t.T = "hh:mm:ss tt";
            t.d = "MM/dd/yyyy";
            t.D = "MMMM dd, yyyy";
            t.Y = "MMMM, yyyy";
            t._c = "$#,0.00";
        }
        
        // Composite formats
        t.f = t.D + " " + t.t;
        t.F = t.D + " " + t.T;
        t.g = t.d + " " + t.t;
        t.G = t.d + " " + t.T;
        
        return t;
    }
    
    function groupedAppend(out, value) {
        for (var i in value) {
            // Write number
            out.push(value.charAt(i));

            // Begin a new group?
            if (out.g > 1 && out.g-- % 3 == 1) {
                out.push(out.t);
            }
        }
    }
    
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
    
    function basicNumberFormatter(number, minIntegralDigits, minDecimals, maxDecimals, radixPoint, thousandSeparator) {
        var out = [];
        out.t = thousandSeparator;
        
        if (number < 0) {
            out.push("-");
        }
        
        number = round(number, maxDecimals);
        
        var integralDigits = numberOfIntegralDigits(number);
        minIntegralDigits -= (out.g = integralDigits);
        
        // Pad with zeroes
        while (minIntegralDigits-- > 0) {
            groupedAppend(out, "0");
        }
        
        // Add integer part
        groupedAppend(out, number.substr(0, integralDigits));
        
        // Add decimal point
        var decimals = numberOfDecimalDigits(number);
        
        if (minDecimals || decimals) {
            out.push(radixPoint);
            
            if (decimals) {
                minDecimals -= decimals;
                groupedAppend(out, number.substr(integralDigits + 1));
            }
            
            // Pad with zeroes
            while (minDecimals-- > 0) {
                groupedAppend(out, "0");
            }
        }
        
        return out.join("");
    }
    
    // Handles the internal format processing of a number
    function processNumber(input, format, radixPoint, thousandSeparator) {
        var digits = 0,
            forcedDigits = -1,
            integralDigits = -1,
            decimals = 0,
            forcedDecimals = -1,
            atDecimals = false,
            unused = true, // True until a digit has been written to the output
            c, i,
            out = [];

        // Analyse format string
        // Count number of digits, decimals, forced digits and forced decimals.
        for (i in format) {
            c = format.charAt(i);

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
        
        for (var f in format) {
            c = format.charAt(f);
            
            // Digit placeholder
            if (c == "#" || c == "0") {
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

                    unused = false;

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

    // ***** Number Formatting *****
    Number.prototype.__Format = function(format) {
        /// <summary>
        ///     Formats this number according the specified format string.
        /// </summary>
        /// <param name="format">The formatting string used to format this number.</param>

        var number = Number(this);
        
        var radixPoint = msf.LC._r;
        var thousandSeparator = msf.LC._t;
        
        var standardFormatStringMatch = format.match(/^([a-zA-Z])(\d*)$/);
        
        if (standardFormatStringMatch)
        {
            var result;
            var standardFormatStringMatch_UpperCase = toUpperCase(standardFormatStringMatch[1]);
            var precision = Number(standardFormatStringMatch[2]);
            
            // Standard numeric format string
            switch (standardFormatStringMatch_UpperCase) {
                case "X":
                    var result = Math.round(number).toString(16);
                    
                    if (standardFormatStringMatch[1] == "X") {
                        result = toUpperCase(result);
                    }
                    
                    if (precision) {
                        var paddingToAdd = precision - result.length;
                        
                        while (paddingToAdd-- > 0) {
                            result = "0" + result;
                        }
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
                    
                    
                case "G":
                    if (precision && numberOfIntegralDigits("" + number) > precision) {
                        // Exponential format
                    }
                    
                    return basicNumberFormatter(number, 1, precision || 2, precision || 2, radixPoint);
                
                case "E":
                    var numberAsString = number.toString();
                    var integerDigits = numberAsString.indexOf(".");
                    if (integerDigits < 0) {
                        integerDigits = numberAsString.length;
                    }
                    
                    var exponent = integerDigits - 1;
                    while (--integerDigits > 0) {
                        number /= 10;
                    }
                    
                    return basicNumberFormatter(number, 1, precision || 6, precision || 6, radixPoint, thousandSeparator) + standardFormatStringMatch[1] + "+" + basicNumberFormatter(exponent, 3, 0);
                    
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
        
        return processNumber(number, format, radixPoint, format.match(/^[^\.]*[0#],[0#]/) && thousandSeparator);
    };

    // ***** Date Formatting *****
    Date.prototype.__Format = function(format) {
        var date = this;
		var output = "";
		var i;
        if (format.length == 1) {
            format = msf.LC[format];
        }
		
		return format.replace(/(d{1,4}|M{1,4}|yyyy|yy|HH|H|hh|h|mm|m|ss|s|tt)/g, 
			function () { switch (arguments[0]) {
					case "dddd": return msf.LC._d[date.getDay()];
					case "ddd": return msf.LC._d[date.getDay()].substr(0, 3);
					case "dd": return numberPair(date.getDate());
					case "d": return date.getDate();
					case "MMMM": return msf.LC._m[date.getMonth()];
					case "MMM": return msf.LC._m[date.getMonth()].substr(0, 3);
					case "MM": return numberPair(date.getMonth() + 1);
					case "M": return date.getMonth() + 1;
					case "yyyy": return date.getFullYear();
					case "yy": return date.getFullYear().toString().substr(2);
					case "HH": return numberPair(date.getHours());
					case "hh": return numberPair((date.getHours() - 1) % 12 + 1);
					case "H": return date.getHours();
					case "h": return (date.getHours() - 1) % 12 + 1;
					case "mm": return numberPair(date.getMinutes());
					case "m": return date.getMinutes();
					case "ss": return numberPair(date.getSeconds());
					case "s": return date.getSeconds();
					case "tt": return date.getHours() < 12 ? "AM" : "PM";
					default: return "";
				}
			});
    };

    String.__Format = function(str, obj0, obj1, obj2) {
        /// <summary>
        ///     Formats a string according to a specified formatting string.
        /// </summary>
        /// <param name="str">The formatting string used to format the additional arguments.</param>
        /// <param name="obj0">Object 1</param>
        /// <param name="obj1">Object 2 [optional]</param>
        /// <param name="obj2">Object 3 [optional]</param>

        var outerArgs = arguments, arg;
        
        return str.replace(/(\{*)\{((\d+)(\,(-?\d*))?(\:([^\}]*))?)\}/g, function () {
            var innerArgs = arguments;
            if (innerArgs[1] && innerArgs[1].length % 2 == 1) {
                return innerArgs[0];
            }
            
            // Throw exception if argument is missing
            if ((arg = outerArgs[parseInt(innerArgs[3], 10) + 1]) === undefined) {
                throw "Missing argument";
            }
            
            // If the object has a custom format method, use it,
            // otherwise use toString to create a string
            var formatted = arg.__Format ? 
                    arg.__Format(innerArgs[7]) : 
                    arg.toString();
                    
            var align = parseInt(innerArgs[5], 10) || 0;
            var paddingLength = Math.abs(align) - formatted.length;

            if (paddingLength > 0) {
                // Build padding string
                var padding = " ";
                while (padding.length < paddingLength) {
                    padding += " ";
                }

                // Add padding string at right side
                formatted = align > 0 ? formatted + padding : padding + formatted;
            }
            
            return innerArgs[1] + formatted;
        }).replace(/\{\{/g, "{");
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
    pr = Number.prototype;
    pr.format = pr.format || pr.__Format;
    String.format = String.format || String.__Format;

//#IF DEBUG
        
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

