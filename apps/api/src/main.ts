import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const host = config.get<string>("HOST") || "localhost";
  const port = config.get<number>("PORT") || 3000;

  app.enableCors({
    origin: config.get<string>("FRONTEND_URL"),
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Garage Log API")
    .setDescription("Fleet management showcase project")
    .setVersion("1.0")
    .addServer(`http://${host}:${port}/api`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
  console.log(`API running on http://${host}:${port}/api`);
}

bootstrap();
