export default function fit() {
    var winWidth = $(window).width();
    if (winWidth < 412) {
        $('html').css('fontSize', 12);
    } else if (winWidth < 640) {
        $('html').css('fontSize', 16);
    } else if (winWidth < 1000) {
        $('html').css('fontSize', 20);
    } else {
        $('html').css('fontSize', 30);
    }
}
