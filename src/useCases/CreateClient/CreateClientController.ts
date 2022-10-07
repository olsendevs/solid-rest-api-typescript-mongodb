import { Request, Response } from "express";
import { CreateClientUseCase } from "./CreateClientUseCase";

export class CreateClientController {
    constructor(
        private createUserUseCase: CreateClientUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email } = request.body;

        const result = await this.createUserUseCase.execute({
            name,
            email
        });
        return response.status(201).send(result);
    }
}