import Promise from 'bluebird';
import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import { getQueryString } from '../../commons/basic/page';
import LocalCities from '../../commons/basic/LocalCities';
import LocalShopCar from '../../commons/basic/LocalShopCar';
import SessionGoods from '../../commons/basic/SessionGoods';
import { showTips } from '../../commons/basic/modal';
import { formatPayType } from '../../commons/basic/format';

// import mockData from './goods.mock';
sessionStorage.clear();

var localCountrys = LocalCities.Countrys,
    localProvinces = LocalCities.Provinces,
    localCities = LocalCities.Cities;

const renderGoods = (data) => {
    var tmpl = data.map(r => `
        <li class="grid-item">
            <a class="good-img-link" href="./gooddetail.html?id=${r.ID}">
                <img src="${r.IntroImg}"></img>
            </a>
            <dl class="good-info">
                <dt class="good-info-item title">
                    <p>${r.GoodName}</p>
                </dt>
                <dt class="good-info-item price">
                    <span>${formatPayType(r.PayType)}</span><i>￥${parseInt(r.PayPrice)}</i>
                </dt>
                <dt class="good-info-item action">
                    <a class="btn btn_addtoshopcar" data-gid="${r.ID}" data-paytype="${r.PayType}" data-gname="${r.GoodName}" data-imgurl="${r.IntroImg}" data-sprice="${r.ScorePrice}" data-dprice="${r.DiamondPrice}" data-pprice="${r.PointPrice}"><span class="iconfont icon-gouwuche"></span><span>加入购物车</span></a>
                    <a class="btn" data-gid="${r.ID}" href="pay.html?type=singlepay&goodid=${r.ID}"><span class="iconfont icon-danpin"></span><span>立即兑换</span></a>                        
                </dt>
            </dl>
        </li>`).join('');
    $('#grid-goods').append(tmpl);

    $('.main .grid .grid-item .btn.btn_addtoshopcar').click((e) => {
        var target = $(e.currentTarget);
        var gid = target.attr('data-gid'),
            gname = target.attr('data-gname'),
            imgurl = target.attr('data-imgurl'),
            sprice = target.attr('data-sprice'),
            dprice = target.attr('data-dprice'),
            pprice = target.attr('data-pprice'),
            paytype = target.attr('data-paytype');

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


// const getGoods = () => {
//     return new Promise((resolve, reject) => setTimeout(resolve, 300, mockData));
// }

const saveGameID = () => {
    var qsObj = getQueryString();
    localStorage.GameID = qsObj["gameid"];
}

const fetchGoods = () => {
    return new Promise((resolve, reject) => {
        fetchData('/GoodsList')
            .then((res) => {
                renderGoods(res.message);
                setSessionGoods(res.message);
                resolve('Get GoodsList finish');
            })
            .catch((err) => {
                reject(err);
            });
    });
}

var setSessionGoods = (data) => {
    if (!SessionGoods.get()) {
        SessionGoods.set(data);
    }
}

const fetchCities = () => {
    return new Promise((resolve, reject) => {
        fetchData('/CitiesArea', null)
            .then((res) => {

                var m = res.message,
                    co = m.Countrys,
                    p = m.Provinces,
                    ct = m.Cities,
                    oCountrys = localCountrys.get(),
                    oProvinces = localProvinces.get(),
                    oCities = localCities.get();

                if (!oCountrys || oCountrys == "undefined") {
                    localCountrys.set(co);
                }
                if (!oProvinces || oProvinces == "undefined") {
                    localProvinces.set(p);
                }
                if (!oCities || oCities == "undefined") {
                    localCities.set(ct);
                }
                resolve('Get CitiesArea finish');
            }).catch(err => {
                reject(err);
            });
    });
}

var loadData = () => {
    Promise.resolve().then((res) => {
            saveGameID();
        })
        .then((res) => {
            return fetchGoods();
        })
        .then((res) => {
            return fetchCities();
        })
        .then((res) => {
            countShopcar();
        });
}

var countShopcar = () => {
    var count = LocalShopCar.count();
    $('#txtShopcarNum').text(`${count}`);
}

const submit = () => {

}

var selectMunuItem = '#btn_home';

const addClick = (item) => {
    var el = $(item);
    el.click((e) => {
        if (selectMunuItem === item) return;
        $(selectMunuItem).removeClass('active');
        el.addClass('active');
        selectMunuItem = item;
    });
}

const initAction = () => {
    ['#btn_home', '#btn_history', '#btn_shopcar'].forEach((el) => {
        addClick(el);
    });
}

export var init = () => {
    loadData();
    initAction();
}
