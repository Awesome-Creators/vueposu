import type { Ref } from "vue-demi";
import type { Obj } from "@vueposu/utils";

export type StorageMap<T = string> = Obj<Ref<T | null>>;

export const localStorageMap: StorageMap = {};
export const sessionStorageMap: StorageMap = {};
