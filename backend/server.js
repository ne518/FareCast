import express from 'express';
import cors from 'cors';
import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Redis setup
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();

// Dummy route caching endpoint
app.get('/api/routes/:route', async (req, res) => {
  const route = req.params.route;
  const cached = await redisClient.get(route);
  if (cached) {
    return res.json({ source: 'cache', data: JSON.parse(cached) });
  }
  const data = { price: Math.floor(Math.random() * 1000 + 300) };
  await redisClient.set(route, JSON.stringify(data), { EX: 60 });
  res.json({ source: 'api', data });
});

// Connect ML endpoint (to be served by Flask separately)
app.get('/api/predict', (req, res) => {
  res.json({ price: 720 }); // Dummy data
});

app.listen(port, () => console.log(`Server running on port ${port}`));
