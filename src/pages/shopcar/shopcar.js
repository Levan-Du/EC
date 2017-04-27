import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import { backToLastPage } from '../../commons/basic/page';
import LocalShopCar from '../../commons/basic/LocalShopCar';
import mockData from './shopcar.mock';
import { getPayPrice, sumAmount } from '../../commons/basic/goods';
import { showMessage } from '../../commons/basic/modal';

var EditData = null,
    editStatus = 'normal',
    EditStatusEnum = { edit: 'edit', normal: 'normal' };

var setEditData = (data) => {
    EditData = data.slice();
    EditData.map((el) => {
        el.checked = false;
        return el;
    });
}

var renderPrice = (el) => {
    var tmpl = '';
    var pprice = parseInt(el.PointPrice),
        sprice = parseInt(el.ScorePrice),
        dprice = parseInt(el.DiamondPrice);

    if (el.PayType == 1)
        tmpl += `<p><span>金币</span><span class="price price-score" data-sid="${el.ID}">￥${sprice}</span></p>`;
    if (el.PayType == 2)
        tmpl += `<p><span>钻石</span><span class="price price-diamond" data-sid="${el.ID}">￥${dprice}</span></p>`;
    if (el.PayType == 3)
        tmpl += `<p><span>积分</span><span class="price price-point" data-sid="${el.ID}">￥${pprice}</span></p>`;
    return tmpl;
}

var renderGrid = (data) => {
    var tmpl = data.map(el => `
<li class="grid-item">
    <ul>
        <li class="checked">
            <a data-sid="${el.ID}" data-gid="${el.GoodID}"><span class="iconfont icon-${el.checked?'fangxingxuanzhongfill':'fangxingweixuanzhong'}"></span></a>
        </li>
        <li class="img-box">
            <a data-sid="${el.ID}" data-gid="${el.GoodID}"><img src="${el.IntroImg}"></img></a>
        </li>
        <li class="info">
            <p class="title">${el.GoodName}</p>
            <ul class="content">
                <li class="left">${renderPrice(el)}</li>
                <li class="right">
                    <a class="btn btn-reduce" data-sid="${el.ID}" data-gid="${el.GoodID}">-</a>
                    <input type="number" class="num" value=${el.Num} data-sid="${el.ID}" data-gid="${el.GoodID}" data-pprice="${el.PointPrice}" data-sprice="${el.ScorePrice}" data-dprice="${el.DiamondPrice}" data-paytype="${el.PayType}" />
                    <a class="btn btn-add" data-sid="${el.ID}" data-gid="${el.GoodID}">+</a>
                </li>
            </ul>
        </li>
    </ul>
</li>
    `).join('');
    $('#grid-shopCard').html(tmpl);

    var reducBtns = $('.main .grid .grid-item ul li.info ul li.right .btn.btn-reduce');
    var addBtns = $('.main .grid .grid-item ul li.info ul li.right .btn.btn-add');
    // var numInputs = $('.main .grid .grid-item ul li.info ul li.right input.num');
    // var priSpans = $('.main .grid .grid-item ul li.info ul li.left span.price');

    reducBtns.click((e) => {
        onNumClick(e);
    });

    addBtns.click((e) => {
        onNumClick(e);
    });

    // fangxingxuanzhongfill
    var acheck = $('.main .grid .grid-item ul li.checked a');
    acheck.click((e) => {
        e.stopPropagation();
        e.preventDefault();
        var target = $(e.currentTarget),
            sid = target.attr('data-sid'),
            gid = target.attr('data-gid'),
            icon = target.find('span.iconfont');
        var isSelect = icon.prop('class').indexOf('icon-fangxingxuanzhongfill') === -1;
        toggleSelect(icon, !isSelect);

        checkOne(sid, gid);
        renderSumAmount();
        renderCheckAll();
    });

}

var onNumClick = (e) => {
    var target = $(e.currentTarget);
    var numEle = target.siblings('input.num');
    var inum = parseInt(numEle.val());
    if (target.attr('class').indexOf('btn-reduce') !== -1) {
        inum = inum - 1;
        if (inum < 1) return;
    } else {
        var inum = parseInt(numEle.val()) + 1;
    }
    numEle.val(inum);
    var sid = target.attr('data-sid');
    var gid = target.attr('data-gid');
    var paytype = numEle.attr('data-paytype');
    var jsondata = {
        GoodID: gid,
        Num: inum,
        PayType: paytype,
        EditType: 2
    }

    LocalShopCar.updateOne(sid, "Num", inum);
    renderSumAmount();
    postData('/OnShopCar', jsonToParams(jsondata))
        .then((res) => {
            console && console.log(res);
        })
        .catch((err) => {
            console && console.log(err);
        });
}

var renderSumAmount = () => {
    var checkedSum = LocalShopCar.getCheckedSum();
    $('#s_amount').text('￥' + checkedSum.SAmount);
    $('#d_amount').text('￥' + checkedSum.DAmount);
    $('#p_amount').text('￥' + checkedSum.PAmount);
    $('#allnum').text(checkedSum.Num);
}

var toggleSelect = (icon, isSelect) => {
    if (isSelect) {
        icon.removeClass('icon-fangxingxuanzhongfill');
        icon.addClass('icon-fangxingweixuanzhong');
    } else {
        icon.removeClass('icon-fangxingweixuanzhong');
        icon.addClass('icon-fangxingxuanzhongfill');
    }
}

var renderCheckAll = () => {
    var checkAllBtn = $('#selectAll'),
        icon = checkAllBtn.find('span.iconfont'),
        isSelect = true;
    if (editStatus === EditStatusEnum.normal) {
        isSelect = LocalShopCar.isAllChecked();
    } else {
        isSelect = EditData.filter((el) => {
            return !el.checked;
        }).length === 0;
    }
    toggleSelect(icon, !isSelect);
}

