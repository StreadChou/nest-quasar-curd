import {EntityDefine} from "@stread/curd-generator";
import {Entity} from "typeorm";


export const define: EntityDefine = {
    TableMark: "用户库",
    ClassName: "User",
    Restful: "User",
    columns: {},
    backend: {
        EntityDecorator: `@Entity({name : "User"})`,
    }

}