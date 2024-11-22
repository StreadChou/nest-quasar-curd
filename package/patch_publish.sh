#!/bin/bash

export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 获取当前脚本所在的目录
FILE_PATH=$(pwd)

# 先把共享的内容复制过去
sh "$FILE_PATH/cp.sh"

# 切换到 ./nest-curd 目录并执行 npm 命令
cd "$FILE_PATH/nest-curd" || { echo "Failed to enter $FILE_PATH/nest-curd directory"; exit 1; }
npm run patch && npm publish -access public

# 切换到 ./generator 目录并执行 npm 命令
cd "$FILE_PATH/curd-generator" || { echo "Failed to enter $FILE_PATH/curd-generator directory"; exit 1; }
npm run patch && npm publish -access public

# 切换到 ./quasar-curd 目录并执行 npm 命令
cd "$FILE_PATH/quasar-curd" || { echo "Failed to enter $FILE_PATH/quasar-curd directory"; exit 1; }
npm run patch && npm publish -access public

# 重新建立共享内容的软连接
sh "$FILE_PATH/link.sh"

echo "Build and publish completed successfully."