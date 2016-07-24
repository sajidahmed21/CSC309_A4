var assert = require("chai").assert;
var searchEngine = require('../searchEngine.js').test;

describe('scoring', function() {
    describe('scoreParts()', function() {
        describe('single words', function() {
            it('exact matching', function() {
                assert.equal(searchEngine.scorePart('bob', 'bob'), 25);
            });
        
            it('beginning match', function() {
                assert.equal(searchEngine.scorePart('bob', 'bob1'), 14);
                assert.equal(searchEngine.scorePart('bob', 'bob12'), 13);
            });
        
            it('non-beginning match', function() {
                assert.equal(searchEngine.scorePart('bob', '1bob'), 9);
                assert.equal(searchEngine.scorePart('bob', '1bob2'), 8);
            });
        
            it('not matching', function() {
                assert.equal(searchEngine.scorePart('bob', 'alice'), 0);
            });
        });
    });
});