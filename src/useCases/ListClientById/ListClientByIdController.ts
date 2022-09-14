import { ObjectID } from "bson";
import { Request, Response } from "express";
import { ListClientByIdUseCase } from "./ListClientByIdUseCase";

export class ListClientByIdController {
    constructor(
        private ListUserUsByIdeCase: ListClientByIdUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const id = new ObjectID(request?.params?.id);

        try{
            const result = await this.ListUserUsByIdeCase.execute(id);
            
            return response.status(200).send(result);
        } catch (err) {
            return response.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }

    }
}