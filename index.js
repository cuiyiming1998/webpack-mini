import fs from 'fs'
import path from 'path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
import { jsonLoader } from './jsonLoader.js'

let id = 0

const webpackConfig = {
	module: {
		rules: [
			{
				test: /\.json$/,
				use: [ jsonLoader ]
			}
		]
	}
}

function createAsset(filePath) {
	// 1. 获取文件的内容
	let source = fs.readFileSync(filePath, {
		encoding: 'utf-8'
	})

  // 查看当前filePath 在loader中有没有匹配
  // 如果有匹配 则调用loader转换source
  const loaders = webpackConfig.module.rules
  const loaderContext = {
    addDeps(dep) {
      console.log('addDeps', dep)
    }
  }

  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        use.reverse().forEach(fn => {
          // 改变this, 把loaderContext写入
          source = fn.call(loaderContext, source)
        })
      }
    }
  })

	// 2. 获取依赖关系
	// 解析ast树, 获取node.source.value
	const ast = parser.parse(source, {
		sourceType: 'module'
	})

	const deps = []

	// 遍历ast, 在遇到ImportDeclaration时 将依赖加入deps
	traverse.default(ast, {
		ImportDeclaration({ node }) {
			deps.push(node.source.value)
		}
	})

	const { code } = transformFromAst(ast, null, {
		presets: ['env']
	})

	return {
		filePath,
		code,
		deps,
		id: id++,
		mapping: {}
	}
}

// 生成图
function createGraph() {
	const mainAsset = createAsset('./example/main.js')

	const queue = [mainAsset]

	// 如果当前asset有deps, 那么循环添加到queue中, 再次寻找deps的deps
	for (const asset of queue) {
		asset.deps.forEach(relativePath => {
			const child = createAsset(path.resolve('./example', relativePath))
			asset.mapping[relativePath] = child.id
			queue.push(child)
		})
	}

	return queue
}

const graph = createGraph()

function build(graph) {
	// 生成模板
	const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' })
	const data = graph.map(asset => {
		const { id, code, mapping } = asset
		return {
			id,
			code,
			mapping
		}
	})
	const code = ejs.render(template, { data })
	// 将生成的代码放进dist里
	fs.writeFileSync('./dist/bundle.js', code)
}

build(graph)
