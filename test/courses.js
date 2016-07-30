var assert = require("chai").assert;
var courses = require('../courses.js').test;
var createcourse = require('../createcourse.js').test;
var server = require('../server.js');
var http = require('http');




describe('Courses', function () {
    describe('isImage', function () {
        describe('tests where mimetype is not an image', function () {
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('application/json'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('application/x-www-form-urlencoded'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('multipart/form-data'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('text/html'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('text/plain'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('text/css'), false);
                done();
            });
        });
        describe('tests where mimetype is accepted type of image', function () {
            it('Should return true', function (done) {
                assert.equal(createcourse.isImage('image/png'), true);
                done();
            });
            it('Should return true', function (done) {
                assert.equal(createcourse.isImage('image/bmp'), true);
                done();
            });
            it('Should return true', function (done) {
                assert.equal(createcourse.isImage('image/jpeg'), true);
                done();
            });
            it('Should return true', function (done) {
                assert.equal(createcourse.isImage('image/gif'), true);
                done();
            });

        });
        describe('tests where mimetype is image, but not accepted type', function () {
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('image/x-portable-pixmap'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('image/tiff'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('image/x-windows-bmp'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('image/pjpeg'), false);
                done();
            });
            it('Should return false', function (done) {
                assert.equal(createcourse.isImage('image/jpg'), false);
                done();
            });

        });
    });
});