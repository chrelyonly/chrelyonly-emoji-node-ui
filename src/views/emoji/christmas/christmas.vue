<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const canvasRef = ref(null)
const ctx = ref(null)

const layers = ref([])
const activeLayerIndex = ref(-1)
const dragging = ref(false)
const rotating = ref(false)
const resizing = ref(false)
const resizeCorner = ref(null)

const history = ref([])
const historyIndex = ref(-1)

const ROTATE_HANDLE_DISTANCE = 30
const RESIZE_HANDLE_SIZE = 10

const materials = ref(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `素材${i + 1}`,
      src: `/emoji-app/static/christmas/${i + 1}.png`
    }))
)

const activeLayer = computed(() =>
    activeLayerIndex.value >= 0 ? layers.value[activeLayerIndex.value] : null
)

/* ========== 生命周期 ========== */
onMounted(() => {
  const canvas = canvasRef.value
  ctx.value = canvas.getContext('2d')

  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  const canvas = canvasRef.value
  canvas.removeEventListener('mousedown', onMouseDown)
  canvas.removeEventListener('mousemove', onMouseMove)
  canvas.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('keydown', onKeyDown)
})

/* ========== 工具函数 ========== */
function getMousePos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function getCenter(layer) {
  return { cx: layer.x + layer.w / 2, cy: layer.y + layer.h / 2 }
}

function getAngle(x, y, layer) {
  const { cx, cy } = getCenter(layer)
  return Math.atan2(y - cy, x - cx)
}

// 旋转后的点检测
function rotatePoint(px, py, cx, cy, angle) {
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const dx = px - cx
  const dy = py - cy
  return {
    x: dx * cos - dy * sin + cx,
    y: dx * sin + dy * cos + cy
  }
}

function hitRect(x, y, layer) {
  const { cx, cy } = getCenter(layer)
  const rotated = rotatePoint(x, y, cx, cy, layer.rotate)
  return (
      rotated.x >= layer.x &&
      rotated.x <= layer.x + layer.w &&
      rotated.y >= layer.y &&
      rotated.y <= layer.y + layer.h
  )
}

function hitRotateHandle(x, y, layer) {
  const { cx, cy } = getCenter(layer)
  const rx = cx + Math.cos(layer.rotate - Math.PI / 2) * (layer.h / 2 + ROTATE_HANDLE_DISTANCE)
  const ry = cy + Math.sin(layer.rotate - Math.PI / 2) * (layer.h / 2 + ROTATE_HANDLE_DISTANCE)
  return Math.hypot(x - rx, y - ry) < 10
}

function hitResizeHandle(x, y, layer) {
  const { cx, cy } = getCenter(layer)
  const corners = [
    { x: layer.x, y: layer.y, corner: 'tl' },
    { x: layer.x + layer.w, y: layer.y, corner: 'tr' },
    { x: layer.x, y: layer.y + layer.h, corner: 'bl' },
    { x: layer.x + layer.w, y: layer.y + layer.h, corner: 'br' }
  ]

  for (const { x: px, y: py, corner } of corners) {
    const cos = Math.cos(layer.rotate)
    const sin = Math.sin(layer.rotate)
    const dx = px - cx
    const dy = py - cy
    const rx = cx + dx * cos - dy * sin
    const ry = cy + dx * sin + dy * cos

    if (Math.hypot(x - rx, y - ry) < RESIZE_HANDLE_SIZE) {
      return corner
    }
  }
  return null
}

/* ========== 历史记录 ========== */
function saveHistory() {
  const state = JSON.parse(JSON.stringify(layers.value.map(l => ({
    x: l.x, y: l.y, w: l.w, h: l.h, rotate: l.rotate, locked: l.locked, src: l.img.src
  }))))

  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(state)
  historyIndex.value++

  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
}

function undo() {
  if (historyIndex.value <= 0) return
  historyIndex.value--
  restoreHistory()
}

function redo() {
  if (historyIndex.value >= history.value.length - 1) return
  historyIndex.value++
  restoreHistory()
}

