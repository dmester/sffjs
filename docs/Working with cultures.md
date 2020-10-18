# Working with cultures

To support formatting dates and numbers in multiple languages, culture objects containing formatting information
are used by sffjs. The easiest way to enable formatting in a specific language is to load the appropriate
culture file bundled with sffjs.

```html
<script src="https://cdn.jsdelivr.net/npm/@dmester/sffjs@1.17.0/dist/stringformat.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@dmester/sffjs@1.17.0/dist/cultures/stringformat.en.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@dmester/sffjs@1.17.0/dist/cultures/stringformat.sv.js"></script>
```

Note that sffjs does not come with a culture loader. You need to manually include the culture files on your page.

## Getting and setting current culture

By default sffjs will try to pick the best registered culture based on the browser language settings. 
To set culture explicitly, use the `sffjs.setCulture` method, which accepts an IETF language tag.

```js
sffjs.setCulture("sv-SE");
```

The following resolution order is used for selecting a culture:

1. Exact match. If `"de-DE"` is set as culture, and there is a registered culture called `"de-DE"`, it is used.
2. Primary subtag match. If `"de-DE"` is set as culture, but there is no registered culture for `"de-DE"`, it will fallback to the culture `"de"`, if registered.
3. Invariant culture is used as last resort.

The culture currently in use is exposed by the `sffjs.LC` property.

```js
console.log(sffjs.LC);

// Output:
{
  "name": "en",
  "d": "MM/dd/yyyy",
  "D": "dddd, dd MMMM yyyy",
  "t": "HH:mm",
  "T": "HH:mm:ss",
  "M": "MMMM dd",
  "Y": "yyyy MMMM",
  "s": "yyyy-MM-ddTHH:mm:ss",
  "f": "dddd, dd MMMM yyyy HH:mm",
  "F": "dddd, dd MMMM yyyy HH:mm:ss",
  "g": "MM/dd/yyyy HH:mm",
  "G": "MM/dd/yyyy HH:mm:ss",
  "m": "MMMM dd",
  "y": "yyyy MMMM",
  "_M": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "_D": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "_r": ".",
  "_t": ",",
  "_c": "¤#,0.00",
  "_ct": ",",
  "_cr": ".",
  "_am": "AM",
  "_pm": "PM"
}
```

## Listing registered cultures
All registered cultures can be listed by calling `sffjs.getCultures()`, returning an array of culture objects. The invariant culture is included in the array, and is identified by an empty string as `name`.

```js
console.log(sffjs.getCultures());

// Output:
[
  { "name": "", ...},
  { "name": "en", ...},
  { "name": "sv", ...}
]
```

## Culture object specification

Missing properties are populated with the default values.

| Property | Default value           | Description       |
| -------- | ----------------------- | ----------------- |
| name     | `""`                    | IETF language tag |
| _M       | `["January", ...]`      | Full month names |
| _m       | `["Jan", ...]`          | Short month names |
| _D       | `["Sunday", ...]`       | Full weekday names starting with Sunday |
| _d       | `["Sun", ...]`          | Short weekday names |
| _r       | `"."`                   | Decimal separator |
| _t       | `","`                   | Thousands separator |
| _c       | `"¤#,0.00"`             | Currency format string |
| _cr      | `"."`                   | Decimal separator for currency formatting |
| _ct      | `","`                   | Thousands separator for currency formatting |
| _am      | `"AM"`                  | AM (before noon) designator |
| _pm      | `"PM"`                  | PM (after noon) designator |
| d        | `"MM/dd/yyyy"`          | Short date format |
| D        | `"dddd, dd MMMM yyyy"`  | Long date format |
| t        | `"HH:mm"`               | Short time format |
| T        | `"HH:mm:ss"`            | Long time format |
| M        | `"MMMM dd"`             | Month/day format |
| Y        | `"yyyy MMMM"`           | Year/month format |
| s        | `"yyyy-MM-ddTHH:mm:ss"` | Sortable date/time format |
| f        | `D + " " + t`           | Long date with short time |
| F        | `D + " " + T`           | Long date with long time |
| g        | `d + " " + t`           | Short date with short time |
| G        | `d + " " + T`           | Short date with long time |

