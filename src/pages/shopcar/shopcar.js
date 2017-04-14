import { fetchData, postData } from '../../commons/basic/ajax';
import mockData from './shopcar.mock';

var createPage = (data) => {
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
			<p class="title">${el.GoodName}2017款 16G内存256G SSD硬盘</p>
			<ul class="content">
				<li class="left">
					<p><span>积分</span><span class="price price-point" data-sid="${el.ID}">￥${el.PointPrice}</span></p>
					<p><span>金币</span><span class="price price-score" data-sid="${el.ID}">￥${el.ScorePrice}</span></p>
					<p><span>钻石</span><span class="price price-diamond" data-sid="${el.ID}">￥${el.DiamondPrice}</span></p>
				</li>
				<li class="right">
					<a class="btn btn-reduce" data-sid="${el.ID}" data-gid="${el.GoodID}">-</a>
					<input type="number" class="num" value=1 data-sid="${el.ID}" data-gid="${el.GoodID}" />
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
    var priceSpan = $('.main .grid .grid-item ul li.info ul li.left span.price');

    reducBtns.click((e) => {
        var target = $(e.currentTarget);
        var sid = target.attr('data-sid');
        var gid = target.attr('data-gid');
        var num = target.siblings('input.num'); //reducBtns.parent().find('input.num[data-sid="' + sid + '"]');
        var inum = parseInt(num.val());
        if (inum > 1) {
            inum = inum - 1;
            num.val(inum);
            var liinfo = target.closest('li.info');
            var icon = target.closest('.grid-item').find('li.checked span.iconfont');
            var isSelected = icon.prop('class').indexOf('icon-fangxingxuanzhongfill') !== -1;
            if (isSelected) {
                sumAmount(sid, gid, inum, liinfo, true, true);
            }
        }
    });

    addBtns.click((e) => {
        var target = $(e.currentTarget);
        var sid = target.attr('data-sid');
        var gid = target.attr('data-gid');
        var num = target.siblings('input.num'); //addBtns.parent().find('input.num[data-sid="' + sid + '"]');
        var inum = parseInt(num.val()) + 1;
        num.val(inum);
        var liinfo = target.closest('li.info');
        var icon = target.closest('.grid-item').find('li.checked span.iconfont');
        var isSelected = icon.prop('class').indexOf('icon-fangxingxuanzhongfill') !== -1;
        if (isSelected) {
            sumAmount(sid, gid, inum, liinfo, false, true);
        }
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

        var isSelect = icon.prop('class').indexOf('icon-fangxingweixuanzhong') === -1;
        var inum = liinfo.find('ul.content li.right input.num').val();
        toggleSelect(icon, isSelect);
        sumAmount(sid, gid, inum, liinfo, isadd, isSelect);
    });
}

var sumAmount = (sid, gid, inum, liinfo, isadd, isSelect) => {
    var ipprice = liinfo.find('ul.content li.left span.price.price-point').text().replace('￥', '');
    var isprice = liinfo.find('ul.content li.left span.price.price-score').text().replace('￥', '');
    var idprice = liinfo.find('ul.content li.left span.price.price-diamond').text().replace('￥', '');

    inum = parseInt(inum);
    var p_am = inum * parseFloat(ipprice);
    var s_am = inum * parseFloat(isprice);
    var d_am = inum * parseFloat(idprice);

    var index = 0;
    var el = selectedGoods.find((el, i) => {
        index = i;
        return el.ID === sid;
    });
    if (!isSelect) {
        selectedGoods.splice(i, 1);
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

var initData = () => {
    fetchData('/ShopCarList')
        .then((res) => {
            createPage(res.message);
        })
        .catch((err) => {
            console.log(err);
        })
}


var initAction = () => {

}

export var init = () => {
    initData();
    initAction();
}
