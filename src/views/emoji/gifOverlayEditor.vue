<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const line1 = ref('')
const line2 = ref('')
const line3 = ref('')

const generate = () => {
  if (!line1.value && !line2.value && !line3.value) {
    ElMessage.warning('请至少填写一句话内容')
    return
  }

  // 调用生成函数或后端接口
  ElMessage.success('表情包生成成功！')
}
</script>

<template>
  <div class="page-wrapper">
    <div>
      <h2 class="form-title">编辑表情包文字</h2>
    </div>
    <!-- 顶部 GIF -->
    <div class="gif-container">
      <img src="https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif" alt="预览GIF" />
    </div>

    <!-- 表单区域 -->
    <el-card class="form-card" shadow="always">
      <h2 class="form-title">编辑表情包文字</h2>
      <el-form label-position="top" class="text-form">
        <el-form-item label="请输入第一句话">
          <el-input v-model="line1" placeholder="例如：你干嘛～"></el-input>
        </el-form-item>
        <el-form-item label="请输入第二句话">
          <el-input v-model="line2" placeholder="例如：哎哟～"></el-input>
        </el-form-item>
        <el-form-item label="请输入第三句话">
          <el-input v-model="line3" placeholder="可选填"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generate" size="large">生成表情包</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8d0e3, #c6e5f9);
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.gif-container {
  width: 300px;
  margin-bottom: 2rem;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(255, 182, 193, 0.4);
}
.gif-container img {
  width: 100%;
  display: block;
  border-radius: 24px;
}

.form-card {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(255, 182, 193, 0.3);
  padding: 2rem;
  backdrop-filter: blur(12px);
  font-family: 'ZCOOL KuaiLe', 'PingFang SC';
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  color: #5a3e66;
  margin-bottom: 1.8rem;
}

.text-form :deep(.el-form-item__label) {
  color: #5a3e66;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 6px;
}
.text-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #f5c2e7 inset;
  background-color: #fff;
}
.text-form :deep(.el-input__inner) {
  font-size: 1.05rem;
  font-family: 'ZCOOL KuaiLe';
  color: #5a3e66;
}

.el-button {
  background: linear-gradient(to right, #ff9ec4, #ff66a1);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: bold;
  padding: 12px 24px;
  font-size: 1rem;
  font-family: 'ZCOOL KuaiLe';
  transition: all 0.3s ease;
}
.el-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(255, 105, 180, 0.4);
}
</style>
