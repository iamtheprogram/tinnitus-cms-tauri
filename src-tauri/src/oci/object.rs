pub mod oci_obj_storage {
    use async_trait::async_trait;

    #[async_trait]
    pub trait OciObjectStorageServices {
        async fn get_object(
            &self,
            bucket: &str,
            object_path: &str,
            object_name: &str,
        ) -> Result<String, Box<dyn std::error::Error + Send + Sync>>;

        async fn put_object(
            &self,
            bucket: &str,
            object_path: &str,
            object_name: &str,
            data: Vec<u8>,
        ) -> Result<String, Box<dyn std::error::Error + Send + Sync>>;

        async fn put_object_multipart(
            &self,
            bucket: &str,
            object_path: &str,
            object_name: &str,
            data: Vec<u8>,
        ) -> Result<String, Box<dyn std::error::Error + Send + Sync>>;

        async fn delete_object(
            &self,
            bucket: &str,
            object: &str,
        ) -> Result<(), Box<dyn std::error::Error + Send + Sync>>;

        fn list_objects(&self, bucket: &str) -> Result<Vec<String>, Box<dyn std::error::Error>>;

        fn list_buckets(&self) -> Result<Vec<String>, Box<dyn std::error::Error>>;

        fn create_bucket(&self, bucket: &str) -> Result<(), Box<dyn std::error::Error>>;

        fn delete_bucket(&self, bucket: &str) -> Result<(), Box<dyn std::error::Error>>;

        fn get_bucket_location(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>>;

        fn get_bucket_acl(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>>;

        fn set_bucket_acl(&self, bucket: &str, acl: &str)
            -> Result<(), Box<dyn std::error::Error>>;

        fn get_bucket_policy(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>>;

        fn set_bucket_policy(
            &self,
            bucket: &str,
            policy: &str,
        ) -> Result<(), Box<dyn std::error::Error>>;

        fn get_bucket_cors(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>>;

        fn set_bucket_cors(
            &self,
            bucket: &str,
            cors: &str,
        ) -> Result<(), Box<dyn std::error::Error>>;

        fn get_bucket_lifecycle(&self, bucket: &str) -> Result<String, Box<dyn std::error::Error>>;

        fn set_bucket_lifecycle(
            &self,
            bucket: &str,
            lifecycle: &str,
        ) -> Result<(), Box<dyn std::error::Error>>;
    }
}
