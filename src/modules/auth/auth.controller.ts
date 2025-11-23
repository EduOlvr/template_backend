import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import axios from 'axios';
import config from 'config';

const keycloakConfig = config.get<any>('keycloak');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    return req.user;
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', body.refresh_token);
    params.append('client_id', keycloakConfig.clientId);
    if (keycloakConfig.clientSecret) params.append('client_secret', keycloakConfig.clientSecret);

    const resp = await axios.post(keycloakConfig.tokenEndpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return resp.data;
  }

  @Post('logout')
  async logout(@Body() body: RefreshDto) {
    // Keycloak supports logout endpoint via POST to /protocol/openid-connect/logout
    const logoutEndpoint = keycloakConfig.tokenEndpoint.replace('/token', '/logout');
    const params = new URLSearchParams();
    params.append('refresh_token', body.refresh_token);
    params.append('client_id', keycloakConfig.clientId);
    if (keycloakConfig.clientSecret) params.append('client_secret', keycloakConfig.clientSecret);

    const resp = await axios.post(logoutEndpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return { ok: true, data: resp.data };
  }
}
