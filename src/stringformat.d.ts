/*
 * String.format for JavaScript {version}
 * https://github.com/dmester/sffjs
 *  
 * Built: {date}
 *
 * Copyright (c) 2009-{year} Daniel Mester Pirttijärvi
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

/**
 * String.format for JavaScript.
 */
declare namespace sffjs {
    /**
     * Version of sffjs.
     */
    const version: string;

    /**
     * Implement this interface on a class to make it formattable.
     */
    interface Formattable {
        /**
         * Formats this date using a specified format string.
         * 
         * @param formatString Format string specifying the notation of the resulting string.
         */
        __Format(formatString?: string): string;
    }

    /**
     * Provides date/time and number formatting information about a specific culture.
     */
    interface CultureInfo {
        /**
         * IETF language tag.
         * @default ""
         */
        name: string;
        /**
         * Full month names.
         * @default ["January","February","March","April","May","June","July","August","September","October","November","December"]
         */
        _M: string[];
        /**
         * Short month names.
         * @default ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
         */
        _m: string[];
        /**
         * Full weekday names starting with Sunday.
         * @default ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
         */
        _D: string[];
        /**
         * Short weekday names starting with Sunday.
         * @default ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
         */
        _d: string[];
        /**
         * Decimal separator
         * @default "."
         */
        _r: string;
        /**
         * Thousands separator
         * @default ","
         */
        _t: string;
        /**
         * Currency format string
         * @default "¤#,0.00"
         */
        _c: string;
        /**
         * Decimal separator for currency formatting
         * @default "."
         */
        _cr: string;
        /**
         * Thousands separator for currency formatting
         * @default ","
         */
        _ct: string;
        /**
         * AM (before noon) designator
         * @default "AM"
         */
        _am: string;
        /**
         * PM (after noon) designator
         * @default "PM"
         */
        _pm: string;
        /**
         * Sortable date/time format
         * @default "yyyy-MM-ddTHH:mm:ss"
         */
        s: string;
        /**
         * Short date format
         * @default "MM/dd/yyyy"
         */
        d: string;
        /**
         * Long date format
         * @default "dddd, dd MMMM yyyy"
         */
        D: string;
        /**
         * Short time format
         * @default "HH:mm"
         */
        t: string;
        /**
         * Long time format
         * @default "HH:mm:ss"
         */
        T: string;
        /**
         * Long date with short time
         * @default "dddd, dd MMMM yyyy HH:mm"
         */
        f: string;
        /**
         * Long date with long time
         * @default "dddd, dd MMMM yyyy HH:mm:ss"
         */
        F: string;
        /**
         * Short date with short time
         * @default "MM/dd/yyyy HH:mm"
         */
        g: string;
        /**
         * Short date with long time
         * @default "MM/dd/yyyy HH:mm:ss"
         */
        G: string;
        /**
         * Month/day format
         * @default "MMMM dd"
         */
        M: string;
        /**
         * Year/month format
         * @default "yyyy MMMM"
         */
        Y: string;
    }

    /**
     * Sets the specified culture. This command has no effect unless you also load the corresponding culture file. 
     * Sffjs does not come with a culture file autoloader.
     * 
     * @param culture IETF language tag.
     */
    function setCulture(culture: string): void;

    /**
     * Gets a list of all registered cultures. The invariant culture is included with an empty string as name.
     */
    function getCultures(): CultureInfo[];

    /**
     * Gets the culture currently in use.
     */
    const LC: CultureInfo;
}

interface StringConstructor {
    /**
     * Replaces all placeholders on the format {0} with the corresponding argument, which is formatted using an optional format string.
     * 
     * @param formatString Composite format string optionally including placeholders for the arguments.
     * @param args Arguments to the format string.
     */
    format(formatString: string, ...args: any[]): string;
}

interface Number extends sffjs.Formattable {
    /**
     * Formats this number using a specified format string.
     * 
     * @param formatString Format string specifying the notation of the resulting string.
     */
    format(formatString?: string): string;
}

interface Date extends sffjs.Formattable {
    /**
     * Formats this date using a specified format string.
     * 
     * @param formatString Format string specifying the notation of the resulting string.
     */
    format(formatString?: string): string;
}
