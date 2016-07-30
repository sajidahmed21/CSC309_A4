var assert = require("chai").assert;
var courses = require('../courses.js').test;
var createcourse = require('../createcourse.js').test;
var server = require('../server.js');
var http = require('http');




describe('Courses', function() {
	describe('isImage', function() {
		describe('tests where mimetype is not an image', function() {
		    it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('application/json'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('application/x-www-form-urlencoded'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('multipart/form-data'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('text/html'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('text/plain'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('text/css'), false);
	            done();
			});
		});
		describe('tests where mimetype is accepted type of image', function() {
			it('Should return true', function(done) {
	            assert.equal(createcourse.isImage('image/png'), true);
	            done();
			});
			it('Should return true', function(done) {
	            assert.equal(createcourse.isImage('image/bmp'), true);
	            done();
			});
			it('Should return true', function(done) {
	            assert.equal(createcourse.isImage('image/jpeg'), true);
	            done();
			});
			it('Should return true', function(done) {
	            assert.equal(createcourse.isImage('image/gif'), true);
	            done();
			});

		});
		describe('tests where mimetype is image, but not accepted type', function () {
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('image/x-portable-pixmap'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('image/tiff'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('image/x-windows-bmp'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('image/pjpeg'), false);
	            done();
			});
			it('Should return false', function(done) {
	            assert.equal(createcourse.isImage('image/jpg'), false);
	            done();
			});

		});
	});
	describe('testing formatting of course info before entered into db', function() {
		describe('format title', function() {
			it('should capitalize every word given mixed lowercase, and uppercase', function() {
				assert.equal(createcourse.formatTitle("vErY FuNkY nAmE"), 'Very Funky Name');
				//done();
			});
			it('should capitalize every word given uppercase only', function() {
				assert.equal(createcourse.formatTitle("ALL CAPS AND MORE CAPS"), 'All Caps And More Caps');
				//done();
			});
			it('should do nothing if all numbers', function() {
				assert.equal(createcourse.formatTitle("39920398405029"), '39920398405029');
				//done();
			});
		});
		describe('format course desc/reqs', function() {
			it('should capitalize every sentence given newlines and commas', function() {
				assert.equal(createcourse.formatDesc("some very long stuff\n including newlines and stuff."
					+ "one period here and there, and stuff."), 
				'Some very long stuff\n including newlines and stuff. One period here and there, and stuff.');
				
			});
			it('should capitalize every sentence, given a variety of characters', function() {
				assert.equal(createcourse.formatReqs("requirements: should have laptop.should have prior knowledge of information etc etc."), 
					'Requirements: should have laptop. Should have prior knowledge of information etc etc.');
				
			});
			it('should capitalize every sentence, given a lot of spacing', function() {
				assert.equal(createcourse.formatReqs("requirements:                should have laptop.should        have prior knowledge of information etc etc."), 
					'Requirements:                should have laptop. Should        have prior knowledge of information etc etc.');
				
			});
			it('should capitalize every sentence, given a lot of spacing', function() {
				assert.equal(createcourse.formatReqs("requirements:                should hAVeEe laptop.shoULld        have prior knowledge of information etc etc."), 
					'Requirements:                should haveee laptop. Shoulld        have prior knowledge of information etc etc.');
				
			});
		});

	});
});
