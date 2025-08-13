import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/authRouter.js";
import cors from "cors";
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || false
        : "http://localhost:3000",
    credentials: true,
}));
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/udyam", authRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
