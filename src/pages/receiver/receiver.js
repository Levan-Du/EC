import '../../commons/vendor/swiper/swiper-3.4.2.jquery.min';
import '../../commons/vendor/swiper/swiper-3.4.2.min.css';
import { fetchData, postData } from '../../commons/basic/ajax';
import { backToLastPage, getQueryString } from '../../commons/basic/page';


var validatd = () => {
    if ($('#txt_receiver').val() == "")
        return false;
    if ($('#txt_mobile').val() == "")
        return false;
    if ($('#txt_area').val() == "")
        return false;
    if ($('#txt_addr').val() == "")
        return false;
    return true;
}

var submit = () => {
    var form = $('#form1');
    form.submit((e) => {
        e.preventDefault();
        var data = form.serialize();
        postData('/OnAddr', data)
    });
}

var initData = () => {
    fetchData('/CitiesArea', null)
        .then((res) => {
            localStorage.Countrys = JSON.stringify(res.message.Countrys);
            localStorage.Provinces = JSON.stringify(res.message.Provinces);
            localStorage.Cities = JSON.stringify(res.message.Cities);
        });
}

var slideTab = () => {
    var mySwiper = new Swiper('.swiper-content', {
        loop: false,
        onSlideChangeStart: (e) => {
            selectTab(e);
        }
    });
}

var chooseCities = () => {
    $('#txt_area').focus((e) => {
        $('#chooseAddr_area').css('display', 'flex');
    });
    $('#btn_back').click((e) => {
        console.log('hide');
        $('#chooseAddr_area').css('display', 'none');
    });
}

var initAction = () => {
    submit();
    backToLastPage('#btn_back');
    slideTab();
    chooseCities();
}


export var init = () => {
    initData();
    initAction();
}
