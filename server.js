const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const env = require('dotenv').config();

const app = express();
const port = 5000;

// Replace with your Supabase URL and anon key
const supabaseUrl = env.parsed.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = env.parsed.SUPABASE_KEY || 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// allow serving static files from the root directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tasks', async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*');

    if (error) {
        res.status(500).send(error.message);
        return;
    }
    res.json(data);
});

app.post('/api/tasks', async (req, res) => {
    const { content, status } = req.body;
    if (!content || !status) {
        return res.status(400).send('Content and status are required');
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert([{ content, status }])
        .select();

    if (error) {
        res.status(500).send(error.message);
        return;
    }
    res.json(data[0]);
});

app.put('/api/tasks/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).send('Status is required');
    }

    const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        res.status(500).send(error.message);
        return;
    }
    if (!data || data.length === 0) {
        return res.status(404).send('Task not found');
    }
    res.json({ message: 'Task updated successfully' });
});

app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        res.status(500).send(error.message);
        return;
    }
    
    res.json({ message: 'Task deleted successfully' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});