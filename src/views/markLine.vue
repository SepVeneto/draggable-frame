<template>
  <div class="mark-line">
    <div
      v-for="(line, index) in lines"
      :key="line"
      :ref="el => el && (lineRefs[line] = el as HTMLElement)"
      class="line"
      :class="line.includes('x') ? 'x-line' : 'y-line'"
    />
  </div>
</template>

<script lang="ts" setup>
import { useComponentData } from '@/store';
import { onBeforeUpdate, shallowRef, watch } from 'vue';
import type { CSSProperties } from 'vue'
const componentData = useComponentData()
const lines = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr']
watch(() => componentData.current?.style, (style) => {
  if (!style) return
  const pos = getPos(style)
  const posStyle: CSSProperties = {}
  lines.forEach(line => {
    switch (line) {
      case 'xt':
        posStyle.top = pos.y + 'px'
        posStyle.left = 0
        break;
      case 'xc':
        posStyle.top = pos.y + pos.height / 2 + 'px';
        posStyle.left = 0
        break;
      case 'xb':
        posStyle.top = pos.y + pos.height + 'px';
        posStyle.left = 0
        break;
      case 'yl':
        posStyle.top = 0;
        posStyle.left = pos.x + 'px';
        break;
      case 'yc':
        posStyle.top = 0;
        posStyle.left = pos.x + pos.width / 2 + 'px';
        break;
      case 'yr':
        posStyle.top = 0;
        posStyle.left = pos.x + pos.width + 'px';
        break;
    }
    Object.entries(posStyle).forEach(([key, value]) => {
      lineRefs.value[line].style[key as any] = value
    })
  })
})
const lineRefs = shallowRef<Record<string, HTMLElement>>({})
onBeforeUpdate(() => {
  lineRefs.value = {}
})
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
.mark-line {
  height: 100%;
}
.mark-line .line {
  background: #4089ef;
  position: absolute;
}
.x-line {
  width: 100%;
  height: 1px;
}
.y-line {
  height: 100%;
  width: 1px;
}
</style>
