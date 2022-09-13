# Modelo de REST SOLID API em TypeScript 
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

3.
 
