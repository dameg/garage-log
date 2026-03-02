import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: config.get<string>("FRONTEND_URL"),
  });

  const port = config.get<number>("PORT") || 3000;

  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
