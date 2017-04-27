import '../../commons/vendor/swiper/swiper-3.4.2.jquery.min';
import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import '../../commons/vendor/swiper/swiper-3.4.2.min.css';
import { backToLastPage } from '../../commons/basic/page';
// import mockData from './gooddetail.mock';
import { getQueryString } from '../../commons/basic/page';
import LocalShopCar from '../../commons/basic/LocalShopCar';
import SessionGoods from '../../commons/basic/SessionGoods';
import { showTips } from '../../commons/basic/modal';


var QueryString = getQueryString(),
    GoodID = QueryString['id'],
    GoodDetail = SessionGoods.findOne(GoodID),
    mySwiper = null,
    mySwiper2 = null;

var slide = () => {
    mySwiper = new Swiper('#swiper1', {
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

var renderGoodsInfo = () => {
        var d = GoodDetail;
        var tmpl = `
        <div id="swiper2" class="swiper-container">
            <ul id="good-img-box" class="swiper-wrapper">
            ${d.images.map(el => `
                <li class="swiper-slide">
                    <img src="${el.ImgUrl}">
                <li>
            `).join('')}
            </ul>
        </div>
        <article class="goods-info">
            <p>${d.GoodName}</p>
            <p class="price">￥${d.PayPrice}</p>
        </article>
`;
    $('.main #pageInfo').append(tmpl);

    tmpl=`
    <img src="${d.Intro}">
`
    $('.main #pageIntro').append(tmpl);

    mySwiper2 = new Swiper('#swiper2', {
        loop: false,
        onSlideChangeStart: (e) => {

        }
    });
}

var addToShopcar=()=>{
    $('#btn_addto_shopcar').click((e)=>{
        var d = GoodDetail,
            gid = d.ID,
            gname = d.GoodName,
            imgurl = d.IntroImg,
            sprice = d.ScorePrice,
            dprice = d.DiamondPrice,
            pprice = d.PointPrice,
            paytype = d.PayType;

        var jsondata = {
            GoodID: gid,
            Num: 1,
            PayType: paytype,
            EditType: 1
        }

        postData('/OnShopCar', jsonToParams(jsondata))
                .then((res) => {
                    showTips('成功添加到购物车');
                    var c = LocalShopCar.findOneBy(gid, paytype);
                    if (c) {
                        LocalShopCar.increNum(c.ID, 'Num');
                    } else {
                        LocalShopCar.insertOne(res.message, gid, gname, paytype, 1, sprice, dprice, pprice, imgurl);
                    }
                    countShopcar();
                });
    });
}

var initPayBtn=()=>{
    $('#btn_buynow').prop('href','pay.html?type=singlepay&goodid='+GoodDetail.ID);
}

var countShopcar = () => {
    var count = LocalShopCar.count();
    $('#txtShopcarNum').text(`(${count})`);
}

var loadData = () => {

}


var initAction = () => {
    backToLastPage('#btn_back');
    slide();
    clickToSlide();
    renderGoodsInfo();
    addToShopcar();
    initPayBtn();
    countShopcar();
}

export var init = () => {
    loadData();
    initAction();
}
