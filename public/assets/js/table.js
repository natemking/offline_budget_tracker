import { saveRecord } from './indexedDB';
import { populateChart, populateDonut } from './chart';
import { populateTotal } from './total';

export const tableBodyEl = document.getElementById('tbody');

let transactions = [];
let previousCell;
let previousValue;
let currentCell;


//*** CREATE ***//
//==============//
//Send the newly added transaction data to the server and update table/totals/charts
export const sendTransaction = (isAdding) => {
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
        name: nameEl.value.trim(),
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
    //If online refresh the page
    if (navigator.onLine) {
        location.reload();
    }
}

//Populate the table with the transactions data
export function populateTable() {
    tableBodyEl.innerHTML = '';

    //Iterate over all trans and populate table rows w/ formatted dates, names, catagories with upper-cased first letter of each word, & values
    transactions.forEach(transaction => {
        let tr = document.createElement('tr');
        tr.setAttribute("class", "table-row");
        tr.innerHTML = `
            <td id=${transaction._id} data-type="date" class="td-data">
                ${transaction.date.slice(5, 7)}/${transaction.date.slice(8, 10)}/${transaction.date.slice(2, 4)}
            </td>
            <td id=${transaction._id} data-type="name" class="td-data">
                ${transaction.name}
            </td>
            <td id=${transaction._id} data-type="category" class="td-data">
                ${transaction.category.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
            </td>
            <td id=${transaction._id} data-type="value" class="td-data">$${transaction.value}
                <span id=${transaction._id} class="delete">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </span>
            </td>
        `;
        //Append table data to parent
        tableBodyEl.appendChild(tr);
    });
}


//** READ ***//
//===========//
//Get the transactions data from the server and update table/totals/charts
export const getTransactions = async () => {
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
};


//*** UPDATE ***//
//==============//
export const editCell = e => {
    //Var for the clicked on cells HTML <td> data
    const cell = e.target.closest('td');

    //If date is clicked on return
    if (cell.dataset.type === 'date') {
        return;
    }

    //If another there was a previous cell chosen to edit and a new one is clicked on, revert the previous one back to its original value
    if (previousCell !== undefined) {
        previousCell.parentElement.innerHTML = previousValue
    }

    //Var of the cells current text
    const currentValue = cell.innerHTML;
    //Var for the cells row number
    const row = cell.parentElement;
    //Var for the cells inner HTML to be switched to a text input
    const newHtml = `<input type="text" id="${row.rowIndex} ${cell.cellIndex}" size="10"/>`

    //Update the previous cell value var to the current cell value
    previousValue = currentValue;

    //Change the cell to a text input
    cell.innerHTML = newHtml;
    //Update current cell var to have the cells new input id
    currentCell = document.getElementById(`${row.rowIndex} ${cell.cellIndex}`);

    //Update previous cell var to have the current cells new ids
    previousCell = currentCell

    //Bring new cell text input into focus
    currentCell.focus();

    //Send updated data to the server
    currentCell.addEventListener('keypress', function (e) {
        //When enter is pressed, update the body var to the value of the matching dataset
        if (e.key === 'Enter') {
            
            let body;

            switch (cell.dataset.type) {
                case 'name':
                    body = {
                        name: currentCell.value.trim()
                    }
                    break;
                case 'category':
                    body = {
                        category: currentCell.value.trim().toLowerCase()
                    }
                    break;
                case 'value':
                    body = {
                        value: currentCell.value
                    }
                    break;
                default:
                    break;
            }

            //Send updated data to server
            (async () => {
                try {
                    const response = await fetch(`/api/transaction/${cell.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(body),
                        headers: {
                            Accept: 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                } catch (err) { err => {console.error(err) }}              
            })();

            location.reload();
        }

    });
}

//Cancel edit
export const cancelEditCell = (e) => {
    //Var for any clicks on the table body
    const tableClick = tableBodyEl.contains(e.target);
    //If anything but the table body is clicked on and the previous chosen to edit cell is undefined, then reset the current cell to its value before changing to an input field
    if (!tableClick && previousCell !== undefined) {
        currentCell.parentElement.innerHTML = previousValue
        previousValue = undefined;
        previousCell = undefined;
    }
    
}


//*** DELETE ***//
//==============//
export const deleteRow = (e) => {
    //If the use clicks on the 'x' icon delete the row
    if (e.target.tagName === 'I') {
        //Set element id to var for req.param
        let id = e.target.parentNode.id;
        //Send the collection id to be deleted to the server
        (async () => {
            try {
                const response = await fetch(`/api/transaction/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                });
                await response.json();
            } catch (err) { err => { console.error(err) } }
        })();

        location.reload();
    }
}

