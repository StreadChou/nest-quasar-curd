import {Injectable} from '@nestjs/common'
import {AbstractCurdService} from '../../AbstractCurdService'
import {UserEntity} from '../entity/UserEntity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Injectable()
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class UserService extends AbstractCurdService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity) private userEntityRepository: Repository<UserEntity>
        // CUSTOMER CONSTRUCTOR START
        // CUSTOMER CONSTRUCTOR END
    ) {
        super(userEntityRepository);
    }

    // CUSTOMER CONTENT START
    // CUSTOMER CONTENT END
}
