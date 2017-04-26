var styles = {
    tipscontainer: 'position:absolute;width:100%;height:100%;left:0;top:0;',
    tipsbox: 'position:absolute;width:10rem;height:3rem;left:50%;top:50%;background:#fff;transform:translate(-50%,-50%);background:#eee;',
    tipsshow: 'line-height:2rem;padding:.5rem;',
    tipsicon: 'padding-right:.5rem;color:#3e3;'
}

var showTips = (tips) => {
    var tipEle = $('.lev-tips-container');
    if (tipEle.length === 0) {
        var tmpl = `
<div style="${styles.tipscontainer}" class="lev-tips-container">
	<article class="lev-tips" style="${styles.tipsbox}">
		<p style="${styles.tipsshow}"><span style=${styles.tipsicon} class="iconfont icon-yuanxingxuanzhongfill"></span><span>${tips}</span></p>
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

export default showTips;
