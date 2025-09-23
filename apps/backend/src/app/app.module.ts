import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { CryptoModule } from '@/crypto/crypto.module';
// import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroOrmConfig from '@/mikro-orm.config';
// import { Asset } from '@/entities/asset.entity';
// import { TradingPair } from '@/entities/trading-pair.entity';
// import { PriceHistory } from '@/entities/price-history.entity';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), CryptoModule],
  // imports: [
  //   MikroOrmModule.forRoot({
  //     driver: PostgreSqlDriver,
  //     host: process.env.DATABASE_HOST,
  //     port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  //     user: process.env.DATABASE_USER,
  //     password: process.env.DATABASE_PASSWORD,
  //     dbName: process.env.DATABASE_NAME,
  //     entities: [Asset, TradingPair, PriceHistory],
  //     // entities: ['./dist/entities/*.entity.ts'],
  //     // entitiesTs: ['./src/entities/*.entity.ts'],
  //     debug: process.env.NODE_ENV !== 'production',
  //     preferTs: true,
  //   }),
  //   CryptoModule,
  // ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
