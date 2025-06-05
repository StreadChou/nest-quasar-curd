import {Column, CreateDateColumn, Entity} from 'typeorm'
// CUSTOMER IMPORT START
// CUSTOMER IMPORT END

@Entity({

})
// CUSTOMER DECORATOR START
// CUSTOMER DECORATOR END
export class UserEntity {

// CUSTOMER CONTENT START
// CUSTOMER CONTENT END


    @Column({type: "string"})
    createdAt: Date;
}
