
# String.format for JavaScript

http://mstr.se/sffjs

Copyright (c) Daniel Mester Pirttijärvi

## Description

This is a JavaScript library for string, date and number formatting. Formatting 
is done with format strings and is almost completely compatible with the 
`String.Format` method in Microsoft .NET Framework.

## Files

You got a number of files when you extracted the script library:

| File                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| stringformat-X.XX.min.js     | Compressed and obfuscated, to be used in production. |
| stringformat-X.XX.js         | Commented source file for your reference.            |
| tests.html                   | Test page that performs unit tests on the library.   |
| stringformat.tests.js        | Script for tests.html.                               |
| cultures/stringformat.XX.js  | Files holding metadata about cultures.               |


## How to use

To use the library, include the library and optionally the cultures you 
are targetting. Note that if no culture files are included, the invariant 
culture will be used.

```HTML
<script type="text/javascript" src="stringformat-X.XX.min.js"></script>
<script type="text/javascript" src="cultures/stringformat.en.js"></script>
<script type="text/javascript" src="cultures/stringformat.sv.js"></script>
```

Then you're ready to go. Here are two simple examples using indexes and object
paths/named parameters.

```JavaScript
// Index
String.format(
    "Welcome back, {0}! Last seen {1:M}", 
    "John Doe", new Date(1985, 3, 7, 12, 33)
    );
    
// Outputs: 
// Welcome back, John Doe! Last seen April 07

// Named parameters
String.format(
    "Welcome back, {user.name}! Last seen {lastseen:M}", 
    { 
        user: {
            name : "John Doe", 
            age : 42
        },
        lastseen: new Date(2009, 3, 7, 12, 33) 
    });
    
// Outputs: 
// Welcome back, John Doe! Last seen April 07
```

By default the browser culture will be used, given that the appropriate culture 
file has been referenced from the page. To set culture explicitly, use the 
`sffjs.setCulture` method, which accepts a IETF language code.

```JavaScript
sffjs.setCulture("sv");
```

## See more

* [Usage examples](http://mstr.se/sffjs)
* [Reference information regarding .NET format strings](http://msdn.microsoft.com/en-us/library/system.string.format.aspx)

## Compatibility with .NET implementation

The output of this library is highly compatible with the output from the .NET 
implementation. In this section differences will be listed

* Date format
    * Date format specifier `O` is not supported
    * Date format specifier `R` is not supported
* Number format
    * Number format specifier `c` ignores specified precision

Other types does not have a format implementation, and is thus serialized to a 
string by the `__Format` function or the Javascript runtime using the toString function.

These are additions in this implementation, and thus not supported by the .NET implementation:

* Object paths/named parameters


