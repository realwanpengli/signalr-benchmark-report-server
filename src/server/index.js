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
    res.send(types);
});
app.get('/api/getChartData', (req, res) => {
    var queryVal = Object.keys(req.query).map(key => req.query[key]);
    const type = req.query.type;
    const timestamp = req.query.timestamp;

    const targetFolder = benchmarkResults + timestamp + '/';
    var jobs = fs.readdirSync(targetFolder, 'utf8');

    var selectedJob = "";
    for (var i = 0; i < jobs.length; i++) {
        var items = jobs[i].split('_');
        var check = true;
        for (var j = 0; j < items.length; j++) {
            for (var configItem of items) {
                if (queryVal.includes(configItem) == false) {
                    check = false;
                }
            }
        }

        if (check) {
            selectedJob = jobs[i];
            break;
        }
    }
    console.log('target', targetFolder + selectedJob + '/counters.txt', 'query', req.query);
    var text = fs.readFileSync(targetFolder + selectedJob + '/counters.txt', 'utf8');
    var dataByTime = []
    var lines = text.split(os.EOL);
    lines.forEach(line => {
        if (line.length <= 1) return;
        var cntr = JSON.parse(line.slice(0, -1));
        dataByTime.push(cntr);
    });
    var dataByKey = {"Time": []};
    const keys = Object.keys(dataByTime[dataByTime.length - 1]["Counters"]);
    keys.forEach(key => dataByKey[key] = []);
    dataByTime.forEach(data => {
        Object.keys(data["Counters"]).forEach(key => {
            dataByKey[key].push(data["Counters"][key]);
        });
        dataByKey["Time"].push(data["Time"]);
    });
    console.log('send chart data');
    res.send(dataByKey);
    return;
    
});
app.listen(8080, () => console.log('Listening on port 8080!'));
