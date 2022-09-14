import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { ListClientController } from "./ListClientController";
import { ListClientUseCase } from "./ListClientUseCase";

const postgressUserRepository = new MongodbUserRepository();

const listClientUseCase = new ListClientUseCase(
    postgressUserRepository
);

const listClientController = new ListClientController(
    listClientUseCase
);

export { listClientUseCase, listClientController  }