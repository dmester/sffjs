
(function () {
    /// <summary>
    ///     Performs a series of unit tests and writes the output to the page.
    /// </summary>

    function assert(expected, formatString, obj0, obj1, obj2) {
        var args = Array.prototype.slice.call(arguments, 1);
        var actual;

        try {
            actual = String.format.apply(null, args);
            var result = actual === expected;
        } catch (e) {
            actual = e;
            var result = false;
        }

        var msg = actual !== expected ? String.format("Expected: {0}, actual: {1}", expected, actual) : "";
        document.write(String.format("{1,6} {0,15} {2}<br/>", formatString, result ? " OK " : "FAIL", msg));
    }
    document.write("<pre>");

    msf.setCulture("en");

    assert("42%", "{0:0%}", 0.42);
    assert("42.01%", "{0:0.00%}", 0.42009);
    assert("42.01d", "{0:0.00d}", 42.009);
    assert("42.01", "{0:0.0#}", 42.009);
    assert("42.0", "{0:0.0#}", 42.001);
    assert("42", "{0:0}", 42.4);
    assert("43", "{0:0}", 42.5);
    assert("043", "{0:000}", 42.5);
    assert("042.50", "{0:000.#0}", 42.5);
    assert("042.5", "{0:000.0#}", 42.5);
    
    assert("43", "{0:d}", 42.5);
    assert("43", "{0:D}", 42.5);
    assert("0043", "{0:d4}", 42.5);
    assert("43", "{0:D1}", 42.5);
    
    
    assert("$42.50", "{0:c}", 42.5);
    assert("$42.50", "{0:C}", 42.5);
    
    assert("1242.50", "{0:f}", 1242.5);
    assert("1242.50", "{0:F}", 1242.5);
    assert("1242.6", "{0:f1}", 1242.55);
    assert("1242.500", "{0:F3}", 1242.5);
    assert("1242.000", "{0:F3}", 1242);
    
    assert("1,242.50", "{0:n}", 1242.5);
    assert("1,242.50", "{0:N}", 1242.5);
    assert("1,242.6", "{0:n1}", 1242.55);
    assert("1,242.500", "{0:N3}", 1242.5);
    assert("1,242.000", "{0:N3}", 1242);
    
    assert("1242.50", "{0:g}", 1242.5);
    assert("1242.50", "{0:G}", 1242.5);
    assert("1e+03", "{0:g1}", 1242.55);
    assert("1242", "{0:G3}", 1242.5);
    assert("1242.000", "{0:G3}", 1242);
    
    assert("a", "{0:x}", 10);
    assert("A", "{0:X}", 10);
    assert("00a", "{0:x3}", 10);
    assert("00A", "{0:X3}", 10);
    
    assert("2.350000e+002", "{0:e}", 235);
    assert("2.350000E+002", "{0:E}", 235);
    
    assert("2.35e+003", "{0:e2}", 2353);
    assert("2.35E+003", "{0:E2}", 2353);

    document.write("</pre>");
})();