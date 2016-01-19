/**
 * ubicall access parent object Error
 * @version 0.0.1
 * @module access/errors
 * @exports .
 * @namespace Error
 */
function UbicallError() {

}
UbicallError.prototype = Error.prototype;

/**
 * return HTTP 500 error with @param message or  "Unexpected Condition Was Encountered"
 * @param origin - original error object
 * @param resource - current resource url path
 * @param message - custom error message
 * @return HTTP 404
 * @memberof Error
 */
function ServerError(origin, resource, message) {
    this.name = "Server Error";
    this.status = 500;
    this.response = {};
    this.response.resource = resource;
    this.response.message = message || "Unexpected Condition Was Encountered";
}
ServerError.prototype = UbicallError.prototype;

/**
 * return HTTP 429 error with @param message or  "Rate limit exceeded"
 * @param origin - original error object
 * @param resource - current resource url path
 * @param message - custom error message
 * @return HTTP 429
 * @memberof Error
 */
function RateLimitExceededError(origin, resource, message) {
    this.name = "RateLimitExceeded Error";
    this.status = 429;
    this.response = {};
    this.response.resource = resource;
    this.response.message = message || "Rate limit exceeded";
}
RateLimitExceededError.prototype = UbicallError.prototype;

module.exports = {
    ServerError: ServerError,
    RateLimitExceededError: RateLimitExceededError
};