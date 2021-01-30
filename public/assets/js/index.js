let transactions = [];
let myChart;
let myDonut;

fetch('/api/transaction')
  .then(response => {
    return response.json();
  })
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
    populateDonut();
  });

function populateTotal() {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector('#total');
  totalEl.textContent = total;
}

const formatDate = (date) => {
  return `${date.slice(5,7)}/${date.slice(8,10)}/${date.slice(2,4)}`
}

function populateTable() {
  let tbody = document.querySelector('#tbody');
  tbody.innerHTML = '';

  transactions.forEach(transaction => {
    // create and populate a table row w/ names, catagories with uppercased first letter of each word, & values
    let tr = document.createElement('tr');
    //Pull in the  
    tr.innerHTML = `
      <td id='date'>${formatDate(transaction.date)}</td>
      <td>${transaction.name}</td>
      <td>${transaction.category.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</td>
      <td>$${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
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

  //Function to find duplicate catagories, combine their values and merge as one object
  const mergeCatagories = data => {
    const result = {}
    data.forEach(category => { 
      for (let [key, value] of Object.entries(category)) {
        if (result[key]) { 
          result[key] += value;
        } else { 
          result[key] = value;
        }
      }
    });
    return result
  }
  
  //Merge catagories on filtered data
  const data = mergeCatagories(catValue);

  //If donut chart exists delete
  if (myDonut) {
    myDonut.destroy();
  }

  const ctx = document.getElementById('myDonut').getContext('2d');
  //Create donut chart with user data
  myDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(data).reverse(),
      datasets: [
        {
          label: 'Totals by Category',
          backgroundColor: colors,
          data: Object.values(data).reverse()
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Totals by Category'
      }
    }
  });
}


function sendTransaction(isAdding) {
  let nameEl = document.querySelector('#t-name');
  let catEl = document.querySelector('#t-cat');
  let amountEl = document.querySelector('#t-amount');
  let errorEl = document.querySelector('.form .error');
  // validate form
  if (nameEl.value === '' || catEl.value === '' || amountEl.value === '') {
    errorEl.textContent = 'Missing Information';
    return;
  }
  else {
    errorEl.textContent = '';
  }

  // create record
  let transaction = {
    name: nameEl.value,
    category: catEl.value.trim().toLowerCase(),
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateDonut();
  populateTable();
  populateTotal();
  
  
  // also send to server
  fetch('/api/transaction', {
    method: 'POST',
    body: JSON.stringify(transaction),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = 'Missing Information';
    }
    else {
      // clear form
      nameEl.value = '';
      catEl.value = '';
      amountEl.value = '';
    }
  })
  .catch(err => {
    // fetch failed, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = '';
    catEl.value = '';
    amountEl.value = '';
  });
}

document.querySelector('#add-btn').onclick = function() {
  sendTransaction(true);
};

document.querySelector('#sub-btn').onclick = function() {
  sendTransaction(false);
};
