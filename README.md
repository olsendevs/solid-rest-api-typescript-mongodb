# Modelo de REST SOLID API em TypeScript com MongoDB  
Seguem referencias para criação do modelo:
- Princípios SOLID em uma API REST com Node.js e TypeScript (https://www.youtube.com/watch?v=vAV4Vy4jfkc)
- MVP de micro-serviço com TypeScript, Mongo e TDD (https://www.youtube.com/watch?v=f9zdYWnuPzc)
- SOLID (O básico para você programar melhor) (https://www.youtube.com/watch?v=mkx0CdWiPRA)
- Como usar o TypeScript com o MongoDB Atlas (https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial)

## Iniciando o projeto

1. Para iniciar seu ambiente use os seguintes comandos:

``yarn init -y ``  (Para criar a package.json com as configurações básicas)

``yarn add ts-node-dev``   (Para inserir a biblioteca de modo desenvolvimento do ts)

``yarn add typescript --ts-node-dev``  (para inserir o typescript no modo dev)

``tsc --init`` (Para criar o arquivo tsconfig.json com as configurações básicas)

``yarn add express`` (Para adicionar o express, modulo que cria um servidor local para rodar sua aplicação)

``yarn add @types/express -D`` (Para adicionar as tipagens do express no modo dev)

``yarn add mongodb`` (Para adicionar o mongodb ao projeto)

``yarn add dotenv`` (Para adicionar a biblioteca dotenv que serve para esconder dados secretos como senhas)

2. Configure seu arquivo tsconfig.json conforme a necessidade do projeto, segue abaixo o exemplo básico:
```
{
  "compilerOptions": {

    "target": "ES2021",                               

    "module": "commonjs",     
    
    "allowJs": true,
 
    "esModuleInterop": true,                          
    
    "forceConsistentCasingInFileNames": true,         
                             
    "skipLibCheck": true                              
  },
  "include": [
    "src/**/*.ts"]
}

```

3. Criando a estrutura de pastas e arquivos iniciais da API, crie uma pasta chamada ``src/`` e dentro dela a seguinte estrutura:
```
- entities/
- providers/
- repositories/
- services/
- useCases/
- app.ts
- server.ts
- .env
```

4. Dentro do arquivo .env você deve inserir as informações sigilosas do seu projeto, como a connection string, segue um exemplo abaixo:

```
DB_CONN_STRING="mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net"
DB_NAME="solid-api"
CLIENT_COLLECTION_NAME="client"
```

5. Dentro da pasta ``entities/`` crie a entidade base para seu projeto e inicie as propriedades no seu construtor, segue um exemplo:

```
import { ObjectId } from "mongodb";

export class User {
    public readonly _id: ObjectId;

    public name: string;
    public email: string;

    constructor(props: Omit<User, '_id'>, _id?: string){
        Object.assign(this, props);

        if(!_id) {
            this._id = new ObjectId();
        }
    }
}

```

6. Dentro da pasta ``services/`` vamos criar nosso arquivo de configuração e conexão com o banco ``database.service.ts``, segue o exemplo abaixo:

```
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { client?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const clientCollection: mongoDB.Collection = db.collection(process.env.CLIENT_COLLECTION_NAME);

    await db.command({
        "collMod": process.env.CLIENT_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "price", "category"],
                additionalProperties: false,
                properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string"
                }
                }
            }
         }
    });

 
    collections.client = clientCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${clientCollection.collectionName}`);
 }


```

7. Agora criaremos nosso CRUD para cada funcionalidade da API, segue abaixo a estrutura de arquivos que deve ser criada dentro da pasta ``useCases`` para cada função dentro do projeto, a seguir veja um exemplo de um POST:

```
- CreateClient/
  - CreateClientController.ts
  - CreateClientDTO.ts
  - CreateClienteUseCase.spec.ts
  - CreateClientUseCase.ts
  - index.js
```

8. Dentro do seu arquivo DTO você deve criar uma interface para o request que será enviado nesse POST:
 
```
export interface ICreateClientRequestDTO {
    name: string;
    email: string;
}
```

9. No controlLer ``CreateClientController`` você criar um método ``handle`` com a implementação da funcionalidade que será criada no arquivo ``UseCase`` baseada nas resposta enviada no corpo da requisição, é aqui que você envia as respostas e os erros:

```
import { Request, Response } from "express";
import { CreateClientUseCase } from "./CreateClientUseCase";

export class CreateClientController {
    constructor(
        private createUserUseCase: CreateClientUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email } = request.body;

        try{
            var result = await this.createUserUseCase.execute({
                name,
                email,
            });
            

            return response.status(201).send(result);
        } catch (err) {
            return response.status(400).json({
                message: err.message || 'Unexpected error.'
            })
        }

    }
}

