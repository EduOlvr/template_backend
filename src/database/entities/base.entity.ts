import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ type: String, format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: Date,
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: Date,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt?: Date;
}
