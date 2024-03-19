const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

const dbPath = path.resolve(__dirname, '../pbw.db');
const db = new sqlite3.Database(dbPath);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Selecting the necessary columns from 'devices' and the most recent 'waterlevels' entries
    db.all(`
        SELECT
            devices.devicename,
            devices.devicefriendlyname,
            devices.status,
            waterlevels.waterlevel
        FROM devices
        LEFT JOIN (
            SELECT
                devicename,
                waterlevel,
                MAX(timestamp) AS max_timestamp
            FROM waterlevels
            GROUP BY devicename
        ) AS latest_waterlevels ON devices.devicename = latest_waterlevels.devicename
        LEFT JOIN waterlevels ON latest_waterlevels.devicename = waterlevels.devicename AND latest_waterlevels.max_timestamp = waterlevels.timestamp
    `, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Grouping the data by devicename
        const data = rows.reduce((acc, row) => {
            if (!acc[row.devicename]) {
                acc[row.devicename] = {
                    devicename: row.devicename,
                    devicefriendlyname: row.devicefriendlyname,
                    status: row.status,
                    waterlevel: row.waterlevel || null,
                };
            }
            return acc;
        }, {});

        // Converting the object back to an array
        const entries = Object.values(data);

        // Render the index.ejs page with data
        res.render('index', { entries });
    });
});


app.get('/errorlog', (req, res) => {
    res.render('errorlog');
});

app.get('/devicemanager', (req, res) => {
    res.render('devicemanager');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});