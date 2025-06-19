<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import {ElLoading} from "element-plus";
const router = useRouter()

// 示例表情包数据（你可替换为 API 返回）
const data = ref([])
const pageInfo = ref({
  pages: 1,
  total: 0,
  current: 1,
})
onMounted(() => {
  init()
})

const init = () => {
  let params = {

  }
  $https("/emoji-api/emoji-list","get",params,1,{}).then((res) => {
    data.value = res.data.data.records
    pageInfo.value.pages = res.data.data.pages;
    pageInfo.value.total = res.data.data.total;
    pageInfo.value.current = res.data.data.current;
  })
}
const toDetail = (item) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.2)',
  })

  setTimeout(() => {
    loading.close()
    router.push(
        {
          path: "/gifOverlay/gifOverlayEditor",
          query: {
            id: item.id
          }
        }
    )
  }, 200)
}
</script>

<template>
  <div class="emoji-row-wrapper">
    <h3 class="emoji-title">🎀 可爱表情包展示区 🎀</h3>
    <div class="emoji-row">
      <div class="emoji-card" v-for="(item, index) in data" :key="index" @click="toDetail(item)">
        <el-image :src="item.url" class="emoji-img" />
        <div class="emoji-text">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.emoji-row-wrapper {
  height: calc(100vh); /* 减去导航高度 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 让内容居中显示 */
  align-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(to right, #f8d0e3, #c6e5f9);
  border-radius: 0;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.emoji-title {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  color: #5a3e66;
}

.emoji-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.emoji-card {
  width: 170px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(255, 192, 203, 0.25);
  text-align: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  padding: 0.5rem;
}
.emoji-card:hover {
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4);
}

.emoji-img {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.emoji-text {
  font-size: 0.95rem;
  color: #5a3e66;
  word-break: break-word;
}
</style>
