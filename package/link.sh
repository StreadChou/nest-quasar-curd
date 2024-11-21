#!/bin/bash

# 获取当前脚本所在的目录
FILE_PATH=$(pwd)

# 定义需要链接的目标目录
LINK_DIR="$FILE_PATH/link"

NEST_CURD_SRC="$FILE_PATH/nest-curd/src/link"
# 创建软链接到 nest-curd 目录
if [ ! -d "$NEST_CURD_SRC" ]; then
    ln -s "$LINK_DIR" "$NEST_CURD_SRC"
    echo "Created symbolic link to $LINK_DIR in $NEST_CURD_SRC"
else
    echo "Symbolic link already exists in $NEST_CURD_SRC"
fi


GENERATOR_SRC="$FILE_PATH/curd-generator/src/link"
if [ ! -d "$GENERATOR_SRC" ]; then
    ln -s "$LINK_DIR" "$GENERATOR_SRC"
    echo "Created symbolic link to $LINK_DIR in $GENERATOR_SRC"
else
    echo "Symbolic link already exists in $GENERATOR_SRC"
fi


QUASAR_CURD_SRC="$FILE_PATH/quasar-curd/src/link"
if [ ! -d "$QUASAR_CURD_SRC" ]; then
    ln -s "$LINK_DIR" "$QUASAR_CURD_SRC"
    echo "Created symbolic link to $LINK_DIR in $QUASAR_CURD_SRC"
else
    echo "Symbolic link already exists in $QUASAR_CURD_SRC"
fi
