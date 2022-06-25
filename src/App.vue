<template>
  <section style="display: flex;">
    <section @dragstart="onDragstart" style="border: 1px solid #222; padding: 20px;">
      <span
        v-for="(item, index) in componentList"
        :key="index"
        style="padding: 20px; border: 1px solid #222; cursor: grab;"
        :draggable="true"
        :data-index="index"
      >{{item.label}}</span>
    </section>
    <section
      ref="editorRef"
      @drop="onDrop"
      @dragover="onDragover"
      style="border: 1px solid #222; min-width: 400px; min-height: 200px; position: relative; flex: 1;"
    >
      <widget-wrapper
        v-for="item in componentData.list"
        :key="item.id"
        :element="item"
        :custom-style="item.style"
        :style="item.style"
      >
        <component
          :is="customButton"
          :prop-value="item.propValue"
          :style="getSizeStyle(item.style)"
        />
      </widget-wrapper>
      <mark-line />
    </section>
  </section>
</template>

<script setup lang="ts">
import { useComponentData } from '@/store';
import widgetWrapper from './views/widgetWrapper.vue';
import customButton from './components/button/index.vue'
import { ref, shallowRef, DefineComponent, CSSProperties } from 'vue'
import { useMove, useRect } from '@/hooks'
import { cloneDeep } from 'lodash-unified'
import { v4 as uuidv4 } from 'uuid'
import markLine from './views/markLine.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const componentData = useComponentData()
const componentList = ref<any>([
  { label: '按钮', component: 'customButton', propValue: '按钮' }
])
const currentComponent = ref<DefineComponent>()
const editorRef = shallowRef()

function getSizeStyle(style?: CSSProperties) {
  return {
    width: style?.width + 'px',
    height: style?.height + 'px',
  }
}
function onDragstart(evt: DragEvent) {
  if (evt.target != null && evt.target instanceof HTMLElement) {
    evt.dataTransfer?.setData('index', evt.target.dataset.index ?? '')
  }
}
function onDrop(evt: DragEvent) {
  evt.preventDefault()
  evt.stopPropagation()
  const index = evt.dataTransfer?.getData('index')
  if (index == null || index === '') {
    return;
  }
  const component = cloneDeep(componentList.value[index])
  const { x, y } = useRect(editorRef)
  const startX = evt.clientX
  const startY = evt.clientY
  componentData.list.push({
    id: uuidv4(),
    ...component,
    style:{
      transform: `translate(${startX - x}px, ${startY - y}px)`,
      width: 100,
      height: 40,
    }
  })
}
function onDragover(evt: DragEvent) {
  evt.preventDefault()
}
</script>
