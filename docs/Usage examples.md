# Usage examples

## Load library

To use the library, include the library itself and optionally the cultures you 
are targetting. Note that if no culture files are included, the invariant 
culture will be used.

```html
<script type="text/javascript" src="stringformat.js"></script>
<script type="text/javascript" src="cultures/stringformat.en.js"></script>
<script type="text/javascript" src="cultures/stringformat.sv.js"></script>
```

Then you're ready to go. Here are some simple examples using indexes and object
paths/named parameters.

```js
// Index
String.format(
    "Welcome back, {0}! Last seen {1:M}", 
    "John Doe", new Date(1985, 3, 7, 12, 33)
    );
// output: 
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
// output: 
// Welcome back, John Doe! Last seen April 07

// Formating an individual number or date
var number = 14.15;
number.format("0.0");
// output:
// 12.2

var date = new Date(1985, 3, 7, 12, 33);
date.format("M");
// output:
// April 07
```

## Collisions with other libraries

If you have another script defining the methods `String.format`, 
`Date.prototype.format` or `Number.prototype.format`, those methods will not be 
replaced. However you may still use the methods of this library by using the 
internal formatting methods, which are called `__Format`.

## Change culture

By default the browser culture will be used, given that the appropriate culture 
file has been referenced from the page. To set culture explicitly, use the 
`sffjs.setCulture` method, which accepts a IETF language code.

```JavaScript
sffjs.setCulture("sv");
```

Note that sffjs does not come with a culture loader. You need to manually include
the culture files on your page.

See also [Working with cultures](https://github.com/dmester/sffjs/blob/master/docs/Working%20with%20cultures.md).

## More examples

```js
// Object path
String.format("Welcome back, {username}!", 
{ id: 3, username: "JohnDoe" });
// Result: "Welcome back, JohnDoe!"


// Date/time formatting
String.format("The time is now {0:t}.", 
new Date(2009, 5, 1, 13, 22));
// Result: "The time is now 01:22 PM."


// Date/time formatting (without using a full format string)
var d = new Date();
d.format("hh:mm:ss tt");
// Result: "02:28:06 PM"


// Custom number format string
String.format("Please call me at {0:+##0 (0) 000-00 00}.", 
4601111111);
// Result: "Please call me at +46 (0) 111-11 11."


// Another custom number format string
String.format("The last year result was {0:+$#,0.00;" + 
"-$#,0.00;0}.", -5543.346);
// Result: "The last year result was -$5,543.35."


// Alignment
String.format("|{0,10:PI=0.00}|", Math.PI);
// Result: "|   PI=3.14|"


// Rounding
String.format("1/3 ~ {0:0.00}", 1/3);
// Result: "1/3 ~ 0.33"


// Boolean values
String.format("{0:true;;false}", 0);
// Result: "false"


// Explicitly specified localization
// (note that you have to include the .js file for used cultures)
sffjs.setCulture("en-US");
String.format("{0:#,0.0}", 3641.667);
// Result: "3,641.7"


sffjs.setCulture("sv-SE");
String.format("{0:#,0.0}", 3641.667);
// Result: "3 641,7"
```
