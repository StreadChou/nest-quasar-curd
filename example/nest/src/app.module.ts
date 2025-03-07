import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ModuleList} from "./generator/collect/module.collect";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EntityList} from "./generator/collect/entity.collect";

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
                ...EntityList,
            ],
            synchronize: true,
        }),
        ...ModuleList,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
