use crate::oci::provider::STORE;
use crate::utils::http_utils::HttpService;
use reqwest::Client;
use serde::{Deserialize, Serialize};
#[allow(unused)]
pub struct ObjectStorage {
    user: String,
    tenancy: String,
    fingerprint: String,
    namespace: String,
    preauthreq: String,
}

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Debug, Serialize, Deserialize)]
pub struct SongData {
    pub file: String,
    pub extension: String,
    pub name: String,
    pub duration: i64,
}

impl SongData {
    pub fn new(file: String, extension: String, name: String, duration: i64) -> SongData {
        SongData {
            file,
            extension,
            name,
            duration,
        }
    }
}

#[allow(unused)]
impl ObjectStorage {
    pub fn new() -> Self {
        let user: String = STORE.get("user").unwrap().unwrap();
        let tenancy: String = STORE.get("tenancy").unwrap().unwrap();
        let fingerprint: String = STORE.get("fingerprint").unwrap().unwrap();
        let namespace: String = STORE.get("namespace").unwrap().unwrap();
        let preauthreq: String = STORE.get("preauthreq").unwrap().unwrap();
        Self {
            user,
            tenancy,
            fingerprint,
            namespace,
            preauthreq,
        }
    }

    pub async fn get_object(
        &self,
        bucket: &str,
        object_path: &str,
        object_name: &str,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        let endpoint = object_path.to_string();
        //Generate signed request for GET album
        let http_service = HttpService::new(endpoint);
        // http_service.generate_request_get()?;
        //Create http client to send request
        let client = Client::new();
        let response = client.get(http_service.uri.to_string()).send().await?;
        // let body = response.text().await?;
        match response.error_for_status() {
            Err(e) => Err(Box::new(e)),
            Ok(_) => Ok("OK".to_string()),
        }
    }

    pub async fn put_object(
        &self,
        bucket: &str,
        object_path: &str,
        object_name: &str,
        data: Vec<u8>,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        let endpoint = object_path.to_string();
        //Create http client to send request
        let client = Client::new();
        let response = client.put(endpoint).body(data).send().await?;
        match response.error_for_status() {
            Err(e) => Err(Box::new(e)),
            Ok(_) => Ok("OK".to_string()),
        }
    }

    pub async fn put_object_multipart(
        &self,
        bucket: &str,
        object_path: &str,
        object_name: &str,
        data: Vec<u8>,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        Ok("OK".to_string())
    }

    pub async fn delete_object(
        &self,
        bucket: &str,
        object_path: &str,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let endpoint = object_path.to_string();
        let client = Client::new();
        let response = client.delete(endpoint).send().await?;

        Ok(())
    }

    fn list_objects(&self, bucket: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        todo!()
    }

    fn list_buckets(&self) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        todo!()
    }

    fn create_bucket(&self, bucket: &str) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }

    fn delete_bucket(&self, bucket: &str) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }

    fn get_bucket_location(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>> {
        todo!()
    }

    fn get_bucket_acl(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>> {
        todo!()
    }

    fn set_bucket_acl(&self, bucket: &str, acl: &str) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }

    fn get_bucket_policy(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>> {
        todo!()
    }

    fn set_bucket_policy(
        &self,
        bucket: &str,
        policy: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }

    fn get_bucket_cors(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>> {
        todo!()
    }

    fn set_bucket_cors(&self, bucket: &str, cors: &str) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }

    fn get_bucket_lifecycle(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>> {
        todo!()
    }

    fn set_bucket_lifecycle(
        &self,
        bucket: &str,
        lifecycle: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        todo!()
    }
}

// #[allow(unused)]
// #[cfg(test)]
// mod tests {
//     use super::albums_utils::AlbumsService;
//     use crate::oci_provider::oci_provider::*;

//     #[test]
//     fn generate_request_post_test() {
//         let service = AlbumsService::new();
//     }
// }
