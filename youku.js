module.exports = async function (context, commands) {
    // 优酷   https://v.youku.com/v_show/id_XNDc0MjA2Nzk0NA==.html
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'YK_PSL_SETTINGS\',\'{"skip":true,"continuePlay":true,"quality":"540p","language":"default"}\')' });
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'isg__\',\'BBsbIvCdwLocLT2aVQhc_JbJqn-F8C_yfsjwbg1coJox7DzOlcEQQwskhkziTIfq\')' });
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `function setCookie(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";Domain=" + '.youku.com'+ ";Path=" + '/'+ ";expires=" + exp.toGMTString();
        }
        setCookie("P_sck", "bPqbePMQbP1PzmrKafyD8DgUiZPree2OaN2ay6NCtcByIs7Dsj332nznqwlnL6MEp0TbWt3DWOwEkGjxiIUMR9YW%2BW6WEpgpsoW0PIdVBXfnXBq96RMRwPyX2yJz9%2Bzkhv6N%2BGQXjXt03WnkR92gMw%3D%3D");
    setCookie("P_pck_rm", "sdWkdBofc6976ba82bd44dZBVbzSOdYBb56stZSH0Ej5%2FP%2FGSc4%2BCaaHmndH4IHEHabJjj1fSYHRAYUJvosh0SFYkeMoF5q2rIubZZqTGPDk45PJdm9O78WMY%2BTJglo9Te0hIVUqP9KfGpECsws2uJwS0EfqJfsVPOvchw%3D%3D%5FV2");
    setCookie("P_gck", "NA%7C9jUW%2FUPXuY%2FHNVfRbGlvGQ%3D%3D%7CNA%7C1595408073115");` });
    await commands.measure.start('https://v.youku.com/v_show/id_XNDc0MjA2Nzk0NA==.html');

}