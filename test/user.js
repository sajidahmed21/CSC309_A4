var assert = require("chai").assert;
var users = require('../user.js');
var test = users.test;
var user_id = 1;

describe('user', function () {
    describe('signupHandler()', function () {
        describe('create-user-unsuccessgful', function () {
            describe('with empty field', function () {
                it('empty name', function (done) {
                    test.createUser('', 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('empty username', function (done) {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('empty password', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', '', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('empty confirmpassword', function (done) {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', '', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('with null field', function () {
                it('null name', function (done) {
                    test.createUser(null, 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('null username', function (done) {
                    test.createUser('testingpurpose', null, 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('null password', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', null, 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('null confirmpassword', function (done) {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', null, function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('with undefined field', function () {
                it('undefined name', function (done) {
                    test.createUser(undefined, 'testingpurpose', 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('undefined username', function (done) {
                    test.createUser('testingpurpose', undefined, 'testingpurpose1.', 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('undefined password', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', undefined, 'testingpurpose1..', function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('undefined confirmpassword', function (done) {
                    test.createUser('testingpurpose', '', 'testingpurpose1.', undefined, function (result) {
                        try {
                            assert.equal(result, 'Required field missing');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('password and confirm password don\'t match', function () {
                it('password and confirm password don\'t match 1', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurpose1.', 'testingpurpose11..', function (result) {
                        try {
                            assert.equal(result, 'Passwords Don\'t Match');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('password and confirm password don\'t match 2', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurposeabc1.', 'testingpurpose1.', function (result) {
                        try {
                            assert.equal(result, 'Passwords Don\'t Match');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('too short/too long username', function () {
                it('too short username', function (done) {
                    test.createUser('testingpurpose', 'short', 'testingpurpose1.', 'testingpurpose1.', function (result) {
                        try {
                            assert.equal(result, 'Incorrect Username Length');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('too long username', function (done) {
                    test.createUser('testingpurpose', 'testingpurposelonglonglonglong', 'testingpurpose1.', 'testingpurpose1.', function (result) {
                        try {
                            assert.equal(result, 'Incorrect Username Length');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('too short/too long password', function () {
                it('too short password', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', 'short', 'short', function (result) {
                        try {
                            assert.equal(result, 'Incorrect Password Length');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('too long password', function (done) {
                    test.createUser('testingpurpose', 'testingpurpose', 'testingpurpose1.longlonglonglong', 'testingpurpose1.longlonglonglong', function (result) {
                        try {
                            assert.equal(result, 'Incorrect Password Length');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
        describe('create-user-success', function () {
            it('successs', function (done) {
                test.createUser('testingpurpose', 'testingpurpose', 'testingpurpose1.', 'testingpurpose1.', function (errorType, id) {
                    try {
                        if (id != undefined) {
                            console.log("TESTING ID:" + id);
                            user_id = id;
                        }
                        assert.equal(errorType, undefined);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });
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
                it('empty username', function (done) {
                    test.signinHandler(emptyUsername, res, function (result) {
                        try {
                            assert.equal(result, 'Missing Required Field!');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                var emptyPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: ''
                    }
                };
                var res = {};
                it('empty password', function (done) {
                    test.signinHandler(emptyPassword, res, function (result) {
                        try {
                            assert.equal(result, 'Missing Required Field!');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
                it('null username', function (done) {
                    try {
                        test.signinHandler(nullUsername, res, function (result) {
                            assert.equal(result, 'Missing Required Field!');
                        });
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
                var nullPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: null
                    }
                };
                var res = {};
                it('null password', function (done) {
                    test.signinHandler(nullPassword, res, function (result) {
                        try {
                            assert.equal(result, 'Missing Required Field!');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
                it('empty username', function (done) {
                    test.signinHandler(undefinedUsername, res, function (result) {
                        try {
                            assert.equal(result, 'Missing Required Field!');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                var undefinedPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: undefined
                    }
                };
                var res = {};
                it('null password', function (done) {
                    test.signinHandler(undefinedPassword, res, function (result) {
                        try {
                            assert.equal(result, 'Missing Required Field!');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
                it('short username', function (done) {
                    test.signinHandler(shortUsername, res, function (result) {
                        try {
                            assert.equal(result, 'Too long / Too Short Username or Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                var longUsername = {
                    body: {
                        signinUsername: 'testingpurposelonglonglong',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('long username', function (done) {
                    test.signinHandler(longUsername, res, function (result) {
                        try {
                            assert.equal(result, 'Too long / Too Short Username or Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
                it('short password', function (done) {
                    test.signinHandler(shortPassword, res, function (result) {
                        try {
                            assert.equal(result, 'Too long / Too Short Username or Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                var longPassword = {
                    body: {
                        signinUsername: 'testingpurpose',
                        signinPassword: 'testingpurpose1.longlonglong'
                    }
                };
                var res = {};
                it('long password', function (done) {
                    test.signinHandler(longPassword, res, function (result) {
                        try {
                            assert.equal(result, 'Too long / Too Short Username or Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
                it('Invalid username and password 1', function (done) {
                    test.signinHandler(invalidCombination, res, function (result) {
                        try {
                            assert.equal(result, 'Invalid Username and Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                var invalidCombination = {
                    body: {
                        signinUsername: 'wrongwronguser',
                        signinPassword: 'testingpurpose1.'
                    }
                };
                var res = {};
                it('Invalid username and password 2', function (done) {
                    test.signinHandler(invalidCombination, res, function (result) {
                        try {
                            assert.equal(result, 'Invalid Username and Password');
                            done();
                        } catch (err) {
                            done(err);
                        }
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
            it('correct username and password', function (done) {
                test.signinHandler(validCombination, res, function (result) {
                    try{
                    assert.equal(result, 'true');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
        });
    });
    describe('changeName()', function () {
        describe('change-name-unsuccessful', function () {
            it('invalid id', function (done) {
                test.changeName(0, 'testingnewname', function (result) {
                    try{
                    assert.equal(result, 'Invalid user id');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            it('undefined name', function (done) {
                test.changeName(user_id, undefined, function (result) {
                    try{
                    assert.equal(result, 'Invalid name');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            it('null name', function (done) {
                test.changeName(user_id, null, function (result) {
                    try{
                    assert.equal(result, 'Invalid name');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            it('empty name', function (done) {
                test.changeName(user_id, '', function (result) {
                    try{
                    assert.equal(result, 'Invalid name');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
        });
        describe('change-name-successful', function () {
            it('valid name and id', function (done) {
                test.changeName(user_id, 'testingNewName', function (result) {
                    try{
                    console.log("CHANGE_NAME_RESTUL" + result);
                    assert.equal(result, 'Success');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
        });
    });
    describe('changePassword()', function () {
        describe('change-password-unsuccessful', function () {
            it('invalid id', function (done) {
                test.changePassword(0, 'testpurpose1.', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                    try{
                    assert.equal(result, 'Invalid user id');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            describe('undefined password', function () {
                it('undefined current password', function (done) {
                    test.changePassword(user_id, undefined, 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Incorrect password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('undefined new password', function (done) {
                    test.changePassword(user_id, 'testpurpose1', undefined, 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid new password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('undefined new password confirm', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', undefined, false, function (result) {
                        try{
                        assert.equal(result, 'Invalid old password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('null password', function () {
                it('null current password', function (done) {
                    test.changePassword(user_id, null, 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Incorrect password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('null new password', function (done) {
                    test.changePassword(user_id, 'testpurpose1', null, 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid new password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('null new password confirm', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', null, false, function (result) {
                        try{
                        assert.equal(result, 'Invalid old password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('empty password', function () {
                it('empty current password', function (done) {
                    test.changePassword(user_id, '', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Incorrect password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                    
                });
                it('empty new password', function (done) {
                    test.changePassword(user_id, 'testpurpose1', '', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid new password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('empty new password confirm', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', '', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid old password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('short password', function () {
                it('short current password', function (done) {
                    test.changePassword(user_id, 'short', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Incorrect password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('short new password', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'short', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid new password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('short new password confirm', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'short', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid old password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                    
                });
            });
            describe('long password', function () {
                it('short current password', function (done) {
                    test.changePassword(user_id, 'longlonglonglonglonglonglong', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Incorrect password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('long new password', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'longlonglonglonglonglonglong', 'testpurpose2.', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid new password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
                it('long new password confirm', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'longlonglonglonglonglonglong', false, function (result) {
                        try{
                        assert.equal(result, 'Invalid old password');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('passwords do not match', function () {
                it('password do not match', function (done) {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'randompass1.', false, function (result) {
                        try{
                        assert.equal(result, 'Passwords do not match');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('incorrect password', function () {
                it('incorrect password', function (done) {
                    test.verifyUserPassword(user_id, 'randomwrongpass1.', function (result) {
                        try{
                        assert.equal(result, 'Invalid');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
        describe('change-password-successful', function () {
            describe('verify correct password', function () {
                it('verify correct password', function (done) {
                    test.verifyUserPassword(user_id, 'testingpurpose1.', function (result) {
                        try{
                        assert.equal(result, 'Valid');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
            describe('change password successful', function () {
                it('verify correct password', function (done) {
                    test.updatePassword(user_id, 'testingpurpose2.', function (result) {
                        try{
                        assert.equal(result, 'Success');
                        done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('delete-user-successful', function () {
        describe('delete-user-unsuccessful', function () {
            it('invalid id', function (done) {
                test.deleteUser(0, function (result) {
                    try{
                    assert.equal(result, 'Invalid user id');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            it('undefined id', function (done) {
                test.deleteUser(undefined, function (result) {
                    try{
                    assert.equal(result, 'Invalid user id');done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
            it('empty id', function (done) {
                test.deleteUser('', function (result) {
                    try{
                    assert.equal(result, 'Invalid user id');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
        });
        describe('delete-user-successful', function () {
            it('delete-user-successful', function (done) {
                test.deleteUser(user_id, function (result) {
                    try{
                    console.log("DELETE RESULT" + result);
                    assert.equal(result, 'Success');
                    done();
                        } catch (err) {
                            done(err);
                        }
                });
            });
        });
    });
});