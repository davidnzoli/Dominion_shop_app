import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import error from "./src/middlewares/error.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//middlewares

app.use(express.json());
app.use(cors());

//Routes
app.use("/api", userRoutes);

app.get("/", async(req, res)=>{
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is : $${result.rows[0].current_database}`)
})

app.listen(port,()=>{
    console.log(`server is running on http:localhost:${port}`) 
})

//error initilisée

app.use(error)