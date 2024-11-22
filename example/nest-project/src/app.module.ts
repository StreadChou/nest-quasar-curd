import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserCurdController, UserCurdService} from "./nest-quasar-curd/User.controller-service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserCurdEntity} from "./nest-quasar-curd/User.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'test',
            entities: [
                __dirname + '/nest-quasar-curd/*.entity{.ts,.js}',
                __dirname + '/nest-quasar-curd/**/*.entity{.ts,.js}',
            ],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([UserCurdEntity])
    ],
    controllers: [AppController, UserCurdController],
    providers: [AppService, UserCurdService],
})
export class AppModule {
}
