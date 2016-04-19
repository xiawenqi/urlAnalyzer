var jsdom = require('jsdom');
var fs = require('fs');
var xlsx = require('node-xlsx');

var elemTypes = JSON.parse(fs.readFileSync('./elemTypes.json', 'utf8'));
var url = process.argv[2];

if (!url) {
    console.log('请输入要分析的网站url');
    process.exit(1);
}

if (/^www/.test(url)) {
    url = 'http://' + url;
}

console.log("正在请求 " + url + "...");
jsdom.env({
    url: url,
    done: function(err, window) {
        try {
            var document = window.document;
            console.log("请求成功, 正在解析...");
            var acc = 1;

            var res = elemTypes.reduce(function(memo, type) {
                var elems = document.querySelectorAll(type.selector);

                var typeElems = Array.prototype.map.call(elems, function(elem) {
                    return [acc++, type.type, elem.outerHTML, getXPath(elem)];
                });

                return memo.concat(typeElems);
            }, [['序号', '类型', 'html', 'xpath']]);

            writeToXslx(res);
        } catch (e) {
            console.log("无法解析文档， 请确认输入的url正确。")
        }
    }
});


function getXPath(element) {
    var document = element.ownerDocument;
    if (element.id !== '')
        return '//*[@id="' + element.id + '"]';
    if (element === document.body)
        return element.tagName;

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}

function writeToXslx(data) {
    var buffer = xlsx.build([{ data: data }]);
    var xlsname = new Date().toISOString().replace(/[-:\.]/g, '') + '.xlsx';

    fs.writeFile(xlsname, buffer, function(err) {
        if (err) return console.log(err);
        console.log('解析结果已写入 > ' + xlsname);
    });
}
