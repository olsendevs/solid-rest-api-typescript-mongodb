import { ObjectID } from "bson";
import { Request, Response } from "express";
import { DeleteClientUseCase } from "./DeleteClientUseCase";

export class DeleteClientController {
    constructor(
        private DeleteUserUseCase: DeleteClientUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const id = new ObjectID(request?.params?.id);

        await this.DeleteUserUseCase.execute(id);
            
        return response.status(204).send();

    }
}