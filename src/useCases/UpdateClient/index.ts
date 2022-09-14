import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { UpdateClientController } from "./UpdateClientController";
import { UpdateClientUseCase } from "./UpdateClientUseCase";

const postgressUserRepository = new MongodbUserRepository();

const updateClientUseCase = new UpdateClientUseCase(
    postgressUserRepository
);

const updateClientController = new UpdateClientController(
    updateClientUseCase
);

export { updateClientUseCase, updateClientController  }