'use strict';

var FakeProductModel = function() {
};

FakeProductModel.find = function(query, callback) {
  callback();
};

FakeProductModel.findById = function(query, callback) {
  callback();
};

FakeProductModel.prototype.save = function( callback ) {
  callback();
};

module.exports = FakeProductModel;