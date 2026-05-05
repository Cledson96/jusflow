import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";

@Module({
  controllers: [AiController],
  providers: [{ provide: "AI_PROVIDER", useValue: undefined }, AiService]
})
export class AiModule {}
