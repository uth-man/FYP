var ctx = document.getElementById('myChart-bar').getContext('2d');
Chart.defaults.global.defaultFontColor = 'gray';
Chart.defaults.global.defaultFontSize = 15;
Chart.defaults.global.legend.display = false;



var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'july'],
        datasets: [{
            label: 'No. of booked rides in 2020',

            backgroundColor:
                [
                    'rgba(54,162,235,0.6)',
                    'rgba(255,206,86,0.6)',
                    'rgba(75,192,192,0.6)',
                    'rgba(153,102,255,0.6)',
                    'rgba(255,159,64,0.6)',
                    'rgba(255,99,132,0.6)',
                ],
            borderColor: 'rgb(255, 99, 132)',
            data: [6, 10, 5, 2, 20, 30, 2]
        }]
    },

    // Configuration options go here
    options: {}
});

var line = document.getElementById('myChart-line').getContext('2d');
Chart.defaults.global.defaultFontColor = 'gray';
Chart.defaults.global.defaultFontSize = 15;


var lineChart = new Chart(line, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Total Traffic rides in 2020',
            backgroundColor: 'rgba(250,128,114,0.8)',
            borderColor: 'rgb(205,92,92)',
            borderSize: 1,
            data: [16, 20, 15, 29, 30, 40, 12]
        }]
    },

    // Configuration options go here
    options: {}
});