import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// App Config
const PORT = process.env.PORT || 4000
const app = express();
await connectDB();

app.use(express.json());
app.use(cors());

// SPECIAL: For Clerk webhooks, use express.raw for signature validation
app.use('/api/users/webhooks', express.raw({ type: 'application/json' }));


app.get('/', (req, res) => {
    res.send("API Working")
})
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);


app.listen(PORT, ()=>{
    console.log("Server running on PORT " + PORT)
})