import {ColumnsType, EntityDefine, TypeExtensionForRelation} from "@stread/curd-generator";


export const define: EntityDefine = {
    TableMark: "用户库",
    ClassName: "User",
    Restful: "User",
    columns: {
        id: {
            label: "#",
            type: ColumnsType.Number,
            backend: {
                decorator: [
                    "@PrimaryGeneratedColumn()"
                ]
            },
            frontend: {
                show_at_home: true,
                hidden_at_create: true,
                disable_at_update: true,
            },
        },

        username: {
            label: "用户名",
            type: ColumnsType.String,
            backend: {
                decorator: [
                    `@Column({comment: "__COLUMNS_LABEL__"})`
                ],
            },
            frontend: {
                show_at_home: true,
            },
        },

        password: {
            label: "密码",
            type: ColumnsType.String,
            backend: {
                decorator: [
                    `@Column({comment: "__COLUMNS_LABEL__"})`
                ],
            },
            frontend: {
                show_at_home: false,
            },
        },

        leader: {
            label: "直系领导",
            type: ColumnsType.Relation,
            type_extension: {
                type_string: "UserCurdEntity"
            } as TypeExtensionForRelation,
            backend: {
                decorator: [
                    `@ManyToOne(()=> UserCurdEntity)`
                ]
            },
            frontend: {
                show_at_home: true,
                editor_bind: {
                    "option-label": "username",
                    "map-options": true,
                    standout: true,
                    clearable: true,
                }
            }
        },


        created_at: {
            label: "创建时间",
            type: ColumnsType.Date,

            backend: {
                decorator: [
                    `@CreateDateColumn({comment: "__COLUMNS_LABEL__"})`
                ],
            },
            frontend: {
                show_at_home: true,
                hidden_at_create: true,
                disable_at_update: true,
            }
        },
        updated_at: {
            label: "更新时间",
            type: ColumnsType.Date,
            backend: {
                decorator: [
                    `@UpdateDateColumn({comment: "__COLUMNS_LABEL__"})`
                ],
            },
            frontend: {
                show_at_home: true,
                hidden_at_create: true,
                disable_at_update: true,
            }
        },
    },
    backend: {
        EntityDecorator: [
            `@Entity({name : "User"})`
        ],
    },
    frontend: {
        home_page: "/User/Home",
        form_page: "/User/Form/:id"
    }

}