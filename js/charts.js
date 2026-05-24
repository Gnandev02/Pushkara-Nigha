

let crowdChart = null;

document.addEventListener("DOMContentLoaded", () => {
    
    const datasets = {
        "1h": {
            labels: ["15:00", "15:10", "15:20", "15:30", "15:40", "15:50", "16:00"],
            actual: [38500, 39200, 40100, 41800, 42100, 42500, 42850],
            predicted: [38200, 39400, 40500, 41500, 42300, 43000, 43500]
        },
        "6h": {
            labels: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            actual: [28000, 31200, 33500, 37000, 39800, 41800, 42850],
            predicted: [27500, 30800, 34000, 36500, 40200, 42500, 43500]
        },
        "24h": {
            labels: ["16:00 Yesterday", "20:00", "00:00", "04:00", "08:00", "12:00", "16:00 Today"],
            actual: [44200, 35100, 12000, 4500, 26000, 34000, 42850],
            predicted: [43900, 36000, 11500, 4000, 27500, 33500, 43500]
        }
    };

    
    initCrowdChart("1h", datasets);

    
    const filterButtons = document.querySelectorAll(".chart-filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const scale = btn.getAttribute("data-scale");
            updateChartScale(scale, datasets);
            
            
            if (window.showSystemBanner) {
                window.showSystemBanner(`Updated analytics filter: ${btn.textContent.trim()}`);
            }
        });
    });

    
    const themeToggle = document.querySelector(".theme-toggle-btn");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            
            setTimeout(() => {
                if (crowdChart) {
                    const isDark = document.body.getAttribute("data-theme") === "dark";
                    updateChartGridTheme(isDark);
                }
            }, 100);
        });
    }
});

function initCrowdChart(scale, datasets) {
    const ctx = document.getElementById("crowdTrendsChart");
    if (!ctx) return;

    const data = datasets[scale];
    const isDark = document.body.getAttribute("data-theme") === "dark";
    
    
    const actualGradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
    actualGradient.addColorStop(0, "rgba(11, 107, 83, 0.25)");
    actualGradient.addColorStop(1, "rgba(11, 107, 83, 0)");

    const predictedGradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
    predictedGradient.addColorStop(0, "rgba(13, 148, 136, 0.15)");
    predictedGradient.addColorStop(1, "rgba(13, 148, 136, 0)");

    const gridColor = isDark ? "#222F43" : "#E2E8F0";
    const labelColor = isDark ? "#94A3B8" : "#64748B";

    crowdChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Live Registered Crowd (CV sensors)",
                    data: data.actual,
                    borderColor: "#0B6B53",
                    borderWidth: 3,
                    pointBackgroundColor: "#0B6B53",
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    backgroundColor: actualGradient,
                    fill: true,
                    tension: 0.35
                },
                {
                    label: "NeuralNet Predictive Trend",
                    data: data.predicted,
                    borderColor: "#0D9488",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: "#0D9488",
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 1,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    backgroundColor: predictedGradient,
                    fill: true,
                    tension: 0.35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: labelColor,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        boxWidth: 15,
                        usePointStyle: false
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#151D30' : '#FFFFFF',
                    titleColor: isDark ? '#F8FAFC' : '#0F172A',
                    bodyColor: isDark ? '#CBD5E1' : '#475569',
                    borderColor: isDark ? '#222F43' : '#E2E8F0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: {
                        family: 'Outfit',
                        weight: '600'
                    },
                    bodyFont: {
                        family: 'Inter'
                    },
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label.split(" ")[0]}: ${context.raw.toLocaleString()} devotees`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawTicks: false
                    },
                    ticks: {
                        color: labelColor,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 8
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        drawTicks: false
                    },
                    ticks: {
                        color: labelColor,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 8,
                        callback: function(value) {
                            return (value / 1000) + 'k';
                        }
                    }
                }
            }
        }
    });
}

function updateChartScale(scale, datasets) {
    if (!crowdChart) return;
    
    const data = datasets[scale];
    crowdChart.data.labels = data.labels;
    crowdChart.data.datasets[0].data = data.actual;
    crowdChart.data.datasets[1].data = data.predicted;
    
    crowdChart.update('active');
}

function updateChartGridTheme(isDark) {
    if (!crowdChart) return;
    
    const gridColor = isDark ? "#222F43" : "#E2E8F0";
    const labelColor = isDark ? "#94A3B8" : "#64748B";

    crowdChart.options.scales.x.grid.color = gridColor;
    crowdChart.options.scales.x.ticks.color = labelColor;
    crowdChart.options.scales.y.grid.color = gridColor;
    crowdChart.options.scales.y.ticks.color = labelColor;
    crowdChart.options.legend.labels.color = labelColor;
    crowdChart.options.plugins.tooltip.backgroundColor = isDark ? '#151D30' : '#FFFFFF';
    crowdChart.options.plugins.tooltip.titleColor = isDark ? '#F8FAFC' : '#0F172A';
    crowdChart.options.plugins.tooltip.bodyColor = isDark ? '#CBD5E1' : '#475569';
    crowdChart.options.plugins.tooltip.borderColor = isDark ? '#222F43' : '#E2E8F0';

    crowdChart.update();
}


window.pushChartDataValue = function(newLabel, newActualValue, newPredictedValue) {
    if (!crowdChart) return;
    
    
    crowdChart.data.labels.shift();
    crowdChart.data.labels.push(newLabel);
    
    crowdChart.data.datasets[0].data.shift();
    crowdChart.data.datasets[0].data.push(newActualValue);
    
    crowdChart.data.datasets[1].data.shift();
    crowdChart.data.datasets[1].data.push(newPredictedValue);
    
    crowdChart.update();
};
