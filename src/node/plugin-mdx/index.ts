import { Plugin } from 'vite';
import { pluginMdxHMR } from './pluginMdxHmr';
import { pluginMdxRollup } from './pluginMdxRollup';

// Vite 热更新机制
// 1.监听文件的变动
// 2.定位到热更新边界的模块
// 3.执行更新逻辑

// 热更新API
// import.meta.accept()

// Vue/React 组件热更新使用的方式
// react-refresh工具来完成热更新
// 在文件开头插入一段代码，记录组件的状态
// 在组件代码再次执行的时候，恢复上一次的状态

export async function createPluginMdx(): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHMR()];
}
