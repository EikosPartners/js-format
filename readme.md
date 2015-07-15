
js-format
===

> data formatting

Usage
---

```js
format("MM.YYYY", new Date());

format("(0.0a)", "-4.0e12", format.NUMBER);

format("({{status}}!)", { status: "Success" });

var currency_formatter = format.create("($0.00a)", Number, function ( value ) {
    return value.toUpperCase();
});

currency_formatter(-4000);
// => ($4.00K)
```

Vendor
---

### Numeric formatting

[Numeral](https://github.com/adamwdraper/Numeral-js)

### Date formatting

[datef](https://github.com/hogart/datef)

### String formatting

[Mustache](https://github.com/janl/mustache.js)

License
---

MIT (see [LICENSE](https://github.com/tsu-complete/js-format/blob/master/LICENSE))

Linting
---

Linted with jshint

