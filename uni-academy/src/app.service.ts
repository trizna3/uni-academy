import { Injectable } from '@nestjs/common';
import { AppsV1Api, CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import { Logger } from '@nestjs/common';
import { fstat, readFileSync } from 'fs';

@Injectable()
export class AppService {
  appv1Client: AppsV1Api = null;
  coreV1Client: CoreV1Api = null;
  private readonly logger = new Logger(AppService.name);

  constructor() {
    const kc = new KubeConfig();

    try {
      kc.loadFromCluster();
      this.appv1Client = kc.makeApiClient(AppsV1Api);
      this.coreV1Client = kc.makeApiClient(CoreV1Api);
      this.logger.log('K8s clients created');
    } catch (error) {
      this.logger.warn(error);
    }
  }

  getEnv(): any {
    return process.env;
  }
  getHello(): string {
    return `Hello from ${process.env['HOSTNAME'] || 'universe'}!`;
  }

  async getDeployments(namespace): Promise<any> {
    try {
      return await this.appv1Client.listNamespacedDeployment(namespace);
    } catch (error) {
      this.logger.warn(error);
    }
    return Promise.resolve('No client available');
  }

  async getPods(namespace): Promise<any> {
    try {
      return this.coreV1Client.listNamespacedPod(namespace);
    } catch (error) {
      this.logger.warn(error);
    }
    return Promise.resolve('No client available');
  }

  getConfig(): any {
    try {
      const f = readFileSync('/app/config.json')
      return f.toString()
    } catch (error) {
      this.logger.warn(error)
    }
    return 'File not found or not readable!'
  }
}
