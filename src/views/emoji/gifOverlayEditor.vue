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
  background: linear-gradient(to right bottom, #f2f9ff, #d6ecf5);
  min-height: 100vh;
}

.gif-container {
  width: 320px;
  height: auto;
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.gif-container img {
  width: 100%;
  display: block;
}

.form-card {
  width: 100%;
  max-width: 500px;
  background: #ffffffd6;
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.form-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.text-form :deep(.el-input) {
  font-size: 1rem;
}
</style>
