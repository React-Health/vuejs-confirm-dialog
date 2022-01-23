import { ref, Prop, ComputedRef, Ref, Component } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export type PropsData = {
  [key: string]: Prop<unknown, unknown>
}
export interface CreateConfirmDialogFnReturn {
  reveal: (
    data: PropsData
  ) => Promise<UseConfirmDialogRevealResult<PropsData, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
}

export const createConfirmDialog = function (
  dialog: Component,
  props: PropsData = {}
): CreateConfirmDialogFnReturn {
  const propsRef: Ref<PropsData> = ref(props)

  const { addDialog } = useDialogWrapper()
  const { reveal, isRevealed, onConfirm, onReveal, onCancel, confirm, cancel } =
    useConfirmDialog()

  onReveal((data: PropsData) => {
    for (const prop in data) {
      propsRef.value[prop] = data[prop]
    }
  })

  addDialog({
    dialog,
    isRevealed,
    confirm,
    cancel,
    props: propsRef.value,
  })

  return {
    reveal,
    isRevealed,
    onConfirm,
    onCancel,
  }
}
