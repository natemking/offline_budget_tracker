//*** Modules ***//
//===============//
import './indexedDB'; //Whole file imported for bundling
import { populateTotal } from './total';
import { tableBodyEl, populateTable, editCell, cancelEditCell, deleteRow, sendTransaction } from './table';
import { populateChart, populateDonut } from './chart';

//*** READ ***//
//============//
//All other CRUD functions found in table.js. Left this here as I want this data to load on init//

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


//*** Event Listeners ***//
//=======================//
//Add transaction if add button is clicked
document.querySelector('#add-btn').onclick = function() {
  sendTransaction(true, transactions);
};

//Subtract transaction is subtract button is clicked
document.querySelector('#sub-btn').onclick = function() {
  sendTransaction(false, transactions);
};

//Edit cell when clicked. Only when online.
tableBodyEl.addEventListener('click', e => {
  if (navigator.onLine) {
    editCell(e)
  }
});

//Cancel cell edit if clicked anywhere outside of the table body
document.addEventListener('click', e => {
  cancelEditCell(e);
});

//Delete a row
tableBodyEl.addEventListener('click', e => {
  deleteRow(e);
});