import { fetchData, postData } from '../../commons/basic/ajax';
import { backToLastPage } from '../../commons/basic/page';
import mockData from './shopcar.mock';


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
    //    console.log(parseInt(el.PointPrice), parseInt(el.ScorePrice), parseInt(el.DiamondPrice))
    return tmpl;
}

var renderGrid = (data) => {
    var html = data.map(el => `
<li class="grid-item">
    <ul>
        <li class="checked">
            <a data-sid="${el.ID}" data-gid="${el.GoodID}"><span class="iconfont icon-fangxingweixuanzhong"></span></a>
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
    var numInputs = $('.main .grid .grid-item ul li.info ul li.right input.num');
    var priSpans = $('.main .grid .grid-item ul li.info ul li.left span.price');

    reducBtns.click((e) => {
        numClick(e);
    });

    addBtns.click((e) => {
        numClick(e);
    });

    // fangxingxuanzhongfill
    var acheck = $('.main .grid .grid-item ul li.checked a');
    acheck.click((e) => {
        e.stopPropagation();
        e.preventDefault();
        var sid, gid, icon, aa;

        sid = $(e.currentTarget).attr('data-sid');
        gid = $(e.currentTarget).attr('data-gid');
        aa = $(e.currentTarget); //acheck.filter('[data-sid="' + sid + '"]');
        icon = aa.find('span.iconfont');
        var liinfo = aa.parent().siblings('li.info');

        var isSelect = icon.prop('class').indexOf('icon-fangxingxuanzhongfill') === -1;
        var inum = liinfo.find('ul.content li.right input.num').val();
        toggleSelect(icon, !isSelect);
        fillSelectGoods(sid, gid, inum, liinfo, isSelect);
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
            numInputs.forEach((el) => {
                var ele = $(el),
                    sid = ele.attr('data-sid'),
                    gid = ele.attr('data-gid'),
                    inum = parseInt(ele.val()),
                    pprice = parseInt(ele.attr('data-pprice')),
                    sprice = parseInt(ele.attr('data-sprice')),
                    dprice = parseInt(ele.attr('data-dprice')),
                    p_am = inum * pprice,
                    s_am = inum * sprice,
                    d_am = inum * dprice;
                selectedGoods.push({ ID: sid, GoodID: gid, Num: inum, PAmount: p_am, SAmount: s_am, DAmount: d_am });
            });
        } else {
            iconAll.addClass('icon-fangxingweixuanzhong');
            iconAll.removeClass('icon-fangxingxuanzhongfill');
            acheck.find('span.iconfont').addClass('icon-fangxingweixuanzhong');
            acheck.find('span.iconfont').removeClass('icon-fangxingxuanzhongfill');
            selectedGoods.splice(0, selectedGoods.length);
        }
        renderSumAmount();
    });
}

var numClick = (e) => {
    var target = $(e.currentTarget);
    var numEle = target.siblings('input.num');
    var inum = parseInt(numEle.val());
    if (target.attr('class').indexOf('btn-reduce') !== -1) {
        inum = inum - 1;
        if (inum <= 1) return;
    } else {
        var inum = parseInt(numEle.val()) + 1;
    }
    numEle.val(inum);
    var sid = target.attr('data-sid');
    var gid = target.attr('data-gid');
    var paytype = numEle.attr('data-paytype');
    var jsondata = {
        GameID: localStorage.GameID,
        GoodID: gid,
        Num: inum,
        PayType: paytype,
        EditType: 2
    }
    postData('/OnShopCar', jsondata);
    var liinfo = target.closest('li.info');
    var icon = target.closest('.grid-item').find('li.checked span.iconfont');
    var isSelected = icon.prop('class').indexOf('icon-fangxingxuanzhongfill') !== -1;
    if (isSelected) {
        fillSelectGoods(sid, gid, inum, liinfo, true);
    }

}

var fillSelectGoods = (sid, gid, inum, liinfo, isSelect) => {
    var s_sprice = liinfo.find('ul.content li.left span.price.price-score').text();
    var s_dprice = liinfo.find('ul.content li.left span.price.price-diamond').text();
    var s_pprice = liinfo.find('ul.content li.left span.price.price-point').text();
    var ipprice = s_pprice ? s_pprice.replace('￥', '') : '0';
    var isprice = s_sprice ? s_sprice.replace('￥', '') : '0';
    var idprice = s_dprice ? s_dprice.replace('￥', '') : '0';

    inum = parseInt(inum);
    var p_am = inum * parseInt(ipprice);
    var s_am = inum * parseInt(isprice);
    var d_am = inum * parseInt(idprice);

    var index = 0;
    var el = selectedGoods.find((el, i) => {
        index = i;
        return el.ID === sid;
    });
    if (!isSelect) {
        selectedGoods.splice(index, 1);
    } else {
        if (el) {
            el.Num = inum;
            el.PAmount = p_am;
            el.SAmount = s_am;
            el.DAmount = d_am;
        } else {
            selectedGoods.push({ ID: sid, GoodID: gid, Num: inum, PAmount: p_am, SAmount: s_am, DAmount: d_am });
        }
    }
    renderSumAmount();
}

var renderSumAmount = () => {
    var PAmount = 0,
        SAmount = 0,
        DAmount = 0,
        num_all = 0;
    selectedGoods.forEach((el, i) => {
        PAmount += el.PAmount;
        SAmount += el.SAmount;
        DAmount += el.DAmount;
        num_all += el.Num;
    });

    $('#p_amount').text('￥' + PAmount);
    $('#s_amount').text('￥' + SAmount);
    $('#d_amount').text('￥' + DAmount);
    $('#allnum').text(num_all);
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

var selectedGoods = [];

var getMockData = () => {
    return Promise.resolve(mockData);
}

var loadData = () => {
    fetchData('/ShopCarList')
        // getMockData()
        .then((res) => {
            localStorage.Shopcar = res.message;
            renderGrid(res.message);
        })
        .catch((err) => {
            console.log(err);
        })
}


var initAction = () => {
    backToLastPage('#btn_back');
}

export var init = () => {
    loadData();
    initAction();
}
