//*** Modules ***//
//===============//
import './indexedDB';
import { saveRecord } from './indexedDB';
import { populateTotal } from './total';
import { tableBodyEl, populateTable, editCell, cancelEditCell } from './table';
import { populateChart, populateDonut } from './chart';

//*** API ***//
//===========//
//Get the transactions data from the server and update table/totals/charts
let transactions = [];

(async () => {
  try {
    //Fetch the data from the server
    const response = await fetch('/api/transaction');
    //Assign the transactions var w/ the extracted JSON body content of the response
    transactions = await response.json();
    //Call the functions to add the data to the DOM
    populateTotal(transactions);
    populateTable(transactions);
    populateChart(transactions);
    populateDonut(transactions);
  } catch (err) { err => console.error(err) }
})();

//Send the newly added transaction data to the server and update table/totals/charts
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
  populateChart(transactions);
  populateDonut(transactions);
  populateTable(transactions);
  populateTotal(transactions);
  
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

//*** Event Listeners ***//
//=======================//
//Add transaction if add button is clicked
document.querySelector('#add-btn').onclick = function() {
  sendTransaction(true);
};

//Subtract transaction is subtract button is clicked
document.querySelector('#sub-btn').onclick = function() {
  sendTransaction(false);
};

//Edit cell when clicked
tableBodyEl.addEventListener('click', e => {
  editCell(e)
});

//Cancel cell edit if clicked anywhere outside of the table body
document.addEventListener('click', e => {
  cancelEditCell(e);
});
