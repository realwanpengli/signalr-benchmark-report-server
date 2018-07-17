import { constants } from "../../Constants";
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
        }
    };

    var messageLabels = Object.keys(data).filter(key => key != "Time" && key.indexOf('message') > -1 && key.indexOf('receive') < 0 && key.indexOf('sent') < 0);

    const latencyData = messageLabels.map(key => data[key]);

    const lastLatencyData = latencyData.map(list => list[list.length - 1]);

    const backgroundColor = [];
    const colorKeys = Object.keys(constants.chartColors);
    for (var i = 0; i < colorKeys.length && i < messageLabels.length; i++) {
        backgroundColor.push(constants.chartColors[colorKeys[i]]);

    }

    messageChartConfig.options = options;
    messageChartConfig.type = type;
    messageChartConfig.data.labels = messageLabels;
    messageChartConfig.data.datasets = [{ data: lastLatencyData, backgroundColor: backgroundColor }];

    return messageChartConfig;
    
};

export { messagePieConfigGenerator}