//*** Global Variables ***//
//========================//
let transactions = [];
let myChart;
let myDonut;

//Get the transactions data from the server
(async () => {
  try {
    //Fetch the data from the server
    const response = await fetch('/api/transaction');
    //Assign the transactions var w/ the extracted JSON body content of the response
    transactions = await response.json();
    //Call the functions to add the data to the DOM
    populateTotal();
    populateTable();
    populateChart();
    populateDonut();
  } catch (err) { err => console.error(err) }
})();

//Function to populate the total amount of all transactions
const populateTotal = () => {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector('#total');
  totalEl.textContent = total;
}

//Populate the table with the transactions data
function populateTable() {
  let tbody = document.querySelector('#tbody');
  tbody.innerHTML = '';

  //Iterate over all trans and populate table rows w/ formatted dates, names, catagories with upper-cased first letter of each word, & values
  transactions.forEach(transaction => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td id='date'>${transaction.date.slice(5, 7)}/${transaction.date.slice(8, 10)}/${transaction.date.slice(2, 4)}</td>
      <td>${transaction.name}</td>
      <td>${transaction.category.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</td>
      <td>$${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

//Populate the chart w/ the transaction data
const populateChart = () => {
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
const populateDonut = () => {
  //Color array for donut chart
  const colors = ['#463f3a', '#8a817c', '#758b69', '#bcb8b1', '#4f0113', '#b991c9', '#e0afa0', '#c6949a', '#a27f93', '#7a6c86', '#525a72', '#2f4858', '#006796', '#546fa7', '#9177a9', '#ba84a4', '#d4979e', '#aac19d', '#e56d4b', '#f4f3ee']

  //Filter out all category and values that are not income
  let catValue = []
  transactions.forEach((t) => {
    if (t.category !== 'income'){
      catValue.push({[t.category]: t.value})
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

//Send the newly added transaction data to the server and update charts/totals
const sendTransaction = isAdding => {
  let nameEl = document.querySelector('#t-name');
  let catEl = document.querySelector('#t-cat');
  let amountEl = document.querySelector('#t-amount');
  let errorEl = document.querySelector('.form .error');
  //Validate form
  if (nameEl.value === '' || catEl.value === '' || amountEl.value === '') {
    errorEl.textContent = 'Missing Information';
    return;
  }
  else {
    errorEl.textContent = '';
  }

  //Create record
  let transaction = {
    name: nameEl.value,
    category: catEl.value.trim().toLowerCase(),
    value: amountEl.value,
    date: new Date().toISOString()
  };

  //If subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  //Add to beginning of current array of data
  transactions.unshift(transaction);

  //Re-run logic to populate ui with new record
  populateChart();
  populateDonut();
  populateTable();
  populateTotal();
  
  
  //Also send to server
  (async () => {
    try {
      //Send transaction data to server
      const response = await fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
      //Assign extracted JSON body content to var
      const data = await response.json();
      //If any errors, display warning to user, else clear the form data
      data.errors ?
        errorEl.textContent = 'Missing Information' :
        // clear form
        nameEl.value = '';
        catEl.value = '';
        amountEl.value = '';

    } catch (err) {
      // fetch failed, so save in indexed db
      saveRecord(transaction);

      // clear form
      nameEl.value = '';
      catEl.value = '';
      amountEl.value = '';
    }
  })();
}

//Add transaction if add button is clicked
document.querySelector('#add-btn').onclick = function() {
  sendTransaction(true);
};

//Subtract transaction is subtract button is clicked
document.querySelector('#sub-btn').onclick = function() {
  sendTransaction(false);
};

