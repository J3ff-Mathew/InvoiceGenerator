import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import axios from 'axios'
export default function Records() {
    const user = axios.create({ baseURL: "http://localhost:8000" })
    const [records, setRecords] = useState([])
    useEffect(async () => {
        let arr = JSON.parse(localStorage.getItem("credentials"));
        await user.get(`/getInvoice/${arr.email}`).then(res => { setRecords(res.data.list) });
    }, [])
    const update = async (invNum, i) => {
        let temp = [...records];
        temp[i].status = "paid";
        setRecords(temp);
        await user.get(`/updateInvoice/${invNum}`)
        // updaterecords(temp[i]);
    }
    function sendMail(email) {
        let data = new FormData();
        data.append('file', document.getElementById('image').files[0]);
        user.post(`/sendmail/${email}`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
    }
    return (
        <div>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice</TableCell>
                            <TableCell >To(Company Name)</TableCell>
                            <TableCell >Amount</TableCell>
                            <TableCell >Status</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>SendMail</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((row, i) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    # {i + 1}
                                </TableCell>
                                <TableCell >{row.reciever.name}({row.reciever.company})</TableCell>
                                <TableCell >$ {row.total}</TableCell>
                                <TableCell ><Typography variant='h6' color={row.status != 'unpaid' ? 'success.light' : 'error'} sx={{ fontWeight: "bold", fontFamily: "'Teko', sans-serif" }} >{row.status}</Typography></TableCell>
                                <TableCell >
                                    {row.status == 'unpaid' ? <Button variant="contained" color="error" size="small" sx={{ borderRadius: '5px' }} onClick={() => update(row.invoiceNumber, i)}>
                                        pay
                                    </Button> : <Button variant="contained" color="success" size="small" sx={{ borderRadius: '20px' }} disabled>
                                        Paid
                                    </Button>}
                                </TableCell>

                                <TableCell >

                                    {row.status == 'unpaid' && <Button
                                        className='mt-4 btn btn-primary'
                                        variant="contained"
                                        component="label"
                                        style={{ width: '70%' }}

                                    >
                                        Alert User
                                        <input
                                            id="image"
                                            name="file"
                                            type="file"
                                            onChange={() => sendMail(row.reciever.email)}
                                            required
                                            hidden
                                        />
                                    </Button>}

                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
