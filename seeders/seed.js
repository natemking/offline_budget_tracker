let mongoose = require("mongoose");
let db = require("../models");

let budgetSeed = [
    {
        name: 'Paycheck',
        category: 'Income',
        value: 1500, 
        date: new Date().setDate(new Date().getDate() - 15)
    },
    {
        name: 'Fuel',
        category: 'Transportation',
        value: -30,
        date: new Date().setDate(new Date().getDate() - 10)
    },
    {
        name: 'Gas bill',
        category: 'Utilities',
        value: -50,
        date: new Date().setDate(new Date().getDate() - 8)
    },
    {
        name: 'Electric bill',
        category: 'Utilities',
        value: -85,
        date: new Date().setDate(new Date().getDate() - 8)
    },
    {
        name: 'FIOS',
        category: 'Internet',
        value: -40,
        date: new Date().setDate(new Date().getDate() - 8)
    },
    {
        name: 'Groceries',
        category: 'Food',
        value: -135,
        date: new Date().setDate(new Date().getDate() - 6)
    },
    {
        name: 'Money Chris owed me',
        category: 'Income',
        value: 50,
        date: new Date().setDate(new Date().getDate() - 5)
    },
    {
        name: 'Rent',
        category: 'Rent',
        value: -1200,
        date: new Date().setDate(new Date().getDate() - 4)
    },
    {
        name: 'Martha Bar',
        category: 'Dining out',
        value: -20,
        date: new Date().setDate(new Date().getDate() - 4)
    },
    {
        name: 'Paycheck',
        category: 'Income',
        value: 1500,
        date: new Date().setDate(new Date().getDate() - 1)
    }
]

const seed = async () => {
    try {
        await db.Transaction.deleteMany({});
        const data = await db.Transaction.collection.insertMany(budgetSeed);
        console.log(`${data.result.n} records inserted`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1); 
    }
}
       
seed();