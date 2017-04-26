import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import { backToLastPage } from '../../commons/basic/page';
import LocalShopCar from '../../commons/basic/LocalShopCar';
import mockData from './shopcar.mock';
import { getPayPrice, sumAmount } from '../../commons/basic/goods';
import { showMessage } from '../../commons/basic/modal';


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
    var html = data.map(el => `
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
    $('#grid-shopCard').append(html);

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

        LocalShopCar.checkOne(sid, gid);
        renderSumAmount();
        renderCheckAll();
    });

    var selectAllEle = $('#selectAll');
    selectAllEle.click((e) => {
        var target = $(e.currentTarget);
        var iconAll = target.find('span.iconfont');
        var isSelect = iconAll.prop('class').indexOf('icon-fangxingxuanzhongfill') === -1;
        if (isSelect) {
            iconAll.removeClass('icon-fangxingweixuanzhong');
            iconAll.addClass('icon-fangxingxuanzhongfill');
            acheck.find('span.iconfont').removeClass('icon-fangxingweixuanzhong');
            acheck.find('span.iconfont').addClass('icon-fangxingxuanzhongfill');
            LocalShopCar.checkAll(true);
        } else {
            iconAll.addClass('icon-fangxingweixuanzhong');
            iconAll.removeClass('icon-fangxingxuanzhongfill');
            acheck.find('span.iconfont').addClass('icon-fangxingweixuanzhong');
            acheck.find('span.iconfont').removeClass('icon-fangxingxuanzhongfill');
            LocalShopCar.checkAll(false);
        }
        renderSumAmount();
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
        isSelect = LocalShopCar.isAllChecked();
    toggleSelect(icon, !isSelect);
}

var getMockData = () => {
    return Promise.resolve(mockData);
}

var fetchShopCar = () => {
    var lsc = LocalShopCar.get();

    if (lsc) {
        var data = LocalShopCar.get();
        renderGrid(data);
        renderCheckAll();
        renderSumAmount();
    } else {
        fetchData('/ShopCarList')
            // getMockData()
            .then((res) => {
                LocalShopCar.set(res.message);
                var data = LocalShopCar.get();
                renderGrid(data);
                renderCheckAll();
                renderSumAmount();
            })
            .catch((err) => {
                console && console.log(err);
            });
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

var loadData = () => {
    fetchShopCar();
}


var initAction = () => {
    backToLastPage('#btn_back');
    gotoPay();
}

export var init = () => {
    loadData();
    initAction();
}