```

10. No seu UseCase ``CreateClientUseCase`` você deve inserir um método com a lógica por trás dessa chamada, a classe deve chamar e instanciar as interfaces, veja o exemplo a seguir onde verificamos se o e-mail já existe, salvamos no banco caso não exista:
```
import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IUsersRepository";
import { ICreateClientRequestDTO } from "./CreateClientDTO";

export class CreateClientUseCase {
    constructor(
        private clientsRepository: IClientRepository
    ) {}
    
    async execute(data: ICreateClientRequestDTO): Promise<Client> {
        const userAlreadyExists = await this.clientsRepository.findByEmail(data.email);

        if(userAlreadyExists){
            throw new Error('Client already exists.');
        }
        const user = new Client(data);

        await this.clientsRepository.save(user);

        return user;
    }
}

```

11. Em seguida criaremos as interfaces dos nossos ``repositories/`` e ``providers/``:

A pasta ``repositories`` guarda as classes que se comunicam com o banco de dados da aplicação, veja o exemplo a seguir no arquivo ``IClientRepository``:
```
import { ObjectId } from "mongodb";
import Client from "../entities/Client";

export interface IUsersRepository {
    findByEmail(email: string): Promise<Client>;
    save(user: Client): Promise<void>;
    delete(id: ObjectId): Promise<Client[]>;
    listAll(): Promise<Client[]>;
}

```


Cada pasta deve conter uma sub-pasta chamada ``implementation/`` que é o local onde as interfaces serão implementadas.

12. Agora devemos criar a implementação dos nossos ``repositories/`` e ``providers/``, veja abaixo como criar um repositorio com MongoDB:

Crie o arquivo ``MongodbClientRepository``:
```
import { CollectionOptions, ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../IClientRepository";
import { collections } from "../../services/database.service";


export class MongodbUserRepository implements IClientRepository{
    private clients = collections.client;

    async findByEmail(email: string): Promise<Client> {
        const query = { email: email };
        const user = (await this.clients.findOne(query)) as unknown as Client;
        return user;
    }

    async save(user: Client): Promise<void> {
        await this.clients.insertOne(user);
    }

    async delete(id: ObjectId): Promise<Client> {

        const user = await this.clients.find(x => x.id === id) as unknown as Client;
        await this.clients.deleteOne(user);
        return user;
    }

    async listAll(): Promise<Client[]> {
        return (await this.clients.find({}).toArray()) as unknown as Client[]; 
    }
}
```

13. Agora você deve configurar seu ``index.js`` implementando os repositorios e provedores:
```
import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { CreateClientController } from "./CreateClientController";
import { CreateClientUseCase } from "./CreateClientUseCase";

const postgressUserRepository = new MongodbUserRepository();

const createUserUseCase = new CreateClientUseCase(
    postgressUserRepository
);

const createUserController = new CreateClientController(
    createUserUseCase
);

export { createUserUseCase, createUserController  }

```


14. Agora configure seu ``app.ts`` da seguinte forma:

```
import express from 'express';
import { router } from './routes';

const app = express();

app.use(express.json());

export { app }

```

15. Agora você deve definir suas rotas no arquivo ``routes.ts``:
```
import { Router } from "express";
import { createClientController } from "./useCases/CreateClient";

const router = Router();

router.post('/client', (request, response) => {
    return createClientController.handle(request, response);
});


export { router }

```

16. Em seguida configure seu ``server.ts`` da seguinte forma:
```
import express from "express";
import { connectToDatabase } from "./services/database.service"
import { app } from './app';
import { router } from "./routes";

connectToDatabase()
    .then(() => {
        app.use(router);

        app.listen(3333, () => {
            console.log(`Server started at http://localhost:3333`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });
```

Com isso você pode criar um projeto com qualquer funcionalidade dentro da métodologia SOLID. O restante das chamadas está no projeto.
