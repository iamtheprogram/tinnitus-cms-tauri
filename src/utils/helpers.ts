import { DefaultRequestSigner, HttpRequest } from 'oci-common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Err {
    code: number;
    message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    clone(): Err {
        return new Err(this.code, this.message);
    }
}

export const ResponseCodes = new Map([
    [200, 'Cererea a fost efectuata cu succes.'],
    [201, 'Resursa a fost creata.'],
    [202, 'Cererea a fost acceptata si urmeaza sa fie procesata.'],
    [400, 'Cererea trimisa este invalida.'],
    [401, 'Nu esti autorizat in sistem.'],
    [403, 'Nu ai drepturi pentru a accesa resursa ceruta.'],
    [404, 'Resursa sau serviciul cerut nu este disponibil sau nu exista.'],
    [405, 'Metoda pentru aceasta cerere nu este permisa.'],
    [408, 'Timpul de asteptare pentru cererea trimisa a expirat.'],
    [413, 'Cererea trimisa are o dimensiune prea mare.'],
    [415, 'Formatul multimedia nu este suportat.'],
    [500, 'A intervenit o eroare interna in server.'],
    [501, 'Metoda cererii trimisa nu este suportata de catre acest server.'],
    [503, 'Serviciul cerut nu este disponibil. Serverul este in mentenanta sau indisponibil in momentul de fata.'],
    [507, 'Serverul nu mai are spatiu de stocare suficient pentru a inregistra resursa dorita.'],
]);

export const MonthsMap = new Map([
    ['Ianuarie', { number: 1, text: 'jan' }],
    ['Februarie', { number: 2, text: 'feb' }],
    ['Martie', { number: 3, text: 'mar' }],
    ['Aprilie', { number: 4, text: 'apr' }],
    ['Mai', { number: 5, text: 'may' }],
    ['Iunie', { number: 6, text: 'jun' }],
    ['Iulie', { number: 7, text: 'jul' }],
    ['August', { number: 8, text: 'aug' }],
    ['Septembrie', { number: 9, text: 'sep' }],
    ['Octombrie', { number: 10, text: 'oct' }],
    ['Noiembrie', { number: 11, text: 'nov' }],
    ['Decembrie', { number: 12, text: 'dec' }],
]);

export function calculateSeconds(seconds: number, minutes: number, hours: number): number {
    return seconds + minutes * 60 + hours * 3600;
}

export function getDurationFormat(duration: number): string {
    //Calculate duration in HH:MM:SS format
    const hours = Math.floor(duration / 3600);
    const hoursRemSec = duration - hours * 3600;
    const minutes = Math.floor(hoursRemSec / 60);
    const seconds = hoursRemSec - minutes * 60;
    let retVal = '';

    if (hours < 10) {
        retVal += '0';
    }
    retVal += `${hours}:`;
    if (minutes < 10) {
        retVal += '0';
    }
    retVal += `${minutes}:`;
    if (seconds < 10) {
        retVal += '0';
    }
    retVal += `${Math.round(seconds)}`;

    return retVal;
}

export function parseTags(type: string, params: any): any {
    if (type === 'string') {
        let retVal = '';
        for (const item of params) {
            retVal += item + ' ';
        }
        return retVal;
    } else if (type === 'array') {
        const retVal = new Array<string>();
        const hashIndexes = new Array<number>();

        //Get indexes of all hash characters
        for (let i = 0; i < params.length; i++) {
            if (params[i] === '#') {
                hashIndexes.push(i);
            }
        }
        //Extract hash tags
        for (let i = 0; i < hashIndexes.length - 1; i++) {
            for (let j = hashIndexes[i] + 1; j < params.length; j++) {
                if (params[j] === '#') {
                    retVal.push(params.slice(hashIndexes[i], j).trim());
                    break;
                }
            }
        }
        //Last hash tag goes until the eng of string
        retVal.push(params.slice(hashIndexes[hashIndexes.length - 1]).trim());
        return retVal;
    } else {
        return params;
    }
}

// const userID = 'Add User OCID here';
// (async () => {
//     // 1. Create Request Signing instance
//     const signer = new DefaultRequestSigner(provider);

//     // 2. Create HttpRequest to be signed
//     const httpRequest: HttpRequest = {
//         uri: `https://identity.us-phoenix-1.oraclecloud.com/20160918/users/${userID}`,
//         headers: new Headers(),
//         method: 'GET',
//     };

//     // 3. sign request
//     await signer.signHttpRequest(httpRequest);

//     // 4. Make the call
//     const response = await fetch(
//         new Request(httpRequest.uri, {
//             method: httpRequest.method,
//             headers: httpRequest.headers,
//             body: httpRequest.body,
//         }),
//     );
//     // 5. Print response
//     console.log(await response.json());
// })();
