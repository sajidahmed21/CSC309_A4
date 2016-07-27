var assert = require("chai").assert;
var users = require('../user.js');
var test = users.test;

describe('user', function () {
    describe('signupHandler()', function () {
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
        });
        //        describe('create-user-success', function () {
        //            it('successs', function () {
        //                test.createUser('testingpurpos', 'testingpurpos', 'testingpurpose1.', 'testingpurpose1.', function (result) {
        //                    assert.equal(result, 'true');
        //                });
        //            });
        //        });
    });
    describe('signinHandler()', function () {
        describe('login-unsuccessful', function () {
            describe('with empty input', function () {
                var emptyUsername = {
                    body: {
                        signinUsername: '',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('empty username', function () {
                    test.signinHandler(emptyUsername, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
                var emptyPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: ''
                    }
                };
                var res = {};
                it('empty password', function () {
                    test.signinHandler(emptyPassword, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
            });
            describe('with null input', function () {
                var nullUsername = {
                    body: {
                        signinUsername: null,
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('null username', function () {
                    test.signinHandler(nullUsername, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
                var nullPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: null
                    }
                };
                var res = {};
                it('null password', function () {
                    test.signinHandler(nullPassword, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
            });
            describe('with undefined input', function () {
                var undefinedUsername = {
                    body: {
                        signinUsername: undefined,
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('empty username', function () {
                    test.signinHandler(undefinedUsername, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
                var undefinedPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: undefined
                    }
                };
                var res = {};
                it('null password', function () {
                    test.signinHandler(undefinedPassword, res, function (result) {
                        assert(result, 'Missing Required Field!');
                    });
                });
            });
            describe('Too long / too short username', function () {
                var shortUsername = {
                    body: {
                        signinUsername: 'short',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('short username', function () {
                    test.signinHandler(shortUsername, res, function (result) {
                        assert(result, 'Too long / Too Short Username or Password');
                    });
                });
                var longUsername = {
                    body: {
                        signinUsername: 'testingpurposelonglonglong',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('long username', function () {
                    test.signinHandler(longUsername, res, function (result) {
                        assert(result, 'Too long / Too Short Username or Password');
                    });
                });
            });
            describe('Too long / too short password', function () {
                var shortPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: 'short'
                    }
                };
                var res = {};
                it('short password', function () {
                    test.signinHandler(shortPassword, res, function (result) {
                        assert(result, 'Too long / Too Short Username or Password');
                    });
                });
                var longPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: 'testingpurpose1.longlonglong'
                    }
                };
                var res = {};
                it('long password', function () {
                    test.signinHandler(longPassword, res, function (result) {
                        assert(result, 'Too long / Too Short Username or Password');
                    });
                });
            });
            describe('Invalid username and password', function () {
                var invalidCombination = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: 'wrongpassword12..'
                    }
                };
                var res = {};
                it('Invalid username and password 1', function () {
                    test.signinHandler(invalidCombination, res, function (result) {
                        assert(result, 'Invalid Username and Password');
                    });
                });
                var invalidCombination = {
                    body: {
                        signinUsername: 'wrongwronguser',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('Invalid username and password 2', function () {
                    test.signinHandler(invalidCombination, res, function (result) {
                        assert(result, 'Invalid Username and Password');
                    });
                });
            });
        });
        describe('login-successful', function () {
            var validCombination = {
                body: {
                    signinUsername: 'testingpurpose',
                    signinPassword: 'testingpurpose1.'
                }
            };
            var res = {};
            it('correct username and password', function () {
                test.signinHandler(validCombination, res, function (result) {
                    assert(result, 'true');
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