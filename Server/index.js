const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require("cors");
const multer = require("multer");
const path = require('path');


const database = "mongodb://localhost:27017/IniGenify";
const PORT = 8000;
const app = express();
const userModel = require("./SchemaTemplates/UserTemplate");
const invoiceSchema = require("./SchemaTemplates/InvoiceSchema")
app.use(express.static("./uploads/"));
app.use(express.static("../invoice_generator/public/images"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("../client/public/images/"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/images/')
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, filename)
    }
})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
});
var uploadpdf = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            req.fileValidationError = "Forbidden extension"
            cb(null, false, req.fileValidationError);
        }
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'clashparadise7@gmail.com',
        pass: 'clashparadise7@123'
    }
});
const connectDB = async () => {
    try {
        await mongoose.connect(database, { useNewUrlParser: true });
        console.log("MongoDB connected")
    }
    catch (err) {
        console.log(err.message)
    }
}
connectDB();






app.post('/adduser', upload.single('file'), async (req, res) => {
    console.log(req.body);
    console.log(req.fileValidationError);
    if (req.fileValidationError) {
        res.send({ error: "Invalid file Type" })
    }
    console.log(req.file.destination)
    let ImgPath = req.file.destination.substring(16) + req.file.filename;
    let insert = await new userModel({ name: req.body.name, phone: req.body.phone, email: req.body.email, password: req.body.password, companyAddress: req.body.companyAddress, companyName: req.body.companyName, imgPath: ImgPath });
    insert.save((err) => {
        if (err) {

            res.send({ error: "Email Already Exists in database" });
        }
        else
            res.status(201).send({ error: "" });
    });
});

app.post('/addInvoice/:file', async (req, res) => {
    let filename = req.params.file;
    console.log(req.body)
    let insert = await new invoiceSchema(req.body);
    await insert.save((err) => {
        if (err) {
            console.log(err)
            res.send({ error: "Email Already Exists in database" });
        }
        else
            res.status(201).send({ error: "" });
    });
    let mailOptions = {
        from: "clashparadise7@gmail.com",
        to: req.body.reciever.email,
        subject: "Order Confirmed!",
        text: "Download below invoice, Thank you for shopping with us!",
        attachments: [
            {

                path: `C:/Users/Neosoft/Downloads/${filename}`,
            },
        ],
    };



})

app.get('/updateInvoice/:id', async (req, res) => {
    console.log("in update")
    let id = req.params.id
    await invoiceSchema.findOneAndUpdate({ invoiceNumber: id }, { status: 'paid' });
    res.send({ error: '' })

})
app.post('/sendmail/:email', uploadpdf.single('file'), (req, res) => {
    if (req.fileValidationError) {
        res.send({ error: "Invalid file Type" })
    }
    else {
        let pdfPath = req.file.destination.substring(16) + req.file.filename;
        console.log(pdfPath);
        var mailOptions = {
            from: 'clashparadise7@gmail.com', // sender address                                   
            to: req.params.email, // list of receivers                                 
            subject: 'Attachment', // Subject line                                                 
            text: 'Hello world attachment test', // plaintext body                                                 
            html: '<b>Hello world attachment test HTML</b>', // html body                                               
            attachments: [
                {
                    path: "../client/public" + pdfPath
                }]
        };

        // send mail with defined transport object                                                 
        setTimeout(() => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                    res.send("<h1>Sent Successfully!</h1>");
                }
            })
        }, 3000);
    }
})

app.post('/updateCompanyDetails/:email', upload.single('file'), async (req, res) => {
    console.log("inCompanydetails")
    let email = req.params.email;
    await userModel.findOneAndUpdate({ email: email }, { companyAddress: req.body.companyAddress, companyName: req.body.companyName });
    console.log(req.body);
    // console.log(req.fileValidationError);
    console.log(req.file)
    if (req.fileValidationError) {
        res.send({ error: "Invalid file Type" });
    }

    if (req.file) {
        console.log("in----------------------file")
        let ImgPath = req.file.destination.substring(16) + req.file.filename;
        await userModel.findOneAndUpdate({ email: email }, { imgPath: ImgPath });
    }
    res.send({ error: "" })
});


app.get('/getPreviousInvoice', (req, res) => {
    invoiceSchema.find({}, (err, data) => {
        console.log(data.length);
        res.send({ id: data.length })
    });

})

app.get('/getInvoice/:email', (req, res) => {
    let email = req.params.email
    invoiceSchema.find({ email: email }, (err, data) => {
        let invTotal = 0;
        data.map(ele => {
            console.log(ele);
            invTotal += ele.total;
        })
        console.log(data.length);
        res.send({ listLength: data.length, list: data, total: invTotal })
    });

})
app.get('/getPendingInvoice/:email', (req, res) => {
    let email = req.params.email
    invoiceSchema.find({ email: email, status: 'unpaid' }, (err, data) => {
        let invTotal = 0;
        data.map(ele => {
            console.log(ele);
            invTotal += ele.total;
        })
        console.log(invTotal);
        res.send({ listLength: data.length, total: invTotal })
    });

})

app.get('/getUser/:email/:pass', async (req, res) => {
    let email = req.params.email;
    let pass = req.params.pass;
    userModel.findOne({ email: email, password: pass }, (err, data) => {
        console.log(data);
        if (err) {
            throw err;
        }
        console.log(data != null)
        if (data != null) {
            res.status(202).send(data);
        } else {
            res.status(404).send(false);
        }
    });
});

app.get('/getData/:email', (req, res) => {
    console.log("in company");
    let email = req.params.email;
    userModel.findOne({ email: email }, (err, data) => {
        console.log(data);
        if (err) {
            throw err;
        }
        console.log(data != null)
        if (data != null) {
            res.status(202).send(data);
        } else {
            res.status(404).send(false);
        }
    });
})


app.listen(PORT, (err) => {
    if (err)
        throw err;
    console.log(`Working on Port ${PORT}`);
})
