function UbicallError() {

}
UbicallError.prototype = Error.prototype;

function NotImplementedError(resource) {
  this.name = "NotImplementedError";
  this.status = 501;
  this.response = {};
  this.response.resource = resource;
  this.response.message = "501 Not Implemented";
}
NotImplementedError.prototype = UbicallError.prototype;

function BadRequest(resource) {
  this.name = "BadRequest";
  this.status = 400;
  this.response = {};
  this.response.resource = resource;
  this.response.message = "Problems parsing JSON";
}
BadRequest.prototype = UbicallError.prototype;

function MissedParams(resource, params) {
  this.name = "MissedParams";
  this.status = 422;
  this.response = {};
  this.response.resource = resource;
  this.response.message = "Validation Failed";
  this.response.errors = [];
  for (var i = 0; i < params.length; i++) {
    this.response.errors.push({
      resource: resource,
      field: params[i],
      "code": "missing_field"
    });
  }
}
MissedParams.prototype = UbicallError.prototype;

function Forbidden(resource){
  this.name = "Forbidden";
  this.status = 403;
  this.response = {};
  this.response.message = "Bad credentials";
}
Forbidden.prototype = UbicallError.prototype;


function ServerError(resource){
  this.name = "Server Error";
  this.status = 500;
  this.response = {};
  this.response.message = "Unexpected Condition Was Encountered";
}
ServerError.prototype = UbicallError.prototype;


module.exports = {
  UbicallError: UbicallError,
  NotImplementedError: NotImplementedError,
  BadRequest: BadRequest,
  MissedParams: MissedParams,
  Forbidden : Forbidden,
  ServerError : ServerError
}