var getMockData = () => {
    return Promise.resolve(mockData);
}

var fetchShopCar = () => {
    var lsc = LocalShopCar.get();

    if (lsc) {
        var data = lsc;
        return Promise.resolve(data);
    } else {
        return new Promise((resolve, reject) => {
            fetchData('/ShopCarList')
                // getMockData()
                .then((res) => {
                    LocalShopCar.set(res.message);
                    var data = LocalShopCar.get();
                    return resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

var renderData = (ready) => {
    fetchShopCar().then((data) => {
            renderDom(data);
            if (ready) {
                setEditData(data);
            }
        })
        .catch((err) => {
            console && console.log(err);
        })
}

var renderDom = (data) => {
    renderMenubar();
    renderGrid(data);
    renderCheckAll();
    renderSumAmount();
}

var renderMenubar = () => {
    var tmpl = '';
    if (editStatus === EditStatusEnum.edit) {
        tmpl = `
        <ul class="action-wrap">
                <li class="action-left left">
                    <a id="selectAll">
                        <span class="iconfont icon-fangxingweixuanzhong"></span>
                        <span>全选<span>
                    </a>
                </li>
                <li class="action mid-2">
                    <button id="btn_del" class="btn">删除</button>
                </li>                
        </ul>`;
    } else {
        tmpl = `
        <ul class="action-wrap visible">
            <li class="action-left left">
                <a id="selectAll">
                    <span class="iconfont icon-fangxingweixuanzhong"></span>
                    <span>全选<span>
                </a>
            </li>
            <li class="action mid">
                    <article class="sum">
                        <section class="sum-title">合计：
                        </section>
                        <section class="sum-show">
                            <p>金币<span id="s_amount" class="amount">￥0</span></p>
                            <p>钻石<span id="d_amount" class="amount">￥0</span></p>
                            <p>积分<span id="p_amount" class="amount">￥0</span></p>
                        </section>
                    </article>
            </li>
            <li class="action right">
                <a class="action-item-noicon" id="btn_toreceiver" href="pay.html?type=shopcar">去结算(<span id="allnum">0</span>)</a>
            </li>
        </ul>
    `
    }
    $('#menubar').html(tmpl);


    var selectAllEle = $('#selectAll');
    selectAllEle.click((e) => {
        var target = $(e.currentTarget),
            acheck = $('.main .grid .grid-item ul li.checked a'),
            iconLi = acheck.find('span.iconfont'),
            iconAll = target.find('span.iconfont'),
            isSelect = iconAll.prop('class').indexOf('icon-fangxingxuanzhongfill') === -1;

        if (isSelect) {
            iconAll.removeClass('icon-fangxingweixuanzhong');
            iconAll.addClass('icon-fangxingxuanzhongfill');
            iconLi.removeClass('icon-fangxingweixuanzhong');
            iconLi.addClass('icon-fangxingxuanzhongfill');
            checkAll(true);
        } else {
            iconAll.addClass('icon-fangxingweixuanzhong');
            iconAll.removeClass('icon-fangxingxuanzhongfill');
            iconLi.addClass('icon-fangxingweixuanzhong');
            iconLi.removeClass('icon-fangxingxuanzhongfill');
            checkAll(false);
        }
        renderSumAmount();
    });

    gotoPay();

    $('#btn_del').click((e) => {
        delShopcar();
    });
}

var delShopcar = () => {
    var checkedData = EditData.filter((el) => {
        return el.checked
    });
    var promise = Promise.resolve();
    checkedData.forEach((el) => {
        promise = promise.then((res) => {
            return new Promise((resolve, reject) => {
                var jsondata = {
                    GoodID: el.GoodID,
                    Num: el.Num,
                    PayType: el.PayType,
                    EditType: 3
                }
                postData('/OnShopCar', jsonToParams(jsondata))
                    .then((res) => {
                        removeItem(el.ID);
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
        });
    });
    promise.then((res) => {
        bindEditBtn($('#btn_edit'));
    });
}


var removeItem = (sid) => {
    LocalShopCar.removeBy(sid);
    EditData.forEach((el, i) => {
        if (el.ID == sid) {
            EditData.splice(i, 1);
        }
    })
}

var checkOne = (sid, gid) => {
    if (editStatus === EditStatusEnum.normal) {
        LocalShopCar.checkOne(sid, gid);
    } else {
        var selectEl = EditData.find((el) => {
            return el.ID == sid && el.GoodID == gid;
        });
        selectEl.checked = !selectEl.checked;
    }
}

var checkAll = (checked) => {
    if (editStatus === EditStatusEnum.edit) {
        EditData = EditData.map((el) => {
            el.checked = checked;
            return el;
        });
    } else {
        LocalShopCar.checkAll(checked);
    }
}

var gotoPay = () => {
    $('#btn_toreceiver').click((e) => {
        var checkedSum = LocalShopCar.getCheckedSum();
        if (checkedSum.Num === 0) {
            e.preventDefault();
            showMessage('请选择商品！')
        }
    })
}

var initActionBtn = () => {
    $('#btn_edit').click((e) => {
        var target = $(e.currentTarget);
        bindEditBtn(target);
    });
}

var bindEditBtn = (target) => {
    var txt = target.text();
    if (txt === '编辑') {
        editStatus = EditStatusEnum.edit;
        renderDom(EditData);
        target.text('完成');
    } else {
        editStatus = EditStatusEnum.normal;
        renderData(false);
        target.text('编辑');
    }
}

var loadData = () => {}


var initAction = () => {
    backToLastPage('#btn_back');
    renderData(true);
    initActionBtn();
}

export var init = () => {
    loadData();
    initAction();
}
