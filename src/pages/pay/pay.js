import { fetchData, postData } from '../../commons/basic/ajax';
import SessionGoods from '../../commons/basic/SessionGoods';
import { backToLastPage, getQueryString } from '../../commons/basic/page';
// import mockData from './pay.mock';
import './pay.css';

// var { addrs, goods } = mockData;

var renderReceiverInfo = (dfAddr) => {
    var html = `
    <article class="info">
        <section class="info-contact">
            <h1>${dfAddr.ReceiverName}</h1>
            <h1>${dfAddr.ReceiverMobile}</h1>
            <span class="isdefault">默认<span>
        </section>
        <section class="info-addr">
            <p>${dfAddr.Addr}</p>
        </section>
    </article>
    <p class="direction"><span class="iconfont icon-xiangyou1"><span></p>
    `
    $('#receiverinfo').append(html);
}

var loadReceiverInfo = () => {
    fetchData('/GetUserAddr', {})
        .then((res) => {
            var addrs = res.message;
            if (addrs.length === 0) {
                window.location = "./receiver.html";
                return;
            }

            var dfAddr = addrs.find((el) => {
                return el.IsDefault;
            });
            renderReceiverInfo(dfAddr);
        });
}

var renderGoodsInfo = () => {
    var html = goods.map(el => `
    <li class="gooditem">
        <article class="img-box"><img src="/images/4003.png"></article>
        <article class="info">
            <p class="goodname">${el.GoodName}</p>
            <p class="number">
                <span class="price">￥${el.Price}</span>
                <span class="num">x ${el.Num}</span>
            </p>
        </article>
    </li>
    `).join('');
    $('#goodsinfo').append(html);
}

var renderGoodsSum = () => {
    var sum = 0;
    goods.forEach((el) => {
        sum += parseInt(el.Price) * parseInt(el.Num);
    });
    var tmpl = `
        <p>合计：<span class="amount">￥${sum}</span><p>
    `;
    $('#goodssum').append(tmpl);
}

var loadData = () => {
    loadReceiverInfo();
}

var initAction = () => {
    backToLastPage('#btn_back');
    // renderGoodsInfo();
    // renderGoodsSum();
}

var selectAddr = () => {

}

var submit = () => {
    $('#btn_confirm').click((e) => {
        if (goods.length === 1) {
            var data = { Game }
            PostData('/OnOrder');
        } else {
            PostData('/OnOrderCar');
        }
    })
}

export var init = () => {
    loadData();
    initAction();
}
