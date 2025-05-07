import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EntityList} from "./curd/EntityList";
import {ModuleList} from "./curd/ModuleList";

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
