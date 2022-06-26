import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import logo from '@src/icons/logo.png';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { app, db } from '@config/firebase';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getBlob } from 'firebase/storage';
import { useLoading } from '@pages/loading/loading';
import { invoke } from '@tauri-apps/api/tauri';
import { dialog } from '@tauri-apps/api';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [admin, setAdmin] = useState('');
    const [passw, setPassw] = useState('');
    const [adminInvalid, setAdminInvalid] = useState('');
    const [passwInvalid, setPasswInvalid] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app);
    const { appendLoading, removeLoading } = useLoading();

    async function AuthAdmin(): Promise<void> {
        let isValid = 0;

        if (admin === '') {
            setAdminInvalid('Field must not be empty');
            isValid++;
        } else {
            setAdminInvalid('');
        }

        if (passw === '') {
            setPasswInvalid('Field must not be empty');
            isValid++;
        } else {
            setPasswInvalid('');
        }

        if (isValid === 0) {
            //Send authentication request
            try {
                await setPersistence(auth, browserSessionPersistence);
                //Login in firebase
                await signInWithEmailAndPassword(getAuth(), admin, passw);
                dispatch({
                    type: 'general/auth',
                    payload: getAuth().currentUser!.uid,
                });
                //Show loading screen
                appendLoading();
                //Get config from db
                await fetchConfig();
                //Get config files
                // await getConfigFromStorage();
                //Init OCI client provider
                removeLoading();
                setAdmin('');
                setPassw('');
                navigate('/');
            } catch (error: any) {
                //Handle error and display message
                setAdmin('');
                setPassw('');
                dialog.message(error.message);
                removeLoading();
            }
        } else {
            /*Do nothing*/
        }
    }

    async function fetchConfig(): Promise<void> {
        try {
            //Retrieve oci configuration from database
            let docSnap = await getDoc(doc(db, 'misc', 'config'));
            const ociConfig = docSnap.data()!;
            //Fetch key file
            const storage = getStorage();
            const keyRef = ref(storage, 'oci_api_key.pem');
            const keyFile = await getBlob(keyRef);
            docSnap = await getDoc(doc(db, 'misc', 'admin'));
            //OCI services are handled by backend
            const result = (await invoke('set_oci_credentials', {
                user: ociConfig.oci_id,
                tenancy: ociConfig.oci_tenancy,
                fingerprint: ociConfig.oci_fingerprint,
                namespace: ociConfig.oci_namespace,
                preauthreq: docSnap.data()!.preauthreq,
                key: await keyFile.text(),
                keyId: `${ociConfig.oci_tenancy}/${ociConfig.oci_id}/${ociConfig.oci_fingerprint}`,
            })) as string;
            if (result !== 'OK') {
                throw new Error(result);
            }
            //Store prerequested config in redux
            dispatch({
                type: 'oci/config',
                payload: {
                    prereq: ociConfig.oci_prereq,
                },
            });
            //Storeconfiguration data and misc
            await fetchCategories();
        } catch (error) {
            throw error;
        }
    }

    async function fetchCategories(): Promise<void> {
        try {
            let docSnap = await getDoc(doc(db, 'misc', 'albums'));
            let data = docSnap.data()!;
            dispatch({
                type: 'album/categories',
                payload: data.categories,
            });
            docSnap = await getDoc(doc(db, 'misc', 'samples'));
            data = docSnap.data()!;
            dispatch({
                type: 'sample/categories',
                payload: data.categories,
            });
            docSnap = await getDoc(doc(db, 'misc', 'presets'));
            data = docSnap.data()!;
            dispatch({
                type: 'preset/categories',
                payload: data.categories,
            });
        } catch (error) {
            throw error;
        }
    }

    return (
        <div className="PageLogin">
            <img src={logo} className="LogoLogin" />
            <Form noValidate className="LoginForm">
                <div className="InputSection" style={{ height: '55px' }}>
                    <InputGroup className="InputGroupPath" hasValidation>
                        <FormControl
                            required
                            placeholder="email"
                            className="LoginInput"
                            value={admin}
                            onChange={(e: any): void => {
                                setAdmin(e.target.value);
                                setAdminInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="InvalidRed" style={{ marginTop: '2px' }}>
                        {adminInvalid}
                    </p>
                </div>
                <div className="InputSection" style={{ height: '55px' }}>
                    <InputGroup className="InputGroupPath" hasValidation>
                        <FormControl
                            required
                            type="password"
                            placeholder="password"
                            className="LoginInput"
                            value={passw}
                            onChange={(e: any): void => {
                                setPassw(e.target.value);
                                setPasswInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="InvalidRed" style={{ marginTop: '2px' }}>
                        {passwInvalid}
                    </p>
                </div>
                <Button onClick={AuthAdmin} className="LoginBtn">
                    Login
                </Button>
            </Form>
            <p className="Copyright">© 2022 Tinnitus Sounds</p>
        </div>
    );
};

export default Login;
