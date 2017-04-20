import Promise from 'bluebird';
import { fetchData, postData } from '../../commons/basic/ajax';
import { getQueryString } from '../../commons/basic/page';
// import mockData from './goods.mock';

const createGoods = (data) => {
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
                    <i>￥${parseInt(r.PayPrice)}</i>
                </dt>
                <dt class="good-info-item action">
                    <a class="btn btn_addtoshopcar" data-gid="${r.ID}" data-paytype="${r.PayType}"><span class="iconfont icon-gouwuche"></span><span>加入购物车</span></a>
                    <a class="btn" data-gid="${r.ID}" href="pay.html?type=singlepay&goodid=${r.ID}"><span class="iconfont icon-danpin"></span><span>立即兑换</span></a>                        
                </dt>
            </dl>
        </li>`).join('');
    $('#grid-goods').append(tmpl);

    $('.main .grid .grid-item .btn.btn_addtoshopcar').click((e) => {
        var target = $(e.currentTarget);
        var gid = target.attr('data-gid'),
            paytype = target.attr('data-paytype');
        console.log(target);
        var jsondata = {
            GameID: localStorage.GameID,
            GoodID: gid,
            Num: 1,
            PayType: paytype,
            EditType: 1
        }
        postData('/OnShopCar', jsondata);
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
                createGoods(res.message);
                setSessionGoods(res.message);
                resolve('Get GoodsList finish');
            })
            .catch((err) => {
                reject(err);
            });
    });
}

var setSessionGoods = (data) => {
    if (!sessionStorage.Goods) {
        sessionStorage.Goods = data;
    }
}

const fetchCities = () => {
    return new Promise((resolve, reject) => {
        fetchData('/CitiesArea', null)
            .then((res) => {
                if (!localStorage.Countrys || localStorage.Countrys == "undefined") {
                    localStorage.Countrys = JSON.stringify(res.message.Countrys);
                }
                if (!localStorage.Provinces || localStorage.Provinces == "undefined") {
                    localStorage.Provinces = JSON.stringify(res.message.Provinces);
                }
                if (!localStorage.Cities || localStorage.Cities == "undefined") {
                    localStorage.Cities = JSON.stringify(res.message.Cities);
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
        });
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
