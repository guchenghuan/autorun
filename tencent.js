module.exports = async function (context, commands) {

    // 腾讯  https://v.qq.com/x/page/g3112yjamip.html
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `function setCookie(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";Path=" + '/'+ ";expires=" + exp.toGMTString();
        }
        setCookie("main_login", "qq");
        setCookie("main_login", "qq");
        setCookie("o_minduid", "LaTo2dKiBnmvOREalBRZvgg901ecnOFB");
        setCookie("ts_uid", "3280140739");
        setCookie("tvfe_boss_uuid", "e2f995f046ee75af");
        setCookie("uid", "136710360");
        setCookie("vqq_access_token", "8F7B072F1DF72776FFE0EF39E5D43FDA");
        setCookie("vqq_appid", "101483052");
        setCookie("vqq_login_time_init", "1595416274");
        setCookie("vqq_next_refresh_time", "6465");
        setCookie("vqq_openid", "C82D091882CC7E2ED59435A2DD3E9E6A");
        setCookie("vqq_refresh_token", "E5658FE6C11C69F01550C6FDAE79D432");
        setCookie("vqq_vuserid", "580717614");
        setCookie("vqq_vusession", "J50LCY7irHC0bUXafB5wHw..")
        `
    });

    await commands.measure.start('https://v.qq.com/x/page/g3112yjamip.html');

}