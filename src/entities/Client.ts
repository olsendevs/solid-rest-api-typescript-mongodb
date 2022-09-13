import { ObjectId } from "mongodb";

export default class Client {
    public readonly _id: ObjectId;
    public name: string;
    public email: string;

    constructor(props: Omit<Client, '_id'>, _id?: ObjectId){
        Object.assign(this, props);

        if(!_id) {
            this._id = new ObjectId();
        }
    }
}