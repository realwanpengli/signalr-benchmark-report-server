import { constants } from "../../Constants";
var messageRateLineConfigGenerator = function (data) {
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

    var latencyKeys = Object.keys(data).filter(key => key.indexOf('message:sent') >= 0 || key.indexOf('message:received') >= 0);
    var messageLabels = data["Time"];

    const backgroundColor = [];
    const colorKeys = Object.keys(constants.chartColors);
    for (var i = 0; i < colorKeys.length && i < messageLabels.length; i++) {
        backgroundColor.push(constants.chartColors[colorKeys[i]]);
    }

    var diffData = {};
    

    latencyKeys.forEach(key => {
        diffData[key] = [];
    });

    console.log('ratio data', diffData);
    for (var i = 0; i < messageLabels.length - 1; i++) {
        for (var j = 0; j < latencyKeys.length; j++) {
            diffData[latencyKeys[j]].push(data[latencyKeys[j]][i+1] - data[latencyKeys[j]][i]);
        }
    }

    var datasets = latencyKeys.map(key => {

        if (key.indexOf('message:sent') >= 0) i = 0;
        else i = 4;
        return {
            data: diffData[key],
            label: key,
            fill: false,
            borderColor: constants.chartColors[colorKeys[i]],
            backgroundColor: constants.chartColors[colorKeys[i]]
        };
    }); 

    config.options = options;
    config.type = type;
    config.data.labels = messageLabels.slice(0, -1);
    config.data.datasets = datasets;

    return config;
}

export { messageRateLineConfigGenerator}