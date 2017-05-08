import { fetchData, postData } from '../../commons/basic/ajax';
import { formatPayType } from '../../commons/basic/format';
import mockData from './orders.mock';
import Promise from 'bluebird';

var renderOrders = (data) => {
        var tmpl = data.map(o => `
        <li class="grid-item">
            <dl>
                <dt class="order-item-title">
                    <a><span class="iconfont icon-dingdan"><span>兑换单号：<span class="ordercode">${o.OrderNo}</span></a>
                    <span>状态：完成</span>
                </dt>
                <dd class="order-item-goods">
                    ${o.OrderDetails.map(g=>`
                    <a data-oid="${o.OrderID}" data-gid="${g.GoodID}">
                        <img src="${g.IntroImg}">
                    </a>
                    `)}
                </dd>
                <dd class="order-item-sum">
                    <p>共${o.Num}件商品,兑换${formatPayType(o.receiverType)}：${o.Amount}</p>
                    <a class="btn" data-oid="${o.OrderID}">再次兑换</a>
                </dd>
            </dl>
        </li>`
    ).join('');

    $('#grid-orders').append(tmpl);
}

var getOrders = () => {
    return new Promise((resolve, reject) => setTimeout(resolve, 300, mockData));
}

var setHomePage = () => {
    $('#btn_back').attr('href','index.html?gameid='+localStorage.GameID);
}

var loadData = () => {
    getOrders()
    // fetchData('/OrdersList')
        .then((res) => {
            renderOrders(res.message);
        })
        .catch((err)=>{
            alert(err);
        });
}

var initAction = () => {
    // backToLastPage('#btn_back');
    setHomePage();
}

export var init = () => {
    loadData();
    initAction();
}
