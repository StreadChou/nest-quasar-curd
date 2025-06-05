/** 字段装饰器 */
export enum AttrColumnDecoratorType {
  Column = "Column",


  ObjectIdColumn = "ObjectIdColumn",
  PrimaryGeneratedColumn = "PrimaryGeneratedColumn",
  PrimaryColumn = "PrimaryColumn",
  VersionColumn = "VersionColumn",
  ViewColumn = "ViewColumn",
  VirtualColumn = "VirtualColumn",

  CreateDateColumn = "CreateDateColumn",
  UpdateDateColumn = "UpdateDateColumn",
  DeleteDateColumn = "DeleteDateColumn",
}

export const AttrColumnDecoratorTypeArray = Object.values(AttrColumnDecoratorType);


/** 关系装饰器 */
export enum AttrRelationDecoratorType {
  JoinColumn = "JoinColumn",
}


export const AttrRelationDecoratorTypeArray = Object.values(AttrRelationDecoratorType);
