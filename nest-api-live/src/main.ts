import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as AWS from 'aws-sdk';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    await app.listen(5000);
    app.enableCors({
        origin: "*"
    });
}
bootstrap();
