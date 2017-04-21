var findOne = (localKey, id) => {
    var goods = get();
    var selectEl = goods.find(el => {
        return el.ID == id;
    });
    return selectEl;
}

var updateOne = (localKey, id, key, value) => {
    var goods = get();
    var selectEl = goods.find(el => {
        return el.ID == id;
    });
    selectEl[key] = value;
    localStorage.Goods = JSON.stringify(goods);
}

var get = (localKey) => {
    var sg = localStorage[localKey];
    if (!sg || sg == 'undefined')
        return null;
    return JSON.parse(sg);
}

var set = (localKey, obj) => {
    localStorage[localKey] = JSON.stringify(obj);
}


const _Countrys = 'Countrys';
const _Provinces = 'Provinces';
const _Cities = 'Cities';

var createLocalObj = (localKey) => {
    return {
        get: () => {
            return get(localKey);
        },
        set: (value) => {
            set(localKey, value);
        },
        findOne: (id) => {
            return findOne(localKey, id);
        },
        updateOne: (id, key, value) => {
            updateOne(localKey, id, key, value);
        }
    }
}

var LocalCities = {
    Countrys: createLocalObj(_Countrys),
    Provinces: createLocalObj(_Provinces),
    Cities: createLocalObj(_Cities)
}

export default LocalCities;
