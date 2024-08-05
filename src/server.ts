import app from "./app";
import { sequelize } from "./models/videoModel";
import { PORT } from "./config/serverConfig";

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log("Database connected and synced");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
