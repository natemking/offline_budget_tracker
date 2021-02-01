export const tableBodyEl = document.getElementById('tbody');
export let newValue;
let previousCell;
let previousValue;
let currentCell;



//Populate the table with the transactions data
export function populateTable(transactions) {
    tableBodyEl.innerHTML = '';

    //Iterate over all trans and populate table rows w/ formatted dates, names, catagories with upper-cased first letter of each word, & values
    transactions.forEach(transaction => {
        let tr = document.createElement('tr');
        tr.setAttribute("class", "table-row");
        tr.innerHTML = `
            <td id=${transaction._id} data-type="date" class="td-data">${transaction.date.slice(5, 7)}/${transaction.date.slice(8, 10)}/${transaction.date.slice(2, 4)}</td>
            <td id=${transaction._id} data-type="name" class="td-data">${transaction.name}</td>
            <td id=${transaction._id} data-type="category" class="td-data">${transaction.category.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</td>
            <td id=${transaction._id} data-type="value" class="td-data">$${transaction.value}</td>
        `;
        //Append table data to parent
        tableBodyEl.appendChild(tr);
    });
}

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

    currentCell.addEventListener('keypress', function (e) {
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
        console.log(cell.id);
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
            console.log(data);
          } catch (err) { err => {console.error(err) }}              
        })();
       location.reload();
    }

});


}

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