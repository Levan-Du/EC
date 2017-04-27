import { fetchData, postData, jsonToParams } from '../../commons/basic/ajax';
import { backToLastPage, getQueryString } from '../../commons/basic/page';


var renderAddrs = () => {
    fetchData('/GetUserAddr', null)
        .then((res) => {
            var arr = res.message;
            var tmpl = arr.map(el => `
				<li class="grid-item">
					<a class="grid-icon grid-icon-selected" data-addrid="${el.AddrID}"><span class="iconfont icon-xuanze"></span></a>
					<a class="grid-item-info" data-addrid="${el.AddrID}">
						<article>
							<section>
								<h1 class="r-name">${el.ReceiverName}</h1>
								<h1>${el.ReceiverMobile}</h1>
							</section>	
							<section class="r-addr">${el.Addr}</section>
						</article>
					</a>
					<a class="grid-icon grid-icon-edit"><span class="iconfont icon-fankui"></span></a>
				</li>
			`).join('');
            $('#grid-addrs').append(tmpl);
            initSelectedItem();
            selectItem();
        });
}


var selectedItem = null;
var select = (currItem) => {
    if (currItem == selectedItem) return;
    if (selectedItem)
        selectedItem.css('display', 'none');
    currItem.css('display', 'flex');
    selectedItem = currItem;
}

var selectItem = () => {
    $('#grid-addrs .grid-item-info').click((e) => {
        var target = $(e.currentTarget),
            currItem = target.siblings('.grid-icon-selected');
        localStorage.AddrID = target.attr('data-addrid');

        select(currItem)
    });
}

var initSelectedItem = () => {
    var filter = '[data-addrid="' + localStorage.AddrID + '"]',
        currItem = $('#grid-addrs .grid-icon.grid-icon-selected').filter(filter);
    select(currItem);
}

var loadData = () => {
    renderAddrs();
}


var initAction = () => {
    backToLastPage('#btn_back');
    backToLastPage('#btn_ok');
}

export var init = () => {
    loadData();
    initAction();
}
