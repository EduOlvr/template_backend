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
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    validate(payload: KeycloakJwtPayload): Promise<{
        sub: string;
        email: string;
        name: string;
        roles: string[];
    }>;
}
export {};