function restoreHistory() {
  const state = history.value[historyIndex.value]
  layers.value = state.map(s => {
    const img = new Image()
    img.src = s.src
    return { ...s, img }
  })
  activeLayerIndex.value = -1
  redraw()
}

/* ========== 绘制 ========== */
function redraw() {
  ctx.value.clearRect(0, 0, 600, 400)

  layers.value.forEach((layer, index) => {
    ctx.value.save()

    const { cx, cy } = getCenter(layer)
    ctx.value.translate(cx, cy)
    ctx.value.rotate(layer.rotate)

    ctx.value.drawImage(layer.img, -layer.w / 2, -layer.h / 2, layer.w, layer.h)

    if (index === activeLayerIndex.value) {
      // 绘制边框
      ctx.value.strokeStyle = '#409EFF'
      ctx.value.lineWidth = 2
      ctx.value.strokeRect(-layer.w / 2, -layer.h / 2, layer.w, layer.h)

      // 绘制旋转手柄
      ctx.value.beginPath()
      ctx.value.moveTo(0, -layer.h / 2)
      ctx.value.lineTo(0, -layer.h / 2 - ROTATE_HANDLE_DISTANCE)
      ctx.value.stroke()

      ctx.value.fillStyle = '#409EFF'
      ctx.value.beginPath()
      ctx.value.arc(0, -layer.h / 2 - ROTATE_HANDLE_DISTANCE, 6, 0, Math.PI * 2)
      ctx.value.fill()

      // 绘制缩放手柄
      const corners = [
        [-layer.w / 2, -layer.h / 2],
        [layer.w / 2, -layer.h / 2],
        [-layer.w / 2, layer.h / 2],
        [layer.w / 2, layer.h / 2]
      ]
      corners.forEach(([x, y]) => {
        ctx.value.fillStyle = '#fff'
        ctx.value.strokeStyle = '#409EFF'
        ctx.value.fillRect(x - 4, y - 4, 8, 8)
        ctx.value.strokeRect(x - 4, y - 4, 8, 8)
      })
    }

    ctx.value.restore()
  })
}

/* ========== 上传底图 ========== */
function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      layers.value.unshift({
        img,
        x: 0,
        y: 0,
        w: 600,
        h: 600,
        rotate: 0,
        locked: true
      })
      saveHistory()
      redraw()
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

/* ========== 添加素材 ========== */
function addMaterial(src) {
  const img = new Image()
  img.onload = () => {
    layers.value.push({
      img,
      x: 200,
      y: 150,
      w: 120,
      h: 120,
      rotate: 0
    })
    activeLayerIndex.value = layers.value.length - 1
    saveHistory()
    redraw()
  }
  img.src = src
}

/* ========== 图层操作 ========== */
function selectLayer(index) {
  activeLayerIndex.value = index
  redraw()
}

function deleteLayer(index) {
  if (layers.value[index].locked) return
  layers.value.splice(index, 1)
  if (activeLayerIndex.value === index) {
    activeLayerIndex.value = -1
  } else if (activeLayerIndex.value > index) {
    activeLayerIndex.value--
  }
  saveHistory()
  redraw()
}

function moveLayer(index, direction) {
  const newIndex = direction === 'up' ? index + 1 : index - 1
  if (newIndex < 0 || newIndex >= layers.value.length) return

  const temp = layers.value[index]
  layers.value[index] = layers.value[newIndex]
  layers.value[newIndex] = temp

  if (activeLayerIndex.value === index) {
    activeLayerIndex.value = newIndex
  } else if (activeLayerIndex.value === newIndex) {
    activeLayerIndex.value = index
  }

  saveHistory()
  redraw()
}

function duplicateLayer(index) {
  const layer = layers.value[index]
  const newLayer = {
    img: layer.img,
    x: layer.x + 20,
    y: layer.y + 20,
    w: layer.w,
    h: layer.h,
    rotate: layer.rotate
  }
  layers.value.splice(index + 1, 0, newLayer)
  activeLayerIndex.value = index + 1
  saveHistory()
  redraw()
}

