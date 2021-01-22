const schedule = require('node-schedule');
const path = require("path");
const fs = require("fs");
var exec = require("child_process").exec;
const puppeteer = require("puppeteer");

var MongoClient = require('mongodb').MongoClient;
/**
 * 遍历指定目录下的所有文件
 * @param {*} dir 
 */
function readFileList(dir, filesList = [], name) {
    delPath = path.join(__dirname, dir)
    // console.log(delPath)
    function traverse(delPath) {
        // console.log(fs.readdirSync(delPath))
        fs.readdirSync(delPath).forEach((file) => {
            // console.log(file)
            const pathname = path.join(delPath, file)
            // console.log(pathname)
            if (fs.statSync(pathname).isDirectory()) {
                traverse(pathname)
            } else {
                // if (path.extname(pathname) === '.html') {
                //     filesList.push(pathname)
                // }
                if (path.basename(pathname).includes(name)) {
                    filesList.push(pathname)
                }
            }
        })
    }
    traverse(delPath)
    if (name === 'detailed.html' || name === 'domains.html') {
        return filesList[0];
    } else {
        return filesList[1];
    }

}
function formatDate() {
    var date = new Date();
    var d = new Date(date);
    var month = d.getMonth() + 1;
    var m = month < 10 ? "0" + month : month;
    var day = d.getDate();
    var dd = day < 10 ? "0" + day : day;
    var H = d.getHours();
    var h = H < 10 ? "0" + H : H;
    var M = d.getMinutes();
    var mm = M < 10 ? "0" + M : M;
    var S = d.getSeconds();
    var s = S < 10 ? "0" + S : S;
    var resDate = d.getFullYear() + "-" + m + "-" + dd;
    var resTime = h + ":" + mm + ":" + s;
    var alldate = resDate + " " + resTime;
    return alldate;
}
// 查询元素在数组中的索引值
Array.prototype.indexValue = function (arr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arr) {
            return i;
        }
    }
}
function resolespeednum(newnums) {
    let num = parseFloat(newnums);
    let numStr = num.toString();
    let index = numStr.indexOf(".");
    let result = numStr.slice(0, index + 5);
    return result;
}
async function netbian(url, names) {
    puppeteer.launch(
        {
            headless: true, // 开启界面,
            timeout: 30 * 1000,
            // devtools: true,  // 开启开发者控制台  
            //设置每个步骤放慢200毫秒
            slowMo: 200,
            //设置打开页面在浏览器中的宽高
            // defaultViewport: null,
            // args: ['--start-maximized'],
            ignoreDefaultArgs: ['--enable-automation'],
            // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // userDataDir: `C:/Users/guchenghuan/AppData/Local/Google/Chrome/UserData/Profile1`,
            // executablePath: '--user-data-dir=C:/Users/guchenghuan/AppData/Local/Google/Chrome/User Data/Profile 1',
        }
    ).then(async browser => {
        const page = await browser.newPage();
        try {
            // const newurl = 'file://' + url
            await page.goto(url);//为了方便从第二页开始
            let images = await page.$$eval("td", (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
            );
            const num = images.indexValue('<a href="help.html#firstPaint">First Paint</a>')
            // console.log('images:  ', num)
            const platformname = names
            const Performance = resolespeednum(images[8])
            const TTFB = resolespeednum(images[num + 32]) < 50 ? resolespeednum(images[num + 32]) * 1000 : resolespeednum(images[num + 32])
            const FCP = resolespeednum(images[num + 20]) < 50 ? resolespeednum(images[num + 20]) * 1000 : resolespeednum(images[num + 20])
            const LCP = resolespeednum(images[num + 14]) < 50 ? resolespeednum(images[num + 14]) * 1000 : resolespeednum(images[num + 14])
            const CLS = resolespeednum(images[num + 92]) < 50 ? resolespeednum(images[num + 92]) * 1000 : resolespeednum(images[num + 92])
            const SpeedIndex = resolespeednum(images[num + 104]) < 50 ? resolespeednum(images[num + 104]) * 1000 : resolespeednum(images[num + 104])
            const Visual99 = resolespeednum(images[num + 134]) < 50 ? resolespeednum(images[num + 134]) * 1000 : resolespeednum(images[num + 134])
            const firstPaint = resolespeednum(images[num + 2]) < 50 ? resolespeednum(images[num + 2]) * 1000 : resolespeednum(images[num + 2])
            const imgsize = resolespeednum(images[56])
            const Htmlsize = resolespeednum(images[62])
            const Csssize = resolespeednum(images[68])
            const Jssize = resolespeednum(images[74])
            const Totalsize = resolespeednum(images[86])
            const FullyLoaded = resolespeednum(images[num + 8]) < 50 ? resolespeednum(images[num + 8]) * 1000 : resolespeednum(images[num + 8])
            const newdate = formatDate();
            // try {
            console.log('start insert')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var myobj = {
                    platformname: platformname, Performance: Performance, TTFB: TTFB, FCP: FCP, LCP: LCP, CLS: CLS, SpeedIndex: SpeedIndex, Visual99: Visual99, firstPaint: firstPaint, Date: newdate
                    , imgsize: imgsize, Htmlsize: Htmlsize, Csssize: Csssize, Jssize: Jssize, Totalsize: Totalsize, FullyLoaded: FullyLoaded
                };
                dbo.collection("platformdata").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("文档插入成功");
                    db.close();
                });
            })
            // } catch (e) {
            //     console('e: ', e)
            //     res(e)
            // }
            // console.log('newArr:  ', newArr)
            await browser.close();
        } catch (error) {
            console.log('请求页面超时，尝试重新连接: ' + error);
        }

    });

}

