
// var text = 'By.id("su")......................cccBy.id("kw").....By.className("bri")........By.cssSelector("#u1 > a:nth-child(4)") .....By.xpath("//*[@id=\'u1\']/a[5]").....By.linkText("设置")';
const regExps = [{
	type: 'css',
	exp: /By\.id\(\"[\w\-]+\"\)/g,
	getSelector: str => {
		return '#' + str;
	}
}, {
	type: 'css',
	exp: /By\.className\(\"[\w\-]+\"\)/g,
	getSelector: str => {
		return '.' + str;
	}
}, {
	type: 'css',
	exp: /By\.name\(\"[\w\-]+\"\)/g,
	getSelector: str => {
		return '[name="' + str + '"]';
	}
}, {
	type: 'css',
	exp: /By\.cssSelector\(\"[^\"]+\"\)/g,
	getSelector: str => {
		return str;
	}
}, {
	type: 'xpath',
	exp: /By\.xpath\(\"[^\"]+\"\)/g,
	getSelector: str => {
		return str;
	}
},{
	type: 'linkText',
	exp: /By\.linkText\(\"[^\"]+\"\)/g,
	getSelector: str => {
		return str;
	}
}, {
	type: 'partialLinkText',
	exp: /By\.partialLinkText\(\"[^\"]+\"\)/g,
	getSelector: str => {
		return str;
	}
}];

const selectorWrapExp = /\"[^\"]+\"/;
const selectorExp = /[^\"]+/
function getTextSelectors(text){
	let matchedSelectors = regExps.reduce(function(memo, reg){
		let matchedStrs = text.match(reg.exp);

		if(!matchedStrs) return memo;
		let mcSelectors = matchedStrs.map(function(mat){
			let selector = reg.getSelector(mat.match(selectorWrapExp)[0].match(selectorExp)[0]);
			return {
				type: reg.type,
				matcher: mat,
				selector: selector
			};
		});

		return [...memo, ...mcSelectors]
	}, []);
	return matchedSelectors;
}

module.exports = getTextSelectors;
// console.log(getTextSelectors(text));
