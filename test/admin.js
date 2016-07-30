var assert = require('chai').assert;
var admin = require('../admin.js');

var db = require('../common.js');

describe('admin', function () {

    describe('handleLoginRequest()', function () {

        it('missing fields', function() {
            var testRequest = getTestRequest();
            var testResponse = getTestResponse();
            
            admin.handleLoginRequest(testRequest, testResponse, function(result) {
               assert.equal(result, 'Error: Missing required fields');
            });
        });
        
        it('incorrect username / password length', function () {
            var testRequest = getTestRequest();
            testRequest.body.admin_id = 'abcde';
            testRequest.body.password = '1234';
            var testResponse = getTestResponse();
            
            admin.handleLoginRequest(testRequest, testResponse, function(result) {
               assert.equal(result, 'Error: Incorrect field length');
            });
        });
    });
});


function getTestRequest() {
    return {body: {}, session: {}};
}

function getTestResponse() {
    return {};
}
