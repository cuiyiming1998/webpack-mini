# mini-webpack

📚 实现最简 webpack

## 读取文件内容`createAsset`

读取文件内容一共分为两步

### 读取内容

- 使用`fs.readFileSync`读取内容

### 获取文件的依赖关系

- 使用`@babel-parser`解析 AST 树, 获取代码(`node.source.value`)
- 使用`@babel/traverse`遍历 AST 树, 获取代码的依赖, 添加到`deps`中
- 使用`babel-core`将 ESM 的代码转换成 CJS 的代码

`createAsset`返回

```javascript
{
  filePath, // 文件路径
  code, // 生成的代码
  deps, // 文件的依赖
  mapping: {}, // 用于查找的索引, 初始化为空
  id, // 索引的id
}
```

## 生成依赖图`createGraph`

遍历入口文件的`deps`, 为所有的`dep`调用`createAsset`, 将结果放到一个`queue`中, 作为`graph`返回

这里会把文件路径`filePath`作为`mapping`的`key`, `id`为`value`, 给`mapping`赋值

## 生成模板`build`

循环生成的依赖图`graph`, 获取`code, id, mapping`, 通过`ejs`模板, 调用`fs.writeFileSync`写入`bundle.js`

## `require`

通过`id`, 去寻找`mapping`中的依赖, 并执行

## 打包完成

最终会打包成一个立即执行函数, 参数为`mapping`后的所有依赖

```javascript
// 一个文件的例子
1: [ // id
	function (require, module, exports) {
	const { foo } = require('./foo.js')
		foo()
		console.log('main.js')
	},
	{ './foo.js': 2 }
],
```

## 运行
```
node index.js
```

打开`example`中的`index.html`

成功后在控制台会输出

```
foo
bar
main.js
```