import { Logger, NotFoundException } from "@nestjs/common";
import { TypeORMError } from "typeorm";

export class ModelException extends TypeORMError {
    private logger = new Logger(ModelException.name);
    /**
     * Constructs a new instance of the ModelException class.
     *
     * @param {any} error - The error object that occurred.
     */
    constructor(error: any) {
        super(error);
        // Log the error object as a stringified JSON.
        // This is useful for debugging purposes.
        this.logger.error(JSON.stringify(error.message));
    }
}