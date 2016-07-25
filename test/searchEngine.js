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

describe('scoring', function() {
    describe('scoreParts()', function() {
        describe('single words', function() {
            it('exact matching', function() {
                assert.equal(searchEngine.scorePart('monkey', 'monkey'),
                    exactMatch);
                assert.equal(searchEngine.scorePart('gorilla', 'gorilla'),
                    exactMatch);
                assert.equal(searchEngine.scorePart('ape', 'large ape'),
                    exactMatch);
            });
        
            it('beginning match', function() {
                assert.equal(searchEngine.scorePart('kangaro', 'kangaroo'),
                    beginningMatch + missingLetter);
                assert.equal(searchEngine.scorePart('kangar', 'kangaroo'),
                    beginningMatch + missingLetters(2));
            });
        
            it('non-beginning match', function() {
                assert.equal(searchEngine.scorePart('key', 'monkey'),
                    nonBeginningMatch + missingLetters(3));
                assert.equal(searchEngine.scorePart('ke', 'monkey'),
                    nonBeginningMatch + missingLetters(4));
            });
        
            it('not matching', function() {
                assert.equal(searchEngine.scorePart('kangaroo', 'monkey'),
                    noMatch);
                assert.equal(searchEngine.scorePart('monkey', 'gorilla'),
                    noMatch);
            });
            
            it('assorted', function() {
                assert.equal(searchEngine.scorePart('ape', 'large ape aped'),
                    noMatch + exactMatch + beginningMatch + missingLetter);
                assert.equal(searchEngine.scorePart('monkey', 'gorilla kangaroo'),
                    noMatch + noMatch);
                assert.equal(searchEngine.scorePart('mon', 'monkey keymon'),
                    beginningMatch + missingLetters(3) + nonBeginningMatch + missingLetters(3));
            });
        });
        
        describe('multiple words', function() {
            it('exact matching', function() {
                assert.equal(searchEngine.scorePart('apple', 'apple apple'),
                    exactMatch + exactMatch)
                assert.equal(searchEngine.scorePart('kiwi', 'kiwi kiwi kiii kiwi'),
                    exactMatch + exactMatch + noMatch + exactMatch);
            });
            
            it('beginning match', function() {
                assert.equal(searchEngine.scorePart('kiwi', 'kiwitree kiwiapple'),
                    beginningMatch + missingLetters(4) + beginningMatch + missingLetters(5));
                assert.equal(searchEngine.scorePart('kiwi', 'kiwitree kiwiapples'),
                    beginningMatch + missingLetters(4) + beginningMatch + missingLetters(6));
            });
            
            it('non-beginning match', function() {
                assert.equal(searchEngine.scorePart('app', 'orapp testapp'),
                    nonBeginningMatch + missingLetters(2) + nonBeginningMatch + missingLetters(4));
                assert.equal(searchEngine.scorePart('lee', 'canlee test qwerlee'),
                    nonBeginningMatch + missingLetters(3) + noMatch + nonBeginningMatch + missingLetters(4));
            });
            
            it('not matching', function() {
                assert.equal(searchEngine.scorePart('app', 'test for the mising word'),
                    noMatch);
                assert.equal(searchEngine.scorePart('lee', 'Can we le leave early?'),
                    noMatch);
            });
        });
    });
});