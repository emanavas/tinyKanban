
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// allow serving static files from the root directory
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./kanban.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the kanban database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        status TEXT NOT NULL
    )`);
});

app.get('/api/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/api/tasks', (req, res) => {
    const { content, status } = req.body;
    if (!content || !status) {
        return res.status(400).send('Content and status are required');
    }

    const sql = `INSERT INTO tasks (content, status) VALUES (?, ?)`;
    db.run(sql, [content, status], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json({ id: this.lastID, content, status });
    });
});

app.put('/api/tasks/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).send('Status is required');
    }

    const sql = `UPDATE tasks SET status = ? WHERE id = ?`;
    db.run(sql, [status, id], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (this.changes === 0) {
            return res.status(404).send('Task not found');
        }
        res.json({ message: 'Task updated successfully' });
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (this.changes === 0) {
            return res.status(404).send('Task not found');
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
