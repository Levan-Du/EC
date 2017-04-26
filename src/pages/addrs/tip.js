var styles = {
    tipsbox: 'position:absolute;',
    tipsshow: 'display:flex;flex-direction:row;justify-content:center;align-items:center;color:#3e3;'
}

$.extends({
    showTips: (tips) => {
        var levtips = $('.lev-tips');
        if (levtips.length === 0) {
            var tmpl = `
	<article class="lev-tips" style="${styles.tipsbox}">
		<p style="${styles.tipsshow}"><span class="iconfont icon-yuanxingxuanzhongfill"></span>${tips}</p>
	</article>
`
            $(document.body).append(tmpl);
        }
        return {
            close: () => {
                levtips.remove();
            }
        }
    }
});
