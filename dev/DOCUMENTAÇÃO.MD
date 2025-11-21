# **Documentação**

## **Índice**

* [Visão Geral]

* [Arquitetura]

* [Setup e Execução]

* [Autenticação JWT]

* [Rotas da API]

* [Testes no Postman]

* [Status do Projeto]

---

## **Visão Geral**

Sistema de autenticação backend desenvolvido em NestJS integrado com Keycloak, fornecendo autenticação JWT com validação RS256 via JWKS.

### **Stack Tecnológica**

* Backend: NestJS

* Autenticação: Keycloak \+ Passport JWT

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

2. Iniciar Keycloak

cd keycloak-server  
docker-compose up \-d

3. Instalar dependências e rodar NestJS (em outro terminal)

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

* Rotas protegidas

* Clients configurados corretamente

* Roles e realms configurados no Keycloak

### **Em Desenvolvimento**

* Refresh token

* Logout

* Verificação de token

* Sincronização Keycloak → Banco de dados

---


