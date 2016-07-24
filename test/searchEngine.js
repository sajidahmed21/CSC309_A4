var assert = require("chai").assert;
var searchEngine = require('../searchEngine.js').test;

describe('scoring', function() {
    it('scoreParts()', function() {
        assert.equal(searchEngine.scorePart('bob', 'bob'), 25);
    });
});