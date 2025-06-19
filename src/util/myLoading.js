// MyLoadingPlugin.ts
import { createApp, defineComponent, h, ref } from 'vue'

const MyLoadingComponent = defineComponent({
    name: 'MyLoadingComponent',
    setup(_, { expose }) {
        const visible = ref(false)
        const msg = ref('')

        const open = (newMsg) => {
            msg.value = newMsg
            visible.value = true
        }

        const close = () => {
            visible.value = false
        }

        expose({ open, close })

        return {
            visible,
            msg,
        }
    },
    render() {
        return this.visible
            ? h(
                'div',
                { class: 'global-my-loading' },
                [
                    h('div', { class: 'my-loading-overlay' }),
                    h('div', { class: 'my-loading-content' }, [
                        h('div', { class: 'my-loading-spinner' }),
                        h('p', { class: 'my-loading-text' }, this.msg),
                    ]),
                ]
            )
            : null
    },
})

function injectStyles() {
    const style = document.createElement('style')
    style.textContent = `
.global-my-loading {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    pointer-events: all;
}

.my-loading-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 228, 240, 0.6); /* 可爱粉透明背景 */
}

.my-loading-content {
    position: relative;
    z-index: 2;
    background: #fff0f6;
    padding: 24px 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(255, 192, 203, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.my-loading-spinner {
    border: 5px solid #ffe0eb;
    border-top: 5px solid #ff69b4;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: cute-spin 1s linear infinite;
    margin-bottom: 12px;
}

@keyframes cute-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.my-loading-text {
    font-size: 16px;
    color: #d63384;
    font-weight: 600;
}
    `.trim()
    document.head.appendChild(style)
}

export default {
    install(app) {
        injectStyles() // 👈 注入样式

        const container = document.createElement('div')
        document.body.appendChild(container)

        const instance = createApp(MyLoadingComponent)
        const vm = instance.mount(container)
        const exposed = instance._instance?.exposed

        window.$myLoading = {
            open: (msg) => {
                exposed?.open(msg)
            },
            close: () => {
                exposed?.close()
            },
        }
    },
}
