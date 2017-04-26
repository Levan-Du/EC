import { getPayPrice, sumAmount } from './goods';

var findOne = (id) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
    });
    return selectEl;
}

var findOneBy = (goodid, paytype) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.GoodID == goodid && el.PayType == paytype;
    });
    return selectEl;
}

var checkOne = (id) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
    });
    selectEl.checked = !selectEl.checked;
    localStorage.Shopcar = JSON.stringify(lsc);
}

var checkAll = (checked) => {
    var lsc = get();
    lsc.forEach((el) => {
        el.checked = checked;
    });
    localStorage.Shopcar = JSON.stringify(lsc);
}


var insertOne = (id, goodid, goodname, paytype, sprice, dprice, pprice, introImg) => {
    var now = new Date().toString(),
        lsc = get();
    lsc.push({
        checked: true,
        selected: false,
        ID: id,
        GoodID: goodid,
        Created: now,
        Modified: now,
        PayType: paytype,
        GoodName: goodname,
        PointPrice: pprice,
        ScorePrice: sprice,
        DiamondPrice: dprice,
        IntroImg: introImg
    })
    localStorage.Shopcar = JSON.stringify(lsc);
}

var updateOne = (id, key, value) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
    });
    selectEl[key] = value;
    localStorage.Shopcar = JSON.stringify(lsc);
}

var increNum = (id, key) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
    });
    var oldNum = selectEl[key];
    selectEl[key] = oldNum + 1;
    localStorage.Shopcar = JSON.stringify(lsc);
}

var removeChecked = () => {
    var lsc = get();
    var unCheckedGoods = lsc.filter(el => {
        return !el.checked
    });
    localStorage.Shopcar = JSON.stringify(unCheckedGoods);
}

var get = () => {
    var sc = localStorage.Shopcar;
    if (!sc || sc == 'undefined')
        return null;
    return JSON.parse(sc);
}

var set = (obj) => {
    localStorage.Shopcar = JSON.stringify(obj);
}

var isAllChecked = () => {
    var lsc = get();
    var el;
    for (var i = lsc.length; i--;) {
        el = lsc[i];
        if (!el.checked) {
            return false;
        }
    };
    return true;
}

var getCheckedSum = () => {
    var lsc = get();
    var PAmount = 0,
        SAmount = 0,
        DAmount = 0,
        NumSum = 0;
    var checkedGoods = lsc.filter(el => {
        return el.checked
    });

    checkedGoods.forEach((el) => {
        SAmount += sumAmount(el, 1);
        DAmount += sumAmount(el, 2);
        PAmount += sumAmount(el, 3);
        NumSum += parseInt(el.Num);
    });
    return {
        SAmount: SAmount,
        DAmount: DAmount,
        PAmount: PAmount,
        NumSum: NumSum
    }
}

var LocalShopCar = {
    get: get,
    set: set,
    findOne: findOne,
    findOneBy: findOneBy,
    checkOne: checkOne,
    checkAll: checkAll,
    updateOne: updateOne,
    increNum: increNum,
    isAllChecked: isAllChecked,
    getCheckedSum: getCheckedSum,
    removeChecked: removeChecked
}

export default LocalShopCar;
