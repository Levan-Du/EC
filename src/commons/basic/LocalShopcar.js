var findOne = (id) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
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

var updateOne = (id, key, value) => {
    var lsc = get();
    var selectEl = lsc.find(el => {
        return el.ID == id;
    });
    selectEl[key] = value;
    localStorage.Shopcar = JSON.stringify(lsc);
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

var LocalShopCar = {
    get: get,
    set: set,
    findOne: findOne,
    checkOne: checkOne,
    checkAll: checkAll,
    updateOne: updateOne,
    isAllChecked: isAllChecked
}

export default LocalShopCar;
