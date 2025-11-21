# **Nexus Auth Backend \- Documentação Completa**

## **Índice**

* [Visão Geral]

* [Arquitetura]

* [Setup e Execução]

* [Autenticação JWT]

* [Rotas da API]

* [Testes no Postman]

* [Status do Projeto]

* [Próximos Passos]

---

## **Visão Geral**

Sistema de autenticação backend desenvolvido em NestJS integrado com Keycloak, fornecendo autenticação JWT federada com validação RS256 via JWKS.

### **Stack Tecnológica**

* Backend: NestJS \+ TypeScript

* Autenticação: Keycloak \+ Passport JWT

* Tokens: JWT RS256 com validação JWKS

* Container: Docker \+ Docker Compose

* Database: (Futuro)

---

**Arquitetura**

### **Fluxo de Autenticação**

1\. Usuário → Keycloak (login) → Access Token JWT  
2\. Client → NestJS (/me) com token no header  
3\. NestJS → Valida token via JWKS no Keycloak  
4\. NestJS → Retorna dados do usuário autenticado

### **Estrutura do Projeto**

dev/  
├── keycloak-server/  
│   ├── docker-compose.yml  
│   └── realm-nexus.json  
├── src/  
│   ├── auth/  
│   │   ├── jwt.strategy.ts  
│   │   └── auth.module.ts  
│   ├── app.controller.ts  
│   └── app.module.ts  
├── .env.example  
└── package.json

---

## **Setup e Execução**

### **Pré-requisitos**

* Docker e Docker Compose

* Node.js 18+

* npm ou yarn

### **Configuração do Ambiente**

1. Clonar repositório

git clone \<https://github.com/EduOlvr/template\_backend.gitl\>

2. Configurar variáveis

cp .env.example .env

3. Iniciar Keycloak

cd keycloak-server  
docker-compose up \-d

4. Instalar dependências e rodar NestJS (em outro terminal)

npm install  
npm run start:dev

### **Verificação do Setup**

Keycloak acessível em:

http://localhost:8080

NestJS acessível em:

http://localhost:3000

---

## **Autenticação JWT**

### **Configuração Keycloak**

* Realm: nexus

* Client: api-nexus

* Roles: admin, curador, pesquisador

### **Estratégia JWT**

* Validação RS256 via JWKS

* Cache de chaves

* Validação de issuer e audience

* Extração automática de roles

* Tratamento robusto de erros

### **Usuários Pré-configurados**

| Usuário | Senha | Roles |
| ----- | ----- | ----- |
|  |  |  |
| eduardo\_oliveira | 123456 | pesquisador |

---

## **Rotas da API**

### **Rotas Públicas**

GET /

### **Rotas Protegidas**

GET /me  
GET /profile

### **Rotas em Desenvolvimento**

POST /auth/refresh  
POST /auth/logout  
GET /auth/verify

---

## **Testes no Postman**

### **1\. Obter Token**

POST http://localhost:8080/realms/nexus/protocol/openid-connect/token  
Content-Type: application/x-www-form-urlencoded

grant\_type \= password  
client\_id  \= api-nexus  
username \= eduardo\_oliveira  
password \= sua\_senha

### **2\. Acessar Rota Protegida**

GET http://localhost:3000/me  
Authorization: Bearer \<access\_token\>

---

## **Status do Projeto**

### **Implementado**

* Estratégia JWT completa

* Validação RS256 com JWKS

* Keycloak via Docker

* Rotas protegidas

### **Em Desenvolvimento**

* Refresh token

* Logout

* Verificação de token

Entidade User

* Sincronização Keycloak → Banco de dados

### **Pendentes**

* Rate limiting

* CORS avançado

* Audit logging

* Guards baseados em roles

* Documentação Swagger

* CI/CD

---

## **Próximos Passos**

### **Prioridade Alta**

1. Implementar refresh token

2. Implementar logout

3. Criar entidade User

4. Sincronizar usuários do Keycloak

### **Prioridade Média**

1. Configurar CORS

2. Implementar role guards

3. Logging e monitoramento

4. Variáveis de produção

### **Prioridade Baixa**

1. Rate limiting

2. Swagger/OpenAPI

3. Testes automatizados

4. Pipeline CI/CD

