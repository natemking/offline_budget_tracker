//Populate the table with the transactions data
export function populateTable(transactions) {
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