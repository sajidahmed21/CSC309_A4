var assert = require("chai").assert;
var users = require('../user.js');
var test = users.test;

describe('user', function () {
    describe('signinHandler()', function () {
        it('signin-correct', function () {
            var req = {
                "body":{
                    "signinUsername": 'bill',
                    "signinPassword": '123123123'
                }
            }
            var res = {
                "status": undefined
            }
            test.signinHandler(req, res, function(result){
               asser.equals(result, true);
            });
            //assert.equal(test.signinHandler(req, res), true);
        });
    });
});