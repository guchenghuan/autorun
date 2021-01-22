module.exports = async function (context, commands) {

    // A站   https://www.acfun.cn/v/ac16708856
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'AcfunH5player::\',\'{"playContinue":false,"danmaku_enabled":true,"subtitle_protected":false,"danmaku_merged":true,"danmaku_alpha":100,"danmaku_area":1,"danmaku_blocked":{"top":false,"bottom":false,"move":false,"color":false,"role":false},"danmaku_filtered":{"filters":[],"enable":true},"danmaku_color":16777215,"danmaku_mode":"1","danmaku_size":25,"danmaku_allowOverlap":false,"danmaku_fontScale":1,"danmaku_speedScale":1,"muted":false,"volume":50,"autoplay":false,"loop":false,"firstQualityType":"540p","sound_effects_enable":true,"sound_effects_preset":"","sound_effects_gain":1,"sound_effects_eqbands":10}\')' });

    await commands.measure.start('https://www.acfun.cn/v/ac16708856');

}