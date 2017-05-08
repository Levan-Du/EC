import '../../commons/vendor/swiper/swiper-3.4.2.jquery.min';
import '../../commons/vendor/swiper/swiper-3.4.2.min.css';
import { fetchData, postData } from '../../commons/basic/ajax';
import { backToLastPage, getQueryString } from '../../commons/basic/page';
import LocalCities from '../../commons/basic/LocalCities';

var validate = () => {
    var validInputs = [
        { id: 'txt_receiver', msg: '请输入收货人姓名！' },
        { id: 'txt_mobile', msg: '请输入收货人手机！' },
        { id: 'txt_addr', msg: '请选择收货人所在地区！' },
        { id: 'txt_street', msg: '请输入收货人详细地址！' }
    ];
    var validateState = {};
    validateState.states = validInputs.map((el) => {
        var Ele = $('#' + el.id);
        if (Ele.val() == "") {
            el.status = false;
        } else {
            el.status = true;
        }
        return el;
    });

    var coll = validateState.states;

    var failvalid = coll.find((el) => {
        return el.status == false;
    });

    validateState.isAllvalidated = !failvalid;
    validateState.showErrorMessage = () => {
        var { id, msg } = failvalid;
        $('#' + id).focus();
        showErrorMessage(msg);
    };
    return validateState;
}

var showErrorMessage = (msg) => {
    var errEle = $('#error_msg');
    errEle.text(msg);
    errEle.show();
    setTimeout(() => {
        errEle.hide();
    }, 10000)
}

var formData = { CountryID: '', ProvinceID: '', CityID: '', DistrictsID: '', IsDefault: 0 };
var submit = () => {
    var form = $('#form1');
    form.submit((e) => {
        e.preventDefault();
        var state = validate();
        if (!state.isAllvalidated) {
            state.showErrorMessage();
            return false;
        }

        var data = form.serialize();
        for (var f in formData) {
            data += '&' + f + '=' + formData[f];
        }
        postData('/OnAddr', data)
            .then((res) => {
                $('#chooseAddr_area').css('z-index', '-100');
                backToLastPage('#btn_back');
            })
            .catch((err) => {
                showErrorMessage(err);
            });
        return true;
    });
}


var mySwiper;
var slideTab = () => {
    mySwiper = new Swiper('.swiper-container', {
        loop: false,
        onSlideChangeStart: (e) => {
            changeTab(e);
        }
    });
}

var chooseCities = () => {
    $('#txt_addr').focus((e) => {
        $('#chooseAddr_area').css('z-index', '100');
    });
    $('#btn_hide').on('click', (e) => {
        $('#chooseAddr_area').css('z-index', '-100');
    });
}

var selectTabIndex = 0;
var labels = $('.main #chooseAddr_area .swiper-tab .swiper-tab-label');
var clickToSlide = () => {
    labels.find('a').click((e) => {
        var t = $(e.target).parent('.swiper-tab-label');
        var index = labels.index(t[0]);
        setTabLabelVisible(index + 1);
        if (index === selectTabIndex) {
            return;
        }

        mySwiper.slideTo(index, 600, false);

        labels.eq(index).addClass('active');
        labels.eq(selectTabIndex).removeClass('active');
        selectTabIndex = index;
    });
}

var changeTab = (e) => {
    var tablabel = $('.swiper-slide.swiper-slide-active').attr('data-label');
    var index = labels.index('[data-for="' + tablabel + '"]');
    changeTabByIndex(index);
}

var changeTabByIndex = (index) => {
    labels.eq(index).addClass('active');
    labels.eq(selectTabIndex).removeClass('active');
    selectTabIndex = index;
}

var changeTabAndSlideByIndex = (index) => {
    mySwiper.slideTo(index, 600, false);
    changeTabByIndex(index);
}

var IconTarget = {
    provTarget: null,
    cityTarget: null,
    distrTarget: null
};

var setIconVisible = (prevTarget, target) => {
    if (IconTarget[prevTarget] == target) return;
    target.addClass('visible');
    if (IconTarget[prevTarget])
        IconTarget[prevTarget].removeClass('visible');
    IconTarget[prevTarget] = target;
}

var setAreaID = (p, c, d) => {
    formData.ProvinceID = p.id;
    var areaName = p.name + ' ';
    if (c) {
        formData.CityID = c.id;
        areaName += c.name + ' ';
    }
    if (d) {
        formData.DistrictsID = d.id;
        areaName += d.name + ' ';
    }
    $('#txt_addr').val(areaName);
}

