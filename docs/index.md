---
title: 'island'
---
# GFM 

## Autolink 

www.example.com, https://example.com, and contact@example.com.




```ts
import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdxRollup';

export async function pluginMdx(): Promise<Plugin[]> {
  return [await pluginMdxRollup()];
}
```