const schedule = require('node-schedule');
const path = require("path");
const fs = require("fs");

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
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}

let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [5];
rule.hour = [11];
rule.minute = 30;
rule.second = 0;

let job = schedule.scheduleJob(rule, async () => {
    try {
        deleteFolder('./sitespeed-result')
    } catch (e) {
        console.log(e + '---------')
    }
});
