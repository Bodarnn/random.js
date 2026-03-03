'use strict';

var Stat = (function () {

    Stat = {};

    function _moment(array, n, k, center, ddof) {
        var sum = 0;

        for (var i = 0; i < n; i++) {
            sum += Math.pow(array[i] - center, k);
        }

        return sum / (n - ddof);
    }

    function _sorted(array, n) {
        var result = new Array(n);

        for (var i = 0; i < n; i++) {
            var x = array[i];
            var j = i;

            while (result[j - 1] > x) {
                result[j] = result[j - 1];
                j--;
            }

            result[j] = x;
        }

        return result;
    }

    Object.defineProperty(Stat, 'mean', {
        writable: true, enumerable: false, configurable: true,
        value: function (array) {
            var n = array.length;

            return _mean(array, n);
        }
    });

    Object.defineProperty(Stat, 'median', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, sorted) {
            var n = array.length;
            if (!sorted) array = _sorted(array, n);

            return _percentile(array, n, 0.5);
        }
    });

    Object.defineProperty(Stat, 'percentile', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, p, sorted) {
            var n = array.length;
            if (!sorted) array = _sorted(array, n);

            return _percentile(array, n, p);
        }
    });

    function _percentile(array, n, p) {
        var i = (n - 1) * p;
        var a = Math.floor(i);
        var b = Math.ceil(i);
        var w = i - a;

        return array[a] * (1 - w) + array[b] * w;
    }

    function _mean(array, n) {
        return _sum(array, n) / n;
    }

    Object.defineProperty(Stat, 'sem', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, ddof) {
            var n = array.length;
            if (ddof === undefined) ddof = 1;

            return _sem(array, n, ddof);
        }
    });

    function _sem(array, n, ddof) {
        return _std(array, n, ddof) / Math.sqrt(n);
    }

    Object.defineProperty(Stat, 'std', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, ddof) {
            var n = array.length;
            if (ddof === undefined) ddof = 1;

            return _std(array, n, ddof);
        }
    });

    function _std(array, n, ddof) {
        return Math.sqrt(_var(array, n, ddof));
    }

    Object.defineProperty(Stat, 'sum', {
        writable: true, enumerable: false, configurable: true,
        value: function (array) {
            var n = array.length;

            return _sum(array, n);
        }
    });

    function _sum(array, n) {
        var sum = 0;

        for (var i = 0; i < n; i++) {
            sum += array[i];
        }

        return sum;
    }

    Object.defineProperty(Stat, 'var', {
        writable: true, enumerable: false, configurable: true,
        value: function (array, ddof) {
            var n = array.length;
            if (ddof === undefined) ddof = 1;

            return _var(array, n, ddof);
        }
    });

    function _var(array, n, ddof) {
        return _moment(array, n, 2, _mean(array, n), ddof);
    }

    return Stat;

})();

// https://en.wikipedia.org/wiki/Standard_error
// https://en.wikipedia.org/wiki/68–95–99.7_rule
// https://en.wikipedia.org/wiki/Bootstrapping_(statistics)

// "Bootstrapping" uses random sampling with replacement to estimate
// the error of a sample statistic.

function bootstrap(array, callback) {
    var random = new RNG();
    var result = new Array(1000);

    for (var i = 0; i < 1000; i++) {
        result[i] = callback(random.resample(array));
    }

    return result;
}

// Our boss needs the average age of the company.
// We take a sample and report the mean and standard error.

var data = [
    22, 24, 25, 26, 27, 28, 28, 29, 30, 31,
    32, 33, 34, 35, 37, 38, 40, 42, 45, 50
];

console.log('Mean', Stat.mean(data))
console.log('Analytic SEM', Stat.sem(data));

// We can estimate the standard error using bootstrapping.

var samples = bootstrap(data, Stat.mean);
var p_16 = Stat.percentile(samples, 0.16);
var p_84 = Stat.percentile(samples, 0.84);

console.log('Bootstrap SEM', (p_84 - p_16) / 2);
// alternatively: Stat.std(samples)

// We can estimate the 95% confidence interval of the median.

console.log('Median', Stat.median(data));

var samples = bootstrap(data, Stat.median);
var p_025 = Stat.percentile(samples, 0.025);
var p_975 = Stat.percentile(samples, 0.975);

console.log('95% CI', p_025, '-', p_975);
