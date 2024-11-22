import {CurdController, CurdService} from "@stread/nest-curd";
import {Repository} from "typeorm";
import {Controller, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserCurdEntity} from "./User.entity";

@Injectable()
export class UserCurdService extends CurdService<UserCurdEntity> {
    public constructor(@InjectRepository(UserCurdEntity) public repository: Repository<UserCurdEntity>) {
        super(repository)
    }
}

@Controller('User/Curd')
export class UserCurdController extends CurdController {
    public constructor(service: UserCurdService) {
        super(service);
    }
}

