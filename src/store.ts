import { defineStore } from 'pinia'
import { markRaw, ref, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'

export type ComponentData = {
  id: string,
  component: string,
  style: CSSProperties,
  propValue?: Record<string, any>,
}

export const useComponentData = defineStore('componentData', {
  state: () => {
    const list = ref<ComponentData[]>([])
    const current = ref<ComponentData>()
    function setPosition(pos: { x: number, y: number, width: number, height: number }) {
      current.value!.style! = {
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: pos.width,
        height: pos.height,
      }
    }
    function add(component: ComponentData) {
      // list.value = [...list.value, component]
      list.value.push(markRaw(component))
    }
    return {
      list,
      current,
      setPosition,
      add
    }
  }
})
