# Known issues

### Large numbers in IE8
Large floating point numbers are formatted incorrectly in IE8. This is an example 
how sffjs format large numbers in IE8:

```js
String.format("{0:N0}", 1242300000000000000000.0);
// expected output:  1,242,300,000,000,000,000,000
// actual output:   12,423,000,000,000,000,000,000
```

This is due to a bug in IE8's scientific number formatter for floating point numbers. 
The bug can be confirmed by entering the following lines in a IE8 JS console:

```js
(1242300000000000000000).toString()
// outputs "1.2423e+21" (correct)

(1242300000000000000000.0).toString()
// outputs "1.2423e+22" (incorrect)
```

A possible workaround would be to use `toFixed` instead of `toString` in `numberToString`,
since `toFixed` does not use scientific notation in IE8.

However IE8 is considered dead and no workaround will be included in sffjs.
