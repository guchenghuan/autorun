module.exports = async function (context, commands) {
    // B站   https://www.bilibili.com/video/BV1oV411673W

    await commands.measure.start('https://www.bilibili.com/video/BV1oV411673W');
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.window.scrollTo(100,2000)' });
}