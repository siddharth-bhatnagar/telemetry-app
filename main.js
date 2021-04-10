// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./serviceWorker.js', { scope: "./" })
            .then((registration) => console.log(`Registration Successful, scope: ${registration.scope}`))
            .catch((error) => console.log(`Service Worker Registration failed: ${error}`));
    });
}


// fetch data from chrome extension
const fetchMetrics = () => {
    return new Promise((resolve) => {
        const EXTENSION_ID = "miiffkdgleccckcbcgmghnjlkjhigaah";
        window.chrome.runtime.sendMessage(
            EXTENSION_ID,
            { type: "SEND_METRICS" },
            function (response) {
                resolve(response);
            }
        );
    })
}

// helper function to get metrics
const metrics = () => {
    let data = fetchMetrics();
    data.then((info) => {
        parsingAndCharting(info);
    });
}

// parsing data
function parsingAndCharting(data) {
    console.log(data);
    const processors = data.cpuInfo.usage;
    let usages = processCPUUsage(processors);
    plotCPUData(processors, usages);
    let memoryUsage = getMemoryUsage(data.memory);
    plotMemoryData(memoryUsage);
    display(data);
    displayMemoryInfo(data, memoryUsage);
    displayCPUInfo(data);
}

function display(data) {
    document.getElementById("os").innerHTML = "OS: " + data.info.operatingSystem;
    document.getElementById("chrome-version").innerHTML = "Chrome: "+data.info.chromeVersion;
    document.getElementById("platform").innerHTML = "Platform: " + data.info.platform;
}

function displayMemoryInfo(data, usage) {
    document.getElementById("ram").innerHTML = "In-use: " + data.memory.usage + " MB";
    document.getElementById("capacity").innerHTML = "Capacity: " + data.memory.capacity + " MB";
    document.getElementById("mem-percentage").innerHTML = "Usage: " + usage + " %";
}

function displayCPUInfo(data) {
    document.getElementById("cpu-name").innerHTML = "Name: " + data.cpuInfo.name;
    document.getElementById("cpu-arch").innerHTML = "Architecture: " + data.cpuInfo.arch;
    document.getElementById("cpu-cores").innerHTML = "Number of Cores: " + data.cpuInfo.usage.length;
}

function processCPUUsage(processors) {
    let dummyDataSets = [];
    processors.forEach((processor, index) => {
        let usage = calculateUsagePercentage(processor);
        dummyDataSets.push(usage);
    });
    console.log(dummyDataSets);
    return dummyDataSets;
}

function calculateUsagePercentage(data) {
    let utilization = (1 - data["idle"] / data["total"]) * 100;
    return Number.parseFloat(utilization.toFixed(2));
}

function getMemoryUsage(memory) {
    return Number.parseFloat(((memory.usage / memory.capacity) * 100).toFixed(2));
}

let graphColors = [
    "#FF9172",
    "#386BD7",
    "#42BAFE",
    "#92B2F0",
    "#D9D9D9",
    "#0052CC",
    "#000000",
    "#C4C4C4",
    "#003f5c",
    "#58508d",
    "#ffa600",
    "#bc5090"
];

function plotCPUData(processors, usages) {
    let colors = graphColors;
    let dummyDatasets = [];
    let names = [];
    processors.forEach((processor, index) => {
        const usage = usages[index];
        console.log(usage)
        let num = index + 1;
        names.push("CPU " + num);

        let dataset = {
            label: "CPU" + " " + num,
            data: [usage, usage, usage, usage, usage, usage, usage, usage, usage, usage, usage, usage],
            backgroundColor: colors,
            borderColor: colors[index % 8],
            pointRadius: 0,
            lineTension: 0,
            borderWidth: 1,
            fill: false
        };
        dummyDatasets.push(dataset);
    });

    const ctx = document.getElementById('cpu').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: names,
            datasets: dummyDatasets
        },
        options: {
            animation: {
                duration: 3,
            },
            scales: {
                scaleLabel: {
                    fontColor: "white",
                },
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: false,
                        },
                        gridLines: {
                            display: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
            legend: {
                display: true,
                position: "right",
                labels: {
                    fontColor: "white",
                    boxWidth: 15,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function plotMemoryData(memoryUsage) {
    const ctx = document.getElementById('memory').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: [memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage, memoryUsage],
                label: "Memory Usage",
                borderColor: "yellow",
                fill: false,
                pointRadius: 0,
                lineTension: 0,
                borderWidth: 1,
            }]
        },
        options: {
            animation: {
                duration: 3,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: "white",
                            min: 0,
                            max: 100,
                        },
                        gridLines: {
                            display: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        display: false,
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

//  polling
const interval = 1000;
metrics();
setInterval(metrics, interval);