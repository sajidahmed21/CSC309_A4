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
        describe('create-user-success', function (done) {
            it('successs', function () {
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
                        try{
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
                        try{
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
                it('Invalid username and password 2', function () {
                    test.signinHandler(invalidCombination, res, function (result) {
                        assert.equal(result, 'Invalid Username and Password');
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
                    assert.equal(result, 'true');
                });
            });
        });
    });
    describe('changeName()', function () {
        describe('change-name-unsuccessful', function () {
            it('invalid id', function () {
                test.changeName(0, 'testingnewname', function (result) {
                    assert.equal(result, 'Invalid user id');
                });
            });
            it('undefined name', function () {
                test.changeName(user_id, undefined, function (result) {
                    assert.equal(result, 'Invalid name');
                });
            });
            it('null name', function () {
                test.changeName(user_id, null, function (result) {
                    assert.equal(result, 'Invalid name');
                });
            });
            it('empty name', function () {
                test.changeName(user_id, '', function (result) {
                    assert.equal(result, 'Invalid name');
                });
            });
        });
        describe('change-name-successful', function () {
            it('valid name and id', function () {
                test.changeName(user_id, 'testingNewName', function (result) {
                    console.log("CHANGE_NAME_RESTUL" + result);
                    assert.equal(result, 'Success');
                });
            });
        });
    });
    describe('changePassword()', function () {
        describe('change-password-unsuccessful', function () {
            it('invalid id', function () {
                test.changePassword(0, 'testpurpose1.', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                    assert.equal(result, 'Invalid user id');
                });
            });
            describe('undefined password', function () {
                it('undefined current password', function () {
                    test.changePassword(user_id, undefined, 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Incorrect password');
                    });
                });
                it('undefined new password', function () {
                    test.changePassword(user_id, 'testpurpose1', undefined, 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Invalid new password');
                    });
                });
                it('undefined new password confirm', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', undefined, false, function (result) {
                        assert.equal(result, 'Invalid old password');
                    });
                });
            });
            describe('null password', function () {
                it('null current password', function () {
                    test.changePassword(user_id, null, 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Incorrect password');
                    });
                });
                it('null new password', function () {
                    test.changePassword(user_id, 'testpurpose1', null, 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Invalid new password');
                    });
                });
                it('null new password confirm', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', null, false, function (result) {
                        assert.equal(result, 'Invalid old password');
                    });
                });
            });
            describe('empty password', function () {
                it('empty current password', function () {
                    test.changePassword(user_id, '', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Incorrect password');
                    });
                });
                it('empty new password', function () {
                    test.changePassword(user_id, 'testpurpose1', '', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Invalid new password');
                    });
                });
                it('empty new password confirm', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', '', false, function (result) {
                        assert.equal(result, 'Invalid old password');
                    });
                });
            });
            describe('short password', function () {
                it('short current password', function () {
                    test.changePassword(user_id, 'short', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Incorrect password');
                    });
                });
                it('short new password', function () {
                    test.changePassword(user_id, 'testpurpose1', 'short', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Invalid new password');
                    });
                });
                it('short new password confirm', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'short', false, function (result) {
                        assert.equal(result, 'Invalid old password');
                    });
                });
            });
            describe('long password', function () {
                it('short current password', function () {
                    test.changePassword(user_id, 'longlonglonglonglonglonglong', 'testpurpose2.', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Incorrect password');
                    });
                });
                it('long new password', function () {
                    test.changePassword(user_id, 'testpurpose1', 'longlonglonglonglonglonglong', 'testpurpose2.', false, function (result) {
                        assert.equal(result, 'Invalid new password');
                    });
                });
                it('long new password confirm', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'longlonglonglonglonglonglong', false, function (result) {
                        assert.equal(result, 'Invalid old password');
                    });
                });
            });
            describe('passwords do not match', function () {
                it('password do not match', function () {
                    test.changePassword(user_id, 'testpurpose1', 'testpurpose2.', 'randompass1.', false, function (result) {
                        assert.equal(result, 'Passwords do not match');
                    });
                });
            });
            describe('incorrect password', function () {
                it('incorrect password', function () {
                    test.verifyUserPassword(user_id, 'randomwrongpass1.', function (result) {
                        assert.equal(result, 'Invalid');
                    });
                });
            });
        });
        describe('change-password-successful', function () {
            describe('verify correct password', function () {
                it('verify correct password', function () {
                    test.verifyUserPassword(user_id, 'testingpurpose1.', function (result) {
                        assert.equal(result, 'Valid');
                    });
                });
            });
            describe('change password successful', function () {
                it('verify correct password', function () {
                    test.updatePassword(user_id, 'testingpurpose2.', function (result) {
                        assert.equal(result, 'Success');
                    });
                });
            });
        });
    });
    describe('delete-user-successful', function () {
        describe('delete-user-unsuccessful', function () {
            it('invalid id', function () {
                test.deleteUser(0, function (result) {
                    assert.equal(result, 'Invalid user id');
                });
            });
            it('undefined id', function () {
                test.deleteUser(undefined, function (result) {
                    assert.equal(result, 'Invalid user id');
                });
            });
            it('empty id', function () {
                test.deleteUser('', function (result) {
                    assert.equal(result, 'Invalid user id');
                });
            });
        });
        describe('delete-user-successful', function () {
            it('delete-user-successful', function () {
                test.deleteUser(user_id, function (result) {
                    console.log("DELETE RESULT" + result);
                    assert.equal(result, 'Success');
                });
            });
        });
    });
});