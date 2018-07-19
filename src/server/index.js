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
    try {
        var text = fs.readFileSync(targetFolder + selectedJob + '/counters.txt', 'utf8');
    } catch (err) {
        console.log(err);
        res.send([]);
    }
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

function filterOptions (selectedOptions, timestamp) {
    console.log('slect options', selectedOptions);
    const targetFolder = benchmarkResults + timestamp + '/';

    var types = fs.readdirSync(targetFolder, 'utf8');
    var typesArray = types.map((type) => {
        return type.split('_');
    });
    var filteredOptions = typesArray.map((options, ind) => {
        var includeAllOptions = fs.existsSync(targetFolder + types[ind] + "/counters.txt");
        for (var i = 0; selectedOptions && i < selectedOptions.length; i++) {
            if (options.includes(selectedOptions[i]) == false) {
                includeAllOptions = false;
                break;
            }
        }
        if (includeAllOptions) {
            return options;
        } else {
            return [];
        }
    });

    return filteredOptions;
}

app.get('/api/getAvailableOptions', (req, res) => {
    res.send(filterOptions(req.query.options, req.query.timestamp));
});

app.get('/api/checkOptionsExists', (req, res) => {
    const opts = filterOptions(req.query.options, req.query.timestamp);
    var exist = false;
    for (var opt of opts) {
        if (opt.length > 0) {
            exist = true;
            break;
        }
    }
    if (exist == true) res.send({exist: true});
    else res.send({exist: false});
});

app.get('/api/getPercentageLtOneSecond', (req, res) => {
    var statisticList = [];
    const timestamp = req.query.timestamp;
    const units = req.query.units;

    if (!timestamp || timestamp == 'null') {
        res.send([]);
    } else {
        const dirs = fs.readdirSync(benchmarkResults + timestamp, 'utf8');
        dirs.forEach(dir => {
            const file = `${benchmarkResults}${timestamp}/${dir}/counters.txt`;
            if (fs.existsSync(file)) {
                const text = fs.readFileSync(file, 'utf8');
                const lastRec = JSON.parse(text.split(os.EOL).slice(-2, -1)[0].slice(0, -1));
                const totalSend = lastRec['Counters']['message:sent'] + lastRec['Counters']['message:notSentFromClient'];
                const received = lastRec['Counters']['message:received'];
                const totalConn = lastRec['Counters']['connection:success'] + lastRec['Counters']['connection:error']; 
                var lt1000Percentage = totalSend == 0. ? 0. : (received - lastRec['Counters']['message:ge:1000']) / totalSend;
                if (dir.indexOf('broadcast') >= 0) {
                    lt1000Percentage = totalSend == 0. ? 0. : (received - lastRec['Counters']['message:ge:1000']) / (totalSend * totalConn);
                }
                var statistic = dir.split('_').concat([(lt1000Percentage * 100).toFixed(2).toString() + "%"]);
                if (units.includes(statistic[0])) statisticList.push(statistic);
            }
        });
        var statisticDict = {};
        statisticList.forEach(arr => {
            const serviceType = arr[0];
            if (!statisticDict[serviceType]) {
                statisticDict[serviceType] = [arr];
            } else {
                statisticDict[serviceType].push(arr);
            }
        });
        res.send(statisticDict);
    }
    
})


app.get('/api/getUnits', (req, res) => {
    var timestamp = req.query.timestamp;
    const dirs = fs.readdirSync(benchmarkResults + timestamp, 'utf8');
    var units = {};
    dirs.forEach(dir => units[dir.split('_')[0]] = 0);
    res.send(units);
});
app.listen(8787, () => console.log('Listening on port 8787!'));
