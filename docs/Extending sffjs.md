# Extending sffjs

Let's say you have a class called `Person` that you want to format using sffjs.

```js
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}
```

Trying to format a `Person` won't provide any useful string:

```js
var person = new Person("John", "Doe");

String.format("Hello {0}!", person);
// output:
// "Hello [object Object]!"
```


## Implement `toString`

The first step is to override `toString` on the `Person` class. sffjs will then use
your `toString` implementation.

```js
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}
Person.prototype.toString = function Person_toString() {
    return this.firstname + " " + this.lastname;
};

var person = new Person("John", "Doe");

String.format("Hello {0}!", person);
// output:
// "Hello John Doe!"
```

Much better!

## Implement `__Format`

You can also provide a formatter accepting a format string. In this case, you
should define a method called `__Format` on your class.

```js
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}
Person.prototype.__Format = function Person_Format(formatString) {
    switch (formatString) {
        case "F": return this.firstname;
        case "L": return this.lastname;
    }
    return this.firstname + " " + this.lastname;
};

var person = new Person("John", "Doe");

String.format("Hello Mr {0:L}!", person);
// output:
// "Hello Mr Doe!"
```

If you have defined both `__Format` and `toString`, `__Format` will have precedence.

Sffjs will extend the builtin datatypes `Number` and `Date` with a `__Format` 
method.