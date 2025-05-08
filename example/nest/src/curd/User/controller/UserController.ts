import {Controller} from '@nestjs/common'
import {UserService} from '../services/UserService'
import {AbstractCurdController} from '../../AbstractCurdController'
import {UserEntity} from '../entity/UserEntity'
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Controller()
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class UserController extends AbstractCurdController<UserEntity> {
    constructor(
        private readonly userService: UserService
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        super(userService);
        // CUSTOMER CONTENT_CONTENT START
        // CUSTOMER CONTENT_CONTENT END
    }
    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}
