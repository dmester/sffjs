﻿
(function () {
    /// <summary>
    ///     Performs a series of unit tests and writes the output to the page.
    /// </summary>
    
    
    function runTests() {
        msf.setCulture("en");
        
        var testObject = {
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
        var test = new Test();
        
        test.section("Tags");
        assert.formatsTo("Test {with} brackets", "Test {{with}} brackets");
        
        
        test.section("Index");
        assert.formatsTo("!String!", "!{0}!", "String");
        assert.formatsTo("!42!", "!{0}!", 42);
        assert.formatsTo("!true!", "!{0}!", true);
        assert.formatsTo("null:!!", "null:!{0}!", null);
        assert.formatsTo("undefined:!!", "undefined:!{0}!", undefined);
        assert.doesThrow(function () { String.format("{1}", 42) }, "Missing argument", "Index out of range");
        assert.doesThrow(function () { String.format("{-1}", 42) }, "Invalid path", "Negative index");

        
        test.section("Path");
        assert.formatsTo("Hi, John!", "Hi, {authors[0].firstname}!", testObject);
        assert.formatsTo("Hi, !", "Hi, {authors[1].firstname}!", testObject);
        
        test.section("Resolve");
        assert.areEqual(undefined, msf.resolve("fgfgdgh", undefined), "Undefined value");
        assert.areEqual(undefined, msf.resolve("fgfgdgh", testObject), "Undefined member");
        assert.areEqual(undefined, msf.resolve("authors.dfgggf", testObject), "Undefined sub-member");
        assert.areEqual(testObject.authors, msf.resolve("authors", testObject), "Normal member");
        assert.areEqual(1, msf.resolve("authors.length", testObject), "Normal member");
        assert.areEqual(testObject.authors[0], msf.resolve("authors[0]", testObject), "Index member");
        assert.areEqual("John", msf.resolve("authors[0].firstname", testObject), "Index+normal member");

        test.section("Resolve: should throw");
        assert.doesThrow(function () { msf.resolve("fgdgg$", undefined) }, "Invalid path", "Inline dollar sign");
        assert.doesThrow(function () { msf.resolve("fgdgg[]", undefined) }, "Invalid path", "No index number specified");
        assert.doesThrow(function () { msf.resolve("fgdgg[-1]", undefined) }, "Invalid path", "Negative index");
        assert.doesThrow(function () { msf.resolve("fgdgg.", undefined) }, "Invalid path", "Ending point");
        assert.doesThrow(function () { msf.resolve(".fgdgg", undefined) }, "Invalid path", "Starting point");
        assert.doesThrow(function () { msf.resolve("fgdgg..hj", undefined) }, "Invalid path", "Double point");

        test.section("Date/time tandard");
        var dtam = new Date(1989, 3, 2, 6, 20, 33);
        var dtpm = new Date(1989, 3, 2, 18, 20, 33);
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
        assert.formatsTo("1989-04-02T18:20:33.0000000", "{0:O}", dtpm);
        assert.formatsTo("1989-04-02T18:20:33.0000000", "{0:o}", dtpm);
        
        assert.formatsTo("Sun, 2 April 1989 06:20:33 GMT", "{0:R}", dtam);
        assert.formatsTo("1989-04-02T06:20:33", "{0:s}", dtam);
        
        assert.formatsTo("6:20 AM", "{0:t}", dtam);
        assert.formatsTo("6:20 PM", "{0:t}", dtpm);
        
        assert.formatsTo("6:20:33 AM", "{0:T}", dtam);
        assert.formatsTo("6:20:33 PM", "{0:T}", dtpm);
        
        assert.formatsTo("1989-04-02 06:20:33Z", "{0:u}", dtpm);
        assert.formatsTo("Sunday, April 2, 1989 6:20:33 PM", "{0:U}", dtpm);
        
        assert.formatsTo("April 1989", "{0:y}", dtpm);
        assert.formatsTo("April 1989", "{0:Y}", dtpm);
        
        test.section("Date/time custom");
        assert.formatsTo("1989-04-02 18:20:33", "{0:yyyy-MM-dd HH:mm:ss}", dtpm);
        assert.formatsTo("06:20:33 A", "{0:hh:mm:ss t}", dtam);
        assert.formatsTo("06:20:33 AM", "{0:hh:mm:ss tt}", dtam);
        assert.formatsTo("06:20:33 P", "{0:hh:mm:ss t}", dtpm);
        assert.formatsTo("06:20:33 PM", "{0:hh:mm:ss tt}", dtpm);
        
        assert.formatsTo("hh:mm:33 PM", "{0:'hh:mm':ss tt}", dtpm);

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
        assert.formatsTo("0.42      ", "{0,10}", 0.42);
        assert.formatsTo("      0.42", "{0,-10}", 0.42);
        
        test.section("Positive/negative numeric strings");
        assert.formatsTo("pos", "{0:pos;neg}", 5);
        assert.formatsTo("neg", "{0:pos;neg}", -5);
        assert.formatsTo("pos", "{0:pos;neg}", 0);
        
        assert.formatsTo("pos", "{0:pos;neg;zero}", 5);
        assert.formatsTo("neg", "{0:pos;neg;zero}", -5);
        assert.formatsTo("zero", "{0:pos;neg;zero}", 0);
        
        test.section("Simple numeric format strings");
        assert.formatsTo("0.42", "{0}", 0.42);
        assert.formatsTo("35", "{0}", 35);

        test.section("Custom numeric format strings");
        assert.formatsTo("42%", "{0:0%}", 0.42);
        assert.formatsTo("42.01%", "{0:0.00%}", 0.42009);
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
        
        assert.formatsTo("1098#234.0", "{0:0'098#'000.0#}", 1234);
        
        test.section("Specifier D");
        assert.formatsTo("43", "{0:d}", 42.5);
        assert.formatsTo("43", "{0:D}", 42.5);
        assert.formatsTo("0043", "{0:d4}", 42.5);
        assert.formatsTo("43", "{0:D1}", 42.5);
        
        test.section("Specifier C");
        assert.formatsTo("$42.50", "{0:c}", 42.5);
        assert.formatsTo("$42.50", "{0:C}", 42.5);
        
        test.section("Specifier F");
        assert.formatsTo("1242.50", "{0:f}", 1242.5);
        assert.formatsTo("1242.50", "{0:F}", 1242.5);
        assert.formatsTo("1242.6", "{0:f1}", 1242.55);
        assert.formatsTo("1242.500", "{0:F3}", 1242.5);
        assert.formatsTo("1242.000", "{0:F3}", 1242);
        
        test.section("Specifier N");
        assert.formatsTo("1,242.50", "{0:n}", 1242.5);
        assert.formatsTo("1,242.50", "{0:N}", 1242.5);
        assert.formatsTo("1,242.6", "{0:n1}", 1242.55);
        assert.formatsTo("1,242.500", "{0:N3}", 1242.5);
        assert.formatsTo("1,242.000", "{0:N3}", 1242);
        
        test.section("Specifier G");
        assert.formatsTo("1242", "{0:g}", 1242);
        assert.formatsTo("1242.5", "{0:g}", 1242.5);
        assert.formatsTo("1242.5", "{0:G}", 1242.5);
        assert.formatsTo("0.0004", "{0:G}", 0.0004);
        assert.formatsTo("4E-05", "{0:G}", 0.00004);
        assert.formatsTo("4E-06", "{0:G}", 0.000004);
        assert.formatsTo("4.7e-07", "{0:g}", 0.00000047);
        
        assert.formatsTo("-1242", "{0:g}", -1242);
        assert.formatsTo("-1242.5", "{0:g}", -1242.5);
        assert.formatsTo("-1242.5", "{0:G}", -1242.5);
        assert.formatsTo("-0.0004", "{0:G}", -0.0004);
        assert.formatsTo("-4E-05", "{0:G}", -0.00004);
        assert.formatsTo("-4E-06", "{0:G}", -0.000004);
        assert.formatsTo("-4.7e-07", "{0:g}", -0.00000047);
        
        assert.formatsTo("1e+03", "{0:g1}", 1242.55);
        assert.formatsTo("1.2e+03", "{0:g2}", 1242.55);
        assert.formatsTo("1243", "{0:G4}", 1242.5);
        assert.formatsTo("1242.6", "{0:G5}", 1242.55);
        assert.formatsTo("1.24E+03", "{0:G3}", 1242);
        
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
        
        test.section("Specifier P");
        assert.formatsTo("12.55 %", "{0:p}", 0.12549);
        assert.formatsTo("12.55 %", "{0:P}", 0.12549);
        
        assert.formatsTo("1,212.55 %", "{0:p}", 12.12549);
        assert.formatsTo("1,212.55 %", "{0:P}", 12.12549);
        
        assert.formatsTo("12.5 %", "{0:p1}", 0.12549);
        assert.formatsTo("12.5 %", "{0:P1}", 0.12549);
        
        test.section("Specifier R");
        assert.formatsTo("2353", "{0:R}", 2353);
        assert.formatsTo("25.3333333", "{0:R}", 25.3333333);
        
        test.section("Culture sv-se");
        msf.setCulture("sv");
        assert.formatsTo("1,2e+03", "{0:g2}", 1242.55);
        assert.formatsTo("1242,50", "{0:f}", 1242.5);
        assert.formatsTo("1 242,500", "{0:N3}", 1242.5);
        
        assert.formatsTo("2353", "{0:R}", 2353);
        assert.formatsTo("25.3333333", "{0:R}", 25.3333333);
        
        assert.formatsTo("1989-04-02", "{0:d}", dtam);
        assert.formatsTo("den 2 april 1989 18:20:33", "{0:F}", dtpm);
        assert.formatsTo("1989-04-02 18:20:33", "{0:G}", dtpm);
        assert.formatsTo("2 april", "{0:m}", dtpm);
        assert.formatsTo("18:20", "{0:t}", dtpm);
        assert.formatsTo("18:20:33", "{0:T}", dtpm);
        assert.formatsTo("april 1989", "{0:y}", dtpm);

        test.print();
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
            var table = document.createElement("table");
            var tr, td;
            
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
                    tr.appendChild(td);
                    td.appendChild(document.createTextNode(result.message));
                    
                    // Error message
                    td = document.createElement("td");
                    td.className = "error";
                    tr.appendChild(td);
                    if (result.errorMessage) td.appendChild(document.createTextNode(result.errorMessage));
                }
            }
            
            document.body.appendChild(table);
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
            var actualError;
            
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
            
            var message = String.format("{0,-14}  {1,15}", formatString, stringify(obj0));

            try {
                actual = String.format.apply(null, args);
            } catch (e) {
                registerTestResult(message, "Exception: " + e);
                return;
            }
            
            assert.areEqual(expected, actual, message);
        }
    };

    runTests();
})();