async function netbiandomain(url) {
    puppeteer.launch(
        {
            headless: true, // 开启界面,
            timeout: 30 * 1000,
            // devtools: true,  // 开启开发者控制台  
            //设置每个步骤放慢200毫秒
            slowMo: 200,
            //设置打开页面在浏览器中的宽高
            // defaultViewport: null,
            // args: ['--start-maximized'],
            ignoreDefaultArgs: ['--enable-automation'],
            // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // userDataDir: `C:/Users/guchenghuan/AppData/Local/Google/Chrome/UserData/Profile1`,
            // executablePath: '--user-data-dir=C:/Users/guchenghuan/AppData/Local/Google/Chrome/User Data/Profile 1',
        }
    ).then(async browser => {
        const page = await browser.newPage();
        try {
            // const newurl = 'file://' + url
            await page.goto(url);//为了方便从第二页开始
            let imageskey = await page.$$eval(".assetsurl", (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );

            let imagesvalue = await page.$$eval('.number', (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );
            const newArr = []
            for (var i = 0; i < imageskey.length; i++) {
                var obj = {
                    name: imageskey[i],
                    value: imagesvalue[7 + i * 9]
                }
                newArr.push(obj)
            }
            // console.log('newArr:  ', newArr)
            // try {
            console.log('start insert Domain')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                const newdate = formatDate();
                var myobj = {
                    name: 'Domain',
                    data: newArr,
                    Date: newdate
                };
                dbo.collection("historydata").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("文档插入成功");
                    db.close();
                });
            })
            // } catch (e) {
            //     console('e: ', e)
            //     res(e)
            // }
            // console.log('newArr:  ', newArr)
            await browser.close();
        } catch (error) {
            console.log('请求页面超时，尝试重新连接');
        }

    });

}

