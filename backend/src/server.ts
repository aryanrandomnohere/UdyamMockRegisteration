import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/authRouter.js";
import cors from "cors";
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",    //TODO: Change to production URL
    credentials: true,
}));
app.use("/api/v1/udyam", authRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});