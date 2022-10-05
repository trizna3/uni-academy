import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/env')
  getEnv(): any {
    return this.appService.getEnv();
  }

  @Get('/pods')
  getPods(  @Query('namespace') namespace: string   ): any {
    return this.appService.getPods(namespace);
  }

  @Get('/deployments')
  getDeployments(  @Query('namespace') namespace: string   ): any {
    return this.appService.getDeployments(namespace);
  }

  @Get('/config')
  getConfig(){
    return this.appService.getConfig();
  }
}
