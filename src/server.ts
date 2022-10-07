import 'express-async-errors'
import { connectToDatabase } from "./services/database.service"
import { app } from './app';
import { clientsRouter } from "./routes/clients.routes";
import cors from 'cors';
import { errorMiddleware } from "./middlewares/error";

connectToDatabase()
    .then(() => {

        const options: cors.CorsOptions = {
            methods: "GET, OPTIONS, PUT, POST, DELETE",
            origin: "*"
        };

        app.use(cors(options));

        app.use("/clients", clientsRouter);

        app.use(errorMiddleware);

        return app.listen(3333);
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });