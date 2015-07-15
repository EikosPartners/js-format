
;(function ( normalize, factory ) {
    "use strict";

    var name = "format"
    ,   _old
    ,   _new
    ,   generate = function ( ) {
            return factory.apply(null, normalize.apply(null, arguments));
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

    var datef, numberf, stringf;

    datef = function ( format, raw ) {
        return _datef(format, raw);
    };
    datef.i18n = function ( language ) {
        _datef.lang(language);
    };

    numberf = function ( format, raw ) {
        return _numeral(raw).format(format);
    };
    numberf.i18n = function ( language ) {
        _numeral.language(language);
    };

    stringf = function ( format, raw ) {
        return _mustache.render(format, raw);
    };

    return [ datef, numberf, stringf ];

}, function ( datef, numberf, stringf ) {
    "use strict";

    var _args = Array.prototype.slice.call(arguments)
    ,   formatter = function ( format, raw, before, after ) {
            if ("function" === typeof before) {
                raw = before(raw);
            }

            if (raw instanceof Date) {
                raw = datef(format, raw);
            } else if ("number" === typeof raw) {
                raw = numberf(format, raw);
            } else if ("object" === typeof raw) {
                raw = stringf(format, raw);
            } else {
                throw new TypeError("format: unsupported type;" + typeof raw);
            }

            if ("function" === typeof after) {
                raw = after(raw);
            }

            return raw;
        };

    formatter.create = function ( format, _before, _after ) {
        return function ( raw, before, after) {
            if ("undefined" === typeof before) {
                before = _before;
            }
            if ("undefined" === typeof after) {
                after = _after;
            }
            return formatter(format, raw, before, after);
        };
    };

    // provide direct formatters
    formatter.datef   = datef;
    formatter.numberf = numberf;
    formatter.stringf = stringf;

    formatter.i18n = function ( language ) {
        _args.forEach(function ( arg ) {
            if ("function" === typeof arg.i18n) {
                arg.i18n(language);
            }
        });
    };

    return formatter;
});

