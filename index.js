
;(function ( normalize, factory ) {
    "use strict";

    var name = "format"
    ,   _old
    ,   _new
    ,   generate = function ( ) {
            return factory.call(null, normalize.apply(null, arguments));
        }
    ;

    if ("function" === typeof define && define.amd) {
        define(["datef", "numeral", "mustache"], generate);
    } else if ("undefined" !== typeof module) {
        module.exports = generate(
            require("datef")
        ,   require("numeral")
        ,   require("mustache")
        );
    } else {
        _old = window[name];
        _new = generate(
            window.datef
        ,   window.numeral
        ,   window.Mustache
        );

        _new.noConflict = function ( ) {
            window[name] = _old;
            return _new;
        };
    }

})(function ( _datef, _numeral, _mustache ) {
    "use strict";

    var datef, numberf, objectf;

    datef = function ( format, raw ) {
        return _datef(format, raw);
    };
    datef.cast = function ( raw ) {
        if (!(raw instanceof Date)) {
            raw = new Date(raw);
        }
        return raw;
    };
    datef.i18n = function ( language ) {
        _datef.lang(language);
    };

    numberf = function ( format, raw ) {
        return _numeral(raw).format(format);
    };
    numberf.cast = function ( raw ) {
        if ("number" !== typeof raw) {
            raw = Number(raw);
        }
        return raw;
    };
    numberf.i18n = function ( language ) {
        _numeral.language(language);
    };

    objectf = function ( format, raw ) {
        return _mustache.render(format, raw);
    };
    objectf.cast = function ( raw ) {
        return Object(raw);
    };

    return {
        date: datef
    ,   number: numberf
    ,   object: objectf
    };

}, function ( formatters ) {
    "use strict";

    var _normalize, _formatter, formatter;

    formatter = function ( format, raw, options, after ) {
        return _formatter(raw, _normalize(format, options, after));
    };

    // provide direct formatters and type constants
    formatters.forEach(function ( name ) {
        formatter[name.toUpperCase()] = name;
        formatter[name] = formatters[name];
    });

    _formatter = function ( raw, options ) {
        if ("function" === typeof options.before) {
            raw = options.before(raw);
        }

        raw = options.format(raw);

        if ("function" === typeof options.after) {
            raw = options.after(raw);
        }

        return raw;
    };

    _normalize = function ( format, options, after ) {
        var fn;

        if ("function" === typeof options) {
            options = {
                before: options
            ,   after: after
            };
        } else if ("string" === typeof options) {
            options = {
                type: options
            };
        } else if (!options) {
            options = { };
        }

        if (options.type) {
            fn = formatter[options.type];
            if ("function" !== typeof fn) {
                throw new TypeError(
                    "format: unsupported type;" + options.type);
            }
            options.format = function ( raw ) {
                return fn(format, fn.cast(raw));
            };
        } else {
            options.format = function ( raw ) {
                var type;

                if (raw instanceof Date) {
                    type = formatter.DATE;
                } else if ("number" === typeof raw) {
                    type = formatter.NUMBER;
                } else if ("object" === typeof raw) {
                    type = formatter.OBJECT;
                }

                type = formatter[type];
                if (!type) {
                    throw new TypeError(
                        "format: unsupported type;" + options.type);
                }

                return type(format, raw);
            };
        }

        return options;
    };

    formatter.create = function ( format, options, after ) {
        options = _normalize(format, options, after);

        return function ( raw ) {
            return _formatter(raw, options);
        };
    };

    formatter.i18n = function ( language ) {
        formatters.forEach(function ( formatter ) {
            if ("function" === typeof formatter.i18n) {
                formatter.i18n(language);
            }
        });
    };

    return formatter;
});

