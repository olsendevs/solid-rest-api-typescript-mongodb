import { ObjectId } from "mongodb";

export interface IUpdateClientRequestDTO {
    name: string;
    email: string;
    _id: ObjectId;
}