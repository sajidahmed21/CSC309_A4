var assert = require('chai').assert;
var admin = require('../admin.js');

var db = require('../common.js').db;

describe('admin', function () {

    describe('handleLoginRequest()', function () {

        var testRequest = getTestRequest();
        var testResponse = getTestResponse();
        
        it('missing fields', function() {
            
            admin.login(undefined, undefined, testRequest, testResponse, function(result) {
               assert.equal(result, 'Error: Missing required fields');
            });
        });
        
        it('incorrect username / password length', function () {
            
            admin.login('abcde', '1234', testRequest, testResponse, function(result) {
               assert.equal(result, 'Error: Incorrect field length');
            });
        });
        
            
        it('incorrect password', function () {
            
            // Insert test credentials
            db.query('INSERT INTO ADMIN_CREDENTIALS (username, password) VALUES(\'test_id321\', \'test_password\')').spread(function() {
                    
                admin.login('test_id321', 'wrong_password', testRequest, testResponse, function(result) {
                    assert.equal(result, 'Login Failed: Invalid Credentials');
                    db.query('DELETE FROM ADMIN_CREDENTIALS WHERE username = \'test_id321\'').spread(function() {});
                });
            
            }).catch(function(error){
                console.log('Database error: ');
                console.log(error);
            });
        });
        
        it('correct password', function () {
            
            // Insert test credentials
            db.query('INSERT INTO ADMIN_CREDENTIALS (username, password) VALUES(\'test_id654\', \'test_password123\')').spread(function() {
                    
                admin.login('test_id654', 'test_password123', testRequest, testResponse, function(result) {
                    assert.equal(result, 'Login Failed: Invalid Credentials');
                    db.query('DELETE FROM ADMIN_CREDENTIALS WHERE username = \'test_id654\'').spread(function() {});
                });
            
            }).catch(function(error){
                console.log('Database error: ');
                console.log(error);
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
