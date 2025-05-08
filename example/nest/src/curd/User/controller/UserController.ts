import {Controller} from '@nestjs/common'
import {AbstractController} from "../../AbstractCurdController";
import {UserEntity} from "../entity/UserEntity";
import {UserService} from "../services/UserService";
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Controller()
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class UserController extends AbstractController<UserEntity> {
    constructor(
        private readonly userService: UserService
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        super(userService);
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}
