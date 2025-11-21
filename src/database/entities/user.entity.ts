import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @Column({
    name: 'full_name',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (hash)',
    example: '$2b$10$...',
  })
  @Column()
  password: string;
}
