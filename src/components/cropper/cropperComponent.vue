<script setup>
import { ref, nextTick } from 'vue';
import Cropper from 'cropperjs';               // 引入 CropperJS 主库
import 'cropperjs/dist/cropper.css';           // 引入 CropperJS 样式

// 向父组件触发裁剪完成事件
const emit = defineEmits(['crop-finish']);

// 控制弹窗显示
const cropDialogVisible = ref(false);

// 存储原始图片 base64 数据
const originalImage = ref('');

// 存储 cropper 实例对象
const cropperInstance = ref(null);

// 用来绑定 <img> 元素的 DOM 引用
const cropperImageRef = ref(null);

// 打开裁剪弹窗并设置图片数据
const initCropperComponent = (base64) => {
  originalImage.value = base64;
  cropDialogVisible.value = true;
};

// 图片加载完成时初始化 Cropper 实例
const onImageLoaded = async () => {
  await nextTick();
  const imageElement = cropperImageRef.value;
  if (!imageElement) return;

  // 如果已经有旧实例，先销毁
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
    cropperInstance.value = null;
  }

  // 创建新的 Cropper 实例
  cropperInstance.value = new Cropper(imageElement, {
    aspectRatio: 1,          // 裁剪框宽高比为 1:1，头像适用
    viewMode: 1,             // 限制裁剪框不能超出图片
    autoCropArea: 0.8,       // 默认裁剪区域占图片 50%
    movable: true,           // 裁剪框是否可移动
    zoomable: true,          // 是否允许缩放
    background: false,       // 不显示默认灰格背景
    responsive: true,        // 自适应容器尺寸
  });
};

// 点击“确认裁切”按钮时
const confirmCrop = () => {
  const cropper = cropperInstance.value;
  if (!cropper || typeof cropper.getCroppedCanvas !== 'function') {
    console.error('Cropper not initialized properly.');
    return;
  }

  // 获取裁剪区域生成的 canvas（不设置宽高，即使用原图尺寸）
  const canvas = cropper.getCroppedCanvas();
  const croppedBase64 = canvas.toDataURL('image/png');

  // 触发父组件事件，传出裁剪结果 base64
  emit('crop-finish', croppedBase64);

  // 销毁实例并关闭对话框
  cropper.destroy();
  cropDialogVisible.value = false;
  cropperInstance.value = null;
};

// 点击“取消”按钮
const cancelCrop = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy();
    cropperInstance.value = null;
  }
  cropDialogVisible.value = false;
};

// 向外暴露方法供父组件调用
defineExpose({
  initCropperComponent,
});
</script>

<template>
  <!-- 裁剪头像弹窗 -->
  <el-dialog
      v-model="cropDialogVisible"
      title="裁切头像"
      width="340px"
      draggable
      destroy-on-close
  >
    <!-- 图片容器 -->
    <div class="cropper-container">
      <img
          :src="originalImage"
      ref="cropperImageRef"
      @load="onImageLoaded"
      style="display: block;"
      />
    </div>

    <!-- 操作按钮区域 -->
    <div class="crop-actions" style="text-align: right; margin-top: 20px;">
      <el-button @click="cancelCrop">取消</el-button>
      <el-button type="primary" @click="confirmCrop">确认裁切</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 图片容器大小控制 */
.cropper-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
}
</style>
