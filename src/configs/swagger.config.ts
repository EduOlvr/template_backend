import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Nexus API')
  .setDescription(
    `
   Nexus Backend REST API
    `,
  )
  .setVersion('0.0.1')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Insira o token JWT no formato: Bearer {token}',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:4000', 'Ambiente de Desenvolvimento')
  .build();

export const runSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc-api', app, document, {
    jsonDocumentUrl: '/api-json',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
    },
  });
};
