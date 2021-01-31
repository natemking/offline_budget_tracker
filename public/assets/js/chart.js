let myChart;
let myDonut;

//Populate the chart w/ the transaction data
export const populateChart = (transactions) => {
    // copy array and reverse it
    let reversed = transactions.slice().reverse();
    let sum = 0;

    // create date labels for chart
    let labels = reversed.map(t => {
        let date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    // create incremental values for chart
    let data = reversed.map(t => {
        sum += parseInt(t.value);
        return sum;
    });

    // remove old chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    let ctx = document.getElementById('myChart').getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Total Over Time',
                fill: true,
                backgroundColor: '#e0afa0',
                data
            }]
        },
        options: {
            responsive: true
        }
    });
}

//Populate the donut chart w/ only expense catagories
export const populateDonut = (transactions) => {
    //Color array for donut chart
    const colors = ['#463f3a', '#8a817c', '#758b69', '#bcb8b1', '#4f0113', '#b991c9', '#e0afa0', '#c6949a', '#a27f93', '#7a6c86', '#525a72', '#2f4858', '#006796', '#546fa7', '#9177a9', '#ba84a4', '#d4979e', '#aac19d', '#e56d4b', '#f4f3ee']

    //Filter out all category and values that are not income
    let catValue = []
    transactions.forEach((t) => {
        if (t.category !== 'income') {
            catValue.push({ [t.category]: t.value })
        }
    });

    //Reduce the results so that any duplicate catagories are returned as one and their values combined
    const data = catValue.reduce((finalObj, obj) => {
        for (const [category, value] of Object.entries(obj)) {
            if (!finalObj[category]) {
                finalObj[category] = 0;
            }
            finalObj[category] += value;
        }
        return finalObj;
    }, {});

    //If donut chart exists delete
    if (myDonut) {
        myDonut.destroy();
    }
    //Context variable for chart location in DOM
    const ctx = document.getElementById('myDonut').getContext('2d');
    //Create donut chart with user data
    myDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data).reverse(),
            datasets: [
                {
                    label: 'Total Spending by Category',
                    backgroundColor: colors,
                    data: Object.values(data).reverse()
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Total Spending by Category'
            }
        }
    });
}