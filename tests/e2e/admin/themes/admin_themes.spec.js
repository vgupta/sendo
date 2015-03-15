'use strict';

var async = require('async');

describe('Admin Themes Page View', function() {
  beforeEach(function () {
    this._themes_page = require('./admin_themes.po.js');
    this._themes_page.visit();
  } );

  describe("Initialize", function () {
    it( 'should display correctly', function () {
      // page title should be "Sendo | Products"
      expect(browser.getTitle()).toEqual('Sendo | Themes');

      // should include "Themes" admin page header
      var themes_page = this._themes_page;
      expect(themes_page.page_title_el.getText()).toBe("Themes");

      // Themes list should show correctly
      expect(themes_page.result_list_container_el.all(by.css('.theme-list-row')).count()).toBe(3);
    } );
  } );
} );