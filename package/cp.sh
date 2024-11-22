#!/bin/bash

# 获取当前脚本所在的目录
FILE_PATH=$(pwd)

# 定义需要链接的目标目录
LINK_DIR="$FILE_PATH/link"

NEST_CURD_LINK="$FILE_PATH/nest-curd/src/link"
# 创建软链接到 nest-curd 目录
if [ -d "$NEST_CURD_LINK" ]; then
  rm -rf "$NEST_CURD_LINK"
fi
cp -R "$LINK_DIR" "$NEST_CURD_LINK"


GENERATOR_LINK="$FILE_PATH/curd-generator/src/link"
if [ -d "$GENERATOR_LINK" ]; then
    rm -rf "$GENERATOR_LINK"
fi
cp -R "$LINK_DIR" "$GENERATOR_LINK"


QUASAR_CURD_LINK="$FILE_PATH/quasar-curd/src/link"
if [ -d "$QUASAR_CURD_LINK" ]; then
    rm -rf "$QUASAR_CURD_LINK"  # 修正为删除 QUASAR_CURD_LINK
fi
cp -R "$LINK_DIR" "$QUASAR_CURD_LINK"