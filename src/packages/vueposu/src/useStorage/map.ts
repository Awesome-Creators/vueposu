import type { Ref } from "vue-demi";
export type StorageMap = { [key: string]: Ref<string | null> };

export const localStorageMap: StorageMap = {}

export const sessionStorageMap: StorageMap = {}