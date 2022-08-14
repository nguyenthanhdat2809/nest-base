import { Transport } from '@nestjs/microservices';
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.SERVER_PORT,
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.templateDir = process.env.TEMPLATE_DIR;

    this.envConfig.itemService = {
      options: {
        port: process.env.ITEM_SERVICE_PORT || 3000,
        host: process.env.ITEM_SERVICE_HOST || 'item-service',
      },
      transport: Transport.TCP,
    };

    this.envConfig.userService = {
      options: {
        port: process.env.USER_SERVICE_PORT || 3000,
        host: process.env.USER_SERVICE_HOST || 'user-service',
      },
      transport: Transport.TCP,
    };

    this.envConfig.produceService = {
      options: {
        port: process.env.PRODUCE_SERVICE_PORT || 3000,
        host: process.env.PRODUCE_SERVICE_HOST || 'produce-service',
      },
      transport: Transport.TCP,
    };

    this.envConfig.saleService = {
      options: {
        port: process.env.SALE_SERVICE_PORT || 3000,
        host: process.env.SALE_SERVICE_HOST || 'sale-service',
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
