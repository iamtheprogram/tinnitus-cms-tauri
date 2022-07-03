use base64::encode;
use httpdate::fmt_http_date;
use reqwest::header::{HeaderMap, HeaderValue};
use ring::{rand, signature, signature::RsaKeyPair};
use sha2::{Digest, Sha256};
use std::{collections::HashMap, str::FromStr, time::SystemTime};
use tauri::http::Uri;

use crate::oci::provider::STORE;

pub struct HttpService {
    pub uri: Uri,
    pub headers_to_sign: HashMap<String, String>,
    pub headers: HeaderMap<HeaderValue>,
    pub method: String,
}

impl HttpService {
    pub fn new(uri_string: String) -> Self {
        let uri = Uri::from_str(&uri_string).unwrap();
        let headers_to_sign: HashMap<String, String> = HashMap::new();
        let headers = HeaderMap::new();
        Self {
            uri,
            headers_to_sign,
            headers,
            method: "".to_string(),
        }
    }

    pub fn generate_request_post(
        &mut self,
        data: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.method = "POST".to_string();
        //Append headers to the request
        self.append_headers("POST".to_string(), Some(&data))
            .unwrap();
        //Create signature
        let signature = self.generate_signature().unwrap();
        //Create authorization header
        self.set_auth_header(&signature).unwrap();
        //Append body if exists

        Ok(())
    }

    #[allow(unused)]
    pub fn generate_request_get(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        self.method = "GET".to_string();
        //Append headers
        self.append_headers("GET".to_string(), None).unwrap();
        //Create signature
        let signature = self.generate_signature().unwrap();
        //Create authorization header
        self.set_auth_header(&signature).unwrap();

        Ok(())
    }

    fn append_headers(
        &mut self,
        method: String,
        data: Option<&String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let uri_host = self.uri.host().unwrap();

        self.headers
            .append("host", HeaderValue::from_str(uri_host).unwrap());
        self.headers_to_sign
            .insert("host".to_string(), uri_host.to_string());

        let date = fmt_http_date(SystemTime::now());
        self.headers
            .append("Date", HeaderValue::from_str(&date).unwrap());
        self.headers_to_sign
            .insert("date".to_string(), date.clone());

        // let x_date = Utc::now().to_rfc2822();
        self.headers
            .append("x-date", HeaderValue::from_str(&date).unwrap());
        self.headers_to_sign.insert("x-date".to_string(), date);

        if method == "PUT" || method == "POST" {
            if let Some(data) = data {
                //It has body so it's a POST/PUT request
                let mut hasher = Sha256::new();
                hasher.update(Some(data).unwrap().as_bytes());
                //Hash as vector uf UTF-8 bytes
                let result = hasher.finalize().to_vec();
                //Hash as base64 string
                let hash_result = encode(&result);

                self.headers.append(
                    "x-content-sha256",
                    HeaderValue::from_str(&hash_result).unwrap(),
                );
                self.headers_to_sign
                    .insert("x-content-sha256".to_string(), hash_result);

                self.headers
                    .append("Content-type", HeaderValue::from_static("application/json"));
                self.headers_to_sign
                    .insert("ontent-type".to_string(), "application/json".to_string());

                self.headers.append(
                    "Content-length",
                    HeaderValue::from_str(&format!("{}", data.len())).unwrap(),
                );
                self.headers_to_sign
                    .insert("ontent-length".to_string(), format!("{}", data.len()));
            }
        }

        Ok(())
    }

    fn generate_signature(&self) -> Result<String, Box<dyn std::error::Error>> {
        let method = &self.method;
        let target = self.uri.path();
        let mut string_to_sign: String = "".to_string();

        //Build string to sign
        string_to_sign.push_str(format!("(request-target): {} {}\n", &method, &target).as_str());
        for (key, value) in &self.headers_to_sign {
            string_to_sign.push_str(format!("{}: {}\n", &key, &String::from(value)).as_str());
        }
        //Remove last newline
        string_to_sign.pop();

        //Get key from store
        let key: Vec<u8> = STORE.get("key").unwrap().unwrap();
        let rng = rand::SystemRandom::new();
        //Create signature with rsa-sha256
        let key_pair = RsaKeyPair::from_pkcs8(key.as_slice()).unwrap();
        // The output buffer is one byte too short.
        let mut signature = vec![0; key_pair.public_modulus_len()];
        //Sign the payload with RSA-SHA256
        key_pair
            .sign(
                &signature::RSA_PKCS1_SHA256,
                &rng,
                string_to_sign.as_bytes(),
                &mut signature,
            )
            .unwrap();

        //Convert signature to base64
        let signature = encode(&signature);

        Ok(signature)
    }

    fn set_auth_header(&mut self, signature: &str) -> Result<(), Box<dyn std::error::Error>> {
        //Get key id from store
        let key_id: String = STORE.get("key_id").unwrap().unwrap();
        let mut auth_header = String::new();
        auth_header.push_str(r#"Signature version="1","#);
        auth_header.push_str(r#"keyId=""#);
        auth_header.push_str(key_id.as_str());
        auth_header.push_str(r#"","#);
        auth_header.push_str(r#"algorithm="rsa-sha256","#);
        let mut headers_string = String::new();
        for key in &self.headers_to_sign {
            headers_string.push_str(format!("{:?} ", &key).as_str());
        }
        //Remove last white space
        headers_string.pop();
        auth_header.push_str(r#"headers="(request-target) "#);
        auth_header.push_str(headers_string.as_str());
        auth_header.push_str(r#"","#);
        auth_header.push_str(r#"signature=""#);
        auth_header.push_str(signature);
        auth_header.push_str(r#"""#);
        //Append auth header
        self.headers.append(
            "Authorization",
            HeaderValue::from_str(&auth_header).unwrap(),
        );

        println!("{:?}", self.headers);

        Ok(())
    }
}
