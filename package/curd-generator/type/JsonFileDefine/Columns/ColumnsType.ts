/** 字段类型 */
export enum ColumnsType {
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


export const ColumnsTypeOption: { [key in ColumnsType]: { value: key, label: string } } = {
  [ColumnsType.Column]: {value: ColumnsType.Column, label: "普通列"},
  [ColumnsType.CreateDateColumn]: {value: ColumnsType.CreateDateColumn, label: "创建时间列"},
  [ColumnsType.DeleteDateColumn]: {value: ColumnsType.DeleteDateColumn, label: "软删除时间列"},
  [ColumnsType.ObjectIdColumn]: {value: ColumnsType.ObjectIdColumn, label: "MongoDB ObjectId 列"},
  [ColumnsType.PrimaryColumn]: {value: ColumnsType.PrimaryColumn, label: "主键列"},
  [ColumnsType.PrimaryGeneratedColumn]: {value: ColumnsType.PrimaryGeneratedColumn, label: "自增主键列"},
  [ColumnsType.UpdateDateColumn]: {value: ColumnsType.UpdateDateColumn, label: "更新时间列"},
  [ColumnsType.VersionColumn]: {value: ColumnsType.VersionColumn, label: "版本号列（用于乐观锁）"},
  [ColumnsType.ViewColumn]: {value: ColumnsType.ViewColumn, label: "视图列"},
  [ColumnsType.VirtualColumn]: {value: ColumnsType.VirtualColumn, label: "虚拟列（不会持久化）"},
};
