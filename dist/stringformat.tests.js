/**
 * Unit tests for
 * String.format for JavaScript 1.16.1
 * https://github.com/dmester/sffjs
 *  
 * Built: 2019-07-22T15:12:09.052Z
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
 
(function () {
    /// <summary>
    ///     Performs a series of unit tests and writes the output to the page.
    /// </summary>
    
    
    function runTests(test) {
        sffjs.setCulture("en");
        
        var testObject = {
            a: "b",
            authors: [
                {
                    firstname: "John",
                    lastname: "Doe",
                    phonenumbers: [
                        {
                            home: "012",
                            home: "345"
                        }
                    ],
                    age: 27
                }
            ]
        };
        
        var undefined;
        
        test.section("Tags");
        assert.formatsTo("Test {with} brackets", "Test {{with}} brackets");
        assert.formatsTo("{brackets} in args", "{0} in args", "{brackets}");
        assert.formatsTo("{{dblbrackets}} in args", "{0} in args", "{{dblbrackets}}");
        assert.formatsTo("Mismatch {{{brackets}}", "Mismatch {{{0}}", "{{brackets}");
        assert.formatsTo("Double outer {{{brackets}}", "Double outer {{{0}}}", "{{brackets}");
        
        test.section("Index");
        assert.formatsTo("!String!", "!{0}!", "String");
        assert.formatsTo("!42!", "!{0}!", 42);
        assert.formatsTo("!true!", "!{0}!", true);
        assert.formatsTo("null:!!", "null:!{0}!", null);
        assert.formatsTo("undefined:!!", "undefined:!{0}!", undefined);
        assert.doesThrow(function () { String.format("{1}", 42) }, "Missing argument", "Index out of range");
        assert.formatsTo("Negative index:!{-1}!", "Negative index:!{-1}!", 42);

        
        test.section("Path");
        assert.formatsTo("Hi, John!", "Hi, {authors[0].firstname}!", testObject);
        assert.formatsTo("Hi, !", "Hi, {authors[1].firstname}!", testObject);
        assert.formatsTo("Hi, {authors[1]..firstname}!", "Hi, {authors[1]..firstname}!", testObject);
        assert.formatsTo("Hi, {authors[1.firstname}!", "Hi, {authors[1.firstname}!", testObject);
        assert.formatsTo("Hi, {0.authors}!", "Hi, {0.authors}!", testObject);
        assert.formatsTo("Hi, !", "Hi, {fdggffgf}!", undefined);
        assert.formatsTo("Hi, !", "Hi, {fdggffgf}!", testObject);
        assert.formatsTo("Hi, !", "Hi, {authors.fdg}!", testObject);
        assert.formatsTo("Hi, 1!", "Hi, {authors.length}!", testObject);
        assert.formatsTo("1.00", "{authors.length:0.00}", testObject);
        assert.formatsTo("After a comes b.", "After a comes {a}.", testObject);
        
        test.section("Invalid paths");
        assert.formatsTo("Hi, {fg$}!", "Hi, {fg$}!", undefined);
        assert.formatsTo("Hi, {fg[]}!", "Hi, {fg[]}!", undefined);
        assert.formatsTo("Hi, {fg[-1]}!", "Hi, {fg[-1]}!", undefined);
        assert.formatsTo("Hi, {fg.}!", "Hi, {fg.}!", undefined);
        assert.formatsTo("Hi, {.fg}!", "Hi, {.fg}!", undefined);
        assert.formatsTo("Hi, {a..b}!", "Hi, {a..b}!", undefined);
        
        test.section("Escaped braces");
        assert.formatsTo("a { b", "a {{ b", testObject);
        assert.formatsTo("a } b", "a }} b", testObject);
        assert.formatsTo("a{{a}}", "a{{{{a}}}", testObject); // *
        assert.formatsTo("a{{b}", "a{{{{{a}}}", testObject);
        assert.formatsTo("a{aba}a", "a{{a{a}a}}a", testObject);
        assert.formatsTo("a{{aba", "a{{{a{a}a", testObject); // *
        assert.formatsTo("a{bbb{}a", "a{{b{a}{a}{}a", testObject); // *
        assert.formatsTo("4}.2", "{0:0}}.0}", 4.2);
        assert.formatsTo("4{.2", "{0:0{{.0}", 4.2);
        assert.formatsTo("4}{{}.2", "{0:0}}{{{{}}.0}", 4.2);
        // * These tests do not produce the same output as in .NET. In .NET these format strings will 
        // generate a FormatException while the JS implementation makes a best effort to finish processing
        // the format string.
        
        var dtam = new Date(1989, 3, 2, 6, 20, 33, 123);
        var dtpm = new Date(1989, 3, 2, 18, 20, 33, 123);
        
        test.section("Date/time no formatting");
        assert.formatsTo("04/02/1989 06:20:33", "{0}", dtam);
        
        test.section("Date/time standard (invariant culture)");
        assert.formatsTo("04/02/1989", "{0:d}", dtam);
        assert.formatsTo("Sunday, 02 April 1989", "{0:D}", dtam);
        assert.formatsTo("Sunday, 02 April 1989 06:20", "{0:f}", dtam);
        assert.formatsTo("Sunday, 02 April 1989 18:20", "{0:f}", dtpm);
        assert.formatsTo("Sunday, 02 April 1989 06:20:33", "{0:F}", dtam);
        assert.formatsTo("Sunday, 02 April 1989 18:20:33", "{0:F}", dtpm);
        assert.formatsTo("04/02/1989 06:20", "{0:g}", dtam);
        assert.formatsTo("04/02/1989 18:20", "{0:g}", dtpm);
        assert.formatsTo("04/02/1989 06:20:33", "{0:G}", dtam);
        assert.formatsTo("04/02/1989 18:20:33", "{0:G}", dtpm);
        assert.formatsTo("April 02", "{0:M}", dtpm);
        assert.formatsTo("April 02", "{0:m}", dtpm);
        
        // Not currently supported
        //assert.formatsTo("1989-04-02T18:20:33.0000000", "{0:O}", dtpm);
        //assert.formatsTo("1989-04-02T18:20:33.0000000", "{0:o}", dtpm);
        
        // Not currently supported
        //assert.formatsTo("Sun, 2 April 1989 06:20:33 GMT", "{0:R}", dtam);
        
        assert.formatsTo("1989-04-02T06:20:33", "{0:s}", dtam);
        
        assert.formatsTo("06:20", "{0:t}", dtam);
        assert.formatsTo("18:20", "{0:t}", dtpm);
        
        assert.formatsTo("06:20:33", "{0:T}", dtam);
        assert.formatsTo("18:20:33", "{0:T}", dtpm);
        
        // Not currently supported
        //assert.formatsTo("1989-04-02 06:20:33Z", "{0:u}", dtpm);
        //assert.formatsTo("Sunday, April 2, 1989 6:20:33 PM", "{0:U}", dtpm);
        
        assert.formatsTo("1989 April", "{0:y}", dtpm);
        assert.formatsTo("1989 April", "{0:Y}", dtpm);
        
        test.section("Date/time custom");
        assert.formatsTo("1989-04-02 18:20:33", "{0:yyyy-MM-dd HH:mm:ss}", dtpm);
        assert.formatsTo("06:20:33 A", "{0:hh:mm:ss t}", dtam);
        assert.formatsTo("06:20:33 AM", "{0:hh:mm:ss tt}", dtam);
        assert.formatsTo("06:20:33 P", "{0:hh:mm:ss t}", dtpm);
        assert.formatsTo("06:20:33 PM", "{0:hh:mm:ss tt}", dtpm);
        
        assert.formatsTo("hh:mm:33 PM", "{0:'hh:mm':ss tt}", dtpm);

        assert.formatsTo("89 89 1989 1989 01989 0000000000000000000001989", "{0:%y} {0:yy} {0:yyy} {0:yyyy} {0:yyyyy} {0:yyyyyyyyyyyyyyyyyyyyyyyyy}", dtpm);
        assert.formatsTo("1 01 001 0001 00001 0000000000000000000000001", "{0:%y} {0:yy} {0:yyy} {0:yyyy} {0:yyyyy} {0:yyyyyyyyyyyyyyyyyyyyyyyyy}", new Date("0001-01-01"));

        assert.formatsTo("00 ", "{0:ff} {0:FF}", new Date(1901, 0, 1));
        assert.formatsTo("1 1", "{0:%f} {0:%F}", dtpm);
        assert.formatsTo("12 12", "{0:ff} {0:FF}", dtpm);
        assert.formatsTo("123 123", "{0:fff} {0:FFF}", dtpm);
        assert.formatsTo("1230 123", "{0:ffff} {0:FFFF}", dtpm);
        assert.formatsTo("12300 123", "{0:fffff} {0:FFFFF}", dtpm);
        assert.formatsTo("123000 123", "{0:ffffff} {0:FFFFFF}", dtpm);
        assert.formatsTo("1230000 123", "{0:fffffff} {0:FFFFFFF}", dtpm);

        var negativeTimeZoneOffset = new Date(1901, 0, 1);
        var zeroTimeZoneOffset = new Date(1901, 0, 1);
        var positiveTimeZoneOffset = new Date(1901, 0, 1);
        negativeTimeZoneOffset.getTimezoneOffset = function () { return -90; };
        zeroTimeZoneOffset.getTimezoneOffset = function () { return 0; };
        positiveTimeZoneOffset.getTimezoneOffset = function () { return 90; };
        assert.formatsTo("-1 -01 -01:30", "{0:%z} {0:zz} {0:zzz}", negativeTimeZoneOffset);
        assert.formatsTo("+0 +00 +00:00", "{0:%z} {0:zz} {0:zzz}", zeroTimeZoneOffset);
        assert.formatsTo("+1 +01 +01:30", "{0:%z} {0:zz} {0:zzz}", positiveTimeZoneOffset);

        assert.formatsTo("Sun", "{0:ddd}", dtpm);
        assert.formatsTo("Sunday", "{0:dddd}", dtpm);
        
        assert.formatsTo("Apr", "{0:MMM}", dtpm);
        assert.formatsTo("April", "{0:MMMM}", dtpm);

        test.section("Special numeric values");
        assert.formatsTo("NaN", "{0}", NaN);
        assert.formatsTo("Infinity", "{0}", 1.7976931348623157E+10308);
        assert.formatsTo("-Infinity", "{0}", -Infinity);
        
        assert.formatsTo("NaN", "{0:0.00}", NaN);
        assert.formatsTo("Infinity", "{0:0.00}", 1.7976931348623157E+10308);
        assert.formatsTo("-Infinity", "{0:0.00}", -1.7976931348623157E+10308);
        
        assert.formatsTo("NaN", "{0:N5}", NaN);
        assert.formatsTo("Infinity", "{0:N5}", 1.7976931348623157E+10308);
        assert.formatsTo("-Infinity", "{0:N5}", -1.7976931348623157E+10308);

        test.section("Align");
        assert.formatsTo("|0.42    |", "|{0,-8}|", 0.42);
        assert.formatsTo("|    0.42|", "|{0,8}|", 0.42);
        assert.formatsTo("|0123456789|", "|{0,8}|", "0123456789");
        assert.formatsTo("|0123456789|", "|{0,-8}|", "0123456789");
        
        test.section("Positive/negative numeric strings");
        assert.formatsTo("pos", "{0:pos;neg}", 5);
        assert.formatsTo("neg", "{0:pos;neg}", -5);
        assert.formatsTo("pos", "{0:pos;neg}", 0);
        assert.formatsTo("pos;", "{0:pos';';neg';'}", 5);
        assert.formatsTo("neg;", "{0:pos';';neg';'}", -5);
        assert.formatsTo("pos;", "{0:pos';';neg';'}", 0);
        
        assert.formatsTo("pos", "{0:pos;neg;zero}", 5);
        assert.formatsTo("neg", "{0:pos;neg;zero}", -5);
        assert.formatsTo("zero", "{0:pos;neg;zero}", 0);
        assert.formatsTo("pos", "{0:pos;neg;zero';'}", 5);
        assert.formatsTo("neg", "{0:pos;neg;zero';'}", -5);
        assert.formatsTo("zero;", "{0:pos;neg;zero';'}", 0);
        
        test.section("Simple numeric format strings");
        assert.formatsTo("0.42", "{0}", 0.42);
        assert.formatsTo("35", "{0}", 35);
        
        test.section("Custom numeric format strings");
        assert.formatsTo("4", "{0:0}", 4.42);
        assert.formatsTo("42.01d", "{0:0.00d}", 42.009);
        assert.formatsTo("42.01", "{0:0.0#}", 42.009);
        assert.formatsTo("42.0", "{0:0.0#}", 42.001);
        assert.formatsTo("0¤1¤42.0", "{0:0¤#¤#0.0}", 142.009);
        assert.formatsTo("abc142.0", "{0:abc0.0}", 142.009);
        assert.formatsTo("42", "{0:0}", 42.4);
        assert.formatsTo("43", "{0:0}", 42.5);
        assert.formatsTo("043", "{0:000}", 42.5);
        assert.formatsTo("042.50", "{0:000.#0}", 42.5);
        assert.formatsTo("042.5", "{0:000.0#}", 42.5);
        assert.formatsTo("042.5000000000000000000000000", "{0:000.0000000000000000000000000}", 42.5);
        assert.formatsTo("1098#234.0", "{0:0'098#'000.0#}", 1234);
        
        test.section("Custom numeric format strings - percent");
        assert.formatsTo("42%", "{0:0%}", 0.42);
        assert.formatsTo("4200%%", "{0:0%%}", 0.42);
        assert.formatsTo("4%", "{0:0'%'}", 4.2);
        assert.formatsTo("4%", "{0:0\\%}", 4.2);
        assert.formatsTo("42.01%", "{0:0.00%}", 0.42009);
        assert.formatsTo("30%", "{0:#,#%}", 0.3);
        assert.formatsTo("30%", "{0:#,#%}", 0.3012);
        assert.formatsTo("31%", "{0:#,#%}", 0.3123);
        assert.formatsTo("30%", "{0:0,0%}", 0.30345)
        assert.formatsTo("03%", "{0:0,0%}", 0.030345)
        
        test.section("Custom numeric format strings - thousands separator and scaling");
        assert.formatsTo("4200", "{0:,0,}", 4200000);
        assert.formatsTo("4,200", "{0:#,0,}", 4200000);
        assert.formatsTo("4", "{0:#,0,,}", 4200000);
        assert.formatsTo("4.2", "{0:0,,.0}", 4200000);
        assert.formatsTo("4.2", "{0:#,0,,.0}", 4200000);
        assert.formatsTo("4200.0", "{0:0.,0}", 4200);
        assert.formatsTo("4200,", "{0:0\\,.}", 4200);
        assert.formatsTo("4.", "{0:0,\\.}", 4200);
        assert.formatsTo("4200,.", "{0:0',.'}", 4200);
        
        test.section("Specifier D");
        assert.formatsTo("43", "{0:d}", 42.5);
        assert.formatsTo("43", "{0:D}", 42.5);
        assert.formatsTo("0043", "{0:d4}", 42.5);
        assert.formatsTo("43", "{0:D1}", 42.5);
        assert.formatsTo("43", "{0:D0}", 42.5);
        
        test.section("Specifier C");
        assert.formatsTo("¤42.50", "{0:c}", 42.5);
        assert.formatsTo("¤42.50", "{0:C}", 42.5);
        
        test.section("Specifier F");
        assert.formatsTo("1242.50", "{0:f}", 1242.5);
        assert.formatsTo("1242.50", "{0:F}", 1242.5);
        assert.formatsTo("1242.6", "{0:f1}", 1242.55);
        assert.formatsTo("1242.500", "{0:F3}", 1242.5);
        assert.formatsTo("1242.000", "{0:F3}", 1242);
        assert.formatsTo("1242.000000000000000000000000000000", "{0:F30}", 1242);
        assert.formatsTo("F301", "{0:F300}", 1);
        assert.formatsTo("1242", "{0:F0}", 1242.3);
        assert.formatsTo("0.000000002", "{0:f9}", 0.000000001594874941);
        
        // sffjs rounds traditionally away from zero, instead of to the nearest even number
        assert.formatsTo("1.00", "{0:f2}", 1.0049);
        assert.formatsTo("1.01", "{0:f2}", 1.005);
        assert.formatsTo("-1.00", "{0:f2}", -1.0049);
        assert.formatsTo("-1.01", "{0:f2}", -1.005);
        
        test.section("Specifier N");
        assert.formatsTo("1,242.50", "{0:n}", 1242.5);
        assert.formatsTo("1,242.50", "{0:N}", 1242.5);
        assert.formatsTo("1,242.6", "{0:n1}", 1242.55);
        assert.formatsTo("1,242.500", "{0:N3}", 1242.5);
        assert.formatsTo("1,242.000", "{0:N3}", 1242);
        assert.formatsTo("1,242.000000000000000000000000000000", "{0:N30}", 1242);
        assert.formatsTo("N301", "{0:N300}", 1);
        assert.formatsTo("1,242", "{0:N0}", 1242.3);
        assert.formatsTo("1,242,300,000,000,000,000,000", "{0:N0}", 1242300000000000000000.0);
        assert.formatsTo("1,242,300,000,000,000,000,000.0", "{0:N1}", 1242300000000000000000.0);
        
        test.section("Specifier G");
        assert.formatsTo("1242", "{0:g}", 1242);
        assert.formatsTo("1.594874941e-09", "{0:g}", 0.000000001594874941);
        assert.formatsTo("1242.5", "{0:g}", 1242.5);
        assert.formatsTo("1242.5", "{0:G}", 1242.5);
        
        assert.formatsTo("0", "{0:G}", 0);
        assert.formatsTo("0.0004", "{0:G}", 0.0004);
        assert.formatsTo("4E-05", "{0:G}", 0.00004);
        assert.formatsTo("4E-06", "{0:G}", 0.000004);
        assert.formatsTo("4.7e-07", "{0:g}", 0.00000047);
        assert.formatsTo("1.59487494155E-09", "{0:G}", 0.00000000159487494155);
        assert.formatsTo("1.59487494155E-09", "{0:G}", 0.00000000159487494155);
        assert.formatsTo("1.594874942E-09", "{0:G10}", 0.00000000159487494155);
        
        assert.formatsTo("159487494155.1", "{0:G}", 159487494155.1);
        assert.formatsTo("1.5949E+11", "{0:G5}", 159487494155.1);
        assert.formatsTo("159487494155.1", "{0:G}", 159487494155.1);
        assert.formatsTo("159487494155568", "{0:G}", 159487494155568);
        assert.formatsTo("1.59487494155569E+15", "{0:G}", 1594874941555692.0);
        // The last assert will generate different output on .NET depending on
        // the data type. double will generate a string with the exponential 
        // notation, and long will generate an expanded number string. JS does
        // not expose different data types for double and long =>
        // we will treat all numbers as doubles.
        
        assert.formatsTo("-1242", "{0:g}", -1242);
        assert.formatsTo("-1242.5", "{0:g}", -1242.5);
        assert.formatsTo("-1242.5", "{0:G}", -1242.5);
        assert.formatsTo("-0.0004", "{0:G}", -0.0004);
        assert.formatsTo("-4E-05", "{0:G}", -0.00004);
        assert.formatsTo("-4E-06", "{0:G}", -0.000004);
        assert.formatsTo("-4.7e-07", "{0:g}", -0.00000047);
        assert.formatsTo("-4.7e-07", "{0:g0}", -0.00000047);
        
        assert.formatsTo("1e+03", "{0:g1}", 1242.55);
        assert.formatsTo("1.2e+03", "{0:g2}", 1242.55);
        assert.formatsTo("1243", "{0:G4}", 1242.5);
        assert.formatsTo("1242.5", "{0:G5}", 1242.5);
        assert.formatsTo("1242.6", "{0:G5}", 1242.55);
        assert.formatsTo("1.24E+03", "{0:G3}", 1242);
        assert.formatsTo("1242", "{0:G30}", 1242);
        
        test.section("Specifier X");
        assert.formatsTo("a", "{0:x}", 10);
        assert.formatsTo("A", "{0:X}", 10);
        assert.formatsTo("00a", "{0:x3}", 10);
        assert.formatsTo("00A", "{0:X3}", 10);
        
        test.section("Specifier E");
        assert.formatsTo("2.350000e+002", "{0:e}", 235);
        assert.formatsTo("2.350000E+002", "{0:E}", 235);
        
        assert.formatsTo("2.35e+003", "{0:e2}", 2353);
        assert.formatsTo("2.35E+003", "{0:E2}", 2353);
        
        assert.formatsTo("2E+003", "{0:E0}", 2353);
        
        test.section("Specifier P");
        assert.formatsTo("12.55 %", "{0:p}", 0.12549);
        assert.formatsTo("12.55 %", "{0:P}", 0.12549);
        assert.formatsTo("13 %", "{0:P0}", 0.12549);
        
        assert.formatsTo("1,212.55 %", "{0:p}", 12.12549);
        assert.formatsTo("1,212.55 %", "{0:P}", 12.12549);
        
        assert.formatsTo("12.5 %", "{0:p1}", 0.12549);
        assert.formatsTo("12.5 %", "{0:P1}", 0.12549);

        assert.formatsTo("30 %", "{0:p0}", 0.3);
        assert.formatsTo("30 %", "{0:p0}", 0.301);
        assert.formatsTo("30 %", "{0:p0}", 0.3012);
        
        test.section("Specifier R");
        assert.formatsTo("2353", "{0:R}", 2353);
        assert.formatsTo("25.3333333", "{0:R}", 25.3333333);
        
        test.section("Culture sv-se");
        sffjs.setCulture("sv-SE");
        assert.formatsTo("1,2e+03", "{0:g2}", 1242.55);
        assert.formatsTo("1242,50", "{0:f}", 1242.5);
        assert.formatsTo("1 242,500", "{0:N3}", 1242.5);
        
        assert.formatsTo("2353", "{0:R}", 2353);
        assert.formatsTo("25.3333333", "{0:R}", 25.3333333);
        
        assert.formatsTo("1989-04-02", "{0:d}", dtam);
        assert.formatsTo("den 2 april 1989 18:20:33", "{0:F}", dtpm);
        assert.formatsTo("1989-04-02 18:20:33", "{0:G}", dtpm);
        assert.formatsTo("2 april", "{0:m}", dtpm);
        assert.formatsTo("18:20", "{0:t}", dtpm);
        assert.formatsTo("18:20:33", "{0:T}", dtpm);
        assert.formatsTo("april 1989", "{0:y}", dtpm);
        
        assert.formatsTo("1.555,48 kr", "{0:c}", 1555.475);
        
        test.section("Date/time standard (en-US)");
        sffjs.setCulture("en-US");
        assert.formatsTo("4/2/1989", "{0:d}", dtam);
        assert.formatsTo("Sunday, April 2, 1989", "{0:D}", dtam);
        assert.formatsTo("Sunday, April 2, 1989 6:20 AM", "{0:f}", dtam);
        assert.formatsTo("Sunday, April 2, 1989 6:20 PM", "{0:f}", dtpm);
        assert.formatsTo("Sunday, April 2, 1989 6:20:33 AM", "{0:F}", dtam);
        assert.formatsTo("Sunday, April 2, 1989 6:20:33 PM", "{0:F}", dtpm);
        assert.formatsTo("4/2/1989 6:20 AM", "{0:g}", dtam);
        assert.formatsTo("4/2/1989 6:20 PM", "{0:g}", dtpm);
        assert.formatsTo("4/2/1989 6:20:33 AM", "{0:G}", dtam);
        assert.formatsTo("4/2/1989 6:20:33 PM", "{0:G}", dtpm);
        assert.formatsTo("April 2", "{0:M}", dtpm);
        assert.formatsTo("April 2", "{0:m}", dtpm);
        
        assert.formatsTo("12:30 AM", "{0:hh:mm tt}", new Date(2000, 0, 1, 00, 30, 00));
        assert.formatsTo("01:30 AM", "{0:hh:mm tt}", new Date(2000, 0, 1, 01, 30, 00));
        assert.formatsTo("11:30 AM", "{0:hh:mm tt}", new Date(2000, 0, 1, 11, 30, 00));
        assert.formatsTo("12:30 PM", "{0:hh:mm tt}", new Date(2000, 0, 1, 12, 30, 00));
        assert.formatsTo("01:30 PM", "{0:hh:mm tt}", new Date(2000, 0, 1, 13, 30, 00));
        assert.formatsTo("11:30 PM", "{0:hh:mm tt}", new Date(2000, 0, 1, 23, 30, 00));
        
        assert.formatsTo("12:30 AM", "{0:h:mm tt}", new Date(2000, 0, 1, 00, 30, 00));
        assert.formatsTo("1:30 AM", "{0:h:mm tt}", new Date(2000, 0, 1, 01, 30, 00));
        assert.formatsTo("11:30 AM", "{0:h:mm tt}", new Date(2000, 0, 1, 11, 30, 00));
        assert.formatsTo("12:30 PM", "{0:h:mm tt}", new Date(2000, 0, 1, 12, 30, 00));
        assert.formatsTo("1:30 PM", "{0:h:mm tt}", new Date(2000, 0, 1, 13, 30, 00));
        assert.formatsTo("11:30 PM", "{0:h:mm tt}", new Date(2000, 0, 1, 23, 30, 00));
        
        test.section("Quoted text");
        assert.formatsTo("06mm33", "{0:hh'mm'ss}", dtam);
        assert.formatsTo("06mm33", "{0:hh\"mm\"ss}", dtam);
        assert.formatsTo("06m2033", "{0:hh\\mmss}", dtam);
        
        // The handling of non-matching quotation marks in date/time format strings is not compatible 
        // with .NET, but this is ignored, as a solution would inflate the library.
        // assert.formatsTo("06mm\"ss", "{0:hh'mm\"ss}", dtam);
        // assert.formatsTo("06mm'ss", "{0:hh\"mm'ss}", dtam);
        
        // so let's instead see if non-matching quotation marks are handled gracefully, i.e. with no crash, infinity loop etc.
        assert.formatsTo("06'20\"33", "{0:hh'mm\"ss}", dtam);
        assert.formatsTo("06\"20'33", "{0:hh\"mm'ss}", dtam);
        
        assert.formatsTo("40.2", "{0:0'0'.0}", 4.2);
        assert.formatsTo("40\".0", "{0:0'0\".0}", 4.2);
        assert.formatsTo("40.2", "{0:0\"0\".0}", 4.2);
        assert.formatsTo("40'.0", "{0:0\"0'.0}", 4.2);
        assert.formatsTo("40.2", "{0:0\\0.0}", 4.2);
        
        assert.formatsTo("{brackets} in args", "{0} in args", "{brackets}");
        assert.formatsTo("{{dblbrackets}} in args", "{0} in args", "{{dblbrackets}}");

        test.section("setCulture");
        sffjs.registerCulture({ name: "__LANG" });
        sffjs.registerCulture({ name: "__LANG-REGION" });
        sffjs.registerCulture({ name: "__LANG2" });
        sffjs.registerCulture({ name: "__LANG3-region" });
        
        sffjs.setCulture("");
        assert.areEqual("", sffjs.LC.name, "Invariant culture");
        
        sffjs.setCulture("__LANG");
        assert.areEqual("__LANG", sffjs.LC.name, "Neutral culture");
        
        sffjs.setCulture("__LANG-REGION");
        assert.areEqual("__LANG-REGION", sffjs.LC.name, "Specific culture");
        
        sffjs.setCulture("__LANG2-REGION");
        assert.areEqual("__LANG2", sffjs.LC.name, "Fallback to neutral");
        
        sffjs.setCulture("__LANG3-REGION");
        assert.areEqual("__LANG3-region", sffjs.LC.name, "Specific to non-existing neutral");
        
        sffjs.setCulture("__LANG3");
        assert.areEqual("", sffjs.LC.name, "Non-existing neutral");
        
        sffjs.registerCulture({ name: "__Lang3" });
        assert.areEqual("__Lang3", sffjs.LC.name, "Delayed neutral");

        sffjs.setCulture("");
    }
    
    
    function Test() {
        var t = this;
        
        window.currentTest = this;
        this.sections = [];
        
        this.section = function (name) {
            t.sections.push({
                name: name,
                results: []
            });
        }
        
        this.result = function (result) {
            if (t.sections.length == 0) {
                t.section("Untitled test section");
            }
            
            t.sections[t.sections.length - 1].results.push(result);
        }
        
        this.print = function () {
            var container = document.createElement("div");
            
            var numTests = 0;
            var numPassedTests = 0;
            
            for (var si in this.sections) {
                for (var ri in this.sections[si].results) {
                    numTests++;
                    if (this.sections[si].results[ri].result) {
                        numPassedTests++;
                    }
                }
            }
            
            var totalResult = document.createElement("div");
            totalResult.className = numPassedTests == numTests ? "pass" : "fail";
            totalResult.innerHTML = String.format("<em>{0}</em> of <em>{1}</em> tests passed", numPassedTests, numTests);
            totalResult.setAttribute("data-percent", Math.round(100 * numPassedTests / numTests));
            container.appendChild(totalResult);
            
            var progressBar = document.createElement("div");
            progressBar.className = "progress";
            progressBar.style.width = "200px";
            
            var progress = document.createElement("span");
            progress.style.width = Math.round(100 * numPassedTests / numTests) + "%";
            progressBar.appendChild(progress);
            totalResult.appendChild(progressBar);
            
            
            var table = document.createElement("table");
            var tr, td;
            container.appendChild(table);
            
            function createRow() {
                var tr = document.createElement("tr");
                table.appendChild(tr);
                return tr;
            }
            
            for (var si in t.sections) {
                var section = t.sections[si];
                
                tr = createRow();
                td = document.createElement("th");
                td.colSpan = 3;
                td.appendChild(document.createTextNode(section.name));
                tr.appendChild(td);
                
                for (var ri in section.results) {
                    var result = section.results[ri];
                    
                    tr = createRow();
                    
                    // Pass/fail
                    td = document.createElement("td");
                    td.className = result.result ? "pass" : "fail";
                    tr.appendChild(td);
                    td.appendChild(document.createTextNode(result.result ? "Pass" : "Fail"));
                    
                    // Message
                    td = document.createElement("td");
                    td.className = "message";
                    tr.appendChild(td);
                    td.appendChild(document.createTextNode(result.message));
                    
                    // Error message
                    td = document.createElement("td");
                    td.className = "error";
                    tr.appendChild(td);
                    if (result.errorMessage) td.appendChild(document.createTextNode(result.errorMessage));
                }
            }
            
            document.body.appendChild(container);
        }
    }
    
    function registerTestResult(message, errorMessage) {
        if (window.currentTest) {
            window.currentTest.result({
                message: message,
                result: !errorMessage,
                errorMessage: errorMessage
            });
        }
    }
    
    function stringify(value) {
        if (value === null) return "[null]";
        
        switch (typeof value) {
            case "number": return value.toString();
            case "string": 
                if (value.length > 40) { value = value.substr(0, 40) + "..."; }
                return "\"" + value + "\"";
                
            case "undefined": return "[undefined]";
            case "object":
                
                if (value instanceof Date) {
                    return value.format("yyyy-MM-ddTHH:mm:ss");
                }
                
                var first = true;
                var s = "{ ";
                
                for (var i in value) {
                    if (!first) {
                        s += " ...";
                        break;
                    }
                    
                    s += stringify(i) + " : " + stringify(value[i]);
                    
                    first = false;
                }
                
                return s + " }";
            default:
                return value.toString().substr(0, 10);
        }
    }
    
    var assert = {
        areEqual: function (expected, actual, message) {
            var result = actual === expected;
            
            actual = stringify(actual);
            expected = stringify(expected);
            
            registerTestResult(message, result ? null : String.format("Expected: {0}, actual: {1}", expected, actual));
        },
        
        doesThrow: function (fn, expectedError, message) {
            var actualError = "[No exception thrown]";
            
            try {
                fn();
            } catch (e) {
                actualError = e;
            }
            
            assert.areEqual(expectedError, actualError, message);
        },
        
        formatsTo: function (expected, formatString, obj0, obj1, obj2) {
            var args = Array.prototype.slice.call(arguments, 1);
            var actual;
            
            var message = String.format("{0,-25}  {1}", formatString, stringify(obj0));
            
            try {
                actual = String.format.apply(null, args);
            } catch (e) {
                registerTestResult(message, "Exception: " + e);
                return;
            }
            
            var message = String.format("{0,-25}  {1}", formatString, actual);
            
            assert.areEqual(expected, actual, message);
        }
    };

    var s = String.format;
    var formats = 0;
    String.format = function () {
        formats++;
        return s.apply(null, arguments);
    };

    var test = new Test();
    var startTime = new Date().valueOf();
    runTests(test);
    var endTime = new Date().valueOf();
    test.print();
    var timeResult = document.createElement("div");
    timeResult.innerHTML = String.format("Executed in {0:0} ms, mean {1:0.00} µs/format", endTime - startTime, 1000 * (endTime - startTime) / formats);
    document.body.appendChild(timeResult);
    document.body.appendChild(timeResult);
})();