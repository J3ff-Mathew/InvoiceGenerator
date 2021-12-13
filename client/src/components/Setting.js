import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Container, Form, FormControl, FormLabel, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { TextField, Input, InputAdornment, IconButton, InputLabel } from '@mui/material';
import axios from 'axios';


export default function Setting() {
    const navigate = useNavigate();
    const regexname = RegExp(/^[A-Za-z]{2,30}$/);
    const email = JSON.parse(localStorage.getItem('credentials')).email;
    const USER = axios.create({ baseURL: "http://localhost:8000" })
    const [error, setError] = useState({ name: '', fields: '', address: '' });
    const cNameInput = useRef(null);
    const cAddressInput = useRef(null);
    const [image, setImage] = useState("../logo192.png");
    const [show, setShow] = useState(false);
    useEffect(() => {
        renderData();
    }, [])
    async function renderData() {
        await USER.get(`/getData/${JSON.parse(localStorage.getItem('credentials')).email}`).then(res => {
            console.log(res.data);
            // const image1 = require(res.data.imgPath);
            let arr = res.data;
            localStorage.setItem('credentials', JSON.stringify(arr));
            cNameInput.current.value = res.data.companyName;
            cAddressInput.current.value = res.data.companyAddress;
            setImage(res.data.imgPath);
            document.getElementById('image').files = null;
        })
    }
    const validate = async () => {
        error.name = !regexname.test(cNameInput.current.value) ? "Name Fields should contain a minimum of 3 characters and should contain only alphabets" : "";
        error.address = cAddressInput.current.value.length < 20 ? "Address must be 20 character long" : '';
        setError({ ...error })
        if (error.name == "" && error.fields == "" && error.address == "") {
            updateUser();

        }
    }
    const updateUser = async () => {
        let data = new FormData();
        data.append('file', document.getElementById('image').files[0])
        data.append('companyAddress', cAddressInput.current.value)
        data.append('companyName', cNameInput.current.value)
        await USER.post(`/updateCompanyDetails/${JSON.parse(localStorage.getItem('credentials')).email}`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(res => {
            setError({ ...error, fields: res.data.error });
            if (res.data.error)
                setShow(true);
        })
        renderData();
    }
    return (
        <div >

            {show && <Alert id="alert" style={{ position: "absolute", top: "47%", height: "20%", width: "97%", textAlign: "center" }} variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                <p>
                    {error.fields}
                </p>
            </Alert>}

            <Form>
                <Row className='d-flex justify-content-center align-items-center'>
                    <img src={image} alt="" srcset="" style={{
                        height: '200px', width: '200px', borderRadius: "50%"
                    }} />  <Form.Group controlId="formBasicEmail" className='d-flex justify-content-center'>
                        <Button
                            className='mt-4 btn btn-primary'
                            variant="contained"
                            component="label"
                            style={{ width: '70%' }}

                        >
                            Update Company Logo
                            <input
                                id="image"
                                name="file"
                                type="file"
                                hidden
                            />
                        </Button>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className='mt-2' controlId="formBasicEmail">
                        <InputLabel>Enter Company Name</InputLabel>
                        <TextField id="standard-basic" style={{ width: '100%' }} label="" inputRef={cNameInput} variant="standard" />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Text className="text-danger">
                        {error.name}
                    </Form.Text>
                </Row>
                <Row>
                    <Form.Group controlId="formBasicEmail">
                        <InputLabel>Enter Company Address</InputLabel>
                        <TextField id="standard-basic" style={{ width: '100%' }} label="" inputRef={cAddressInput} variant="standard" />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Text className="text-danger">
                        {error.address}
                    </Form.Text>
                </Row>
                <Button className="mb-2" variant="contained" onClick={() => validate()}>Submit Company Profile</Button>
            </Form>
        </div >
    )
}
