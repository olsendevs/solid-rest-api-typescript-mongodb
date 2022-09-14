import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UpdateClientUseCase } from "./UpdateClientUseCase";

export class UpdateClientController {
    constructor(
        private UpdateUserUseCase: UpdateClientUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const id = new ObjectId(request?.params?.id);
        const { name, email } = request.body;

        try{
            const result = await this.UpdateUserUseCase.execute({
                name,
                email,
                _id: id
            });
            

            result
                ? response.status(200).send(result)
                : response.status(304).send();
    
        } catch (err) {
            return response.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }

    }
}