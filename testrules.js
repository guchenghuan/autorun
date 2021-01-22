const schedule = require('node-schedule');
var exec = require("child_process").exec;
// 定义规则
let rule = new schedule.RecurrenceRule();
// rule.minute = [25];  // 每隔 30 分执行一次
rule.second = [0, 10, 20, 30, 40, 50, 60] // meimiao
// 每周一、周三、周五的 0 点和 12 点执行
// rule.dayOfWeek = [1,3,5];
// rule.hour = [0,12];
// rule.minute = 0;
// rule.second = 0;

runCmdTest = async () => {
    return new Promise((res, rej) => {
        var cmdStr = 'node testfile.js'
        console.log('start run')
        exec(cmdStr, function (err, stdout, stderr) {
            if (err) {
                console.log('get weather api error:' + stderr);
            } else {
                const obj = stdout
                console.log('success');
                // return data
                res(obj)
            }
        });
    })
}
// 启动任务
let job = schedule.scheduleJob(rule, async () => {
    // foreach
    try {
        console.log('start------------')
        await runCmdTest().then(
            (data) => {
                if (data) {
                    console.log(data)
                } else {
                    console.log('bilibili fail------------------')
                }
            }
        )
    } catch (e) {
        console.log(e + '---------')
    }
});