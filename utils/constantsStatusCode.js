const http2 = require('http2');

module.exports = {
  HTTP_STATUS_OK,                   // 200
  HTTP_STATUS_CREATED,              // 201
  HTTP_STATUS_BAD_REQUEST,          // 400
  HTTP_STATUS_UNAUTHORIZED,         // 401
  HTTP_STATUS_NOT_FOUND,            // 404
  HTTP_STATUS_CONFLICT,             // 409
  HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
} = http2.constants;

