'use strict';

var should = require('should');
var rewire = require('rewire');
var ProductRouter = rewire("./product.router");
var FakeProductModel = require('../fake/FakeProductModel');
var FakeFileSystem = require('../fake/FakeFileSystem');
var sinon = require('sinon');

describe('Product Router', function() {
  beforeEach(function(done) {
    // Product Model
    FakeProductModel = sinon.spy(FakeProductModel);
    FakeProductModel.prototype.save = sinon.stub(FakeProductModel.prototype, "save");
    FakeProductModel.find = sinon.stub(FakeProductModel, "find");

    ProductRouter.__set__( "Product", FakeProductModel );

    // File System
    FakeFileSystem = sinon.spy(FakeFileSystem);
    FakeFileSystem.unlink = sinon.stub(FakeFileSystem, "unlink");
    ProductRouter.__set__( "fs", FakeFileSystem );

    done();
  });

  afterEach(function(done) {
    // Product Model
    FakeProductModel.reset();
    FakeProductModel.prototype.save.restore();
    FakeProductModel.find.restore();

    // File System
    FakeFileSystem.reset();
    FakeFileSystem.unlink.restore();
    done();
  });

  describe( "index endpoint", function() {
    // Index
    it('should return the results and 200 http status if it is successful', function(done) {
      // Given
      var res = { send: sinon.spy(), json: sinon.spy() };
      var results = [{product: "Product 1"}];
      FakeProductModel.find.yields(null, results );

      // When
      ProductRouter.index({}, res);

      // Then
      res.json.calledWith(200, results).should.equal(true);
      res.send.called.should.equal(false);
      FakeProductModel.find.calledOnce.should.equal(true);
      done();
    });

    it('should return 500 http status if there is any errors', function(done) {
      // Given
      var res = { send: sinon.spy(), json: sinon.spy() };
      FakeProductModel.find.yields( true );

      // When
      ProductRouter.index({}, res);

      // Then
      res.json.called.should.equal(false);
      res.send.calledWith(500).should.equal(true);
      FakeProductModel.find.calledOnce.should.equal(true);
      done();
    });
  } );

  describe( "create endpoint", function() {
    // Create
    it('should create new Product with successful response', function( done ) {
      // Given
      var res = { send: sinon.spy(), json: sinon.spy() };
      var result = { name: "Product 1" };
      FakeProductModel.prototype.save.yields(null, result);

      // When
      ProductRouter.create({}, res);

      // Then
      FakeProductModel.calledWithNew().should.equal(true);
      res.json.calledWith(200, result).should.equal(true);
      res.send.called.should.equal(false);

      done();
    });

    it('should return 500 http status with error message', function( done ) {
      // Given
      var res = { send: sinon.spy(), json: sinon.spy() };
      var result = { name: "Product 1" };
      var error_message = "Error Message";
      FakeProductModel.prototype.save.yields(error_message, result);

      // When
      ProductRouter.create({}, res);

      // Then
      FakeProductModel.calledWithNew().should.equal(true);
      res.json.called.should.equal(false);
      res.send.calledWith(500, error_message).should.equal(true);

      done();
    });
  } );

  describe( "upload_photo endpoint", function() {
    it('should return uploaded file path', function( done ) {
      // Given
      var files = [
        { name: "Photo 1", size: 1234 },
        { name: "Photo 2", size: 5678 }
      ];
      var result = {
        files: [
          { filename: "Photo 1", size: 1234 },
          { filename: "Photo 2", size: 5678 }
        ]
      };
      var req = { files: files };
      var res = { send: sinon.spy(), json: sinon.spy() };

      // When
      ProductRouter.upload_photo( req, res );

      // Then
      res.send.called.should.equal( false );
      res.json.calledWithExactly( result ).should.equal(true);

      done();
    });

    it('should return 500 http status if no "files" provided', function( done ) {
      // Given
      var req = {};
      var res = { send: sinon.spy(), json: sinon.spy() };

      // When
      ProductRouter.upload_photo( req, res );

      // Then
      res.json.called.should.equal( false );
      res.send.calledWith( 500 ).should.equal(true);

      done();
    });
  } );

  describe( "delete_photo endpoint", function() {
    // delete_photo
    it('should return 500 http status if no filename in the query string', function( done ) {
      // Given
      var req = { query: {} };
      var res = { send: sinon.spy(), json: sinon.spy() };

      // When
      ProductRouter.delete_photo( req, res );

      // Then
      res.json.called.should.equal( false );
      res.send.calledWith( 500 ).should.equal(true);

      done();
    });

    it('should return 500 http status if filename does not exist', function( done ) {
      // Given
      var req = { query: { filename: "abc134" } };
      var res = { send: sinon.spy(), json: sinon.spy() };
      FakeFileSystem.unlink.yields("No file found");

      // When
      ProductRouter.delete_photo( req, res );

      // Then
      res.json.called.should.equal( false );
      res.send.calledWith( 500, "No file found" ).should.equal(true);

      done();
    });

    it('should return 200 http status if filename exists', function( done ) {
      // Given
      var req = { query: { filename: "abc134" } };
      var res = { send: sinon.spy(), json: sinon.spy() };
      FakeFileSystem.unlink.yields(null);

      // When
      ProductRouter.delete_photo( req, res );

      // Then
      res.json.calledWith(200).should.equal( true );
      res.send.called.should.equal(false);

      done();
    });
  } );
});
