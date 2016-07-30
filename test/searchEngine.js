var assert = require("chai").assert;
var searchEngine = require('../searchEngine.js').test;

/*  scoring system:
 *
 * exact match: 25
 * beginning matching: 15!
 * non-beginning match: 10!
 * no match: 0
 *
 * !: deduct 1 point per missing letter
 */

var exactMatch = 25;
var beginningMatch = 15;
var nonBeginningMatch = 10;
var noMatch = 0;
var missingLetter = -1;

function missingLetters(i) {
    return i * missingLetter;
}

// shortcuts for functions
var scorePart = searchEngine.scorePart;
var compareResultScores = searchEngine.compareResultScores;
var sortResults = searchEngine.sortResults;
var limitResults = searchEngine.limitResults;
var mergeStrings = searchEngine.mergeStrings;
var mergeResults = searchEngine.mergeResults;


describe('scoring', function () {
    describe('scoreParts()', function () {
        describe('single words', function () {
            it('exact matching', function () {
                assert.equal(scorePart('monkey', 'monkey'),
                    exactMatch);
                assert.equal(scorePart('gorilla', 'gorilla'),
                    exactMatch);
                assert.equal(scorePart('ape', 'large ape'),
                    exactMatch);
            });

            it('beginning match', function () {
                assert.equal(scorePart('kangaro', 'kangaroo'),
                    beginningMatch + missingLetter);
                assert.equal(scorePart('kangar', 'kangaroo'),
                    beginningMatch + missingLetters(2));
            });

            it('non-beginning match', function () {
                assert.equal(scorePart('key', 'monkey'),
                    nonBeginningMatch + missingLetters(3));
                assert.equal(scorePart('ke', 'monkey'),
                    nonBeginningMatch + missingLetters(4));
            });

            it('not matching', function () {
                assert.equal(scorePart('kangaroo', 'monkey'),
                    noMatch);
                assert.equal(scorePart('monkey', 'gorilla'),
                    noMatch);
            });

            it('assorted', function () {
                assert.equal(scorePart('ape', 'large ape aped'),
                    noMatch + exactMatch + beginningMatch + missingLetter);
                assert.equal(scorePart('monkey', 'gorilla kangaroo'),
                    noMatch + noMatch);
                assert.equal(scorePart('mon', 'monkey keymon'),
                    beginningMatch + missingLetters(3) + nonBeginningMatch + missingLetters(3));
            });
        });

        describe('multiple words', function () {
            it('exact matching', function () {
                assert.equal(scorePart('apple', 'apple apple'),
                    exactMatch + exactMatch)
                assert.equal(scorePart('kiwi', 'kiwi kiwi kiii kiwi'),
                    exactMatch + exactMatch + noMatch + exactMatch);
            });

            it('beginning match', function () {
                assert.equal(scorePart('kiwi', 'kiwitree kiwiapple'),
                    beginningMatch + missingLetters(4) + beginningMatch + missingLetters(5));
                assert.equal(scorePart('kiwi', 'kiwitree kiwiapples'),
                    beginningMatch + missingLetters(4) + beginningMatch + missingLetters(6));
            });

            it('non-beginning match', function () {
                assert.equal(scorePart('app', 'orapp testapp'),
                    nonBeginningMatch + missingLetters(2) + nonBeginningMatch + missingLetters(4));
                assert.equal(scorePart('lee', 'canlee test qwerlee'),
                    nonBeginningMatch + missingLetters(3) + noMatch + nonBeginningMatch + missingLetters(4));
            });

            it('not matching', function () {
                assert.equal(scorePart('app', 'test for the mising word'),
                    noMatch);
                assert.equal(scorePart('lee', 'Can we le leave early?'),
                    noMatch);
            });
        });
    });

    describe('compareResultScores()', function () {
        it('less than', function () {
            assert.equal(compareResultScores({
                score: 10
            }, {
                score: 2
            }), -8);
        });

        it('greater than', function () {
            assert.equal(compareResultScores({
                score: 2
            }, {
                score: 8
            }), 6);
        });

        it('equal', function () {
            assert.equal(compareResultScores({
                score: 12
            }, {
                score: 12
            }), 0);
        });
    });

    describe('sortResults()', function () {
        it('two items', function () {
            var input = [
                {
                    score: 1
                },
                {
                    score: 12
                }
            ];

            var expectedResult = [
                {
                    score: 12
                },
                {
                    score: 1
                }
            ];

            sortResults(input);
            assert.deepEqual(input, expectedResult);
        });

        it('four items', function () {
            var input = [
                {
                    score: 213
                },
                {
                    score: 31
                },
                {
                    score: 51
                },
                {
                    score: 124
                }
            ];

            var expectedResult = [
                {
                    score: 213
                },
                {
                    score: 124
                },
                {
                    score: 51
                },
                {
                    score: 31
                }
            ];

            sortResults(input);
            assert.deepEqual(input, expectedResult);
        });
    });

    describe('limitResults()', function () {
        it('no limit', function () {
            var input = [
                {
                    score: 213
                },
                {
                    score: 124
                },
                {
                    score: 51
                },
                {
                    score: 31
                }
            ];

            var expectedResult = [
                {
                    score: 213
                },
                {
                    score: 124
                },
                {
                    score: 51
                },
                {
                    score: 31
                }
            ];

            limitResults(null, input);
            assert.deepEqual(input, expectedResult);
        });

        it('remove two', function () {
            var input = [
                {
                    score: 213
                },
                {
                    score: 124
                },
                {
                    score: 51
                },
                {
                    score: 31
                }
            ];

            var expectedResult = [
                {
                    score: 213
                },
                {
                    score: 124
                }
            ];

            limitResults(2, input);
            assert.deepEqual(input, expectedResult);
        });

        it('remove all', function () {
            var input = [
                {
                    score: 213
                },
                {
                    score: 124
                },
                {
                    score: 51
                },
                {
                    score: 31
                },
                {
                    score: 2
                }
            ];

            var expectedResult = [];

            limitResults(-1, input);
            assert.deepEqual(input, expectedResult);
        });
    });

    describe('mergeStrings()', function () {
        it('both provided', function () {
            assert.equal(mergeStrings('bob', 'test'), 'bob (test)');
            assert.equal(mergeStrings('james', 'jk123'), 'james (jk123)');
        });

        it('primary only', function () {
            assert.equal(mergeStrings('bob', ''), 'bob');
            assert.equal(mergeStrings('james', ''), 'james');
        });

        it('secondary only', function () {
            assert.equal(mergeStrings('', 'test'), 'test');
            assert.equal(mergeStrings('', 'jk123'), 'jk123');
        });
    });

    describe('mergeResults()', function () {
        it('empty with full', function () {
            var empty = [];
            var full = [
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'blue'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            var expectedResult = [
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'blue'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            assert.deepEqual(expectedResult, mergeResults(empty, full));
            assert.deepEqual(expectedResult, mergeResults(full, empty));
        });

        it('no duplicates', function () {
            var first = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 15,
                    data: 'black'
                },
            ];
            var second = [
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'blue'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            var expectedResult = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 15,
                    data: 'black'
                },
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'blue'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            assert.deepEqual(expectedResult, mergeResults(first, second));
            assert.notDeepEqual(expectedResult, mergeResults(second, first));
        });

        it('one duplicate', function () {
            var first = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 15,
                    data: 'black'
                },
            ];
            var second = [
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'red'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            var expectedResult = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 15,
                    data: 'black'
                },
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'orange'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            assert.deepEqual(expectedResult, mergeResults(first, second));
            assert.notDeepEqual(expectedResult, mergeResults(second, first));
        });

        it('multiple duplicates', function () {
            var first = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 15,
                    data: 'black'
                },
                {
                    score: 2,
                    data: 'green'
                }
            ];
            var second = [
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'red'
                },
                {
                    score: 85,
                    data: 'black'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            var expectedResult = [
                {
                    score: 402,
                    data: 'red'
                },
                {
                    score: 102,
                    data: 'green'
                },
                {
                    score: 85,
                    data: 'black'
                },
                {
                    score: 1,
                    data: 'yellow'
                },
            ];

            assert.deepEqual(expectedResult, mergeResults(first, second));
            assert.notDeepEqual(expectedResult, mergeResults(second, first));
        });
    });
});