import { HttpException, Logger } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { QueryFailedError } from "typeorm";
import { get } from 'lodash';

export class ControllerException extends ExceptionsHandler {
    private logger = new Logger(ControllerException.name)
    /**
     * Constructs a new instance of ModelException.
     * @param {any} error - The error object that was thrown.
     */
    constructor(error: any) {
        // Call the parent constructor passing the error object
        super(error);

        // The logger will print the error object as a JSON string
        this.logger.error(JSON.stringify(error));
    }
}