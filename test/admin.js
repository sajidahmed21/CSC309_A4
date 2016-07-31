var assert = require('chai').assert;
var admin = require('../admin.js').test;

var db = require('../common.js').db;

describe('admin', function () {

    describe('login()', function () {

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
    
    describe('getUserProfileData()', function() {
        
        it ('success', function () {
            db.query('INSERT INTO USERS (id, name, profile_color) VALUES (99999999, \'test-man99\' , \'red\' )').spread(function() {
                
                admin.getUserProfileData(99999999, function () {
                    
                    db.query('DELETE FROM USERS WHERE id = 99999999').spread(function() {});
                });
            });
        });
        
        it('invalid user id', function () {
            
            admin.getUserProfileData(0, function (status) {
                assert.equal(status, 'Invalid user id');
            });
        });
    });
    
    describe('deleteAllUsers()', function () {
        
        it('delete all users success', function () {
            
            admin.deleteAllUsers(function (result) {
                assert.equal('Success', result);
            });
        });
    });
    
    describe('deleteAllClasses()', function () {
        it('delete all classes success', function() {
            
            admin.deleteAllClasses(function (result) {
                assert.equal('Success', result);
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
