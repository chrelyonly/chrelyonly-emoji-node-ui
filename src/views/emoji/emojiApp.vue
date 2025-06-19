<script setup>
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

const router = useRouter()

const navigateTo = (path) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.2)',
  })

  setTimeout(() => {
    loading.close()
    router.push(path)
  }, 200)
}
</script>

<template>
  <div class="page-container">
    <!-- 可爱星星背景动画 -->
    <div class="floating-stars">
      <span class="star">💖</span>
      <span class="star">⭐</span>
      <span class="star">✨</span>
    </div>

    <!-- 顶部导航 -->
    <el-menu
        class="navbar"
        mode="horizontal"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="1" @click="navigateTo('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/emoji-app/emojiPngToGif')">PNG转GIF</el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/emoji-app/gifOverlayEditor')">GIF编辑器</el-menu-item>
      <el-menu-item index="4" @click="navigateTo('/emoji-app/staticGenerator')">静态生成器</el-menu-item>
    </el-menu>

    <!-- 页面标题 -->
    <h1 class="title">🎀 表情工具箱导航页 🎀</h1>

    <!-- 卡片区域 -->
    <div class="card-container">
      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/emojiPngToGif')">
        <div class="card-content">
          <div class="icon">🧸🎨</div>
          <h2>PNG 生成 GIF</h2>
          <p>将头像叠加到动态 GIF 上</p>
        </div>
      </el-card>

      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/gifOverlay/gifOverlayList')">
        <div class="card-content">
          <div class="icon">📽️🎉</div>
          <h2>表情包列表</h2>
          <p>文字内容叠加 GIF 上</p>
        </div>
      </el-card>

<!--      <el-card class="glass-card" shadow="hover" @click="navigateTo('/emoji-app/staticGenerator')">-->
<!--        <div class="card-content">-->
<!--          <div class="icon">🪄📷</div>-->
<!--          <h2>静态表情生成</h2>-->
<!--          <p>快速生成 PNG 表情</p>-->
<!--        </div>-->
<!--      </el-card>-->
    </div>
  </div>
</template>

<style scoped>

/* 页面背景 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8d0e3, #c6e5f9);
  padding: 4rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
}

/* 顶部导航栏 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  border: none;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(255, 192, 203, 0.4);
  border-radius: 0 0 16px 16px;
}

/* 页面标题 */
.title {
  margin-top: 6rem;
  font-size: 3rem;
  background: linear-gradient(90deg, #ff6ec4, #7873f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
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

/* 卡片样式 */
.glass-card {
  width: 280px;
  height: 200px;
  background: rgba(255, 255, 255, 0.3);
  border: 2px dashed rgba(255, 182, 193, 0.4);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(255, 182, 193, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  animation: popUp 0.6s ease;
  cursor: pointer;
}
.glass-card:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 16px 50px rgba(255, 105, 180, 0.4);
}

/* 卡片内容 */
.card-content {
  padding: 1.5rem;
  color: #5a3e66;
  text-align: center;
}
.card-content .icon {
  font-size: 2.6rem;
  margin-bottom: 0.6rem;
}
.card-content h2 {
  font-size: 1.4rem;
  text-shadow: 1px 1px 2px #ffb6c1;
  margin-bottom: 0.3rem;
}
.card-content p {
  font-size: 1rem;
  opacity: 0.95;
  color: #5a3e66;
}

/* 弹跳动画 */
@keyframes popUp {
  0% {
    opacity: 0;
    transform: scale(0.6) rotate(-10deg);
  }
  60% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* 星星漂浮效果 */
.floating-stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}
.floating-stars .star {
  position: absolute;
  animation: floatStar 8s linear infinite;
  font-size: 1.5rem;
  opacity: 0.6;
}
.floating-stars .star:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.floating-stars .star:nth-child(2) { top: 30%; left: 70%; animation-delay: 2s; }
.floating-stars .star:nth-child(3) { top: 60%; left: 40%; animation-delay: 4s; }

@keyframes floatStar {
  0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { opacity: 1; }
  100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
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
    font-size: 1.4rem;
    color: #5a3e66;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.35);
    margin-bottom: 0.3rem;
  }

  .card-content p {
    font-size: 1rem;
    color: #5a3e66;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    opacity: 1;
  }
}
</style>
