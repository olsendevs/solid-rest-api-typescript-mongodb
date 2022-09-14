import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { CreateClientController } from "./CreateClientController";
import { CreateClientUseCase } from "./CreateClientUseCase";

const mongodbUserRepository = new MongodbUserRepository();

const createClientUseCase = new CreateClientUseCase(
    mongodbUserRepository
);

const createClientController = new CreateClientController(
    createClientUseCase
);

export { createClientUseCase, createClientController  }