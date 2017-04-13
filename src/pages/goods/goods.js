import { fetchData, postData } from '../../commons/basic/ajax';
import mockData from './goods.mock';
import Promise from 'bluebird';

var createGoods = (data) => {
        var tmpl = `
        ${data.map(r=>`
            <li class="grid-item">
                <a class="good-img-link" href="./gooddetail.html?id=${r.GoodID}">
                    <img src="${r.IntroImg}"></img>
                </a>
                <dl class="good-info">
                    <dt class="good-info-item title">
                        <p>Apple MacBook Pro 13.3英寸笔记本电脑 深空灰色</p>
                    </dt>
                    <dt class="good-info-item price">
                        <i>￥${r.Price}</i>
                    </dt>
                    <dt class="good-info-item action">
                        <a class="btn" data-gid="${r.GoodID}"><span class="iconfont icon-gouwuche"></span><span>加入购物车</span></a>
                        <a class="btn" data-gid="${r.GoodID}" href="pay.html?id=${r.GoodID}"><span class="iconfont icon-danpin"></span><span>立即兑换</span></a>                        
                    </dt>
                </dl>
            </li>`
        ).join('')}`;
    $('#grid-goods').append(tmpl);
}


var getGoods = () => {
    return new Promise((resolve, reject) => setTimeout(resolve, 300, mockData));
}

var initData = () => {
    // getGoods()
    fetchData('/GoodsList')
        .then((res) => {
            console.log(res);
            createGoods(res.message);
        })
        .catch((err)=>{
            alert(err);
        });

        // fetchData('/GoodsList')
        // .then((res)=>{
        //     console.log(res);
        // })
        // .catch((err)=>{
        //     console.log(err);
        // });
}

var selectMunuItem='#btn_home';

var addClick= (item) =>{
    var el=$(item);
    el.click((e)=>{
        if(selectMunuItem===item) return;
        $(selectMunuItem).removeClass('active');
        el.addClass('active');
        selectMunuItem=item;
    });  
}

var initAction = () => {
    ['#btn_home','#btn_history','#btn_shopcar'].forEach((el)=>{
        addClick(el);
    });
}

export var init = () => {
    initData();
    initAction();
}
