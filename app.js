const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer')
const app = express();
const port = 3000;

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

    // Commented out email configuration and sending

    const msg = `New lead arrived\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPage: ${page}\nMessage:\n${message}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.subhojitpatra@gmail.com', // your Gmail address
            // enable 2 factor authentication and then go to 'App passwords' then select App and then generate the password then add it below
            // refer : https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted
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


    // Database connection and insertion
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

    // Optionally redirect user after processing
    res.redirect('https://www.akhairwigs.com/thankyou.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
