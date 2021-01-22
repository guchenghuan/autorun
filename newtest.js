const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
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
                if (path.basename(pathname).includes(name)) {
                    filesList.push(pathname)
                }
            }
        })
    }
    traverse(delPath)
    // console.log('filesList: ', filesList)
    if (name === 'detailed.html' || name === 'domains.html') {
        return filesList[0];
    } else {
        return filesList[1];
    }
}
// readFileList('sitespeed-result/bilibili_js', filesList = [])

// 查询元素在数组中的索引值
Array.prototype.indexValue = function (arr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arr) {
            return i;
        }
    }
}

async function netbian() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const newurl = readFileList('sitespeed-result/bilibili_js', [], 'index.html')
    // const newurls = 'file://' + newurl
    // console.log('newurls: ', newurls)
    await page.goto(newurl);//为了方便从第二页开始
    // 播放器传输  ---------------------------------------
    let imagesplayer = await page.$$eval("td", (el) =>//图片节点，API可查看官方介绍
        el.map((x) => x.innerHTML)
        // el[1].innerHTML//获取图片的src地址
    );

    const numstart = imagesplayer.indexValue('PlayerMediaLoading:start')
    console.log(imagesplayer[numstart + 3])
    const numend = imagesplayer.indexValue('PlayerMediaLoading:end')
    console.log(imagesplayer[numend + 3])

    // // 不同类型文件的传输  ---------------------------------------
    // let imagescontenttvalue = await page.$$eval('#contentSize > tbody > tr > td', (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );
    // var len = imagescontenttvalue.length / 5
    // const newArrcontent = []
    // for (var i = 0; i < len; i++) {
    //     var obj = {
    //         name: imagescontenttvalue[0 + i * 5],
    //         transferSize: imagescontenttvalue[2 + i * 5],
    //         contentSize: imagescontenttvalue[3 + i * 5]
    //     }
    //     newArrcontent.push(obj)
    // }
    // console.log('newArrcontent:  ', newArrcontent)

    // // 较大的资源文件  ------------------------------------------------
    // let imagesLargestkey = await page.$$eval(".assetsurl > a", (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );

    // let imagesLargestvalue = await page.$$eval('#largestAssetsOnThePage > tbody > tr > td.number', (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );
    // const newArrLarges = []
    // for (var i = 0; i < imagesLargestkey.length; i++) {
    //     var obj = {
    //         name: imagesLargestkey[i],
    //         transferSize: imagesLargestvalue[0 + i * 2],
    //         contentSize: imagesLargestvalue[1 + i * 2]
    //     }
    //     newArrLarges.push(obj)
    // }
    // console.log('newArrLarges:  ', newArrLarges)

    // // 查看总概括 -----------------------------------------------
    // let imagessummary = await page.$$eval("#pagexray-panel > div > div > table > tbody > tr >td", (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );
    // // console.log('imagessummary:  ', imagessummary)
    // const newArrsummary = []
    // for (var i = 0; i < imagessummary.length / 2; i++) {
    //     var obj = {
    //         name: imagessummary[0 + i * 2],
    //         value: imagessummary[1 + i * 2]
    //     }
    //     newArrsummary.push(obj)
    // }
    // console.log('newArrsummary:  ', newArrsummary)

    // // domain 下的transfer  --------------------------------

    // let imagestransfer = await page.$$eval("#contentSizePerDomain > tbody > tr > td", (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );
    // // console.log('imagestransfer:  ', imagestransfer)
    // var len = imagestransfer.length / 5
    // const newArrtransfer = []
    // for (var i = 0; i < len; i++) {
    //     var obj = {
    //         name: imagestransfer[0 + i * 5],
    //         transfervalue: imagestransfer[2 + i * 5],
    //         Contentvalue: imagestransfer[3 + i * 5]
    //     }
    //     newArrtransfer.push(obj)
    // }
    // console.log('newArrtransfer:  ', newArrtransfer)

    // domain 下的总耗时 ------------------------------------

    // let imageskey = await page.$$eval(".assetsurl", (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );

    // let imagesvalue = await page.$$eval('.number', (el) =>//图片节点，API可查看官方介绍
    //     el.map((x) => x.innerHTML)
    //     // el[1].innerHTML//获取图片的src地址
    // );
    // const newArr = []
    // for (var i = 0; i < imageskey.length; i++) {
    //     var obj = {
    //         name: imageskey[i],
    //         value: imagesvalue[7 + i * 9]
    //     }
    //     newArr.push(obj)
    // }
    // console.log('newArr:  ', newArr)

    // console.log('images:  ', images)
    // const num = images.indexValue('<a href="help.html#firstPaint">First Paint</a>')
    // console.log('images:  ', num)
    // const newArr = []
    // const Performance = parseFloat(images[8]) // 1
    // const TTFB = parseFloat(images[num + 32]) < 50 ? parseFloat(images[num + 32]) * 1000 : parseFloat(images[num + 32]).toFixed(2)
    // const FCP = parseFloat(images[num + 20]) < 50 ? parseFloat(images[num + 20]) * 1000 : parseFloat(images[num + 20]).toFixed(2)
    // const LCP = parseFloat(images[num + 14]) < 50 ? parseFloat(images[num + 14]) * 1000 : parseFloat(images[num + 14]).toFixed(2)
    // const CLS = parseFloat(images[num + 92]) < 50 ? parseFloat(images[num + 92]) * 1000 : parseFloat(images[num + 92]).toFixed(2)
    // const SpeedIndex = parseFloat(images[num + 104]) < 50 ? parseFloat(images[num + 104]) * 1000 : parseFloat(images[num + 104]).toFixed(2)
    // const Visual99 = parseFloat(images[num + 134]) < 50 ? parseFloat(images[num + 134]) * 1000 : parseFloat(images[num + 134]).toFixed(2)
    // const firstPaint = parseFloat(images[num + 2]) < 50 ? parseFloat(images[num + 2]) * 1000 : parseFloat(images[num + 2]).toFixed(2)
    // const imgsize = parseFloat(images[56])  // 1
    // const Htmlsize = parseFloat(images[62]) // 1
    // const Csssize = parseFloat(images[68]) // 1
    // const Jssize = parseFloat(images[74]) // 1
    // const Totalsize = parseFloat(images[86])  // 1
    // const FullyLoaded = parseFloat(images[num + 8]) < 50 ? parseFloat(images[num + 8]) * 1000 : parseFloat(images[num + 8]).toFixed(2)

    // newArr.push(Performance, TTFB, FCP, LCP, CLS, SpeedIndex, Visual99, firstPaint, imgsize, Htmlsize, Csssize, Jssize, Totalsize, FullyLoaded)
    // console.log('newArr:  ', newArr)

    await browser.close();
    // return newArr
}
//这里执行
netbian()
// readFileList('sitespeed-result/bilibili_js', [], 'index.html')


