import React, { Component } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';



export class Login extends Component {
    USER = axios.create({ baseURL: 'http://localhost:8000' });
    constructor(props) {
        super(props);
        this.state = { flag: 0 }
    }

    async componentDidMount() {
        if (localStorage.getItem('credentials') != undefined) {
            this.setState({ flag: 1 });
        }
        console.log('in login');
    }
    validate() {


        this.USER.get(`/getUser/${document.getElementById('mail').value}/${document.getElementById('pass').value}`)
            .then(res => {
                console.log(res);
                // console.log(res.data[0]["password"]);
                if (res.status == 404) {
                    alert("Enter Valid Credentials");
                }
                if (!res.data) {
                    alert("Enter Valid Credentials");
                }
                else {
                    console.log(document.getElementById('mail').value);
                    let arr = res.data;
                    localStorage.setItem('credentials', JSON.stringify(arr));
                    this.setState({ flag: 1 });
                }

            }).catch(err => { console.log(err); alert("Enter Valid Credentials"); })
    }

    render() {
        return (
            <div id="formpage">
                <header id="main-header">
                    <section className='d-flex align-items-center'>
                        <img src="./images/icon-512.png" alt="IniGenify_logo" style={{ borderRadius: '50%' }} />
                        <h1>IniGenify</h1>
                    </section>
                </header>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': {
                            my: '1rem',
                            mx: '10rem',
                            width: '100ch'
                        }
                    }}
                    autoComplete="off"
                    style={{ marginTop: "10%" }}
                >
                    <h1 className="my-4">Enter Your Credentials</h1>
                    <TextField label="Outlined secondary" id='mail' label="Enter Your Email" color="secondary" />
                    <TextField label="Outlined secondary" id='pass' label="Enter Your Passcode" color="secondary" />
                    <Button className="mb-2" variant="contained" onClick={() => this.validate()}>Log In</Button>
                    <br />
                    <Link style={{ color: 'blue' }} to="/regis">Register User</Link>
                </Box>
                {this.state.flag == 1 && <Navigate to='/dash' />}
            </div>
        )
    }
}
export default Login