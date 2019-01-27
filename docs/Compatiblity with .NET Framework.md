# Compatibility with .NET implementation

The output of this library is highly compatible with the output from the .NET 
implementation. In this section differences will be listed.

* Date format
    * Date format specifier `O` is not supported
    * Date format specifier `R` is not supported
* Number format
    * Number format specifier `c` ignores specified precision
    * Number format specifier `G` formats the number according to how a double is formatted in .NET. Other numeric data type are formatted differently in .NET.

Other types does not have a format implementation, and is thus serialized to a 
string by the `__Format` function or the Javascript runtime using the `toString` 
function.

These are additions in this implementation, and thus not supported by the .NET implementation:

* Object paths/named parameters