/* ========== 交互 ========== */
function onMouseDown(e) {
  const { x, y } = getMousePos(e)

  for (let i = layers.value.length - 1; i >= 0; i--) {
    const layer = layers.value[i]
    if (layer.locked) continue

    // 检测旋转手柄
    if (hitRotateHandle(x, y, layer)) {
      activeLayerIndex.value = i
      rotating.value = true
      layer.startAngle = getAngle(x, y, layer) - layer.rotate
      return
    }

    // 检测缩放手柄
    const corner = hitResizeHandle(x, y, layer)
    if (corner) {
      activeLayerIndex.value = i
      resizing.value = true
      resizeCorner.value = corner
      layer.startX = x
      layer.startY = y
      layer.startW = layer.w
      layer.startH = layer.h
      layer.startCx = layer.x + layer.w / 2
      layer.startCy = layer.y + layer.h / 2
      return
    }

    // 检测矩形
    if (hitRect(x, y, layer)) {
      activeLayerIndex.value = i
      dragging.value = true
      const { cx, cy } = getCenter(layer)
      const rotated = rotatePoint(x, y, cx, cy, layer.rotate)
      layer.offsetX = rotated.x - layer.x
      layer.offsetY = rotated.y - layer.y
      redraw()
      return
    }
  }

  activeLayerIndex.value = -1
  redraw()
}

function onMouseMove(e) {
  const layer = activeLayer.value
  if (!layer) return

  const { x, y } = getMousePos(e)

  if (dragging.value) {
    const { cx, cy } = getCenter(layer)
    const rotated = rotatePoint(x, y, cx, cy, layer.rotate)
    layer.x = rotated.x - layer.offsetX
    layer.y = rotated.y - layer.offsetY
    redraw()
  }

  if (rotating.value) {
    layer.rotate = getAngle(x, y, layer) - layer.startAngle
    redraw()
  }

  if (resizing.value) {
    // 将当前鼠标位置和起始位置都转换到旋转坐标系
    const { cx, cy } = getCenter(layer)
    const currentRotated = rotatePoint(x, y, cx, cy, layer.rotate)
    const startRotated = rotatePoint(layer.startX, layer.startY, cx, cy, layer.rotate)

    // 计算在旋转坐标系中的偏移量
    const dx = currentRotated.x - startRotated.x
    const dy = currentRotated.y - startRotated.y

    let newW = layer.startW
    let newH = layer.startH

    // 根据拖拽的角计算新的宽高
    if (resizeCorner.value === 'tl') {
      newW = layer.startW - dx * 2
      newH = layer.startH - dy * 2
    } else if (resizeCorner.value === 'tr') {
      newW = layer.startW + dx * 2
      newH = layer.startH - dy * 2
    } else if (resizeCorner.value === 'bl') {
      newW = layer.startW - dx * 2
      newH = layer.startH + dy * 2
    } else if (resizeCorner.value === 'br') {
      newW = layer.startW + dx * 2
      newH = layer.startH + dy * 2
    }

    // 限制最小尺寸
    if (newW > 20 && newH > 20) {
      layer.w = newW
      layer.h = newH
      layer.x = layer.startCx - newW / 2
      layer.y = layer.startCy - newH / 2
    }

    redraw()
  }
}

function onMouseUp() {
  if (dragging.value || rotating.value || resizing.value) {
    saveHistory()
  }
  dragging.value = false
  rotating.value = false
  resizing.value = false
}

/* ========== 键盘操作 ========== */
function onKeyDown(e) {
  if (!activeLayer.value || activeLayer.value.locked) return

  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    deleteLayer(activeLayerIndex.value)
  }

  const step = e.shiftKey ? 10 : 1
  let moved = false

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    activeLayer.value.x -= step
    moved = true
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    activeLayer.value.x += step
    moved = true
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeLayer.value.y -= step
    moved = true
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeLayer.value.y += step
    moved = true
  }

  if (moved) {
    redraw()
    saveHistory()
  }

  // 撤销重做
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) {
      redo()
    } else {
      undo()
    }
  }
}

