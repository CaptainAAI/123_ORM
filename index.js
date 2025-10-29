const express = require('express');
const app = express();
const port = 3001;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
db.sequelize.sync()
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    })

// Get all comics
app.get('/komik', async (req, res) => {
    try {
        const komiks = await db.Komik.findAll();
        res.json(komiks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a single comic by ID
app.get('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik not found' });
        }
        res.json(komik);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/komik', async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.send(komik);
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik not found' });
        }
        await komik.update(data);
        res.send(komik);
    } catch (error) {
        res.send({ error: error.message });
    }   
});

app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ error: 'Komik not found' });
        }
        await komik.destroy();
        res.send({ message: 'Komik deleted successfully' });
    } catch (error) {
        res.send({ error: error.message });
    }
});