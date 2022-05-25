export {};
// /* eslint-disable prefer-const */
// import { common, objectstorage } from 'oci-sdk';
// import * as fs from 'fs';
// import path from 'path';
// import * as os from 'os';

// export const ociConfig = {
//     namespace: 'lra4ojegcvqn',
//     tenancy_ocid: 'ocid1.tenancy.oc1..aaaaaaaan5ouui4t3l5jmucw2ltyk6n3vj4hfnreycez466a4tdqhqxdisaa',
//     user_ocid: 'ocid1.user.oc1..aaaaaaaay5hzyz4tzwfnriamvfcosxkjedwcgzay7on2ujdghsod4xbpseaq',
//     fingerprint: 'da:a3:b4:43:f5:ff:91:ce:1e:cd:01:31:49:af:58:24',
//     region: 'uk-london-1',
// };

// const ociDefaultLocation = path.join(os.homedir(), '.oci');
// let provider: common.ConfigFileAuthenticationDetailsProvider;
// let client: objectstorage.ObjectStorageClient;

// export function getProvider(): common.ConfigFileAuthenticationDetailsProvider {
//     return provider;
// }

// export function getClient(): objectstorage.ObjectStorageClient {
//     return client;
// }

// // export function initProvider(): void {
// //     provider = new common.ConfigFileAuthenticationDetailsProvider();
// //     client = new objectstorage.ObjectStorageClient({
// //         authenticationDetailsProvider: provider,
// //     });
// // }

// // export function isKeyAvailable(): boolean {
// //     if (
// //         fs.existsSync(path.join(process.resourcesPath, 'app', 'resources', 'oci_api_key.pem')) &&
// //         fs.existsSync(path.join(process.resourcesPath, 'app', 'resources', 'config'))
// //     ) {
// //         return true;
// //     } else {
// //         return false;
// //     }
// // }

// // export async function createResources(key: string, config: string): Promise<void> {
// //     try {
// //         fs.writeFileSync(path.join(process.resourcesPath, 'app', 'resources', 'oci_api_key.pem'), key);
// //         fs.writeFileSync(path.join(process.resourcesPath, 'app', 'resources', 'config'), config);
// //     } catch (error: any) {
// //         // dialog.showErrorBox('Could not create configuration for storage', error.message);
// //         throw error;
// //     }
// // }

// // export function initProvider(): void {
// //     try {
// //         Verify if .oci folder is already present on the machine
// //         if (!fs.existsSync(ociDefaultLocation)) {
// //             //Create directory if not present and add required files
// //             fs.mkdirSync(ociDefaultLocation);
// //             copyFiles();
// //         } else {
// //             //Verify if all the required files are present
// //             if (
// //                 fs.existsSync(path.join(ociDefaultLocation, 'oci_api_key.pem')) &&
// //                 fs.existsSync(path.join(ociDefaultLocation, 'config'))
// //             ) {
// //                 //Load the config file
// //             } else {
// //                 copyFiles();
// //             }
// //         }
// //         provider = new common.ConfigFileAuthenticationDetailsProvider();
// //         client = new objectstorage.ObjectStorageClient({
// //             authenticationDetailsProvider: provider,
// //         });
// //     } catch (error: any) {
// //         // dialog.showErrorBox('Error', error.message);
// //         throw error;
// //     }
// // }

// // function copyFiles(): void {
// //     try {
// //         fs.copyFileSync(
// //             path.join(process.resourcesPath, 'app', 'resources', 'oci_api_key.pem'),
// //             path.join(ociDefaultLocation, 'oci_api_key.pem'),
// //         );
// //         fs.copyFileSync(
// //             path.join(process.resourcesPath, 'app', 'resources', 'config'),
// //             path.join(ociDefaultLocation, 'config'),
// //         );
// //         fs.appendFileSync(
// //             path.join(ociDefaultLocation, 'config'),
// //             `\nkey_file=${ociDefaultLocation}/oci_api_key.pem\n`,
// //         );
// //     } catch (error: any) {
// //         // dialog.showErrorBox('Could not copy configuration', error.message);
// //         throw error;
// //     }
// // }
