const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// Mock data storage
let expenses = ["shopping", "food"];

// Middleware for user authentication (mock implementation)
const authenticate = (req, res, next) => {
    // For the purposes of this example, we'll assume every request has a valid token
    // In a real-world scenario, implement proper token-based authentication
    next();
};

// GET /api/expenses: Retrieve all expenses for a user
app.get('/api/expenses', authenticate, (req, res) => {
    res.json(expenses);
});
// GET /api/expense: Calculate the total expense for a user
app.get('/api/expense', authenticate, (req, res) => {
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
});
// POST /api/expenses: Add a new expense for a user
app.post('/api/expenses', authenticate, (req, res) => {
    const { description, amount, date } = req.body;
    const newExpense = {
        id: uuidv4(),
        description,
        amount,
        date
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

// PUT /api/expenses/:id: Update an existing expense
app.put('/api/expenses/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    const expense = expenses.find(exp => exp.id === id);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;

    res.json(expense);
});

// DELETE /api/expenses/:id: Delete an existing expense
app.delete('/api/expenses/:id', authenticate, (req, res) => {
    const { id } = req.params;

    const expenseIndex = expenses.findIndex(exp => exp.id === id);

    if (expenseIndex === -1) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    expenses.splice(expenseIndex, 1);
    res.status(204).send();
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
