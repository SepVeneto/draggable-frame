import type { Ref } from 'vue'
export function useRect(elementRef: Ref<HTMLElement>) {
  return elementRef.value.getBoundingClientRect()
}