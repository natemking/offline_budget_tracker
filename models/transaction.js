module.exports = (mongoose, Schema) => {
    const transactionSchema = new Schema({
            name: {
                type: String,
                trim: true,
                required: "Enter a name for transaction"
            },
            category: {
                type: String,
                trim: true,
                required: "Enter a category for transaction"
            },
            value: {
                type: Number,
                required: "Enter an amount"
            },
            date: {
                type: Date,
                default: Date.now
            }
        });

    const Transaction = mongoose.model("Transaction", transactionSchema);

    return Transaction;
}