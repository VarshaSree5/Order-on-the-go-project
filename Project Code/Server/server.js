import express from 'express';
import cors from 'cors';

import cartRoutes from './routes/cartRoutes.js';  // <-- Import cartRoutes here

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Your existing /restaurants route
app.get('/restaurants', (req, res) => {
  res.json([{ id: 1, name: 'Pizza Place' }, { id: 2, name: 'Sushi Spot' }]);
});

// Use cartRoutes middleware
app.use(cartRoutes);  // <-- Add this to use the routes in cartRoutes.js

const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
