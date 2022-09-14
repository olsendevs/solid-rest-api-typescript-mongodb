import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { DeleteClientController } from "./DeleteClientController";
import { DeleteClientUseCase } from "./DeleteClientUseCase";

const mongodbUserRepository = new MongodbUserRepository();

const deleteClientUseCase = new DeleteClientUseCase(
    mongodbUserRepository
);

const deleteClientController = new DeleteClientController(
    deleteClientUseCase
);

export { deleteClientUseCase, deleteClientController  }