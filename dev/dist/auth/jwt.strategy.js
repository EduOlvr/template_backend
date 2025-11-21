"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwks_rsa_1 = require("jwks-rsa");
const config_1 = require("@nestjs/config");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    config;
    logger = new common_1.Logger(JwtStrategy_1.name);
    constructor(config) {
        const realm = config.get('KEYCLOAK_REALM') || 'nexus';
        const audience = config.get('KEYCLOAK_AUDIENCE');
        const envHost = config.get('KEYCLOAK_HOST') || 'http://localhost:8080';
        const jwksUri = `${envHost}/realms/${realm}/protocol/openid-connect/certs`;
        const issuer = `${envHost}/realms/${realm}`;
        if (!audience) {
            throw new Error('KEYCLOAK_AUDIENCE é obrigatório');
        }
        const jwksProvider = (0, jwks_rsa_1.passportJwtSecret)({
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
                        this.logger.debug('💡 Tentar hosts alternativos: 127.0.0.1:8080 ou host.docker.internal:8080');
                    }
                    done(new common_1.UnauthorizedException('Serviço de autenticação indisponível'), null);
                }
                else {
                    done(null, secret);
                }
            });
        };
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider,
            algorithms: ['RS256'],
            issuer,
            audience,
            ignoreExpiration: false,
        });
        this.config = config;
        this.logger.log(`JWT Strategy configurada - Audience: ${audience}`);
    }
    async validate(payload) {
        if (!payload) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
        const email = payload.email || payload.preferred_username;
        if (!email) {
            throw new common_1.UnauthorizedException('Token sem identificação do usuário');
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
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map