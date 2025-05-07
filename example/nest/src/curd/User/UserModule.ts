import {Module, Global} from '@nestjs/common'
import {UserEntity} from './entity/UserEntity'
import {UserController} from './controller/UserController'
import {UserService} from './services/UserService'
import {TypeOrmModule} from '@nestjs/typeorm'
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
        // CUSTOMER IMPORTS START
        // CUSTOMER IMPORTS END
    ],
    controllers: [
        UserController
        // CUSTOMER CONTROLLERS START
        // CUSTOMER CONTROLLERS END
    ],
    providers: [
        UserService
        // CUSTOMER PROVIDERS START
        // CUSTOMER PROVIDERS END
    ],
    exports: [
        UserService
        // CUSTOMER EXPORTS START
        // CUSTOMER EXPORTS END
    ],
})
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
@Global()
export class UserModule {
}
