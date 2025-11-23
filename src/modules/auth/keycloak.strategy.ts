import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import config from 'config';
import { AuthService } from './auth.service';

const keycloakConfig = config.get<any>('keycloak');

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak-jwt') {
  constructor(private readonly authService: AuthService) {
    // Log configured Keycloak endpoints to help debug DNS/URL issues
    const jwksUri = keycloakConfig?.jwksUri;
    const tokenEndpoint = keycloakConfig?.tokenEndpoint;
    const issuer = keycloakConfig?.issuer;

    // Defensive checks
    if (!jwksUri || typeof jwksUri !== 'string') {
      console.error('Keycloak JWKS URI is not configured or invalid:', jwksUri);
    } else {
      console.log('Keycloak JWKS URI:', jwksUri);
    }

    if (!tokenEndpoint || typeof tokenEndpoint !== 'string') {
      console.error('Keycloak tokenEndpoint is not configured or invalid:', tokenEndpoint);
    } else {
      console.log('Keycloak tokenEndpoint:', tokenEndpoint);
    }

    if (!issuer || typeof issuer !== 'string') {
      console.error('Keycloak issuer is not configured or invalid:', issuer);
    } else {
      console.log('Keycloak issuer:', issuer);
    }

    // create secret provider defensively to surface misconfigured URLs
    let secretProvider: any = undefined;
    try {
      if (jwksUri) {
        secretProvider = jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri,
        });
      }
    } catch (err) {
      console.error('Failed to create jwks secret provider:', err);
      throw err;
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKeyProvider: secretProvider as any,
    });
  }

  async validate(payload: any) {
    // payload is the decoded JWT from Keycloak
    return this.authService.validateAndSyncUserFromToken(payload);
  }
}
