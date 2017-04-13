export default function fit() {
    var win_width = windowWidth();
    if (win_width < 412) {
        setHtmlEleFontSize(12);
    } else if (win_width < 640) {
        setHtmlEleFontSize(16);
    } else if (win_width < 1000) {
        setHtmlEleFontSize(20);
    } else {
        setHtmlEleFontSize(24);
    }
}

var windowWidth = () => {
    return win_width = document.body.clientWidth || document.documentElement.clientWidth;
}

var setHtmlEleFontSize = (fontSize) => {
    htmlEle = document.getElementsByTagName('html')[0];
    htmlEle.style.fontSize = fontSize;
}
