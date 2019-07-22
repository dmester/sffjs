/**
 * String.format for JavaScript 1.16.1
 * https://github.com/dmester/sffjs
 *  
 * Built: 2019-07-22T15:11:55.991Z
 *
 * Copyright (c) 2009-2019 Daniel Mester Pirttijärvi
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
 */

var sffjs = (function() {
    "use strict";

    // ***** Public Interface *****
    var sffjs = {
            /**
             * The version of the library String.Format for JavaScript.
             * @type string
             */
            version: "1.16.1",
            
            /**
             * Sets the current culture, used for culture specific formatting.
             * @param {string} languageCode The IETF language code of the culture, e.g. en-US or en.
             */
            setCulture: function (languageCode) {
                currentCultureId = languageCode;
                updateCulture();
            },
            
            /**
             * Registers an object containing information about a culture.
             * @param {*} culture Culture object.
             */
            registerCulture: function (culture) {
                cultures[culture.name[toUpperCase]()] = fillGapsInCulture(culture);
                
                // ...and reevaulate current culture
                updateCulture();
            }
        },
        
    // ***** Shortcuts *****
        toUpperCase = "toUpperCase",
   
    // ***** Private Variables *****
    
        // This is the default values of a culture. Any missing format will default to the format in CULTURE_TEMPLATE.
        // The invariant culture is generated from these default values.
        CULTURE_TEMPLATE = {
            name: "", // Empty on invariant culture
            d: "MM/dd/yyyy",
            D: "dddd, dd MMMM yyyy",
            t: "HH:mm",
            T: "HH:mm:ss",
            M: "MMMM dd",
            Y: "yyyy MMMM",
            s: "yyyy-MM-ddTHH:mm:ss",
            _M: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            _D: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            _r: ".", // Radix point
            _t: ",", // Thounsands separator
            _c: "¤#,0.00", // Currency format string
            _ct: ",", // Currency thounsands separator
            _cr: ".",  // Currency radix point
            _am: "AM",
            _pm: "PM"
        },
    
        // Generate invariant culture
        INVARIANT_CULTURE = fillGapsInCulture({}),
    
        // Holds the current culture object
        currentCulture,
    
        // Holds the id of the current culture. The id is also included in the culture object, but the 
        // culture object might be replaced during runtime when a better matching culture is registered.
        currentCultureId = typeof navigator != "undefined" && (navigator.systemLanguage || navigator.language) || "",
    
        // Holds all registered external cultures, i.e. not the invariant culture
        cultures = {};
    
    
    // ***** Private Methods *****
    
    // General helpers
    
    /**
     * Pads the specified value with zeroes to the left until it reaches the specified length.
     * @param {*} value Value to zeropad. 
     * @param {number} len Minimum length of result.
     * @returns {string}
     */
    function zeroPad(value, len) {
        var s = "" + value;
        while (s.length < len) s = "0" + s;
        return s;
    }

    /**
     * Returns `true` if `value` is not null or undefined.
     * @param {*} value 
     */
    function hasValue(value) {
        return value != null;
    }
    
    /**
     * Returns the first of the two values that is not NaN.
     */
    function numberCoalesce(value1, value2) {
        return isNaN(value1) ? value2 : value1;
    }
    
    
    // Culture functions
    
    /**
     * This method will fill gaps in the specified culture with information from the invariant culture.
     */
    function fillGapsInCulture(culture) {
        // Add missing formats from the culture template
        for (var key in CULTURE_TEMPLATE) {
            culture[key] = culture[key] || CULTURE_TEMPLATE[key];
        }
        
        // Construct composite formats if they are not already defined
        culture.f = culture.f || culture.D + " " + culture.t;
        culture.F = culture.F || culture.D + " " + culture.T;
        culture.g = culture.g || culture.d + " " + culture.t;
        culture.G = culture.G || culture.d + " " + culture.T;
        
        // Add aliases
        culture.m = culture.M;
        culture.y = culture.Y;
        
        return culture;
    }
    
    /**
     * This method will update the currently selected culture object to reflect the currently set LCID (as far as possible).
     */
    function updateCulture() {
        sffjs.LC = currentCulture = 
            currentCultureId && 
            (
                cultures[currentCultureId[toUpperCase]()] || 
                cultures[currentCultureId.split("-")[0][toUpperCase]()]
            ) || INVARIANT_CULTURE;
    }
    
    
    // Maths
    
    function ensureFixedPoint(numberString) {
        var parts = numberString.split("e");
        var result = parts[0];
        
        if (parts.length > 1) {
            // Convert exponential to fixed-point number
            var exponent = Number(parts[1]);
            result = result.replace(".", "");
            
            if (exponent < 0) {
                while (++exponent < 0) {
                    result = "0" + result;
                }
                result = "0." + result;
            }
            else {
                while (exponent >= result.length) {
                    result += "0";
                }
            }
        }
        
        return result;
    }
    
    /**
     * Generates a string representation of the specified number with the specified number of digits.
     * @param {number} number The value to be processed.
     * @param {number} [decimals] The maximum number of decimals. If not specified, the value is not rounded.
     * @returns {string} The rounded absolute value as a string.
     */
    function numberToString(number, decimals) {
        var result = ensureFixedPoint(Math.abs(number).toString());
        
        var radixIndex = result.indexOf(".");
        if (radixIndex > 0 && result.length - radixIndex - 1 > decimals) {
            // Rounding required
            
            // Add 1 to string representation of the number to improve 
            // the chance that toFixed rounds correctly.
            result = ensureFixedPoint(Number(result + "1").toFixed(decimals));
            
            // Trim excessive decimal zeroes
            if (decimals > 0) {
                result = result.replace(/\.?0+$/, "");
            }
        }
        
        return result;
    }
    
    /**
     * Counts the number of integral digits in a number converted to a string by the JavaScript runtime.
     * @param {string} numberString 
     * @returns {number}
     */
    function numberOfIntegralDigits(numberString) {
        var point = numberString.indexOf(".");
        return point < 0 ? numberString.length : point;
    }
    
    /**
     * Counts the number of decimal digits in a number converted to a string by the JavaScript runtime
     * @param {string} numberString 
     * @returns {number}
     */
    function numberOfDecimalDigits(numberString) {
        var point = numberString.indexOf(".");
        return point < 0 ? 0 : numberString.length - point - 1;
    }
    
    
    // Formatting helpers
    
    /**
     * This function resolves a path on the format `<membername>(.<membername>|[<index>])*`
     * and evaluates the value.
     * @param {string} path A series of path components separated by points. Each component is either an index in square brackets.
     * @param {*} value An object on which the path is evaluated.
     */
    function resolvePath(path, value) {
        // Parse and evaluate path
        if (hasValue(value)) {
            var followingMembers = /(\.([a-zA-Z_$]\w*)|\[(\d+)\])/g,
                match = /^[a-zA-Z_$]\w*/.exec(path);
                
            value = value[match[0]];
            
            // Evaluate path until we reach the searched member or the value is undefined/null
            while (hasValue(value) && (match = followingMembers.exec(path))) {
                value = value[match[2] || Number(match[3])];
            }
        }
        
        return value;
    }
    
    /**
     * Writes a value to an array in groups of three digits.
     * @param {string[]} out An array used as string builder to which the grouped output will be appended. The array
     * may have to properties that affect the output:
     * 
     * * `g`: the number of integral digits left to write.
     * * `t`: the thousand separator.
     *   
     * If any of those properties are missing, the output is not grouped.
     * @param {string} value The value that will be written to `out`.
     */
    function groupedAppend(out, value) {
        for (var i = 0, length = value.length; i < length; i++) {
            // Write number
            out.push(value[i]);

            // Begin a new group?
            if (out.g > 1 && out.g-- % 3 == 1) {
                out.push(out.t);
            }
        }
    }
    
    /**
     * Process a single format item in a composite format string.
     * @param {string} pathOrIndex The raw argument index or path component of the format item.
     * @param {string} align The raw alignment component of the format item.
     * @param {string} formatString The raw format string of the format item.
     * @param {Array} args The arguments that were passed to String.format, where index 0 is the full composite format string.
     * @returns {string} The formatted value as a string.
     */
    function processFormatItem(pathOrIndex, align, formatString, args) {        
        var value, 
            index = parseInt(pathOrIndex, 10), 
            paddingLength, 
            padding = "";
        
        // Determine whether index or path mode was used
        if (isNaN(index)) {
            // Non-numerical index => treat as path
            value = resolvePath(pathOrIndex, args[1]);
        } else {
            // Index was numerical => ensure index is within range
            if (index > args.length - 2) {
                // Throw exception if argument is not specified (however undefined and null values are fine!)
                throw "Missing argument";
            }
            
            value = args[index + 1];
        }
        
        // If the object has a custom format method, use it,
        // otherwise use toString to create a string
        value = !hasValue(value) ? "" : value.__Format ? value.__Format(formatString) : "" + value;
        
        // Add padding (if necessary)
        align = Number(align) || 0;
        
        paddingLength = Math.abs(align) - value.length;

        while (paddingLength-- > 0) {
            padding += " ";
        }
        
        // innerArgs[1] is the leading {'s
        return (align < 0 ? value + padding : padding + value);
    }
    
    /**
     * Handles basic formatting used for standard numeric format strings.
     * @param {number} number The number to format.
     * @param {number} minIntegralDigits The minimum number of integral digits. The number is padded with leading
     * zeroes if necessary.
     * @param {number} minDecimalDigits The minimum number of decimal digits. The decimal part is padded with trailing
     * zeroes if necessary.
     * @param {number} maxDecimalDigits The maximum number of decimal digits. The number is rounded if necessary.
     * @param {string} radixPoint The string that will be appended to the output as a radix point.
     * @param {string} thousandSeparator The string that will be used as a thousand separator of the integral digits.
     * @returns {string} The formatted value as a string.
     */
    function basicNumberFormatter(number, minIntegralDigits, minDecimalDigits, maxDecimalDigits, radixPoint, thousandSeparator) {
        var integralDigits, decimalDigits, out = [];
        out.t = thousandSeparator;
        
        // Minus sign
        if (number < 0) {
            out.push("-");
        }
        
        // Prepare number 
        number = numberToString(number, maxDecimalDigits);
        
        integralDigits = out.g = numberOfIntegralDigits(number);
        decimalDigits = numberOfDecimalDigits(number);

        // Pad integrals with zeroes to reach the minimum number of integral digits
        minIntegralDigits -= integralDigits;
        while (minIntegralDigits-- > 0) {
            groupedAppend(out, "0");
        }
        
        // Add integral digits
        groupedAppend(out, number.substr(0, integralDigits));
        
        // Add decimal point and decimal digits
        if (minDecimalDigits || decimalDigits) {
            out.push(radixPoint);
            
            groupedAppend(out, number.substr(integralDigits + 1));

            // Pad with zeroes
            minDecimalDigits -= decimalDigits;
            while (minDecimalDigits-- > 0) {
                groupedAppend(out, "0");
            }
        }
        
        return out.join("");
    }
    
    /**
     * Handles formatting of custom numeric format strings.
     * @param {number} number The number to format.
     * @param {string} format A string specifying the format of the output.
     * @param {string} radixPoint The string that will be appended to the output as a radix point.
     * @param {string} thousandSeparator The string that will be used as a thousand separator of the integral digits.
     * @returns {string} The formatted value as a string.
     */
    function customNumberFormatter(number, format, radixPoint, thousandSeparator) {
        var digits = 0,
            forcedDigits = -1,
            integralDigits = -1,
            decimals = 0,
            forcedDecimals = -1,
            
            thousandsMultiplier = 1,
            
            atDecimals = 0, // Bool
            unused = 1, // Bool, True until a digit has been written to the output
            
            tokens = [],
            tokenGroups = [ tokens ],
            
            currentToken,
            numberIndex,
            formatIndex,
            endIndex,
            
            out = [];

        // Tokenize format string.
        // Constants are represented with String instances, while all other tokens are represented with
        // string literals.
        for (formatIndex = 0; formatIndex < format.length; formatIndex++) {
            currentToken = format[formatIndex];
            
            // Check if we have reached a literal
            if (currentToken == "'" || currentToken == '"') {
                
                // Find end of literal
                endIndex = format.indexOf(currentToken, formatIndex + 1);
                
                // String instances are used to represent constants
                tokens.push(new String(
                    format.substring(
                        formatIndex + 1, 
                        endIndex < 0 ? undefined : endIndex // assume rest of string if matching quotation mark is missing
                    )));
                
                // If there is no matching end quotation mark, let's assume the rest of the string is a literal.
                // This is the way .NET handles things.
                if (endIndex < 0) break;
                
                formatIndex = endIndex;
                
            // Check for single escaped character
            } else if (currentToken == "\\") {
                // String instances are used to represent constants
                tokens.push(new String(format[++formatIndex]));
                
            } else if (currentToken == ";") {
            
                // Short circuit tokenizer
                if (number > 0 || // No need to parse any more groups if the number is positive since the first group is for positive numbers
                    number < 0 && tokenGroups.length > 1) { // Dito for negative numbers which is specified in the second group
                    break;
                }
                
                // Begin a new token group
                tokenGroups.push(tokens = []);
                
            } else {
                tokens.push(currentToken);
                
            }
        }

        // Determine which token group to be used ( positive; negative; zero, where the two last ones are optional)
        if (number < 0 && tokenGroups.length > 1) {
            number *= -1;
            format = tokenGroups[1];
        } else {
            format = tokenGroups[!number && tokenGroups.length > 2 ? 2 : 0];
        }

        // Analyse format string
        // Count number of digits, decimals, forced digits and forced decimals.
        for (formatIndex = 0; formatIndex < format.length; formatIndex++) {
            currentToken = format[formatIndex];
            
            // Only handle digit placeholders and number multipliers during analysis phase
            if (currentToken === "0" || currentToken === "#") {
                decimals += atDecimals;

                if (currentToken == "0") {
                    // 0 is a forced digit
                    if (atDecimals) {
                        forcedDecimals = decimals;
                    } else if (forcedDigits < 0) {
                        forcedDigits = digits;
                    }
                }
                
                // If a comma specifier is specified before the last integral digit
                // it indicates thousand grouping.
                if (thousandsMultiplier != 1 && !atDecimals) {
                    // Set thousand separator
                    out.t = thousandSeparator;
                    thousandsMultiplier = 1;
                }

                digits += !atDecimals;
            }
            
            // End of integral part
            else if (currentToken === ".") {
                atDecimals = 1;
            }
            
            // Comma specifier used for both thousand grouping and scaling.
            // It is only effective if specified before the explicit or implicit decimal point. 
            else if (currentToken === "," && !atDecimals && digits > 0) { 
                thousandsMultiplier *= 0.001;
            }
            
            // Percent
            else if (currentToken === "%") {
                number *= 100;
            }
        }
        forcedDigits = forcedDigits < 0 ? 1 : digits - forcedDigits;

        // Negative value? Begin string with a dash
        if (number < 0) {
            out.push("-");
        }

        // Round the number value to a specified number of decimals
        number = numberToString(number * thousandsMultiplier, decimals);

        // Get integral length
        integralDigits = numberOfIntegralDigits(number);

        // Set initial number cursor position
        numberIndex = integralDigits - digits;

        // Initialize thousand grouping
        out.g = Math.max(integralDigits, forcedDigits);
        
        for (formatIndex = 0; formatIndex < format.length; formatIndex++) {
            currentToken = format[formatIndex];
        
            // Digit placeholder
            if (currentToken === "#" || currentToken === "0") {
                if (numberIndex < integralDigits) {
                    // In the integral part
                    if (numberIndex >= 0) {
                        if (unused) {
                            groupedAppend(out, number.substr(0, numberIndex));
                        }
                        groupedAppend(out, number[numberIndex]);

                        // Not yet inside the number number, force a zero?
                    } else if (numberIndex >= integralDigits - forcedDigits) {
                        groupedAppend(out, "0");
                    }

                    unused = 0;

                } else if (forcedDecimals-- > 0 || numberIndex < number.length) {
                    // In the fractional part
                    groupedAppend(out, numberIndex >= number.length ? "0" : number[numberIndex]);
                }

                numberIndex++;

            // Radix point character according to current culture.
            } else if (currentToken === ".") {
                if (number.length > ++numberIndex || forcedDecimals > 0) {
                    out.push(radixPoint);
                }
                
            // Other characters are written as they are, except from commas
            } else if (currentToken !== ",") {
                out.push(currentToken);
            }
        }
        
        return out.join("");
    }
    
    // ***** FORMATTERS
    // ***** Number Formatting *****

    /**
     * Formats this number according the specified format string.
     * @param {string} format The formatting string used to format this number.
     * @returns {string}
     */
    Number.prototype.__Format = function(format) {
        var number = Number(this),
            radixPoint = currentCulture._r,
            thousandSeparator = currentCulture._t;
        
        // If not finite, i.e. ±Intifity and NaN, return the default JavaScript string notation
        if (!isFinite(number)) {
            return "" + number;
        }
        
        // Default formatting if no format string is specified
        if (!format && format !== "0") {
            format = "G";
        }
        
        // EVALUATE STANDARD NUMERIC FORMAT STRING
        // See reference at
        // http://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
        
        var standardFormatStringMatch = format.match(/^([a-zA-Z])(\d{0,2})$/);
        if (standardFormatStringMatch)
        {
            var standardFormatStringMatch_UpperCase = standardFormatStringMatch[1][toUpperCase](),
                precision = parseInt(standardFormatStringMatch[2], 10); // parseInt used to ensure empty string is aprsed to NaN
            
            // Standard numeric format string
            switch (standardFormatStringMatch_UpperCase) {
                case "D":
                    // DECIMAL
                    // Precision: number of digits
                    
                    // Note: the .NET implementation throws an exception if used with non-integral 
                    // data types. However, this implementation follows the JavaScript manner being
                    // nice about arguments and thus rounds any floating point numbers to integers.
                    
                    return basicNumberFormatter(number, numberCoalesce(precision, 1), 0, 0);
                
                case "F":
                    // FIXED-POINT
                    // Precision: number of decimals
                    
                    thousandSeparator = "";
                    // Fall through to N, which has the same format as F, except no thousand grouping
                    
                case "N":
                    // NUMBER
                    // Precision: number of decimals
                    
                    return basicNumberFormatter(number, 1, numberCoalesce(precision, 2), numberCoalesce(precision, 2), radixPoint, thousandSeparator);
                
                case "G":
                    // GENERAL
                    // Precision: number of significant digits
                    
                    // Fall through to E, whose implementation is shared with G
                    
                case "E":
                    // EXPONENTIAL (SCIENTIFIC)
                    // Precision: number of decimals
                    
                    // Note that we might have fell through from G above!
                    
                    // Determine coefficient and exponent for exponential notation
                    var exponent = 0, coefficient = Math.abs(number);
                    
                    while (coefficient >= 10) {
                        coefficient /= 10;
                        exponent++;
                    }
                    
                    while (coefficient > 0 && coefficient < 1) {
                        coefficient *= 10;
                        exponent--;
                    }
                    
                    var exponentPrefix = standardFormatStringMatch[1],
                        exponentPrecision = 3,
                        minDecimals, maxDecimals;
                    
                    if (standardFormatStringMatch_UpperCase == "G") {
                        // Default precision in .NET is dependent on the data type.
                        // For double the default precision is 15.
                        precision = precision || 15;
                        
                        // When (exponent <= -5) the exponential notation is always more compact.
                        //   e.g. 0.0000123 vs 1.23E-05
                        // When (exponent >= precision) the number cannot be represented 
                        //   with the right number of significant digits without using 
                        //   exponential notation.
                        //   e.g. 123 (1.23E+02) cannot be represented using fixed-point 
                        //   notation with less than 3 significant digits.
                        if (exponent > -5 && exponent < precision) {
                            // Use fixed-point notation
                            return basicNumberFormatter(number, 1, 0, precision - exponent - 1, radixPoint);
                        }
                    
                        exponentPrefix = exponentPrefix == "G" ? "E" : "e";
                        exponentPrecision = 2;
                        
                        // The precision of G is the number of significant digits
                        minDecimals = 0;
                        maxDecimals = precision - 1;
                    } else {
                        // The precision of E is the number of decimal digits
                        minDecimals = maxDecimals = numberCoalesce(precision, 6);
                    }
                    
                    // If the exponent is negative, then the minus is added when formatting the exponent as a number.
                    // In the case of a positive exponent, we need to add the plus sign explicitly.
                    if (exponent >= 0) {
                        exponentPrefix += "+";
                    }
                    
                    // Consider if the coefficient is positive or negative.
                    // (the sign was lost when determining the coefficient)
                    if (number < 0) {
                        coefficient *= -1;
                    }
                    
                    return (
                        basicNumberFormatter(coefficient, 1, minDecimals, maxDecimals, radixPoint, thousandSeparator) + 
                        exponentPrefix + 
                        basicNumberFormatter(exponent, exponentPrecision, 0, 0)
                        );
                
                case "P":
                    // PERCENT
                    // Precision: number of decimals
                    
                    return basicNumberFormatter(number * 100, 1, numberCoalesce(precision, 2), numberCoalesce(precision, 2), radixPoint, thousandSeparator) + " %";
                
                case "X":
                    // HEXADECIMAL
                    // Precision: number of digits
                    
                    // Note: the .NET implementation throws an exception if used with non-integral 
                    // data types. However, this implementation follows the JavaScript manner being
                    // nice about arguments and thus rounds any floating point numbers to integers.
                    
                    var result = Math.round(number).toString(16);
                    
                    if (standardFormatStringMatch[1] == "X") {
                        result = result[toUpperCase]();
                    }
                    
                    // Add padding, remember precision might be NaN
                    precision -= result.length;
                    while (precision-- > 0) {
                        result = "0" + result;
                    }
                    
                    return result;
                
                case "C":
                    // CURRENCY
                    // Precision: ignored (number of decimals in the .NET implementation)
                    
                    // The currency format uses a custom format string specified by the culture.
                    // Precision is not supported and probably won't be supported in the future.
                    // Developers probably use explicit formatting of currencies anyway...
                    format = currentCulture._c;
                    radixPoint = currentCulture._cr;
                    thousandSeparator = currentCulture._ct;
                    break;
                
                case "R":
                    // ROUND-TRIP
                    // Precision: ignored
                    
                    // The result should be reparsable => just use Javascript default string representation.
                    
                    return "" + number;
            }
        }
        
        // EVALUATE CUSTOM NUMERIC FORMAT STRING
        return customNumberFormatter(number, format, radixPoint, thousandSeparator);
    };

    // ***** Date Formatting *****

    /**
     * Formats this date according the specified format string.
     * @param {string} format The formatting string used to format this date.
     * @returns {string}
     */
    Date.prototype.__Format = function(format) {
        var date        = this, 
            year        = date.getFullYear(),
            month       = date.getMonth(),
            dayOfMonth  = date.getDate(),
            dayOfWeek   = date.getDay(),
            hour        = date.getHours(),
            minute      = date.getMinutes(),
            second      = date.getSeconds(),
            fracSecond  = date.getMilliseconds() / 1000,
            tzOffset    = date.getTimezoneOffset(),
            tzOffsetAbs = tzOffset < 0 ? -tzOffset : tzOffset;
            
        // If no format is specified, default to G format
        format = format || "G";
        
        // Resolve standard date/time format strings
        if (format.length == 1) {
            format = currentCulture[format] || format;
        }

        // Note that a leading percent is trimmed below. This is not completely compatible with .NET Framework,
        // which will treat a percent followed by more than a single character as two format tokens, e.g. 
        // %yy is interpreted as ['y' 'y'], whereas this implementation will interpret it as ['yy']. This does
        // not seem to be a documented behavior and thus an acceptable deviation.
        return format.replace(/^%/, "").replace(/(\\.|'[^']*'|"[^"]*"|d{1,4}|M{1,4}|y+|HH?|hh?|mm?|ss?|[f]{1,7}|[F]{1,7}|z{1,3}|tt?)/g, 
            function (match) { 
                var char0 = match[0];

                        // Day
                return  match == "dddd" ? currentCulture._D[dayOfWeek] :
                                             // Use three first characters from long day name if abbreviations are not specifed
                        match == "ddd"  ? (currentCulture._d ? currentCulture._d[dayOfWeek] : currentCulture._D[dayOfWeek].substr(0, 3)) : 
                        char0 == "d"    ? zeroPad(dayOfMonth, match.length) :
                        
                        // Month
                        match == "MMMM" ? currentCulture._M[month] :
                                             // Use three first characters from long month name if abbreviations are not specifed
                        match == "MMM"  ? (currentCulture._m ? currentCulture._m[month] : currentCulture._M[month].substr(0, 3)) :
                        char0 == "M"    ? zeroPad(month + 1, match.length) :

                        // Year
                        match == "yy"   ? zeroPad(year % 100, 2) : 
                        match == "y"    ? year % 100 :
                        char0 == "y"    ? zeroPad(year, match.length) :
                        
                        // Hour
                        char0 == "H"    ? zeroPad(hour, match.length) :
                        char0 == "h"    ? zeroPad(hour % 12 || 12, match.length) :
                        
                        // Minute
                        char0 == "m"    ? zeroPad(minute, match.length) :
                        
                        // Second
                        char0 == "s"    ? zeroPad(second, match.length) :

                        // Fractional second (substr is to remove "0.")
                        char0 == "f"    ? (fracSecond).toFixed(match.length).substr(2) :
                        char0 == "F"    ? numberToString(fracSecond, match.length).substr(2) :
                        
                        // Timezone, "z" -> "+2", "zz" -> "+02", "zzz" -> "+02:00"
                        char0 == "z"    ? (tzOffset < 0 ? "-" : "+") + // sign
                                          (zeroPad(0 | (tzOffsetAbs / 60), match == "z" ? 1 : 2)) + // hours
                                          (match == "zzz" ? ":" + zeroPad(tzOffsetAbs % 60, 2) : "") : // minutes

                        // AM/PM
                        match == "tt"   ? (hour < 12 ? currentCulture._am : currentCulture._pm) : 
                        char0 == "t"    ? (hour < 12 ? currentCulture._am : currentCulture._pm)[0] :
                        
                        // String literal => strip quotation marks
                        match.substr(1, match.length - 1 - (match[0] != "\\"));
            });
    };
    
    /**
     * Formats a string according to a specified formatting string.
     * @param {string} str The formatting string used to format the additional arguments.
     * @param {...*} args
     */
    String.__Format = function(str, obj0, obj1, obj2) {
        var outerArgs = arguments;
        
        return str.replace(/\{((\d+|[a-zA-Z_$]\w*(?:\.[a-zA-Z_$]\w*|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*(?:(?:\}\})+[^\}]+)*))?)\}|(\{\{)|(\}\})/g, function () {
            var innerArgs = arguments;
            
            // Handle escaped {
            return innerArgs[5] ? "{" :
            
            // Handle escaped }
                innerArgs[6] ? "}" :
            
            // Valid format item
                processFormatItem(
                    innerArgs[2], 
                    innerArgs[3], 
                    // Format string might contain escaped braces
                    innerArgs[4] && innerArgs[4].replace(/\}\}/g, "}").replace(/\{\{/g, "{"), 
                    outerArgs);
        });
    };

    // If a format method has not already been defined on the following objects, set __Format as format.
    var formattables = [ Date.prototype, Number.prototype, String ];
    for (var i = 0, length = formattables.length; i < length; i++) {
        formattables[i].format = formattables[i].format || formattables[i].__Format;
    }
    
    // Initiate culture
    updateCulture();
    
    return sffjs;
})(), 

// msf for backward compatibility
msf = sffjs;