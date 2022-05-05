export default class ErrorHandler {
    /**
     *
     * @param error
     * @returns
     */
    static getErrorType(error: any): any {
        let retVal: any = {};

        if (error.message === 'timeout') {
            //! Wait time for response was depleted
            retVal = this.#resolveTimeoutErr();
        } else if (error.response !== undefined) {
            if (typeof error.response.data.message === 'string') {
                //* Response format is correct
                this.#resolveResponseErr(error);
                retVal = error.response.data.message;
            } else {
                //! Reject because response format is invalid
                retVal = error.message;
            }
        } else {
            //! Undefined error
            retVal = error;
        }

        return retVal;
    }

    /**
     *
     * @returns
     */
    static #resolveTimeoutErr(): string {
        return 'Serverul intarzie sa raspunda. Tranzactie inchisa.';
    }

    /**
     *
     * @param error
     */
    static #resolveResponseErr(error: any): void {
        switch (error.response.status) {
            case 401: {
                //* Request new token in case of expiration error
                if (error.response.data.message === 'jwt expired') {
                    //Explicit user message
                    error.response.data.message = 'Tokenul a expirat si a fost inlocuit automat cu unul nou.';
                    //Reqeust new token
                }
                break;
            }
        }
    }
}
