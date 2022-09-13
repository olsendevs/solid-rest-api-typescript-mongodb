import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { CreateClientController } from "./CreateClientController";
import { CreateClientUseCase } from "./CreateClientUseCase";

const postgressUserRepository = new MongodbUserRepository();

const createClientUseCase = new CreateClientUseCase(
    postgressUserRepository
);

const createClientController = new CreateClientController(
    createClientUseCase
);

export { createClientUseCase, createClientController  }