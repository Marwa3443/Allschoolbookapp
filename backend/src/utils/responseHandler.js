import { HTTP_STATUS } from '../config/constants.js';

export class SuccessResponse {
  constructor(message = 'Success', data = null, statusCode = HTTP_STATUS.OK) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res) {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export class ErrorResponse {
  constructor(message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }

  send(res) {
    res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      errors: this.errors,
    });
  }
}

export const sendSuccess = (res, message, data = null, statusCode = HTTP_STATUS.OK) => {
  new SuccessResponse(message, data, statusCode).send(res);
};

export const sendError = (res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  new ErrorResponse(message, statusCode, errors).send(res);
};
