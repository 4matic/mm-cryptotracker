import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { CryptoModule } from '@/crypto/crypto.module';
import mikroOrmConfig from '@/mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
