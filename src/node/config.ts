import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types/index';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    // 探测当前目录下有没有这个配置文件
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.log('Failed to load user config.');
    throw e;
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 获取配置文件的路径

  const configPath = getUserConfigPath(root);
  // 解析配置文件

  const result = await loadConfigFromFile({ command, mode }, configPath, root);
  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;

    // 包含3中情况
    // object
    // promise
    // function
    // 针对三种情况做一个规范化
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);

    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}
