async function foo() {
  const { add } = await import('./util.mjs')
  console.log(add(1, 2))
}

foo()

// 不能再 cjs 中引入 mjs
// 根本原因：模块加载机制
// CJS 同步加载
