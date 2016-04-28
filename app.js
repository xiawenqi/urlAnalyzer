const express = require('express');
const fs = require('fs');
const jsdom = require('jsdom');
const bodyParser = require('body-parser');

const elemTypes = JSON.parse(fs.readFileSync('./elemTypes.json', 'utf8'));
const getTextSelectors = require('./getTextSelectors');

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/static', express.static('public'));

app.post('/fetchUrl', (req, res) => {
	var url = req.body.url;
	var text = req.body.text;

	fetchUrl(res, url, text);
});

function fetchUrl(resp, url, text){
	var selectors = getTextSelectors(text);

	jsdom.env({
	    url: url,
	    done: function(err, window) {
	        // try {
	            var document = window.document;
	            console.log("请求成功, 正在解析...");
	            var acc = 1;

	            var res = elemTypes.reduce(function(memo, type) {
	                var elems = document.querySelectorAll(type.selector);

	                var typeElems = Array.prototype.map.call(elems, function(elem) {
	                	var matched = testElem(elem, selectors);
	                    return {
	                    	index: acc++, 
	                    	elemType: type.type, 
	                    	html: elem.outerHTML, 
	                    	xpath: getXPath(elem)
	                    };
	                });

	                return memo.concat(typeElems);
	            }, []);

	            resp.send(res);
	        // } catch (e) {
	        //     console.log("无法解析文档， 请确认输入的url正确。");
	        // }
	    }
	});
}

// 检查节点是否match selector
function testElem(elem, selectors){
	var matched = false;
	selectors.forEach(function(selector){
		if(selector.type === 'css'){

		}
	});
}


function getXPath(element) {
    var document = element.ownerDocument;
    if (element.id !== '')
        return '//*[@id="' + element.id + '"]';
    if (element === document.body)
        return '/html/body';

    var ix = 0;
    var siblings = element.parentNode.childNodes;

    var siblingLength = Array.prototype.filter.call(siblings, function(sitem){
        return sitem.nodeType === 1;
    }).length;

    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element){
          var suffix = siblingLength === 1 ? '' : '[' + (ix + 1) + ']';
          return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() +  suffix;
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}


app.listen(3000, function () {
  console.log('Analyzing app listening on port 3000, visit localhost:3000/static/index.html!');
});

