import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { ListClientByIdController } from "./ListClientByIdController";
import { ListClientByIdUseCase } from "./ListClientByIdUseCase";

const postgressUserRepository = new MongodbUserRepository();

const listClientByIdUseCase = new ListClientByIdUseCase(
    postgressUserRepository
);

const listClientByIdController = new ListClientByIdController(
    listClientByIdUseCase
);

export { listClientByIdUseCase, listClientByIdController  }