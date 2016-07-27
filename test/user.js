var assert = require("chai").assert;
var users = require('../user.js');
var test = users.test;

describe('user', function () {
    describe('signinHandler()', function () {
        describe('create-user-unsuccessgful', function () {
            describe('with empty field', function () {
                it('empty name', function () {
                    test.createUser('', 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('empty username', function () {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('empty password', function () {
                    test.createUser('testingpurpose', 'testingpurpose', '', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('empty confirmpassword', function () {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', '', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
            });
            describe('with null field', function () {
                it('null name', function () {
                    test.createUser(null, 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('null username', function () {
                    test.createUser('testingpurpose', null, 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('null password', function () {
                    test.createUser('testingpurpose', 'testingpurpose', null, 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('null confirmpassword', function () {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', null, function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
            });
            describe('with undefined field', function () {
                it('undefined name', function () {
                    test.createUser(undefined, 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('undefined username', function () {
                    test.createUser('testingpurpose', undefined, 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('undefined password', function () {
                    test.createUser('testingpurpose', 'testingpurpose', undefined, 'testingpurpose1..', function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
                it('undefined confirmpassword', function () {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', undefined, function (result) {
                        assert.equal(result, 'Required field missing');
                    });
                });
            });
            describe('password and confirm password don\'t match', function () {
                it('password and confirm password don\'t match 1', function () {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurpose1.', 'testingpurpose11..', function (result) {
                        assert.equal(result, 'Passwords Don\'t Match');
                    });
                });
                it('password and confirm password don\'t match 2', function () {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurposeabc1.', 'testingpurpose1.', function (result) {
                        assert.equal(result, 'Passwords Don\'t Match');
                    });
                });
            });
            describe('too short/too long username', function () {
                it('too short username', function () {
                    test.createUser('testingpurpose', 'short', 'testingpurpose1.', 'testingpurpose1.', function (result) {
                        assert.equal(result, 'Incorrect Username Length');
                    });
                });
                it('too long username', function () {
                    test.createUser('testingpurpose', 'testingpurposelonglonglonglong', 'testingpurpose1.', 'testingpurpose1.', function (result) {
                        assert.equal(result, 'Incorrect Username Length');
                    });
                });
            });
            describe('too short/too long password', function () {
                it('too short password', function () {
                    test.createUser('testingpurpose', 'testingpurpose', 'short', 'short', function (result) {
                        assert.equal(result, 'Incorrect Password Length');
                    });
                });
                it('too long password', function () {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurpose1.longlonglonglong', 'testingpurpose1.longlonglonglong', function (result) {
                        assert.equal(result, 'Incorrect Password Length');
                    });
                });
            });
            describe('success', function () {
                it('successs', function () {
                    test.createUser('testingpurpos', 'testingpurpos', 'testingpurpose1.', 'testingpurpose1.', function (result) {
                        assert.equal(result, 'true');
                    });
                });
            });
        });
    });
});

//describe('user', function () {
//    describe('signinHandler()', function () {
//        it('signin-correct', function () {
//            var req = {
//                "body":{
//                    "signinUsername": 'bill',
//                    "signinPassword": '123123123'
//                }
//            }
//            var res = {
//                "status": undefined
//            }
//            test.signinHandler(req, res, function(result){
//               asser.equals(result, true);
//            });
//            //assert.equal(test.signinHandler(req, res), true);
//        });
//    });
//});