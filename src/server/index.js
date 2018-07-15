const express = require('express');
const os = require('os');
const fs = require('fs');

const app = express();

const benchmarkResults = 'public/benchmarkResults/';

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/getTimestamps', (req, res) => {
    var timestamps = fs.readdirSync(benchmarkResults, 'utf8');
    res.send(timestamps);
});
app.get('/api/getTypes', (req, res) => {
    const timestamp = req.query.timestamp;
    if (typeof timestamp === "undefined" || timestamp == null) {
        res.send([]);
        return;
    }
    const targetFolder = benchmarkResults + timestamp + '/';
    var types = fs.readdirSync(targetFolder, 'utf8');
    types = types.map((type) => {
        return type.split('_');
    });
    console.log("types server splited", types);
    res.send(types);
});
app.get('/api/getChartData', (req, res) => {
    const type = req.query.type;
    const timestamps = req.query.timestamp;

    const targetFolder = benchmarkResults + timestamp + '/';
    var jobs = fs.readdirSync(targetFolder, 'utf8');
    jobs = jobs.map((type) => {
        return jobs.split('_');
    });
    jobs.forEach(jobConfig => {
        const check = jobConfig.filter(part => req.query[part] == null);
        if (check.length > 0) return;
        
        res.send({});
    });
    
});
app.listen(8080, () => console.log('Listening on port 8080!'));
