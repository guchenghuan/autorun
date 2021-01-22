module.exports = async function (context, commands) {

    // 爱奇艺  https://www.iqiyi.com/v_19rzivb6s0.html
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'YK_PSL_SETTINGS\',\'{"skip":true,"continuePlay":true,"quality":"540p","language":"default"}\')' });
    // await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'isg__\',\'BBsbIvCdwLocLT2aVQhc_JbJqn-F8C_yfsjwbg1coJox7DzOlcEQQwskhkziTIfq\')' });
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `function setCookie(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + value + ";Path=" + '/'+ ";expires=" + exp.toGMTString();
        }
        setCookie("JSESSIONID", "6FD1390EEB820546F81A344E43B97D3D");
        setCookie("P00001", "e3BWl3qQxCJQxOTRtPMRXm3xL3wU663pFUou3k1iMIsoekS8fIWBlDwm2aNxw9QUqLi825");
        setCookie("P00002", "%7B%22uid%22%3A%221047245242%22%2C%22pru%22%3A1047245242%2C%22user_name%22%3A%22xuyimingace%40163.com%22%2C%22nickname%22%3A%22%5Cu6d41%5Cu5f0a%5Cu5440%22%2C%22pnickname%22%3A%22%5Cu6d41%5Cu5f0a%5Cu5440%22%2C%22type%22%3A10%2C%22email%22%3A%22xuyimingace%40163.com%22%7D");
        setCookie("P00003", "1047245242");
        setCookie("P00004", ".1595477440.54f957d2c9");
        setCookie("P00007", "e3BWl3qQxCJQxOTRtPMRXm3xL3wU663pFUou3k1iMIsoekS8fIWBlDwm2aNxw9QUqLi825");
        setCookie("P00010", "1047245242");
        setCookie("P000email", "xuyimingace%40163.com");
        setCookie("P00PRU", "1047245242");
        setCookie("P01010", "1595520000");
        setCookie("UID", "19623a61a2501093ebca7eg1595479804");
        setCookie("UIDR", "1595479804");
        setCookie("__dfp", "a0a99192bccd1746e4b1c69595735045e91e74e69c03eec5ae7a7bf722c4c7194f@1595572574128@1594276575128");
        setCookie("__uuid", "8ccaa599-8fac-c75f-b827-2fdf7174bc0a")
        setCookie("tsc", "3_5f190ded_5f190e66_0_2")
        `
    });
    await commands.measure.start('https://www.iqiyi.com/v_19rzivb6s0.html');
}