import { fetchData, postData } from '../../commons/basic/ajax';
import mockData from './orders.mock';
import Promise from 'bluebird';

var createOrders = (data) => {
        var tmpl = `
    ${data.map(o=>`
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
                    <p>共${o.Num}件商品,兑换${formatreceiverTypeToString(o.receiverType)}：${o.Amount}</p>
                    <a class="btn" data-oid="${o.OrderID}">再次兑换</a>
                </dd>
            </dl>
        </li>`
    ).join('')}
    `;
    $('#grid-orders').append(tmpl);
}

var formatreceiverTypeToString = (type) => {
    var new_type = parseInt(type);
    console.log(new_type)
    switch(new_type){
        case 1:return '积分';
        case 2:return '金币';
        case 3:return '钻石';
    }
}

var getOrders = () => {
    // fetchData('/goods')

    return new Promise((resolve, reject) => setTimeout(resolve, 300, mockData));
}

var initData = () => {
    // getOrders()
    fetchData('/OrdersList')
        .then((res) => {
            createOrders(res.message);
        })
        .catch((err)=>{
            alert(err);
        });
}

var initAction = () => {

}

export var init = () => {
    initData();
    initAction();
}