async function netbianPageXray(url) {
    puppeteer.launch(
        {
            headless: true, // 开启界面,
            timeout: 30 * 1000,
            // devtools: true,  // 开启开发者控制台  
            //设置每个步骤放慢200毫秒
            slowMo: 200,
            //设置打开页面在浏览器中的宽高
            // defaultViewport: null,
            // args: ['--start-maximized'],
            ignoreDefaultArgs: ['--enable-automation'],
            // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            // userDataDir: `C:/Users/guchenghuan/AppData/Local/Google/Chrome/UserData/Profile1`,
            // executablePath: '--user-data-dir=C:/Users/guchenghuan/AppData/Local/Google/Chrome/User Data/Profile 1',
        }
    ).then(async browser => {
        const page = await browser.newPage();
        try {
            // const newurl = 'file://' + url
            await page.goto(url + '#pagexray');//为了方便从第二页开始


            // 不同类型文件的传输  ---------------------------------------
            let imagescontenttvalue = await page.$$eval('#contentSize > tbody > tr > td', (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );
            var len = imagescontenttvalue.length / 5
            const newArrcontent = []
            for (var i = 0; i < len; i++) {
                var obj = {
                    name: imagescontenttvalue[0 + i * 5],
                    transferSize: imagescontenttvalue[2 + i * 5],
                    contentSize: imagescontenttvalue[3 + i * 5]
                }
                newArrcontent.push(obj)
            }
            // console.log('newArrcontent:  ', newArrcontent)

            // 较大的资源文件  ------------------------------------------------
            let imagesLargestkey = await page.$$eval(".assetsurl > a", (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );

            let imagesLargestvalue = await page.$$eval('#largestAssetsOnThePage > tbody > tr > td.number', (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );
            const newArrLarges = []
            for (var i = 0; i < imagesLargestkey.length; i++) {
                var obj = {
                    name: imagesLargestkey[i],
                    transferSize: imagesLargestvalue[0 + i * 2],
                    contentSize: imagesLargestvalue[1 + i * 2]
                }
                newArrLarges.push(obj)
            }
            // console.log('newArrLarges:  ', newArrLarges)

            // 查看总概括 -----------------------------------------------
            let imagessummary = await page.$$eval("#pagexray-panel > div > div > table > tbody > tr >td", (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );
            // console.log('imagessummary:  ', imagessummary)
            const newArrsummary = []
            for (var i = 0; i < imagessummary.length / 2; i++) {
                var obj = {
                    name: imagessummary[0 + i * 2],
                    value: imagessummary[1 + i * 2]
                }
                newArrsummary.push(obj)
            }
            // console.log('newArrsummary:  ', newArrsummary)

            // domain 下的transfer  --------------------------------

            let imagestransfer = await page.$$eval("#contentSizePerDomain > tbody > tr > td", (el) =>//图片节点，API可查看官方介绍
                el.map((x) => x.innerHTML)
                // el[1].innerHTML//获取图片的src地址
            );
            // console.log('imagestransfer:  ', imagestransfer)
            var len = imagestransfer.length / 5
            const newArrtransfer = []
            for (var i = 0; i < len; i++) {
                var obj = {
                    name: imagestransfer[0 + i * 5],
                    transfervalue: imagestransfer[2 + i * 5],
                    Contentvalue: imagestransfer[3 + i * 5]
                }
                newArrtransfer.push(obj)
            }
            // console.log('newArrtransfer:  ', newArrtransfer)
            // try {
            console.log('start insert pagexray')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                const newdate = formatDate();
                var myobj = [
                    {
                        name: 'content',
                        data: newArrcontent,
                        Date: newdate
                    },
                    {
                        name: 'LargesAsserts',
                        data: newArrLarges,
                        Date: newdate
                    },
                    {
                        name: 'summary',
                        data: newArrsummary,
                        Date: newdate
                    },
                    {
                        name: 'domaintransfer',
                        data: newArrtransfer,
                        Date: newdate
                    },
                ];
                dbo.collection("historydata").insertMany(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("文档插入成功");
                    db.close();
                });
            })
            // } catch (e) {
            //     console('e: ', e)
            //     res(e)
            // }
            // console.log('newArr:  ', newArr)
            await browser.close();
        } catch (error) {
            console.log('请求页面超时，尝试重新连接');
        }

    });

}

async function netbianplayer(url) {
    puppeteer.launch(
        {
            headless: true,
            timeout: 30 * 1000,
            slowMo: 200,
            ignoreDefaultArgs: ['--enable-automation'],
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
    ).then(async browser => {
        const page = await browser.newPage();
        try {
            await page.goto(url);

            let imagesplayer = await page.$$eval("td", (el) =>
                el.map((x) => x.innerHTML)
            );
            const numstart = imagesplayer.indexValue('PlayerMediaLoading:start')
            const starttime = imagesplayer[numstart + 3]
            const numend = imagesplayer.indexValue('PlayerMediaLoading:end')
            const endtime = imagesplayer[numend + 3]
            console.log('start insert player')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                const newdate = formatDate();
                var myobj =
                {
                    start: resolespeednum(starttime) < 50 ? resolespeednum(starttime) * 1000 : resolespeednum(starttime),
                    end: resolespeednum(endtime) < 50 ? resolespeednum(endtime) * 1000 : resolespeednum(endtime),
                    Date: newdate
                }
                dbo.collection("playerdata").insertMany(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("文档插入成功");
                    db.close();
                });
            })
            await browser.close();
        } catch (error) {
            console.log('请求页面超时，尝试重新连接');
        }
    });
}

