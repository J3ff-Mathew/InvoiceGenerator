
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import { Container, Form, FormControl, FormLabel, Row, Col, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router';
import Button from '@mui/material/Button';
import { TextField, Input, InputAdornment, IconButton, InputLabel } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'

export default function Registration() {

    const USER = axios.create({ baseURL: 'http://localhost:8000/adduser' });
    const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const regexname = RegExp(/^[A-Za-z]{2,30}$/);
    const regForPhone = RegExp(/^[7-9][0-9]{9}$/);
    const regexpass = RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{8,}");
    const [pflag, setFlag] = useState(0);
    const [error, setError] = useState({ name: '', email: '', cpass: '', pass: '', fields: '', phone: '', address: '' });
    const [show, setShow] = useState(false);
    const [viewpass1, setViewpass1] = useState(false);
    const [viewpass2, setViewpass2] = useState(false);
    const fNameInput = useRef(null);
    const lNameInput = useRef(null);
    const cNameInput = useRef(null);
    const cAddressInput = useRef(null);
    const phoneInput = useRef(null);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const cPassInput = useRef(null);
    function validate() {
        if (fNameInput.current.value == '' || lNameInput.current.value == '' || emailInput.current.value == '' || passInput.current.value == '' || cPassInput.current.value == '' || phoneInput.current.value == '') {
            setError({ ...error, fields: 'All fields are necessary' });
            setShow(true);
        }
        else {
            error.fields = '';
            error.name = (!regexname.test(fNameInput.current.value) || !regexname.test(lNameInput.current.value) || !regexname.test(cNameInput.current.value)) ? "Name Fields should contain a minimum of 3 characters and should contain only alphabets" : "";
            error.address = cAddressInput.current.value.length < 20 ? "Address must be 20 character long" : '';
            error.email = (!regForEmail.test(emailInput.current.value)) ? "Enter valid email" : "";
            error.pass = (!regexpass.test(passInput.current.value)) ? error.pass = "Password should must have atlesr 8 characters be Alphanumeric and contain 1 uppercase & 1 lowercase with a special char" : "";
            error.cpass = (passInput.current.value != cPassInput.current.value) ? "Password and confirm password must be same" : "";
            error.phone = (!regForPhone.test(phoneInput.current.value)) ? "Enter valid Phone No" : "";
            setError({ ...error })
            if (error.name == "" && error.email == "" && error.cpass == "" && error.pass == "" && error.fields == "" && error.address == "" && error.phone == "") {
                addUser();

            }
        }
    }
    async function addUser() {
        let data = new FormData();
        data.append('file', document.getElementById('image').files[0])
        data.append('email', emailInput.current.value)
        data.append('companyAddress', cAddressInput.current.value)
        data.append('companyName', cNameInput.current.value)
        data.append('password', passInput.current.value)
        data.append('name', `${fNameInput.current.value} ${lNameInput.current.value}`)
        data.append('phone', phoneInput.current.value)
        console.log(document.getElementById('image').files[0])

        await USER.post(``, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(res => {
            setError({ ...error, fields: res.data.error });
            if (res.data.error)
                setShow(true);
            else {
                fNameInput.current.value = '';
                lNameInput.current.value = '';
                passInput.current.value = '';
                emailInput.current.value = '';
                phoneInput.current.value = '';
                cPassInput.current.value = '';

                setFlag(1);
            }
        })

    }
    return (
        <div id="formpage">
            <header id="main-header">
                <section className='d-flex align-items-center'>
                    <img src="./images/icon-512.png" alt="IniGenify_logo" style={{ borderRadius: '50%' }} />
                    <h1>IniGenify</h1>
                </section>
            </header>
            {show && <Alert id="alert" variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! You some an error!</Alert.Heading>
                <p>
                    {error.fields}
                </p>
            </Alert>}
            <Container style={{ marginTop: "10%" }} >

                <Row >
                    <Col>
                        <Form encType='multipart/form-data'>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formBasicEmail">
                                        <TextField id="standard-basic" style={{ width: '100%' }} label="Enter first name" inputRef={fNameInput} variant="standard" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formBasicEmail">
                                        <TextField id="standard-basic" style={{ width: '100%' }} label="Enter Last name" inputRef={lNameInput} variant="standard" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Group className='mt-2' controlId="formBasicEmail">
                                    <TextField id="standard-basic" style={{ width: '100%' }} label="Enter Company Name" inputRef={cNameInput} variant="standard" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.name}
                                </Form.Text>
                            </Row>
                            <Row>
                                <Form.Group controlId="formBasicEmail">
                                    <TextField id="standard-basic" style={{ width: '100%' }} label="Enter Company Address" inputRef={cAddressInput} variant="standard" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.address}
                                </Form.Text>
                            </Row>
                            <Row>

                                <Col>
                                    <Form.Group controlId="formBasicEmail" className='d-flex justify-content-center'>
                                        <Button
                                            className='mt-4 btn btn-primary'
                                            variant="contained"
                                            component="label"
                                            style={{ width: '70%' }}

                                        >
                                            Upload Company Logo
                                            <input
                                                id="image"
                                                name="file"
                                                type="file"
                                                required
                                                hidden
                                            />
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row >
                                <Form.Group controlId="formBasicEmail">
                                    <TextField id="standard-basic" style={{ width: '100%' }} label="Enter Email" inputRef={emailInput} variant="standard" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.email}
                                </Form.Text>
                            </Row>
                            <Row >
                                <Form.Group controlId="formBasicEmail">
                                    <TextField id="standard-basic" style={{ width: '100%' }} label="Enter Phone No" inputRef={phoneInput} variant="standard" />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.phone}
                                </Form.Text>
                            </Row>
                            <Row >
                                <Form.Group className="mb-3">
                                    <InputLabel>Password</InputLabel>

                                    <Input
                                        type={viewpass1 ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => { setViewpass1(!viewpass1) }}
                                                    edge="end"
                                                >
                                                    {viewpass1 ? <VisibilityOff color='error' /> : <Visibility color='info' />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        inputRef={passInput}
                                        lable="Password"
                                        style={{ width: '100%' }}
                                    />

                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.pass}
                                </Form.Text>
                            </Row>
                            <Row >
                                <Form.Group className="mb-3" >

                                    <InputLabel>Confirm Password</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        style={{ width: '100%' }}
                                        label="Confirm Password"

                                        type={viewpass2 ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => { setViewpass2(!viewpass2) }}
                                                    edge="end"
                                                >
                                                    {viewpass2 ? <VisibilityOff color='error' /> : <Visibility color='info' />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        lable="Confirm Password"
                                        inputRef={cPassInput}
                                    />




                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Text className="text-danger">
                                    {error.cpass}
                                </Form.Text>
                            </Row>
                            <Button className="mx-1 mb-4" variant="contained" onClick={validate}  >Register</Button>
                            <br />
                            <Link style={{ color: 'blue' }} to="/">Login Over Here</Link>
                            {pflag == 1 && <Navigate to='/' />}

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
