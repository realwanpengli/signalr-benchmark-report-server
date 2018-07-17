const chartColors = {
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    yellow: 'rgb(255, 205, 86)',
    orange: 'rgb(255, 159, 64)',
    red: 'rgb(255, 99, 132)',
    purple: 'rgb(153, 102, 255)',
    phlox: 'rgb(223, 0, 255)',
    brown: 'rgb(150, 75, 0)',
    grey: 'rgb(201, 203, 207)',
    chocolate: 'rgb(123, 63, 0)',
    lime: 'rgb(191, 255, 0)',
    black: 'rgb(0, 0, 0)'
}; 

const event = {
    'serviceTypes': 'selectNewServiceTypes', 
    'transportTypes': 'selectNewTransportTypes', 
    'hubProtocols': 'selectNewHubProtocols', 
    'scenarios': 'selectNewScenarios', 
    'connections': 'selectNewConnections',
    'timestamp': 'selectNewTimestamp'
};

const pieChartId = {
    'messagePie': 'latency-distribution-in-total',
    'connectionPie': 'connection-success-ratio'
};

const lineChartId = {
    'messageLine': 'latency-distribution-in-time',
    'messageRateLine': 'message=rate-distribution-in-time'
};

const constants = {
    event: event,
    chartColors: chartColors,
    pieChartId: pieChartId,
    lineChartId: lineChartId
};

export {constants}