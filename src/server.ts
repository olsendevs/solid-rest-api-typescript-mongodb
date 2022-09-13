import express from "express";
import { connectToDatabase } from "./services/database.service"
import { app } from './app';
import { router } from "./routes";

connectToDatabase()
    .then(() => {
        app.use(router);

        app.listen(3333, () => {
            console.log(`Server started at http://localhost:3333`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });