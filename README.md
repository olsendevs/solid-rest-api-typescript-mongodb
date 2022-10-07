# Modelo de REST SOLID API em TypeScript com MongoDB  
Seguem referencias para criação do modelo:
- Princípios SOLID em uma API REST com Node.js e TypeScript (https://www.youtube.com/watch?v=vAV4Vy4jfkc)
- MVP de micro-serviço com TypeScript, Mongo e TDD (https://www.youtube.com/watch?v=f9zdYWnuPzc)
- SOLID (O básico para você programar melhor) (https://www.youtube.com/watch?v=mkx0CdWiPRA)
- Como usar o TypeScript com o MongoDB Atlas (https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial)
- Jest Documentation using TypeScript (https://jestjs.io/docs/getting-started#using-typescript)
- Jest Documentation using MongoDB (https://jestjs.io/docs/mongodb)
- Tratamento de erros no Express.js com TypeScript (https://www.youtube.com/watch?v=SnxAq9ktyuo)

## Iniciando o projeto

1. Para iniciar seu ambiente use os seguintes comandos:

``yarn init -y ``  (Para criar a package.json com as configurações básicas)

``yarn add ts-node-dev -D``   (Para inserir a biblioteca de modo desenvolvimento do ts)

``yarn add typescript --ts-node-dev``  (para inserir o typescript no modo dev)

``tsc --init`` (Para criar o arquivo tsconfig.json com as configurações básicas)

``yarn add express`` (Para adicionar o express, modulo que cria um servidor local para rodar sua aplicação)

``yarn add @types/express -D`` (Para adicionar as tipagens do express no modo dev)

``yarn add mongodb`` (Para adicionar o mongodb ao projeto)

``yarn add dotenv`` (Para adicionar a biblioteca dotenv que serve para esconder dados secretos como senhas)

``yarn add cors`` (Para adicionar a biblioteca CORS)

``yarn add express-async-errors`` (Para inserir o sistema de middleware de erros do express)

``yarn add jest -D`` (Para adiciona o Jest, biblioteca de testes js)

``yarn add @babel/preset-typescript -D`` (Para adicionar as configurações do Jest para o typescript)

``yarn add --dev @babel/preset-env`` (Para adicionar a configuração necessaria parar o Jest)

``yarn add --dev @shelf/jest-mongodb`` (Para adicionar a biblioteca do Jest para MongoDB)

2. Configure seu arquivo tsconfig.json conforme a necessidade do projeto, segue abaixo o exemplo básico:
```
{
	"compilerOptions": {
		"target": "es2018",
		"lib": ["es5", "es6", "ES2018"],
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"module": "commonjs",
		"moduleResolution": "node",
		"resolveJsonModule": true,
		"allowJs": true,
		"outDir": "./dist",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"noImplicitAny": true,
		"strictPropertyInitialization": false
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"],
	"ts-node": {
		"files": true
	}
}

```

Seguem scripts que devem ficar no seu arquivo ``package.json`` para rodar o projeto:
```
  "scripts": {
    "test": "jest",
    "dev": "tsnd --transpile-only --respawn --ignore-watch node_modules src/server.ts",
    "start": "npm run build && node dist/server.js",
    "build": "tsc"
  },
```

Crie um arquivo chamado ``babel.config.js`` que será utilizado para configurar a conversão dos testes para o typescript, para isso siga o modelo abaixo:
```
module.exports = {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
  };
```

3. Criando a estrutura de pastas e arquivos iniciais da API, crie uma pasta chamada ``src/`` e dentro dela a seguinte estrutura:
```
- entities/
- middlewares/
- helpers/
- providers/
- repositories/
- services/
- useCases/
- routes/
- app.ts
- server.ts
- .env
```

4. O proximo passo é criar o seu sistema de gerenciamento de erros, para isso comece criando dentro da pasta ``helpers`` um arquivo chamado ``api-errors.ts``, siga o modelo abaixo ao cria-lo:
```
export class ApiError extends Error {
	public readonly statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400)
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(message, 401)
	}
}
```

5. Agora você deve criar seus middlewares para gerenciamento de erros no projeto, dentro da pasta ``middlewares`` crie o arquivo ``error.ts``, segue o exemplo:
```
import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../helpers/api-errors'

export const errorMiddleware = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = error.statusCode ?? 500
	const message = error.statusCode ? error.message : 'Internal Server Error'
	return res.status(statusCode).json({ message })
}

```


6. Dentro do arquivo .env você deve inserir as informações sigilosas do seu projeto, como a connection string, segue um exemplo abaixo:

```
DB_CONN_STRING="mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net"
DB_NAME="solid-api"
CLIENT_COLLECTION_NAME="client"
```

7. Dentro da pasta ``entities/`` crie a entidade base para seu projeto e inicie as propriedades no seu construtor, segue um exemplo:

```
import { ObjectId } from "mongodb";

export class Client {
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

8. Dentro da pasta ``services/`` vamos criar nosso arquivo de configuração e conexão com o banco ``database.service.ts``, segue o exemplo abaixo:

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
Outro exemplo sem validação de campos:
```
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { classification?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const classificationCollection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME);
 
    collections.classification = classificationCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${classificationCollection.collectionName}`);
 }


```


9. Agora criaremos nosso CRUD para cada funcionalidade da API, segue abaixo a estrutura de arquivos que deve ser criada dentro da pasta ``useCases`` para cada função dentro do projeto, a seguir veja um exemplo de um POST:

```
- CreateClient/
  - CreateClientController.ts
  - CreateClientDTO.ts
  - CreateClienteUseCase.spec.ts
  - CreateClientUseCase.ts
  - index.js
```

10. Dentro do seu arquivo DTO você deve criar uma interface para o request que será enviado nesse POST:
 
```
export interface ICreateClientRequestDTO {
    name: string;
    email: string;
}
```

11. No controlLer ``CreateClientController`` você criar um método ``handle`` com a implementação da funcionalidade que será criada no arquivo ``UseCase`` baseada nas resposta enviada no corpo da requisição, é aqui que você envia as respostas e os erros:

```
import { Request, Response } from "express";
import { CreateClientUseCase } from "./CreateClientUseCase";

export class CreateClientController {
    constructor(
        private createUserUseCase: CreateClientUseCase,
    ){}
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email } = request.body;
        var result = await this.createUserUseCase.execute({
            name,
            email,
        });
        

        return response.status(201).send(result);
    }
}

```

12. No seu UseCase ``CreateClientUseCase`` você deve inserir um método com a lógica por trás dessa chamada, a classe deve chamar e instanciar as interfaces, veja o exemplo a seguir onde verificamos se o e-mail já existe, salvamos no banco caso não exista:
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
            throw new BadRequestError('Client already exists.');
        }
        const user = new Client(data);

        await this.clientsRepository.save(user);

        return user;
    }
}

```

13. Em seguida criaremos as interfaces dos nossos ``repositories/`` e ``providers/``:

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

14. Agora devemos criar a implementação dos nossos ``repositories/`` e ``providers/``, veja abaixo como criar um repositorio com MongoDB:

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

15. Agora você deve configurar seu ``index.ts`` implementando os repositorios e provedores:
```
import { MongodbUserRepository } from "../../repositories/implementations/MongodbClientRepository";
import { CreateClientController } from "./CreateClientController";
import { CreateClientUseCase } from "./CreateClientUseCase";

const mongodbUserRepository = new MongodbUserRepository();

const createUserUseCase = new CreateClientUseCase(
    mongodbUserRepository
);

const createUserController = new CreateClientController(
    createUserUseCase
);

export { createUserUseCase, createUserController  }

```


16. Agora configure seu ``app.ts`` da seguinte forma:

```
import express from 'express';

const app = express();

app.use(express.json());

export { app }

```

17. Agora você deve definir as rotas do seu objeto no arquivo ``clients.routes.ts``:
```
import express, { Request, Response } from "express";
import { createClientController } from "../useCases/CreateClient";
import { deleteClientController } from "../useCases/DeleteClient";

export const clientsRouter = express.Router();

clientsRouter.use(express.json());

clientsRouter.post('/', (request, response) => {
    return createClientController.handle(request, response);
});


```

18. Agora você deve criar o seu arquivo ``server.ts``, nele você deve adicionar o middleware de erro do seu projeto sempre antes do return, segue o modelo abaixo que pode ser utilizado como base:
```
import 'express-async-errors'
import { connectToDatabase } from "./services/database.service"
import { app } from './app';
import { clientsRouter } from "./routes/clients.routes";
import cors from 'cors';
import { errorMiddleware } from "./middlewares/error";

connectToDatabase()
    .then(() => {

        const options: cors.CorsOptions = {
            methods: "GET, OPTIONS, PUT, POST, DELETE",
            origin: "*"
        };

        app.use(cors(options));

        app.use("/clients", clientsRouter);

        app.use(errorMiddleware);

        return app.listen(3333);
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

```


Com isso você pode criar um projeto com qualquer funcionalidade dentro da métodologia SOLID. O restante das chamadas está no projeto.
