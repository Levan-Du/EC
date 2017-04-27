var styles = {
    mask: 'width:100%;height:100%;left:0;top:0;background:#333;opacity:.3;',
    tipscontainer: 'position:absolute;width:100%;height:100%;left:0;top:0;z-index:1000000;',
    tipsbox: 'position:absolute;width:12rem;left:50%;top:50%;background:#fff;transform:translate(-50%,-50%);z-index:1000001;border-radius:.5rem;',
    tipsshow: 'line-height:2rem;padding:1rem;text-align:center;',
    tipsicon: 'padding-right:.5rem;color:#3e3;vertical-align:center;',
    tipstext: 'vertical-align:center;',

    msgbox: () => styles.tipsbox.replace('width:12rem', 'width:15rem').replace('height:3rem;', ''),
    msghead: 'padding:.5rem;border-bottom:solid 1px #ddd;',
    msgfoot: 'height:2.5rem;border-top:solid 1px #ccc;display:flex;flex-direction:row;align-items:stretch;',
    msgbtn: 'flex:1;background:transparent;height:100%;border:none;',
    msgicon: 'padding-right:.5rem;',
}

export var showTips = (tips) => {
    var tipEle = $('.lev-tips-container');
    if (tipEle.length === 0) {
        var tmpl = `
            <div style="${styles.tipscontainer}" class="lev-tips-container">
                <article class="lev-tips" style="${styles.tipsbox}">
                    <p style="${styles.tipsshow}"><span style=${styles.tipsicon} class="iconfont icon-yuanxingxuanzhongfill"></span><span class="${styles.tipstext}">${tips}</span></p>
                </article>
            </div>
            `;
        $(document.body).append(tmpl);
        tipEle = $('.lev-tips-container');
    }

    setTimeout(() => {
        tipEle.remove();
    }, 2000);

    return {
        close: () => {
            tipEle.remove();
        }
    }
}


export var showMessage = (msg) => {
    var tipEle = $('.lev-msg-container');
    if (tipEle.length === 0) {
        var tmpl = `
            <div style="${styles.tipscontainer}" class="lev-msg-container">
                <article class="lev-msg" style="${styles.msgbox()}">
                    <p style="${styles.tipsshow}"><span style=${styles.msgicon} class="iconfont icon-tishi"></span><span class="${styles.tipstext}">${msg}</span></p>
                    <footer style="${styles.msgfoot}"><button class="btn btn-ok" style=${styles.msgbtn}>确定</button></footer>
                </article>
                <div class="lev-msg-mask" style="${styles.mask}">
                </div>
            </div>
            `;
        $(document.body).append(tmpl);
        tipEle = $('.lev-msg-container');
    }

    tipEle.find('.btn.btn-ok').click((e) => {
        tipEle.remove();
    });
}
