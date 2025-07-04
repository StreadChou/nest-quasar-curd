import {Controller} from '@nestjs/common'
import {CurdBaseController} from '../CurdBase/CurdBaseController'
import {UserService} from './UserService'

// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Controller()
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class UserController extends CurdBaseController{
    constructor(
        public readonly service: UserService,
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        super(service)
        // CUSTOMER CONTENT_CONTENT START
        // CUSTOMER CONTENT_CONTENT END
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}
