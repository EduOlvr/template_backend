import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

interface KeycloakJwtPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  realm_access?: {
    roles?: string[];
  };
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly config: ConfigService) {
    const realm = config.get<string>('KEYCLOAK_REALM') || 'nexus';
    const audience = config.get<string>('KEYCLOAK_AUDIENCE');
    
    // Configuração de hosts com fallback
    const envHost = config.get<string>('KEYCLOAK_HOST') || 'http://localhost:8080';
    
    const jwksUri = `${envHost}/realms/${realm}/protocol/openid-connect/certs`;
    const issuer = `${envHost}/realms/${realm}`;

    if (!audience) {
      throw new Error('KEYCLOAK_AUDIENCE é obrigatório');
    }

    const jwksProvider = passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri,
      timeout: 5000,
    });

    const secretOrKeyProvider = (request, rawJwtToken, done) => {
      jwksProvider(request, rawJwtToken, (err, secret) => {
        if (err) {
          this.logger.error(`Falha na conexão com Keycloak em ${envHost}: ${err.message}`);
          
          if (process.env.NODE_ENV === 'development') {
            this.logger.debug('Tentar hosts alternativos: 127.0.0.1:8080 ou host.docker.internal:8080');
          }
          
          done(new UnauthorizedException('Serviço de autenticação indisponível'), null);
        } else {
          done(null, secret);
        }
      });
    };

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider,
      algorithms: ['RS256'],
      issuer,
      audience,
      ignoreExpiration: false,
    });

    this.logger.log(`JWT Strategy configurada - Audience: ${audience}`);
  }

  async validate(payload: KeycloakJwtPayload) {
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    const email = payload.email || payload.preferred_username;

    if (!email) {
      throw new UnauthorizedException('Token sem identificação do usuário');
    }

    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`Usuário autenticado: ${email}`);
    }

    return {
      sub: payload.sub,
      email,
      name: payload.name || email,
      roles: payload.realm_access?.roles || [],
    };
  }
}
