import express, { Request, Response } from "express";
import { createClientController } from "../useCases/CreateClient";
import { deleteClientController } from "../useCases/DeleteClient";
import { listClientController } from "../useCases/ListClient";
import { listClientByIdController } from "../useCases/ListClientById";
import { updateClientController } from "../useCases/UpdateClient";

export const clientsRouter = express.Router();

clientsRouter.use(express.json());

clientsRouter.post('/', (request, response) => {
    return createClientController.handle(request, response);
});

clientsRouter.delete('/:id', (request, response) => {
    return deleteClientController.handle(request, response);
});

clientsRouter.put('/:id', (request, response) => {
    return updateClientController.handle(request, response);
});

clientsRouter.get('/:id', (request, response) => {
    return listClientByIdController.handle(request, response);
});

clientsRouter.get('/', (request, response) => {
    return listClientController.handle(request, response);
});
