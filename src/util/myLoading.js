let container = null

    // 已存在则不重复创建
container = document.createElement('div')
container.className = 'global-my-loading'
container.innerHTML = `
      <div class="my-loading-overlay"></div>
      <div class="my-loading-content">
        <div class="my-loading-spinner"></div>
        <p class="my-loading-text"></p>
      </div>
    `
container.style.display = 'none'
document.body.appendChild(container)

    const textElement = container.querySelector('.my-loading-text')

    function open(msg) {
        if (textElement) {
            textElement.textContent = msg || '加载中...'
        }
        container.style.display = 'flex'
    }

    function close() {
        container.style.display = 'none'
    }

window.$myLoading = {
    open,
    close,
}
