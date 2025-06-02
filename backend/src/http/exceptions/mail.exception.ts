import { Logger } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

export class MailException extends ExceptionsHandler {
    private logger = new Logger(MailException.name)
    /**
     * Constructs a new instance of ModelException.
     * @param {any} error - The error object that was thrown.
     */
    constructor(error: any) {
        // Call the parent constructor passing the error object
        super(error);

        // Log the error object with the logger
        // The logger will print the error object as a JSON string
        this.logger.error(JSON.stringify(error));
    }
}