# mini-webpack

ð å®ç°æç® webpack

## è¯»åæä»¶åå®¹`createAsset`

è¯»åæä»¶åå®¹ä¸å±åä¸ºä¸¤æ­¥

### è¯»ååå®¹

- ä½¿ç¨`fs.readFileSync`è¯»ååå®¹

### è·åæä»¶çä¾èµå³ç³»

- ä½¿ç¨`@babel-parser`è§£æ AST æ , è·åä»£ç (`node.source.value`)
- ä½¿ç¨`@babel/traverse`éå AST æ , è·åä»£ç çä¾èµ, æ·»å å°`deps`ä¸­
- ä½¿ç¨`babel-core`å° ESM çä»£ç è½¬æ¢æ CJS çä»£ç 

`createAsset`è¿å

```javascript
{
  filePath, // æä»¶è·¯å¾
  code, // çæçä»£ç 
  deps, // æä»¶çä¾èµ
  mapping: {}, // ç¨äºæ¥æ¾çç´¢å¼, åå§åä¸ºç©º
  id, // ç´¢å¼çid
}
```

## çæä¾èµå¾`createGraph`

éåå¥å£æä»¶ç`deps`, ä¸ºææç`dep`è°ç¨`createAsset`, å°ç»ææ¾å°ä¸ä¸ª`queue`ä¸­, ä½ä¸º`graph`è¿å

è¿éä¼ææä»¶è·¯å¾`filePath`ä½ä¸º`mapping`ç`key`, `id`ä¸º`value`, ç»`mapping`èµå¼

## çææ¨¡æ¿`build`

å¾ªç¯çæçä¾èµå¾`graph`, è·å`code, id, mapping`, éè¿`ejs`æ¨¡æ¿, è°ç¨`fs.writeFileSync`åå¥`bundle.js`

## `require`

éè¿`id`, å»å¯»æ¾`mapping`ä¸­çä¾èµ, å¹¶æ§è¡

## æåå®æ

æç»ä¼æåæä¸ä¸ªç«å³æ§è¡å½æ°, åæ°ä¸º`mapping`åçææä¾èµ

```javascript
// ä¸ä¸ªæä»¶çä¾å­
1: [ // id
	function (require, module, exports) {
	const { foo } = require('./foo.js')
		foo()
		console.log('main.js')
	},
	{ './foo.js': 2 }
],
```

## è¿è¡
```
node index.js
```

æå¼`example`ä¸­ç`index.html`

æååå¨æ§å¶å°ä¼è¾åº

```
foo
bar
main.js
```
