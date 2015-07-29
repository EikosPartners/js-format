
;(function ( normalize, factory ) {
    "use strict";

    var name = "format"
    ,   _old, _new
    ,   generate = function ( ) {
            return factory.call(null, normalize.apply(null, arguments));
        }
    ;

    if ("function" === typeof define && define.amd) {
        define(["moment", "numeral", "mustache"], generate);
    } else if ("undefined" !== typeof module) {
        module.exports = generate(
            require("moment")
        ,   require("numeral")
        ,   require("mustache")
        );
    } else {
        _old = window[name];
        _new = generate(
            window.moment
        ,   window.numeral
        ,   window.Mustache
        );

        _new.noConflict = function ( ) {
            window[name] = _old;
            return _new;
        };
    }

})(function ( _moment, _numeral, _mustache ) {
    "use strict";

    var datef, numberf, objectf;

    datef = {
        format: function ( format, object ) {
            return object.format(format);
        }
    ,   cast: function ( raw ) {
            return raw._isAMomentObject ? raw : _moment(raw);
        }
    ,   i18n: function ( language ) {
            _moment.locale(language);
        }
    };

    numberf = {
        format: function ( format, object ) {
            return object.format(format);
        }
    ,   cast: function ( raw ) {
            if ("number" !== typeof raw) {
                raw = Number(raw);
            }
            return _numeral(raw);
        }
    ,   i18n: function ( language ) {
            _numeral.language(language);
        }
    };

    objectf = {
        format: function ( format, raw ) {
            return _mustache.render(format, raw);
        }
    ,   cast: function ( raw ) {
            return Object(raw);
        }
    };

    return {
        date: datef
    ,   number: numberf
    ,   object: objectf
    };

}, function ( formatters ) {
    "use strict";

    var _normalize, _formatter, _audit, formatter, name;

    formatter = function ( format, raw, options ) {
        return _formatter(raw, _normalize(format, options));
    };

    // occurs before
    formatter.PHASE_0 = 0;
    // occurs after cast
    formatter.PHASE_1 = 1;
    // occurs after format
    formatter.PHASE_2 = 2;

    // provide direct formatters and type constants
    for (name in formatters) {
        if (formatters.hasOwnProperty(name)) {
            formatter[name.toUpperCase()] = name;
            formatter[name] = formatters[name];
        }
    }

    _audit = function ( options, raw, phase ) {
        var temp;

        if ("function" === typeof options.audit) {
            temp = options.audit(raw, phase);
            if (temp != null) {
                raw = temp;
            }
        }

        return raw;
    };

    _formatter = function ( raw, options ) {
        raw = _audit(options, raw, formatter.PHASE_0);

        raw = options.cast(raw);

        raw = _audit(options, raw, formatter.PHASE_1);

        raw = options.format(raw);

        raw = _audit(options, raw, formatter.PHASE_2);

        return raw;
    };

    _normalize = function ( format, options ) {
        var fn;

        if ("function" === typeof options) {
            options = {
                audit: options
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
            if ("object" !== typeof fn) {
                throw new TypeError(
                    "format: unsupported type;" + options.type);
            }
            options.cast = fn.cast;
            options.format = function ( object ) {
                return fn.format(format, object);
            };
        } else {
            options.cast = function ( object ) {
                var _fn;

                if (object instanceof Date) {
                    _fn = formatter.DATE;
                } else if ("number" === typeof object) {
                    _fn = formatter.NUMBER;
                } else if ("object" === typeof object) {
                    _fn = formatter.OBJECT;
                }

                _fn = formatter[_fn];
                if (!_fn) {
                    throw new TypeError(
                        "format: unsupported type; " + typeof object);
                }

                options.format = function ( raw ) {
                    return _fn.format(format, raw);
                };

                return _fn.cast(object);
            };
        }

        return options;
    };

    formatter.create = function ( format, options ) {
        options = _normalize(format, options);

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

