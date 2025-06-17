<script setup>
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

const router = useRouter()

const navigateTo = (path) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.4)',
  })

  setTimeout(() => {
    loading.close()
    router.push(path)
  }, 600)
}
</script>

<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <el-menu
        class="navbar"
        mode="horizontal"
        background-color="transparent"
        text-color="#ffffff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="1" @click="navigateTo('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/emoji-app/emojiPngToGif')">PNG转GIF</el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/emoji-app/gifOverlayEditor')">GIF编辑器</el-menu-item>
      <el-menu-item index="4" @click="navigateTo('/emoji-app/staticGenerator')">静态生成器</el-menu-item>
    </el-menu>

    <h1 class="title">🎉 表情工具箱导航页</h1>

    <div class="card-container">
      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/emojiPngToGif')">
        <div class="card-content">
          <div class="icon">🖼️</div>
          <h2>PNG 生成 GIF</h2>
          <p>将头像叠加到动态 GIF 上</p>
        </div>
      </el-card>

      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/gifOverlayEditor')">
        <div class="card-content">
          <div class="icon">🎞️</div>
          <h2>GIF 叠加编辑器</h2>
          <p>图层拖拽+实时预览</p>
        </div>
      </el-card>

      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/staticGenerator')">
        <div class="card-content">
          <div class="icon">📷</div>
          <h2>静态表情生成</h2>
          <p>快速生成 PNG 表情</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
/* 页面背景 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  padding: 4rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 顶部导航栏 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  border: none;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 标题 */
.title {
  margin-top: 6rem;
  font-size: 3rem;
  background: linear-gradient(90deg, #ffffff, #ffd04b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
}

/* 卡片容器 */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}

/* 卡片玻璃风格 + 动画 */
.glass-card {
  width: 280px;
  height: 200px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInScale 0.6s ease;
  cursor: pointer;
}
.glass-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

/* 卡片内容 */
.card-content {
  padding: 1.2rem;
  color: white;
  text-align: center;
}
.card-content .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.card-content h2 {
  font-size: 1.3rem;
  margin-bottom: 0.3rem;
}
.card-content p {
  font-size: 1rem;
  opacity: 0.9;
}

/* 动画效果 */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 8vw;
    margin-top: 7rem;
  }

  .glass-card {
    width: 90%;
    height: auto;
  }

  .card-container {
    flex-direction: column;
    align-items: center;
  }

  .card-content h2 {
    font-size: 1.2rem;
  }

  .card-content p {
    font-size: 0.95rem;
  }
}
</style>
