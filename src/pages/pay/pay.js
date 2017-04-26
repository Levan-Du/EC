import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import SessionGoods from '../../commons/basic/SessionGoods';
import { backToLastPage, getQueryString } from '../../commons/basic/page';
import { formatPayType } from '../../commons/basic/format';
import { getPayPrice } from '../../commons/basic/goods';
import LocalShopCar from '../../commons/basic/LocalShopCar';
// import mockData from './pay.mock';

/*
    地址参数
    type: 1.singlepay:单个商品直接兑换，2.shopcar:购物车商品兑换
*/
var QueryString = getQueryString(),
    OnOrderType = QueryString['type'],
    GoodID = QueryString['goodid'],
    AddrID = localStorage.AddrID,
    formData = {};

var loadReceiverInfo = () => {
    return new Promise((resolve, reject) => {
        fetchData('/GetUserAddr', {})
            .then((res) => {
                var addrs = res.message;
                console.log(addrs);
                if (addrs.length === 0) {
                    window.location = "./receiver.html";
                    resolve('GetUserAddr finish');
                    return;
                }

                var dfAddr = addrs.find((el) => {
                    if (!AddrID) {
                        return el.IsDefault;
                    } else
                        return el.AddrID == AddrID;
                });
                AddrID = dfAddr.AddrID;

                renderReceiverInfo(dfAddr);
                resolve('GetUserAddr finish');
            })
            .catch((err) => {
                reject(err);
            });
    });
}

var renderReceiverInfo = (dfAddr) => {
    if (!dfAddr) return;

    var html = `
    <article class="info">
        <section class="info-contact">
            <h1>${dfAddr.ReceiverName}</h1>
            <h1>${dfAddr.ReceiverMobile}</h1>
            ${dfAddr?'<span class="isdefault">默认<span>':''}
        </section>
        <section class="info-addr">
            <p><span class="iconfont icon-zuobiao"></span>${dfAddr.Addr}</p>
        </section>
    </article>
    <p class="direction"><span class="iconfont icon-xiangyou1"><span></p>
    `
    $('#receiverinfo').append(html);
}


var loadGoodsInfo = () => {
    switch (OnOrderType) {
        case 'singlepay':
            return new Promise((resolve, reject) => {
                fetchData('/GoodsList', 'GoodID=' + GoodID)
                    .then((res) => {
                        var goods = res.message,
                            g = goods[0];
                        g.PayPrice = getPayPrice(g);
                        g.Num = 1;
                        formData = {
                            AddrID: AddrID,
                            GoodID: GoodID,
                            Num: g.Num,
                            PayType: g.PayType
                        };

                        renderGoods(goods);
                        resolve('GoodsList finish');
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        case 'shopcar':
            return new Promise((resolve, reject) => {
                var shopcar = LocalShopCar.get(),
                    goods = shopcar.filter((el) => {
                        return el.checked == true;
                    });

                var carArr = '';
                goods.forEach((el) => {
                    el.PayPrice = getPayPrice(el);
                    carArr += el.ID + ',';
                });
                formData = {
                    AddrID: AddrID,
                    CarArray: carArr.substring(0, carArr.length - 1)
                };

                renderGoods(goods);
                resolve('LocalShopCar finish');
            });
        default:
            return Promise.resolve();
    }
}

var renderGoods = (goods) => {
    renderGoodsInfo(goods);
    renderGoodsSum(goods);
}

var renderGoodsInfo = (goods) => {
    if (!goods || !goods.map) return;

    var html = goods.map(el => `
    <li class="gooditem">
        <article class="img-box"><img src="${el.IntroImg}"></article>
        <article class="info">
            <p class="goodname">${el.GoodName}</p>
            <p class="number">
                <span class="price">${formatPayType(el.PayType)}￥${parseInt(el.PayPrice)}</span>
                <span class="num">x ${el.Num}</span>
            </p>
        </article>
    </li>
    `).join('');
    $('#goodsinfo').append(html);
}

var renderGoodsSum = (goods) => {
        if (!goods || !goods.map) return;

        var sAmount = 0,
            dAmount = 0,
            pAmount = 0;

        var sumAmount = (el, type) => {
            return (el.PayType == type ? parseInt(el.PayPrice) * parseInt(el.Num) : 0);
        }
        goods.forEach((el) => {
            sAmount += sumAmount(el, 1);
            dAmount += sumAmount(el, 2);
            pAmount += sumAmount(el, 3);
        });
        var tmpl = `
        <article class="sum">
            <section class="sum-title">合计：</section>
            <section class="sum-show">
                ${sAmount===0?'':`<p>${formatPayType(1)}<span class="amount">￥${sAmount}</span></p>`}
                ${dAmount===0?'':`<p>${formatPayType(2)}<span class="amount">￥${dAmount}</span></p>`}
                ${pAmount===0?'':`<p>${formatPayType(3)}<span class="amount">￥${pAmount}</span></p>`}
            </section>
        </article>
    `;
    $('#goodssum').html(tmpl);
}

var selectAddr = () => {

}

var submitPay=()=>{
        if (OnOrderType=='singlepay') {
            return postData('/OnOrderGood', jsonToParams(formData));
        } else {
            return postData('/OnOrderCar',jsonToParams(formData));
        }
    
}
var submit = () => {
    $('#btn_confirm').click((e) => {
        submitPay().then((res)=>{
            if(res.status=='success'){
                window.location="/orders.html";
                if(OnOrderType=='shopcar'){                    
                    LocalShopCar.removeChecked();
                }
            }
            else{
                alert(res.message);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    })
}

var loadData = () => {
    Promise.resolve().then((res) => {
            return loadReceiverInfo();
        })
        .then((res) => {
            return loadGoodsInfo();
        })
        .catch((err) => {
            console.log(err);
        });
}

var initAction = () => {
    backToLastPage('#btn_back');
    submit();
}

export var init = () => {
    loadData();
    initAction();
}
