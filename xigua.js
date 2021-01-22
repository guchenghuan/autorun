module.exports = async function (context, commands) {

    // 西瓜  https://www.ixigua.com/6846724646373425676/?logTag=rlwCVBLSMQANPVlbXqT8q
    await commands.cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.localStorage.setItem(\'xgplayer_pc_localSettings-all\',\'{"volume":0.6,"definition":"480p"}\')' });

    await commands.measure.start('https://www.ixigua.com/6846724646373425676/?logTag=rlwCVBLSMQANPVlbXqT8q');

}