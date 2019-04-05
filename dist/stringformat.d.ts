/*
 * String.format for JavaScript 1.16.0
 * https://github.com/dmester/sffjs
 *  
 * Built: 2019-04-05T18:33:05.038Z
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
     * Sets the specified culture. This command has no effect unless you also load the corresponding culture file. 
     * Sffjs does not come with a culture file autoloader.
     * 
     * @param culture IETF language code.
     */
    function setCulture(culture: string): void;
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
