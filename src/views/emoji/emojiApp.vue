<script setup >
import {nextTick, ref} from "vue";
import {ElMessage} from "element-plus";
import {Loading, UploadFilled} from "@element-plus/icons-vue";
import CropperComponent from "@/components/cropper/cropperComponent.vue";
// ref
const cropperComponentRef = ref();


const previewUrl = ref('');
const originalImage = ref('');
const base64Image = ref('');
const gifUrl = ref('');
const uploading = ref(false);
// 新增两个响应式数据：delay和width
const delay = ref(45);
const rotate = ref(360);
const selectedSource = ref("");

const handleChange = (uploadFile) => {
  const file = uploadFile.raw;
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e?.target?.result;
    // 直接打开裁切对话框
    if (cropperComponentRef.value?.initCropperComponent) {
      cropperComponentRef.value.initCropperComponent(originalImage.value)
    } else {
      console.warn('init 方法未暴露或组件未加载')
    }
  };
  reader.readAsDataURL(file);
};
// 图片裁剪回调
const cropperComponentSubmit = (res) => {
  console.log(res)
}
const upload = () => {
  if (delay.value > 120 || delay.value < 1){
    ElMessage.error('最低不低于1帧或者超过120帧');
    return;
  }
  if (rotate.value > 360 || rotate.value < 0){
    ElMessage.error('旋转度数不能超过360度');
    return;
  }
  if (!selectedSource.value){
    ElMessage.error('请先选择素材来源');
    return;
  }
  uploading.value = true;
  let params = {
    base64: base64Image.value,
    delay: delay.value,
    selectedSource: selectedSource.value,
    rotate: rotate.value,
  };
  $https('/emoji-app/emoji/uploadEmoji',"post", params,2,1).then(res => {
    if (res.data.code === 200){
      gifUrl.value = res.data.data;
    }else {
      ElMessage.error(res.data.msg);
    }
  }).catch(() => {
    ElMessage.error('生成失败');
  }).finally(() => {
    uploading.value = false;
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

    <div class="preview" v-if="previewUrl">
      <div class="preview-container">
        <div>
          <h4>头像预览：</h4>
          <el-image :src="previewUrl" style="width: 150px;height: 150px;border-radius: 50%" />
        </div>
        <div>
          <el-button
              type="primary"
              size="small"
              class="crop-btn"
              @click="openCropDialog"
              :disabled="!originalImage"
          >
            重新裁切
          </el-button>
        </div>
      </div>
    </div>

    <!-- 新增输入项 -->
    <div  v-if="previewUrl">
      <div>
        <el-form-item label="GIF帧(真FPS数,帧数过少会卡顿,过多会出现异常(推荐30-60)">
          <el-input-number
              v-model="delay"
              :min="1"
              :max="120"
              :step="10"
              placeholder="填写1-120帧以内,推荐30-60帧,45帧满足gif流畅"
              controls-position="right"
              :precision="0"
              style="width: 100%;"
          />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="旋转度数(0-360)">
          <el-input-number
              v-model="rotate"
              :min="1"
              :max="360"
              :step="10"
              placeholder="0-360"
              controls-position="right"
              :precision="0"
              style="width: 100%;"
          />
        </el-form-item>
      </div>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <el-form-item label="请选择素材来源:">
        <el-select
            v-model="selectedSource"
            placeholder="请选择素材来源"
            style="width: 200px"
        >
          <el-option label="左右猫猫图素材" value="2.gif" key="2.gif"></el-option>
          <el-option label="雷劈猫猫图素材" value="3.gif" key="3.gif"></el-option>
          <el-option label="急急猫猫图素材" value="4.gif" key="4.gif"></el-option>
          <el-option label="摸头猫猫图素材" value="5.gif" key="5.gif"></el-option>
          <el-option label="跳跳猫猫图素材" value="6.gif" key="6.gif"></el-option>
          <el-option label="骑车猫猫图素材" value="7.gif" key="7.gif"></el-option>
          <!-- 可根据需要扩展 -->
        </el-select>
      </el-form-item>
    </div>
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

    <div class="result" v-if="gifUrl">
      <h4>生成的表情包 GIF：</h4>
      <el-image :src="gifUrl" />
    </div>
  </el-card>
  <cropperComponent ref="cropperComponentRef" @submit="cropperComponentSubmit"></cropperComponent>
</template>

<style scoped>

</style>