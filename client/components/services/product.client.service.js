'use strict';

angular.module('sendoApp')
  .factory('Product', function ($resource) {
    return $resource('/admin/api/products/:id/:controller', {
      id: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: false
      },
      upload_photo: {
        method: 'POST',
        headers: {
          'Content-Type': undefined,
          enctype:'multipart/form-data'
        },
        params: {
          controller: 'upload_photo'
        }
      },
      delete_photo: {
        method: "DELETE",
        params: {
          controller: "delete_photo"
        }
      }
    } );
  });
