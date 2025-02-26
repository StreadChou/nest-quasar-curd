export const WhenColumnIsStringTypeList: Array<SimpleColumnType> = [
  "tinytext",
  "mediumtext",
  "text",
  "ntext",
  "citext",
  "longtext",
  "shorttext",
  "alphanum",
  "raw",
  "long raw",
  "bfile",
  "clob",
  "nclob",
  "bytes",
  "bytea",
  "uuid",
  "xml",
  "json",
  "jsonb",
  "enum",
  "set",
  "tsvector",
  "tsquery",
  "hierarchyid",
  "sql_variant",
  "rowid",
  "urowid",
  "uniqueidentifier",
  "array",
  "cube",
  "ltree",
];

export const WhenColumnIsIntegerTypeList: Array<SimpleColumnType> = [
  "int2",
  "integer",
  "int4",
  "int8",
  "int64",
  "unsigned big int",
  "long",
  "int4range",
  "int8range",
  "int4multirange",
  "int8multirange",
];

export const WhenColumnIsComplexTypeList: Array<SimpleColumnType> = [
  "simple-json",
  "json",
  "jsonb",
  "array",
  "simple-array",
  "hstore",
  "point",
  "line",
  "lseg",
  "box",
  "circle",
  "path",
  "polygon",
  "geography",
  "geometry",
  "linestring",
  "multipoint",
  "multilinestring",
  "multipolygon",
  "geometrycollection",
  "st_geometry",
  "st_point",
  "cidr",
  "inet",
  "inet4",
  "inet6",
  "macaddr",
  "bit",
  "bit varying",
  "varbit",
  "tsrange",
  "tstzrange",
  "daterange",
  "int4multirange",
  "int8multirange",
  "nummultirange",
  "tsmultirange",
  "tstzmultirange",
  "datemultirange",
];


export const WhenColumnIsDateTypeList: Array<SimpleColumnType> = [
  "timetz",
  "timestamptz",
  "timestamp with local time zone",
  "smalldatetime",
  "date",
  "interval year to month",
  "interval day to second",
  "interval",
  "year",
  "seconddate",
];


export type SimpleColumnType =
  "simple-array"
  | "simple-json"
  | "simple-enum"
  | "int2"
  | "integer"
  | "int4"
  | "int8"
  | "int64"
  | "unsigned big int"
  | "float"
  | "float4"
  | "float8"
  | "float64"
  | "smallmoney"
  | "money"
  | "boolean"
  | "bool"
  | "tinyblob"
  | "tinytext"
  | "mediumblob"
  | "mediumtext"
  | "blob"
  | "text"
  | "ntext"
  | "citext"
  | "hstore"
  | "longblob"
  | "longtext"
  | "alphanum"
  | "shorttext"
  | "bytes"
  | "bytea"
  | "long"
  | "raw"
  | "long raw"
  | "bfile"
  | "clob"
  | "nclob"
  | "image"
  | "timetz"
  | "timestamptz"
  | "timestamp with local time zone"
  | "smalldatetime"
  | "date"
  | "interval year to month"
  | "interval day to second"
  | "interval"
  | "year"
  | "seconddate"
  | "point"
  | "line"
  | "lseg"
  | "box"
  | "circle"
  | "path"
  | "polygon"
  | "geography"
  | "geometry"
  | "linestring"
  | "multipoint"
  | "multilinestring"
  | "multipolygon"
  | "geometrycollection"
  | "st_geometry"
  | "st_point"
  | "int4range"
  | "int8range"
  | "numrange"
  | "tsrange"
  | "tstzrange"
  | "daterange"
  | "int4multirange"
  | "int8multirange"
  | "nummultirange"
  | "tsmultirange"
  | "tstzmultirange"
  | "datemultirange"
  | "enum"
  | "set"
  | "cidr"
  | "inet"
  | "inet4"
  | "inet6"
  | "macaddr"
  | "bit"
  | "bit varying"
  | "varbit"
  | "tsvector"
  | "tsquery"
  | "uuid"
  | "xml"
  | "json"
  | "jsonb"
  | "varbinary"
  | "hierarchyid"
  | "sql_variant"
  | "rowid"
  | "urowid"
  | "uniqueidentifier"
  | "rowversion"
  | "array"
  | "cube"
  | "ltree";
