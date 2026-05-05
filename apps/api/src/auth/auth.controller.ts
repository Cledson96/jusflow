import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @Post("register")
  register(
    @Body()
    body: { name: string; email: string; password: string; organizationName: string }
  ) {
    return this.auth.register(body);
  }
}
