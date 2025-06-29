import express from 'express';
import cors from 'cors';

import cartRoutes from './routes/cartRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/restaurants', (req, res) => {
  res.json([{ id: 1, name: 'Pizza Place' }, { id: 2, name: 'Sushi Spot' }]);
});

// Use cartRoutes with '/api' prefix
app.use('/api', cartRoutes);

const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
