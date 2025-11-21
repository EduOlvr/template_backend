import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ormConfig } from './database';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), HealthModule],
  providers: [AppService],
})
export class AppModule {}
