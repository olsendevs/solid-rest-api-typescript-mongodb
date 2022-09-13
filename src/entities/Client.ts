import { ObjectId } from "mongodb";

export default class Client {
    public readonly id: ObjectId;
    public name: string;
    public email: string;

    constructor(props: Omit<Client, 'id'>, id?: ObjectId){
        Object.assign(this, props);

        if(!id) {
            this.id = new ObjectId();
        }
    }
}