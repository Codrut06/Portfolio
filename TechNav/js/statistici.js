// Data for the average repair time chart
var repairTimeData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [{
        label: 'Average Repair Time (hours)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: [10, 8, 12, 9, 11, 7] // Actual data should go here
    }]
};

// Options for the average repair time chart
var repairTimeOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the average repair time chart
var repairTimeChart = new Chart(document.getElementById('repairTimeChart'), {
    type: 'bar',
    data: repairTimeData,
    options: Object.assign({}, repairTimeOptions, { responsive: true })
});

// Data for the work efficiency chart
var workEfficiencyData = {
    labels: ["Hull Cleaning", "Painting", "Cutting", "Welding"],
    datasets: [{
        label: 'Work Efficiency (tasks per month)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: [15, 18, 14, 16] // Actual data should go here
    }]
};

// Options for the work efficiency chart
var workEfficiencyOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the work efficiency chart
var workEfficiencyChart = new Chart(document.getElementById('workEfficiencyChart'), {
    type: 'bar',
    data: workEfficiencyData,
    options: Object.assign({}, workEfficiencyOptions, { responsive: true })
});

// Data for the labor productivity chart
var labourProductivityData = {
    labels: ["Report Generation", "Repair Tasks", "Maintenance", "Welding"],
    datasets: [{
        label: 'Labor Productivity (hours worked)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        data: [120, 130, 110, 125] // Actual data should go here
    }]
};

// Options for the labor productivity chart
var labourProductivityOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the labor productivity chart
var labourProductivityChart = new Chart(document.getElementById('labourProductivityChart'), {
    type: 'bar',
    data: labourProductivityData,
    options: Object.assign({}, labourProductivityOptions, { responsive: true })
});

// Data for the on-time delivery rate chart
var deliveryOnTimeRateData = {
    labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
    datasets: [{
        label: 'On-Time Delivery Rate (%)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: [75, 80, 85, 78, 82, 79] // Actual data should go here
    }]
};

// Options for the on-time delivery rate chart
var deliveryOnTimeRateOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the on-time delivery rate chart
var deliveryOnTimeRateChart = new Chart(document.getElementById('deliveryOnTimeRateChart'), {
    type: 'bar',
    data: deliveryOnTimeRateData,
    options: Object.assign({}, deliveryOnTimeRateOptions, { responsive: true })
});

// Data for the capacity utilization rate chart
var utilizationRateData = {
    labels: ["Dock 1", "Dock 2", "Dock 3", "Dock 4"],
    datasets: [{
        label: 'Capacity Utilization Rate (%)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: [85, 90, 88, 82] // Actual data should go here
    }]
};

// Options for the capacity utilization rate chart
var utilizationRateOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the capacity utilization rate chart
var utilizationRateChart = new Chart(document.getElementById('utilizationRateChart'), {
    type: 'bar',
    data: utilizationRateData,
    options: Object.assign({}, utilizationRateOptions, { responsive: true })
});

// Data for the repeat repair rate chart
var repeatRepairRateData = {
    labels: ["Hull", "Painting", "Cutting", "Welding"],
    datasets: [{
        label: 'Repeat Repair Rate (%)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        data: [5, 8, 7, 6] // Actual data should go here
    }]
};

// Options for the repeat repair rate chart
var repeatRepairRateOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Initialize the repeat repair rate chart
var repeatRepairRateChart = new Chart(document.getElementById('repeatRepairRateChart'), {
    type: 'bar',
    data: repeatRepairRateData,
    options: Object.assign({}, repeatRepairRateOptions, { responsive: true })
});

  // Function to open the user manual in a new window
// function openManual() {
//     window.open('ManualUtilizareTechNav.pdf', '_blank');
// }

// Attach the function to the click event of the button
document.getElementById('vertical-text').addEventListener('click', openManual);