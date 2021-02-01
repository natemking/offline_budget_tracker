//*** Modules ***//
//===============//
import './indexedDB'; //Whole file imported for bundling
import { tableBodyEl, getTransactions, editCell, cancelEditCell, deleteRow, sendTransaction } from './table';


//Initialize app & get the transactions from the server
getTransactions();

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