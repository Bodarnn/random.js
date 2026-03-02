// https://en.wikipedia.org/wiki/Xorshift
// https://en.wikipedia.org/wiki/Rejection_sampling
// https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
// https://en.wikipedia.org/wiki/Reservoir_sampling

'use strict';

var RNG = (function () {

    // Create random number generator
    function RNG(state) {
        if (!(this instanceof RNG)) throw new TypeError('RNG not new');

        if (state === undefined) state = 2463534242;

        if (state % 1 !== 0) throw new TypeError('state not integer');
        if (state < 1 || state > 4294967295) throw new RangeError('state not in [1, 2^32)');

        this.state = state;
    }

    Object.defineProperty(RNG, 'prototype', {
        writable: false, enumerable: false, configurable: false
    });

    // Generate integer in [a, b)
    Object.defineProperty(RNG.prototype, 'between', {
        writable: true, enumerable: false, configurable: true,
        value: function (a, b) {
            if (a === undefined) a = 0;
            if (a % 1 !== 0) throw new TypeError('a not integer');

            if (b === undefined) b = 4294967296;
            if (b % 1 !== 0) throw new TypeError('b not integer');

            var n = b - a;
            if (n < 1 || n > 4294967296) throw new RangeError('n not in [1, 2^32]');

            return _integer(this, n) + a;
        }
    });

    // Return true with probability 0.5
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
            if (p < 0 || p > 1) throw new RangeError('p not in [0, 1]');

            return _float(this) < p;
        }
    });

    // Clone random number generator
    Object.defineProperty(RNG.prototype, 'clone', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return new RNG(this.state);
        }
    });

    // Generate number in [0, 1)
    Object.defineProperty(RNG.prototype, 'float', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return _float(this);
        }
    });

    function _float(rng) {
        return _next(rng) / 4294967296;
    }

    // Generate integer in [0, n)
    Object.defineProperty(RNG.prototype, 'integer', {
        writable: true, enumerable: false, configurable: true,
        value: function (n) {
            if (n === undefined) n = 4294967296;

            if (n % 1 !== 0) throw new TypeError('n not integer');
            if (n < 1 || n > 4294967296) throw new RangeError('n not in [1, 2^32]');

            return _integer(this, n);
        }
    });

    function _integer(rng, n) {
        var m = 4294967296 - 4294967296 % n;

        do {
            var k = _next(rng);
        } while (k >= m);

        return k % n;
    }

    // Advance random number generator
    Object.defineProperty(RNG.prototype, 'next', {
        writable: true, enumerable: false, configurable: true,
        value: function () {
            return _next(this);
        }
    });

    function _next(rng) {
        var k = rng.state;

        k ^= k << 13;
        k ^= k >>> 17;
        k ^= k << 5;
        k >>>= 0;

        return rng.state = k;
    }

    // Sample m items without replacement
    Object.defineProperty(RNG.prototype, 'sample', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, m) {
            var n = array.length;

            if (m === undefined) m = n;

            if (m % 1 !== 0) throw new TypeError('m not integer');
            if (m < 0 || m > n) throw new RangeError('m not in [0, n]');

            var result = new Array(m);

            // --- OPTIONAL ---
            for (var i = 0; i < m; i++) {
                var k = _integer(this, i + 1);

                result[i] = result[k];
                result[k] = array[i];
            }
            // ----------------

            for (var i = m; i < n; i++) {
                var k = _integer(this, i + 1);

                if (k < m) result[k] = array[i];
            }

            return result;
        }
    });

    // Shuffle array in-place
    Object.defineProperty(RNG.prototype, 'shuffle', {
        writable: true, enumerable: false, configurable: true,
        value: function (array) {
            var n = array.length;

            for (var i = 0; i < n; i++) {
                var k = _integer(this, i + 1);
                var x = array[i];

                array[i] = array[k];
                array[k] = x;
            }

            return array;
        }
    });

    // Advance random number generator n times
    Object.defineProperty(RNG.prototype, 'skip', {
        writable: true, enumerable: false, configurable: true,
        value: function (n) {
            if (n === undefined) n = 1;

            if (n % 1 !== 0) throw new TypeError('n not integer');
            if (n < 0) throw new RangeError('n less than 0');

            for (var i = 0; i < n; i++) _next(this);

            return this.state;
        }
    });

    // Sample m items with replacement
    Object.defineProperty(RNG.prototype, 'resample', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, m) {
            var n = array.length;

            if (m === undefined) m = n;

            if (m % 1 !== 0) throw new TypeError('m not integer');
            if (m < 0 || m > 4294967295) throw new RangeError('m not in [0, 2^32)');

            var result = new Array(m);

            for (var i = 0; i < m; i++) {
                result[i] = array[_integer(this, n)];
            }

            return result;
        }
    });

    return RNG;

})();
