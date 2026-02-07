var RNG = (function () {

    // https://en.wikipedia.org/wiki/Xorshift
    // https://en.wikipedia.org/wiki/Rejection_sampling
    // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
    // https://en.wikipedia.org/wiki/Reservoir_sampling

    'use strict';

    // Create a pseudorandom number generator
    function RNG(seed) {
        if (!(this instanceof RNG)) throw new TypeError('RNG must be called with new');

        var state = (seed === undefined) ? 2463534242 : seed;

        if (state % 1 !== 0) throw new TypeError('seed must be an integer');
        if (state < 1 || state > 4294967295) throw new RangeError('seed must be between 1 and 2^32-1');

        this.state = state;
    }

    Object.defineProperty(RNG, 'prototype', {
        writable: false, enumerable: false, configurable: false
    });

    // Progress a pseudorandom number generator
    Object.defineProperty(RNG.prototype, 'next', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return _next(this);
        }
    });

    function _next(rng) {
        var x = rng.state;

        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;

        return rng.state = x >>> 0;
    }

    // Generate a random number in [0, 1)
    Object.defineProperty(RNG.prototype, 'float', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return _float(this);
        }
    });

    function _float(rng) {
        return _next(rng) / 4294967296;
    }

    // Generate a random integer in [0, upper)
    Object.defineProperty(RNG.prototype, 'integer', {
        writable: true, enumerable: false, configurable: true,
        value: function (upper) {
            var n = (upper === undefined) ? 4294967296 : upper;

            if (n % 1 !== 0) throw new TypeError('upper must be an integer');
            if (n < 1 || n > 4294967296) throw new RangeError('upper must be between 1 and 2^32');

            return _integer(this, n);
        }
    });

    function _integer(rng, n) {
        var m = 4294967296 - 4294967296 % n;

        do {
            var x = _next(rng);
        } while (x >= m);

        return x % n;
    }

    // Randomly shuffle an array
    Object.defineProperty(RNG.prototype, 'shuffle', {
        writable: true, enumerable: false, configurable: true,
        value: function (array) {
            var n = array.length;

            for (var i = 0; i < n; i++) {
                var j = _integer(this, i + 1);
                var x = array[i];

                array[i] = array[j];
                array[j] = x;
            }

            return array;
        }
    });

    // Randomly sample k items without replacement
    Object.defineProperty(RNG.prototype, 'sample', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, k) {
            var n = array.length;
            var m = (k === undefined) ? n : k;

            if (m % 1 !== 0) throw new TypeError('k must be an integer');
            if (m < 0 || m > n) throw new RangeError('k must be between 0 and len(array)');

            var result = new Array(m);

            for (var i = 0; i < m; i++) {
                var j = _integer(this, i + 1);

                result[i] = result[j];
                result[j] = array[i];
            }

            for (var i = m; i < n; i++) {
                var j = _integer(this, i + 1);

                if (j < m) result[j] = array[i];
            }

            return result;
        }
    });

    // Randomly sample k items with replacement
    Object.defineProperty(RNG.prototype, 'resample', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, k) {
            var m = (k === undefined) ? array.length : k;

            if (m % 1 !== 0) throw new TypeError('k must be an integer');
            if (m < 0 || m > 4294967295) throw new RangeError('k must be between 0 and 2^32-1');

            var n = array.length;
            var result = new Array(m);

            for (var i = 0; i < m; i++) result[i] = array[_integer(this, n)];

            return result;
        }
    });

    // --- CONSIDERING ---

    // Clone a pseudorandom number generator
    Object.defineProperty(RNG.prototype, 'clone', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return new RNG(this.state);
        }
    });

    // Progress a pseudorandom number generator n times
    Object.defineProperty(RNG.prototype, 'skip', {
        writable: true, enumerable: false, configurable: true,
        value: function (n) {
            if (n % 1 !== 0) throw new TypeError('n must be an integer');
            if (n < 0) throw new RangeError('n must be greater than 0');

            for (var i = 0; i < n; i++) _next(this);
            return this.state;
        }
    });

    // Generate a random boolean
    Object.defineProperty(RNG.prototype, 'boolean', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return (_next(this) & 1) === 1;
        }
    });

    // Return true with probability p
    Object.defineProperty(RNG.prototype, 'chance', {
        writable: true, enumerable: false, configurable: true,
        value: function (p) {
            if (p < 0 || p > 1) throw new RangeError('p must be between 0 and 1');
            return _float(this) < p;
        }
    });

    // Generate a random integer in [lower, upper)
    Object.defineProperty(RNG.prototype, 'between', {
        writable: true, enumerable: false, configurable: true,
        value: function (lower, upper) {
            var a = (lower === undefined) ? 0 : lower;
            if (a % 1 !== 0) throw new TypeError('lower must be an integer');

            var b = (upper === undefined) ? 4294967296 : upper;
            if (b % 1 !== 0) throw new TypeError('upper must be an integer');

            var n = b - a;
            if (n < 0 || n > 4294967296) throw new RangeError('upper - lower must be between 0 and 2^32');

            return _integer(this, n) + a;
        }
    });

    // ---

    return RNG;

})();

