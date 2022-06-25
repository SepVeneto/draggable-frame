<template>
  <section ref="widgetRef" class="widget-wrapper" @mousedown="onMousedown">
    <div
      v-for="(dot, index) in dots"
      :key="index"
      class="widget-dot"
      :style="getDotPos(dot)"
      @mousedown="onMousedownDot($event, dot)"
    ></div>
    <slot />
  </section>
</template>

<script lang="ts" setup>
import type { CSSProperties, PropType } from 'vue'
import { computed, shallowRef } from 'vue'
import { useComponentData } from '@/store';
import type { ComponentData } from '@/store';
import { onClickOutside } from '@vueuse/core'
const props = defineProps({
  customStyle: {
    type: Object as PropType<CSSProperties>,
    required: true,
  },
  element: {
    type: Object as PropType<ComponentData>,
    required: true,
  }
})
const componentData = useComponentData()
const widgetRef = shallowRef()
onClickOutside(widgetRef, () => {
  if (componentData.current?.id === props.element.id) {
    componentData.current = undefined
  }
})

const dots = computed(() => {
  return isActive.value ? ['t', 'r', 'l', 'b', 'lt' ,'lb', 'rt', 'rb'] : []
})
const direct = {
  l: 'w',
  r: 'e',
  t: 'n',
  b: 's',
}
const isActive = computed(() => {
  return componentData.current === props.element
})

function onMousedownDot(evt: MouseEvent, dot: string) {
  evt.stopPropagation()
  evt.preventDefault()

  const { x, y, width, height } = getPos(props.customStyle)
  const startX = evt.clientX
  const startY = evt.clientY

  const isT = /t/.test(dot)
  const isL = /l/.test(dot)
  const isB = /b/.test(dot)
  const isR = /r/.test(dot)

  const move = (mouseEvt: MouseEvent) => {
    const currX = mouseEvt.clientX
    const currY = mouseEvt.clientY
    const deltaX = currX - startX
    const deltaY = currY - startY
    const newWidth = width! + (isL ? -deltaX : isR ? deltaX : 0)
    const newHeight = height! + (isT ? -deltaY : isB ? deltaY : 0)
    const pos = {
      x: x as number + (isL ? deltaX : 0),
      y: y as number + (isT ? deltaY : 0),
      width: newWidth < 0 ? 0 : newWidth,
      height: newHeight < 0 ? 0 : newHeight
    }
    componentData.setPosition(pos)
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}
function getDotPos(dot: string): CSSProperties {
  const { width, height } = props.customStyle!
  const isL = /l/.test(dot)
  const isR = /r/.test(dot)
  const isT = /t/.test(dot)
  const isB = /b/.test(dot)

  let left, top;

  if (dot.length === 2) {
    left = isL ? 0 : width
    top = isT ? 0 : height
  } else {
    if (isL || isR) {
      left = isL ? 0 : width
      top = Number(height) / 2
    } else {
      left = Number(width) / 2
      top = isT ? 0 : height
    }
  }
  return {
    marginLeft: '-2px',
    marginTop: '-2px',
    top: top + 'px',
    left: left + 'px',
    cursor: dot.split('').reverse().map(item => direct[item as keyof typeof direct]).join('') + '-resize'
  }
}
function onMousedown(evt: MouseEvent) {
  evt.stopPropagation()
  componentData.current = props.element
  const pos = getPos(props.customStyle)
  const move = (mouseEvt: MouseEvent) => {
    const { clientX, clientY } = mouseEvt
    componentData.setPosition({
      ...pos,
      x: clientX - evt.clientX + Number(pos.x),
      y: clientY - evt.clientY + Number(pos.y),
    })
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}
function getPos(style: CSSProperties) {
  const { transform, width, height } = style
  const posRegexp = /translate\((\d+)px[, ]+(\d+)px\)/
  const [, x, y] = posRegexp.exec(transform!) ?? []
  return {
    x: Number(x),
    y: Number(y),
    width: parseFloat(width as string),
    height: parseFloat(height as string)
  }
}
</script>

<style scoped>
.widget-wrapper {
  display: inline-block;
  position: absolute;
}
.widget-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  border: 1px solid #4089ef;
}
</style>
