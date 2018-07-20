import { constants } from "../../Constants";

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var messagePieConfigGenerator = function (data) {
    var messageChartConfig = {
        type: "",
        data: {
            datasets: [],
            labels: []
        },
        options: {

        }
    };

    var type = 'pie';
    var options = {
        responsive: true,
        legend: {
            display: true,
            position: 'right'
        },
        pieceLabel: {
            render: args => {
                // return `${args.label.split(' ')[0]}\n\r${args.value.toFixed(2)}%`;
                return `${args.value.toFixed(2)}%`;
            },
            showActualPercentages: true,
            fontColor: function (data) {
                return 'rgba(255.0,255.0,255.0,1.0)';
            },
            precision: 2,
            fontSize: 16,
            textShadow: true,
            shadowBlur: 3,
            shadowOffsetX: -1,
            shadowOffsetY: -1,
            shadowColor: 'rgba(0,0,0,1.0)',
            position: 'default'
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var percentage = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    console.log('tool', tooltipItem, 'data', data);
                    // return `${data.labels[tooltipItem.index]}`;
                    var sum = 0;
                    data.datasets[tooltipItem.datasetIndex].data.forEach(d => sum += d);

                    // return `${(percentage).toFixed(2)}%`;
                    return `${data.labels[tooltipItem.index]}`;
                }
            }
        }
    };

    var messageLabels = Object.keys(data).filter(key => key != "Time" && key.indexOf('message') > -1 && key.indexOf('receive') < 0 && key.indexOf('sent') < 0);

    const latencyData = messageLabels.map(key => data[key]);

    var lastLatencyData = latencyData.map(list => list[list.length - 1]);

    const backgroundColor = [];
    const colorKeys = Object.keys(constants.chartColors);
    for (var i = 0; i < colorKeys.length && i < messageLabels.length; i++) {
        backgroundColor.push(constants.chartColors[colorKeys[i]]);

    }


    // append percentage in the labels
    var sum = 0;
    lastLatencyData.forEach(data => sum += data);
    if (sum != 0) {
        lastLatencyData = lastLatencyData.map(d => d / sum * 100);
    }
    messageLabels = messageLabels.map((l, i) => l + `  ${Number.parseFloat(lastLatencyData[i]).toFixed(2)}%`);

    messageChartConfig.options = options;
    messageChartConfig.type = type;
    messageChartConfig.data.labels = messageLabels;
    messageChartConfig.data.datasets = [{ data: lastLatencyData, backgroundColor: backgroundColor }];

    return messageChartConfig;
    
};

export { messagePieConfigGenerator}