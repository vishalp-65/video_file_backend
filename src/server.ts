import app from "./app";
import dotenv from "dotenv";
import { db } from "./database/sqlite";

dotenv.config();

const PORT = process.env.PORT;

db.then(() => {
    console.log("Database initialized");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Database initialization failed:", error);
});