// ----------------------------------------------------------
// del file
// function deleteFolder(delPath) {
//     delPath = path.join(__dirname, delPath)
//     try {
//         if (fs.existsSync(delPath)) {
//             const delFn = function (address) {
//                 const files = fs.readdirSync(address)
//                 for (let i = 0; i < files.length; i++) {
//                     const dirPath = path.join(address, files[i])
//                     if (fs.statSync(dirPath).isDirectory()) {
//                         delFn(dirPath)
//                     } else {
//                         deleteFile(dirPath, true)
//                     }
//                 }
//                 /**
//                 * @des 只能删空文件夹
//                 */
//                 fs.rmdirSync(address);
//             }
//             delFn(delPath);
//         } else {
//             console.log('do not exist: ', delPath);
//         }
//     } catch (error) {
//         console.log('del folder error', error);
//     }
// }
// function deleteFile(delPath, direct) {
//     delPath = direct ? delPath : path.join(__dirname, delPath)
//     try {
//         /**
//          * @des 判断文件或文件夹是否存在
//          */
//         if (fs.existsSync(delPath)) {
//             fs.unlinkSync(delPath);
//         } else {
//             console.log('inexistence path：', delPath);
//         }
//     } catch (error) {
//         console.log('del error', error);
//     }
// }

// deleteFolder('./sitespeed-result')