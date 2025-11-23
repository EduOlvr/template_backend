import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async validateAndSyncUserFromToken(payload: any) {
    const email = payload.email || payload.preferred_username;
    if (!email) return null;

    let user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      user = this.usersRepository.create({
        email,
        fullName: payload.name || payload.given_name || '',
        password: null,
      });
      await this.usersRepository.save(user);
      this.logger.log(`Created local user record for ${email}`);
    }

    // return a lightweight user object merged with token roles
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: payload.realm_access?.roles || [],
      kcPayload: payload,
    };
  }
}
