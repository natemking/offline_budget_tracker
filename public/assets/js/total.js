//Function to populate the total amount of all transactions
export const populateTotal = (transactions) => {
    // reduce transaction amounts to a single total value
    let total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
    }, 0);

    let totalEl = document.querySelector('#total');
    totalEl.textContent = total;
}
