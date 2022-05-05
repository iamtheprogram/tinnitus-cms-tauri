import { UploadAlbumSong, UploadAlbumArtwork, DeleteAlbum } from '../types/album';
import * as fs from 'fs';
import { objectstorage } from 'oci-sdk';
import { getClient, ociConfig } from '../config/oci';

const MULTIPART_UPLOAD_MIN_SIZE = 50000000;
const MULTIPART_UPLOAD_CHUNK_SIZE = 5000000;

export async function uploadAlbumSong(id: string, song: UploadAlbumSong): Promise<any> {
    try {
        const client = getClient();
        const data = fs.readFileSync(song.filePath);
        const putObjectRequest: objectstorage.requests.PutObjectRequest = {
            namespaceName: ociConfig.namespace,
            bucketName: 'tinnitus',
            objectName: `albums/${id}/${song.name}.${song.extension}`,
            contentLength: data.length,
            putObjectBody: data,
            contentType: `audio/${song.extension}`,
        };
        //Depending on size the uploading process will differ
        if (data.length > MULTIPART_UPLOAD_MIN_SIZE) {
            //Use upload multipart if file is bigger than 50MB
            //Aquire an upload id
            const createMultipartUploadDetails = {
                object: `albums/${id}/${song.name}.${song.extension}`,
                contentType: `audio/${song.extension}`,
            };
            const createMultipartUploadRequest: objectstorage.requests.CreateMultipartUploadRequest = {
                namespaceName: ociConfig.namespace,
                bucketName: 'tinnitus',
                createMultipartUploadDetails: createMultipartUploadDetails,
            };
            const createMultipartUploadResponse = await client.createMultipartUpload(createMultipartUploadRequest);
            const multipartUpload = createMultipartUploadResponse.multipartUpload;
            //Upload the file in chunks
            const partsToCommit = [];
            let bufferPointer = 0;
            let remainingBytes = data.length;
            let partNumber = 1;
            while (remainingBytes > 0) {
                const bytesToUpload =
                    remainingBytes < MULTIPART_UPLOAD_CHUNK_SIZE ? remainingBytes : MULTIPART_UPLOAD_CHUNK_SIZE;
                // Create a request and dependent object(s).
                const uploadPartRequest: objectstorage.requests.UploadPartRequest = {
                    namespaceName: ociConfig.namespace,
                    bucketName: 'tinnitus',
                    objectName: multipartUpload.object,
                    uploadId: multipartUpload.uploadId,
                    uploadPartNum: partNumber,
                    uploadPartBody: data.slice(bufferPointer, bufferPointer + bytesToUpload),
                };
                // Send request to the Client.
                const res = await client.uploadPart(uploadPartRequest);
                partsToCommit.push({ partNum: partNumber, etag: res.eTag });
                bufferPointer += bytesToUpload;
                remainingBytes -= bytesToUpload;
                partNumber++;
            }

            // Commit the uploaded parts
            const commitMultipartUploadDetails = {
                partsToCommit: partsToCommit,
            };
            const commitMultipartUploadRequest: objectstorage.requests.CommitMultipartUploadRequest = {
                namespaceName: ociConfig.namespace,
                bucketName: 'tinnitus',
                objectName: multipartUpload.object,
                uploadId: multipartUpload.uploadId,
                commitMultipartUploadDetails: commitMultipartUploadDetails,
            };
            // Send request to the Client.
            await client.commitMultipartUpload(commitMultipartUploadRequest);
            return `Album song ${song.name} uploaded`;
        } else {
            //Upload from one shot
            await client.putObject(putObjectRequest);
            return `Album song ${song.name} uploaded`;
        }
    } catch (error: any) {
        throw error;
    }
}

export async function uploadAlbumArtwork(id: string, artwork: UploadAlbumArtwork): Promise<any> {
    try {
        const client = getClient();
        const data = fs.readFileSync(artwork.filePath);
        const putObjectRequest: objectstorage.requests.PutObjectRequest = {
            namespaceName: ociConfig.namespace,
            bucketName: 'tinnitus',
            objectName: `albums/${artwork.album}/artwork.${artwork.extension}`,
            contentLength: data.length,
            putObjectBody: data,
            contentType: `image/${artwork.extension}`,
        };
        //Upload artwork to OCI storage
        await client.putObject(putObjectRequest);
        return 'Album cover art uploaded';
    } catch (error: any) {
        throw error;
    }
}

export async function deleteAlbum(id: string, album: DeleteAlbum): Promise<any> {
    const client = getClient();
    for (const file of album.files) {
        //Delete every song from album
        const deleteObjectRequest: objectstorage.requests.DeleteObjectRequest = {
            namespaceName: ociConfig.namespace,
            bucketName: 'tinnitus',
            objectName: `albums/${id}/${file}`,
        };
        //Delete album from OCI storage
        await client.deleteObject(deleteObjectRequest);
    }
    return 'Album deleted';
}
