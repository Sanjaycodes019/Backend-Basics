// form submission using fetch
const express = require('express')
const app = expree();

app.post('/submit', async (req, res) => {
    const data = { username: 'Sanjay', email: 'test@example.com' };

    // Sending data to another internal API using fetch
    const apiRes = await fetch('http://localhost:3000/another-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await apiRes.json();
    res.json({ message: 'Data sent to another route', result });
});
