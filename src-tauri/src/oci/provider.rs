use lazy_static::lazy_static;
use microkv::MicroKV;

lazy_static! {
    pub static ref STORE: MicroKV = MicroKV::new("oci");
}

pub struct OciProvider {
    pub user: String,
    pub tenancy: String,
    pub fingerprint: String,
    pub namespace: String,
    pub preauthreq: String,
    pub key: String,
    pub key_id: String,
}

impl OciProvider {
    pub fn new(
        user: String,
        tenancy: String,
        fingerprint: String,
        namespace: String,
        preauthreq: String,
        key: String,
        key_id: String,
    ) -> Self {
        Self {
            user,
            tenancy,
            fingerprint,
            namespace,
            preauthreq,
            key,
            key_id,
        }
    }
}

pub fn init_provider(provider: OciProvider) -> Result<(), Box<dyn std::error::Error>> {
    STORE.put("user", &provider.user)?;
    STORE.put("tenancy", &provider.tenancy)?;
    STORE.put("fingerprint", &provider.fingerprint)?;
    STORE.put("namespace", &provider.namespace)?;
    STORE.put("preauthreq", &provider.preauthreq)?;
    // let pem = parse(provider.key).unwrap().contents;
    // STORE.put("key".to_string(), &pem)?;
    // STORE.put("key_id".to_string(), &provider.key_id)?;

    let user: Option<String> = STORE.get("user")?;
    assert_eq!(user.unwrap(), provider.user);
    let tenancy: Option<String> = STORE.get("tenancy")?;
    assert_eq!(tenancy.unwrap(), provider.tenancy);
    let fingerprint: Option<String> = STORE.get("fingerprint")?;
    assert_eq!(fingerprint.unwrap(), provider.fingerprint);
    let namespace: Option<String> = STORE.get("namespace")?;
    assert_eq!(namespace.unwrap(), provider.namespace);
    // let key: Option<String> = STORE.get("key".to_string())?;
    // assert_eq!(key.unwrap(), pem_string);
    // let key_id: Option<String> = STORE.get("key_id".to_string())?;
    // assert_eq!(key_id.unwrap(), provider.key_id);

    Ok(())
}

/*
pub fn check_files() -> bool {
    let home: String = home_dir().unwrap().to_str().unwrap().to_owned();
    let oci_api_key_path: String =
        format!("{}{}", home, &String::from("/.oci/oci_api_key.pem"));
    let oci_config_path: String = format!("{}{}", home, &String::from("/.oci/config"));

    if Path::new(&oci_api_key_path).exists() && Path::new(&oci_config_path).exists() {
        true
    } else {
        false
    }
}

pub fn write_oci_config_files(
    config: String,
    key: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let home: String = home_dir().unwrap().to_str().unwrap().to_owned();
    let oci_api_key_path: String =
        format!("{}{}", home, &String::from("/.oci/oci_api_key.pem"));
    let oci_config_path: String = format!("{}{}", home, &String::from("/.oci/config"));

    //Write key
    let mut key_file = fs::File::create(&oci_api_key_path)?;
    key_file.write_fmt(format_args!("{}", key))?;
    //Write OCI provider config file
    let mut config_file = fs::File::create(&oci_config_path)?;
    config_file.write_fmt(format_args!("{}", config))?;

    Ok(())
}
*/

/*
pub fn read_key() -> Result<String, Box<dyn std::error::Error>> {
    let home: String = home_dir().unwrap().to_str().unwrap().to_owned();
    let oci_api_key_path: String =
        format!("{}{}", home, &String::from("/.oci/oci_api_key.pem"));

    let key_file = fs::read_to_string(&oci_api_key_path)?;
    Ok(key_file)
}
*/

#[cfg(test)]
mod tests {
    //use crate::oci_provider::oci_provider;

    /*
    #[test]
    fn check_files_test() {
        assert_eq!(true, oci_provider::check_files());
    }

    #[test]
    fn write_oci_config_files_test() {
        let result = oci_provider::write_oci_config_files("aaaa".to_string(), "bbbb".to_string());
        print!("{:?}", result);
        assert_eq!(true, result.is_ok());
    }

    #[test]
    fn init_provider_test() {
        let mut provider = oci_provider::OciProvider::new(
            "aaaa".to_string(),
            "bbbb".to_string(),
            "cccc".to_string(),
            "dddd".to_string(),
            oci_provider::read_key().unwrap(),
            "key_id".to_string(),
        );
        let key_id = format!(
            "{}/{}/{}",
            &provider.tenancy, &provider.user, &provider.fingerprint
        );
        provider.key_id = key_id;
        assert_eq!(true, oci_provider::init_provider(&provider).is_ok());
    }
    */
}
