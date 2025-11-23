import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KeycloakStrategy } from './keycloak.strategy';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule.register({ defaultStrategy: 'keycloak-jwt' })],
  providers: [AuthService, KeycloakStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