var setTabLabelVisible = (type) => {
    switch (type) {
        case 1:
            {
                $('#tab-city').hide();
                $('#tab-district').hide();
                $('#tab-city').find('a').text('请选择');
                $('#tab-district').find('a').text('请选择');
                break;
            }
        case 2:
            {
                $('#tab-district').hide();
                $('#tab-district').find('a').text('请选择');
                break;
            }
    }
}

var reverseTabLabelVisible = (type) => {
    switch (type) {
        case 1:
            {
                $('#tab-city').show();
                break;
            }
        case 2:
            {
                $('#tab-district').show();
                break;
            }
    }
}


var getMockData = () => {
    return Promise.resolve(mockData);
}

var loadCities = () => {
        var { Countrys, Provinces, Cities } = LocalCities;
        var provs = Provinces.get(),
            cities = Cities.get();

        formData.CountryID = Countrys.get()[0].ID;

        var tmpl = `
<ul class="area area-provice">
	${provs.map(el=>`
	<li class="area-item"><a class="btn_area-item" data-id="${el.ID}" data-provinceid="${el.ProvinceID}" data-countryid="${el.CountryID}">
	<span class="text">${el.ProvinceName}</span><span class="iconfont icon-xuanze"></span></a></li>
	`).join('')}
</ul>
    `;
    $('#page-province').append(tmpl);
    setTabLabelVisible(1);

	$('#page-province .area-item a.btn_area-item').click((e)=>{
		var target=$(e.currentTarget),
			provIcon=target.find('span.iconfont'),
		 	pid=target.attr('data-id'),
		 	provid=target.attr('data-provinceid'),
		 	provname=target.find('span.text').text(),
		 	citiesFilter=cities.filter((el)=>{
	 			return el.ProvinceID==provid;
		 	});
	 	setIconVisible('provTarget',target);
	 	$('#tab-province').find('a').text(provname);
		setAreaID({id:pid,name:provname},'','');
		reverseTabLabelVisible(1);
		changeTabAndSlideByIndex(1);

		var tmpl2 = `
		<ul class="area area-city">
			${citiesFilter.map(el=>`
			<li class="area-item"><a class="btn_area-item" data-id="${el.ID}" data-cityid="${el.CityID}" data-provinceid="${el.ProvinceID}">
			<span class="text">${el.CityName}</span><span class="iconfont icon-xuanze"></span></a></li>
			`).join('')}
		</ul>
		    `;
	    $('#page-city').html(tmpl2);	

	    $('#page-city .area-item a.btn_area-item').click((e)=>{
			var target=$(e.currentTarget),
				cityIcon=target.find('span.iconfont'),
			 	cid=target.attr('data-id'),
			 	cityid=target.attr('data-cityid'),
			 	cityname=target.find('span.text').text();
			 	setIconVisible('cityTarget',target);
			 	$('#tab-city').find('a').text(cityname);
				setAreaID({id:pid,name:provname},{id:cid,name:cityname},null);
				reverseTabLabelVisible(2);
				changeTabAndSlideByIndex(2);
	    	// fetchData('/DistrictsArea',"CityID="+cityid)
            getMockData()
	    		.then((res)=>{
				 	var districts=res.message;
					var tmpl3 = `
						<ul class="area area-city">
							${districts.map(el=>`
							<li class="area-item"><a class="btn_area-item" data-id="${el.ID}" data-districtid="${el.DistrictsID}" data-cityid="${el.CityID}">
							<span class="text">${el.DistrictsName}</span><span class="iconfont icon-xuanze"></span></a></li>
							`).join('')}
						</ul>
						    `;
					    $('#page-district').html(tmpl3);

				    	$('#page-district .area-item a.btn_area-item').click((e)=>{
							var target=$(e.currentTarget),
								distrIcon=target.find('span.iconfont'),
							 	did=target.attr('data-id'),
							 	distrid=target.attr('data-districtid'),
							 	distrname=target.find('span.text').text();
	 						 	setIconVisible('distrTarget',target);
								setAreaID({id:pid,name:provname},{id:cid,name:cityname},{id:did,name:distrname});

							 	$('#tab-district').find('a').text(distrname);
				 		        $('#chooseAddr_area').css('z-index', '-100');
						});

				})
	    		.catch((err)=>{
					console.log(err);
	    		});
	    });
	});
}

var initData = () => {
    loadCities();
}

var initAction = () => {
    submit();
    backToLastPage('#btn_back');
    slideTab();
    clickToSlide();
    chooseCities();
}


export var init = () => {
    initData();
    initAction();
}
