<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import CropperComponent from "@/components/cropper/cropperComponent.vue";
import { cacheUtil } from "@/util/cacheUtil.js";

// 引用裁剪组件
const cropperComponentRef = ref();

// 响应式变量
const previewUrl = ref([]);            // 用于展示预览头像列表
const originalImage = ref('');         // 原始上传图像 base64
const base64Image = ref('');           // 当前选中的头像 base64
const gifUrl = ref('');                // 最终生成的 GIF 链接
const uploading = ref(false);          // 是否正在上传生成 GIF
const delay = ref(45);                 // GIF 帧延迟（速度）
const rotate = ref(360);               // 旋转角度
const selectedSource = ref("");        // 用户选择的表情包素材来源
const selectedIndex = ref(-1);         // 当前选中头像的下标

// 页面加载时尝试读取本地缓存头像（最多保存10个）
onMounted(() => {
  const cached = cacheUtil.getCache('cachedAvatarImage');
  if (cached) {
    previewUrl.value = cached;
  }
});

// 上传头像时触发，读取文件并初始化裁剪组件
const handleChange = (uploadFile) => {
  const file = uploadFile.raw;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e?.target?.result;
    if (cropperComponentRef.value?.initCropperComponent) {
      cropperComponentRef.value.initCropperComponent(originalImage.value);
    } else {
      console.warn('init 方法未暴露或组件未加载');
    }
  };
  reader.readAsDataURL(file);
};

// 用户点击某个预览头像，设置为当前选中头像
const selectAvatar = (index) => {
  selectedIndex.value = index;
  base64Image.value = previewUrl.value[index];
};

// 裁剪完成后回调，保存裁剪结果并更新预览与缓存
const cropperComponentSubmit = (res) => {
  base64Image.value = res; // 更新当前头像为裁剪结果

  // 获取本地缓存，如无则初始化为空数组
  let cachedAvatarImageList = cacheUtil.getCache('cachedAvatarImage');
  if (!cachedAvatarImageList) {
    cachedAvatarImageList = [];
  }

  // 添加新头像到缓存末尾
  cachedAvatarImageList.push(res);

  // 如果超过10个头像，删除最早的一个
  if (cachedAvatarImageList.length > 10) {
    cachedAvatarImageList.shift();
  }

  // 更新预览和缓存
  previewUrl.value = cachedAvatarImageList;
  cacheUtil.setCache('cachedAvatarImage', cachedAvatarImageList);
};

// 生成 GIF 表情包上传接口调用
const upload = () => {
  // 验证参数合法性
  if (delay.value > 120 || delay.value < 1) {
    ElMessage.error('最低不低于1帧或者超过120帧');
    return;
  }
  if (rotate.value > 360 || rotate.value < 0) {
    ElMessage.error('旋转度数不能超过360度');
    return;
  }
  if (!selectedSource.value) {
    ElMessage.error('请先选择素材来源');
    return;
  }

  // 设置上传中状态
  uploading.value = true;

  // 构造上传参数
  const params = {
    base64: base64Image.value,     // 当前头像 base64
    delay: delay.value,            // 帧延迟（速度）
    selectedSource: selectedSource.value, // 素材编号
    rotate: rotate.value           // 旋转角度
  };

  // 发起上传请求
  $https('/api/emoji-app/emoji/uploadEmoji', "post", params, 2, 1).then(res => {
    if (res.data.code === 200) {
      gifUrl.value = res.data.data;  // 成功生成 gif，保存链接
    } else {
      ElMessage.error(res.data.msg); // 接口返回错误信息
    }
  }).catch(() => {
    ElMessage.error('生成失败'); // 网络或接口异常
  }).finally(() => {
    uploading.value = false; // 重置上传状态
  });
};
</script>


<template>
  <el-card>
    <template #header>
      <h2 style="text-align: center;">上传头像生成表情包 GIF</h2>
    </template>

    <el-upload
        drag
        accept="image/*"
        :auto-upload="false"
        :on-change="handleChange"
    >
      <el-icon style="font-size: 60px; color: #409EFF;">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">拖拽或点击上传头像</div>
    </el-upload>
    <div class="preview" v-if="previewUrl && previewUrl.length">
      <div class="preview-container">
        <h4>头像预览（点击选择使用的头像,有历史缓存）：</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; padding: 0 0 20px 0">
          <div
              v-for="(item, index) in previewUrl"
              :key="index"
              class="avatar-wrapper"
              :class="{ selected: index === selectedIndex }"
              @click="selectAvatar(index)"
          >
            <el-image :src="item" style="width: 100px; height: 100px; border-radius: 50%;" />
          </div>
        </div>
      </div>
    </div>


    <!-- 控制参数设置 -->
    <div v-if="previewUrl">
      <el-form-item label="GIF帧 (推荐30-60),在这里也叫速度">
        <el-input-number
            v-model="delay"
            :min="1"
            :max="120"
            :step="10"
            placeholder="1-120 帧"
            controls-position="right"
            style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="旋转度数 (0-360)">
        <el-input-number
            v-model="rotate"
            :min="0"
            :max="360"
            :step="10"
            placeholder="0-360"
            controls-position="right"
            style="width: 100%;"
        />
      </el-form-item>
    </div>

    <!-- 素材来源选择 -->
    <div style="text-align: center; margin-bottom: 20px;">
      <el-form-item label="请选择素材来源:">
        <el-select
            v-model="selectedSource"
            placeholder="请选择素材来源"
            style="width: 200px"
        >
          <el-option label="左右猫猫图素材" value="2.gif" />
          <el-option label="雷劈猫猫图素材" value="3.gif" />
          <el-option label="急急猫猫图素材" value="4.gif" />
          <el-option label="摸头猫猫图素材" value="5.gif" />
          <el-option label="跳跳猫猫图素材" value="6.gif" />
          <el-option label="骑车猫猫图素材" value="7.gif" />
        </el-select>
      </el-form-item>
    </div>

    <!-- 生成按钮 -->
    <div style="text-align: center; margin-top: 20px;">
      <el-button
          type="primary"
          :disabled="!base64Image"
          :loading="uploading"
          @click="upload"
      >
        生成 GIF 表情包
      </el-button>
    </div>

    <!-- 生成结果展示 -->
    <div class="result" v-if="gifUrl" style="margin-top: 30px;">
      <h4>生成的表情包 GIF：</h4>
      <el-image :src="gifUrl" style="width: 150px; display: block; margin: 0 auto;box-shadow: 0 0 10px rgba(64, 158, 255, 0.6);" />
      <div style="text-align: center; margin-top: 10px;">
        <el-button type="primary" :href="gifUrl" download="表情包.gif">下载 GIF</el-button>
      </div>
    </div>
  </el-card>

  <!-- 裁剪组件 -->
  <cropperComponent ref="cropperComponentRef" @crop-finish="cropperComponentSubmit" />
</template>
<style scoped>
.avatar-wrapper {
  border: 2px solid transparent;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.3s ease;
}
.avatar-wrapper:hover {
  transform: scale(1.05);
}
.avatar-wrapper.selected {
  border-color: #409EFF;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.6);
  transform: scale(1.1);
}
</style>