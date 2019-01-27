
# [String.format for JavaScript](http://mstr.se/sffjs)

This is a JavaScript library for string, date and number formatting. Formatting 
is done using format strings almost completely compatible with the `String.Format` 
method in Microsoft .NET Framework.

## How to use

To use the library, include the library itself and optionally the cultures you 
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

## Browser support

sffjs is tested in IE9 and later, Chrome, Firefox and Edge, but may work in
other environments.

## See more

* [Compatibility with .NET Framework](https://github.com/dmester/sffjs/blob/master/docs/Compatiblity%20with%20.NET%20Framework.md)
* [More usage examples](https://github.com/dmester/sffjs/blob/master/docs/Usage%20examples.md)
* [Extending sffjs with support for custom classes](https://github.com/dmester/sffjs/blob/master/docs/Extending%20sffjs.md)
* [Reference information regarding .NET format strings](http://msdn.microsoft.com/en-us/library/system.string.format.aspx)
