#!/bin/bash
#删除 components、views、assets、stores 文件夹内的所有文件。
#清理 App.vue：移除示例模板、示例脚本和样式。
#清理 router/index.ts：删除无用的组件引用。
#清理 Pinia stores：创建一个新的 useDefaultStore.ts。
#创建新的文件夹：包括 hook、api、mock、env、plugin、util layout。

# 递归删除文件夹
deleteFolderRecursive() {
    local filepath="$1"
    if [ -d "$filepath" ]; then
        for file in "$filepath"/*; do
            if [ -d "$file" ]; then
                deleteFolderRecursive "$file"
            else
                rm -f "$file"
            fi
        done
        rmdir "$filepath"
    elif [ -f "$filepath" ]; then
        rm -f "$filepath"
    fi
}

# 删除 'src/components', 'src/views', 'src/assets', 'src/stores' 文件夹内的示例文件
for dir in "components" "views" "assets" "stores"; do
    dirPath="./src/$dir"
    if [ -d "$dirPath" ]; then
        for file in "$dirPath"/*; do
            deleteFolderRecursive "$file"
        done
    fi
done

# 清理 'src/App.vue' 内的示例组件引用
appVuePath="./src/App.vue"
if [ -f "$appVuePath" ]; then
    sed -i '' 's/<template>[\s\S]*<\/template>/<template>\n  <div id="app">\n  <\/div>\n<\/template>/' "$appVuePath"
    sed -i '' 's/<script setup lang="ts">[\s\S]*<\/script>/<script setup lang="ts">\n\n<\/script>/' "$appVuePath"
    sed -i '' 's/<script setup>[\s\S]*<\/script>/<script setup>\n\n<\/script>/' "$appVuePath"
    sed -i '' 's/<style\b[^>]*>([\s\S]*?)<\/style>/<style scoped>\n<\/style>/' "$appVuePath"
fi

# 清理 'src/router/index.ts' 内的示例组件引用
routerPath="./src/router/index.ts"
if [ -f "$routerPath" ]; then
    sed -i '' '1s/.*import.*\n//' "$routerPath"
    sed -i '' '/{\s*path:.*name:.*},*/d' "$routerPath"
fi

# 清理pinia stores
piniaPath="./src/stores"
newStorePath="$piniaPath/useDefaultStore.ts"
initialContent="
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', () => {
  return {}
})"
if [ ! -d "$piniaPath" ]; then
    mkdir -p "$piniaPath"
fi
echo "$initialContent" > "$newStorePath"

# 创建hook，api，mock，env，plugin，util, layout 文件夹
for folder in "hook" "api" "mock" "env" "plugin" "util" "layout"; do
    folderPath="./src/$folder"
    if [ ! -d "$folderPath" ]; then
        mkdir -p "$folderPath"
    fi
done

echo "vue3-pure completed!"