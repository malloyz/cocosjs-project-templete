#! /bin/bash
cur_dir=$(cd "$(dirname "$0")";pwd)
node $cur_dir/tools/projectjson-generator/app.js $cur_dir
