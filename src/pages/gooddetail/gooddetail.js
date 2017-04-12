import '../../commons/vendor/swiper/swiper-3.4.2.jquery.min';
import '../../commons/vendor/swiper/swiper-3.4.2.min.css';
import mockData from './gooddetail.mock';

var mySwiper;
var slide = () => {
    mySwiper = new Swiper('.swiper-container', {
        loop: false,
        onSlideChangeStart: (e) => {
            selectTab(e);
        }
    });
}
var labels = $('.tab-swiper .tab-label');
var clickToSlide = () => {
    labels.find('a').click((e) => {
        var t = $(e.target).parent('.tab-label');
        var index = labels.index(t[0]);
        if (index === selectTabIndex) {
            return;
        }

        mySwiper.slideTo(index, 600, false);

        labels.eq(index).addClass('active');
        labels.eq(selectTabIndex).removeClass('active');
        selectTabIndex = index;
    });
}

var selectTabIndex = 0;

var selectTab = (e) => {
    var tablabel = $('.swiper-slide.swiper-slide-active').attr('data-label');
    var index = labels.index('[data-for="' + tablabel + '"]');
    labels.eq(index).addClass('active');
    labels.eq(selectTabIndex).removeClass('active');
    selectTabIndex = index;
}



var initData = () => {

}


var initAction = () => {
    slide();
    clickToSlide();
}

export var init = () => {
    initData();
    initAction();
}
