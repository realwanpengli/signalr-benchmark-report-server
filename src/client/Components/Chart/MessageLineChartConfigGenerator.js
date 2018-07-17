import { constants } from "../../Constants";
var messageLineConfigGenerator = function (data) {
    var config = {
        type: "",
        data: {
            labels: [],
            datasets: []
        },
        options: {
        }
    };

    var type = 'line';
    var options = {
        responsive: true,
        legend: {
            position: 'right'
        },
        elements: {
            line: {
                tension: 0.000001
            },
            point: {
                radius: 0
            }
        },
        scales: {
            yAxes: [{
                stacked: true
            }]
        },
        plugins: {
            filler: {
                propagate: false
            },
            'samples-filler-analyser': {
                target: 'chart-analyser'
            }
        }
    };

    var latencyKeys = Object.keys(data).filter(key => key != "Time" && key.indexOf('message') > -1 && key.indexOf('receive') < 0 && key.indexOf('sent') < 0);
    var messageLabels = data["Time"];

    const backgroundColor = [];
    const colorKeys = Object.keys(constants.chartColors);
    for (var i = 0; i < colorKeys.length && i < messageLabels.length; i++) {
        backgroundColor.push(constants.chartColors[colorKeys[i]]);
    }

    var ratioData = {};
    

    latencyKeys.forEach(key => {
        ratioData[key] = [];
    });

    console.log('ratio data', ratioData);
    for (var i = 0; i < messageLabels.length; i++) {
        var sum = 0.0;
        for (var j = 0; j < latencyKeys.length; j++) {
            sum += data[latencyKeys[j]][i];
        }
        for (var j = 0; j < latencyKeys.length; j++) {
            if (sum != 0) {
                ratioData[latencyKeys[j]].push(data[latencyKeys[j]][i]/sum);
            } else {
                ratioData[latencyKeys[j]].push(data[latencyKeys[j]][i]);
            }
        }
    }

    var i = -1;
    var datasets = latencyKeys.map(key => {
        i = (i+1) % colorKeys.length;
        
        return {
            data: ratioData[key],
            label: key,
            fill: i == 0 ? true : '-1',
            borderColor: constants.chartColors[colorKeys[i]],
            backgroundColor: constants.chartColors[colorKeys[i]]
        };
    }); 

    config.options = options;
    config.type = type;
    config.data.labels = messageLabels;
    config.data.datasets = datasets;

    return config;
}

export {messageLineConfigGenerator}