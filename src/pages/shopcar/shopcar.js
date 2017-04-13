import { fetchData, postData } from '../../commons/basic/ajax';
import mockData from './shopcar.mock';

var createPage = (data) => {
    var html = data.map(el => `
<li class="grid-item">
	<ul>
		<li class="checked">
			<a data-gid="${el.GoodID}"><span class="iconfont icon-fangxingweixuanzhong"></span></a>
		</li>
		<li class="img-box">
			<img src="${el.IntroImg}"></img>
		</li>
		<li class="info">
			<p class="title">${el.GoodName}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
			<ul>
				<li class="left">
					<p><span>积分</span><span class="price">￥${el.PointPrice}</span></p>
					<p><span>金币</span><span class="price">￥${el.ScorePrice}</span></p>
					<p><span>钻石</span><span class="price">￥${el.DiamondPrice}</span></p>
				</li>
				<li class="right">
					<a class="btn btn-reduce" data-gid="${el.GoodID}">-</a><input class="num" type="number" data-gid="${el.GoodID}" /><a class="btn btn-add" data-gid="${el.GoodID}">+</a>
				</li>
			</ul>
		</li>
	</ul>
</li>
	`).join('');
    $('#grid-shopCard').append(html);
}

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
    var btns = $('.main .grid .grid-item ul li.info ul li.right .btn')
    btns.click((e) => {
        var gid = $(e.target).attr('data-gid');
        var anum = btns.parent().find('a.num');
        anum.val(anum.val() - 1);
    });
}

export var init = () => {
    initData();
    initAction();
}
