const http = require('http');
const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000; // Use port 3000 or environment-specified port

app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to my simple Express server!');
});

// Hello endpoint
app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});

app.post('/submit', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.page) {
        res.status(400).send("Incorrect parameters passed");
        return;
    }

    const { name, email, phone, page, message = "Na" } = req.body;

    const msg = `New lead arrived\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPage: ${page}\nMessage:\n${message}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.subhojitpatra@gmail.com',
            pass: 'sxadegzqgazbjiko'
        }
    });

    const mailOptions = {
        from: email,
        to: 'info.subhojitpatra@gmail.com',
        subject: 'New Lead Submission',
        text: msg,
        headers: {
            'Reply-To': 'info.subhojitpatra@gmail.com'
        }
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`Failed to send email. Error: ${error.message}`);
            res.status(500).send(`Failed to send email. Error: ${error.message}`);
        } else {
            console.log('Email sent successfully.');
            res.send('Email sent successfully.');
        }
    });

    const db = mysql.createConnection({
        host: 'localhost',
        user: 'taxsais6_lead',
        password: 'Ra#961261',
        database: 'taxsais6_lead'
    });

    db.connect((err) => {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            res.status(500).send('Database connection failed: ' + err.stack);
            return;
        }

        const query = 'INSERT INTO `lead` (`name`, `email`, `phone`, `page`, `message`) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, email, phone, page, message], (error, results) => {
            if (error) {
                console.error('Error inserting data: ' + error.message);
                res.status(500).send('Error inserting data: ' + error.message);
            } else {
                console.log('Data inserted successfully!');
                res.send('Data inserted successfully!');
            }
        });
    });

    // res.redirect('./thankyou.html');
    // res.redirect('https://www.akhairwigs.com/thankyou.html');
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