//执行函数
runCmdTest = async (name) => {
    return new Promise((res, rej) => {
        var cmdStr = 'docker run --rm -v "%cd%":/sitespeed.io sitespeedio/sitespeed.io:13.0.1 ' + name + ' --multi'
        console.log('start run')
        exec(cmdStr, function (err, stdout, stderr) {
            if (err) {
                console.log('get weather api error:' + stderr);
            } else {
                const obj = {
                    mes: name
                }
                console.log('success');
                // return data
                res(obj)
            }
        });
    })
}
// del file
function deleteFolder(delPath) {
    delPath = path.join(__dirname, delPath)
    try {
        if (fs.existsSync(delPath)) {
            const delFn = function (address) {
                const files = fs.readdirSync(address)
                for (let i = 0; i < files.length; i++) {
                    const dirPath = path.join(address, files[i])
                    if (fs.statSync(dirPath).isDirectory()) {
                        delFn(dirPath)
                    } else {
                        deleteFile(dirPath, true)
                    }
                }
                /**
                * @des 只能删空文件夹
                */
                fs.rmdirSync(address);
            }
            delFn(delPath);
        } else {
            console.log('do not exist: ', delPath);
        }
    } catch (error) {
        console.log('del folder error', error);
    }
}
function deleteFile(delPath, direct) {
    delPath = direct ? delPath : path.join(__dirname, delPath)
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}
// 定义规则
let rule = new schedule.RecurrenceRule();
rule.minute = [25];  // 每隔 30 分执行一次
// rule.second = [0, 10, 20, 30, 40, 50, 60] // meimiao
// 每周一、周三、周五的 0 点和 12 点执行
// rule.dayOfWeek = [1,3,5];
// rule.hour = [0,12];
// rule.minute = 0;
// rule.second = 0;

// 启动任务
let job = schedule.scheduleJob(rule, async () => {
    // foreach
    try {
        console.log('start------------')
        const cmdresultbilibili1 = await runCmdTest('bilibili.js').then(
            (data) => {
                if (data) {
                    console.log('first bilibili is done')
                    const url = readFileList('sitespeed-result/bilibili_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                    const domainsurl = readFileList('sitespeed-result/bilibili_js', filesList = [], 'domains.html');
                    netbiandomain(domainsurl)
                    const PageXrayurl = readFileList('sitespeed-result/bilibili_js', filesList = [], 'index.html');
                    netbianPageXray(PageXrayurl)
                    netbianplayer(PageXrayurl)
                } else {
                    console.log('bilibili fail------------------')
                }
            }
        )
        const cmdresultacfun = await runCmdTest('acfun.js').then(
            (data) => {
                if (data) {
                    const url = readFileList('sitespeed-result/acfun_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                } else {
                    console.log('acfun fail------------------')
                }
            }
        )
        const cmdresultaqiyi = await runCmdTest('aqiyi.js').then(
            (data) => {
                if (data) {
                    const url = readFileList('sitespeed-result/aqiyi_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                } else {
                    console.log('aqiyi fail------------------')
                }
            }
        )
        const cmdresulttencent = await runCmdTest('tencent.js').then(
            (data) => {
                if (data) {
                    const url = readFileList('sitespeed-result/tencent_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                } else {
                    console.log('tencent fail------------------')
                }
            }
        )
        const cmdresultxigua = await runCmdTest('xigua.js').then(
            (data) => {
                if (data) {
                    const url = readFileList('sitespeed-result/xigua_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                } else {
                    console.log('xigua fail------------------')
                }
            }
        )
        const cmdresultyouku = await runCmdTest('youku.js').then(
            (data) => {
                if (data) {
                    const url = readFileList('sitespeed-result/youku_js', filesList = [], 'detailed.html');
                    netbian(url, data.mes)
                } else {
                    console.log('youku fail------------------')
                }
            }
        )
        // if (cmdresultyouku) {
        //     console.log('start delete -------------')
        //     deleteFolder('./sitespeed-result/bilibili_js')
        //     console.log('delete success-------------')
        // } else {
        //     console.log('fail-------------')
        // }
    } catch (e) {
        console.log(e + '---------')
    }
});