/* ========== 导出 ========== */
function exportImage() {
  const url = canvasRef.value.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'christmas.png'
  a.click()
}

function clearCanvas() {
  if (confirm('确定要清空画布吗？')) {
    layers.value = []
    activeLayerIndex.value = -1
    saveHistory()
    redraw()
  }
}
</script>

<template>
  <div class="editor">
    <div class="toolbar">
      <div class="toolbar-left">
        <label class="upload-btn">
          <input type="file" accept="image/*" @change="uploadImage" style="display: none" />
          <span>📁 上传底图</span>
        </label>
        <button @click="undo" :disabled="historyIndex <= 0" class="btn">↶ 撤销</button>
        <button @click="redo" :disabled="historyIndex >= history.length - 1" class="btn">↷ 重做</button>
        <button @click="clearCanvas" class="btn btn-danger">🗑️ 清空</button>
      </div>
      <button @click="exportImage" class="btn btn-primary">💾 导出图片</button>
    </div>

    <div class="content">
      <div class="canvas-wrapper">
        <canvas ref="canvasRef" width="600" height="600" />
        <div class="tips">
          💡 提示：拖拽移动 | 顶部圆点旋转 | 四角缩放 | 方向键微调 | Delete删除
        </div>
      </div>

      <div class="sidebar">
        <div class="panel">
          <h3>🎨 素材库</h3>
          <div class="materials">
            <div
                v-for="item in materials"
                :key="item.name"
                class="material"
                @click="addMaterial(item.src)"
            >
              <img :src="item.src" />
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>📋 图层 ({{ layers.length }})</h3>
          <div class="layers">
            <div
                v-for="(layer, index) in layers.slice().reverse()"
                :key="index"
                :class="['layer-item', { active: layers.length - 1 - index === activeLayerIndex }]"
                @click="selectLayer(layers.length - 1 - index)"
            >
              <img :src="layer.img.src" class="layer-thumb" />
              <span class="layer-name">
                {{ layer.locked ? '🔒 底图' : `图层 ${layers.length - index}` }}
              </span>
              <div class="layer-actions" v-if="!layer.locked">
                <button @click.stop="moveLayer(layers.length - 1 - index, 'up')" class="icon-btn" title="上移">↑</button>
                <button @click.stop="moveLayer(layers.length - 1 - index, 'down')" class="icon-btn" title="下移">↓</button>
                <button @click.stop="duplicateLayer(layers.length - 1 - index)" class="icon-btn" title="复制">📋</button>
                <button @click.stop="deleteLayer(layers.length - 1 - index)" class="icon-btn icon-btn-danger" title="删除">🗑️</button>
              </div>
            </div>
            <div v-if="layers.length === 0" class="empty">暂无图层</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.editor {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

.toolbar {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.btn, .upload-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  background: #f0f2f5;
  color: #333;
}

.btn:hover:not(:disabled), .upload-btn:hover {
  background: #e4e7eb;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #409EFF;
  color: white;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-danger {
  background: #f56c6c;
  color: white;
}

.btn-danger:hover {
  background: #f78989;
}

.upload-btn {
  display: inline-block;
  background: #67c23a;
  color: white;
}

.upload-btn:hover {
  background: #85ce61;
}

.content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.canvas-wrapper {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

canvas {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  cursor: crosshair;
  display: block;
  background: #fafafa;
}

.tips {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9ff;
  border-left: 3px solid #409EFF;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.panel h3 {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #303133;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.materials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.material {
  aspect-ratio: 1;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.material:hover {
  border-color: #409EFF;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.material img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.layers {
  max-height: 400px;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 6px;
  border: 2px solid transparent;
}

.layer-item:hover {
  background: #f5f7fa;
}

.layer-item.active {
  background: #ecf5ff;
  border-color: #409EFF;
}

.layer-thumb {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  flex-shrink: 0;
}

.layer-name {
  flex: 1;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.layer-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.layer-item:hover .layer-actions {
  opacity: 1;
}

.icon-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: #f0f2f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #e4e7eb;
  transform: scale(1.1);
}

.icon-btn-danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 13px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>