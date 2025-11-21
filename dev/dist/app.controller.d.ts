import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getPublic(): string;
    getMe(req: any): {
        message: string;
        user: any;
    };
    getProfile(req: any): {
        user: {
            id: any;
            email: any;
            name: any;
            roles: any;
        };
    };
}
