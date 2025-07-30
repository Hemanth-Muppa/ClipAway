import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

await connectDB();

// CORS - generally should come before routes
app.use(cors());

// Use JSON parser for all routes except webhook route
app.use(express.json());

// Raw parser for Clerk webhooks (must come before userRouter if webhooks are in userRouter)
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }))

// Test root
app.get('/', (req, res) => {
  res.send('API Working');
});

// Routers
app.use('/api/user', userRouter);    // userRouter to include: /webhooks POST handler for webhook
app.use('/api/image', imageRouter);

app.listen(PORT, () => {
  console.log('Server running on PORT ' + PORT);
});
