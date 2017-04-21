import { fetchData, postData } from '../../commons/basic/ajax';
import { backToLastPage, getQueryString } from '../../commons/basic/page';


var loadData = () => {

}


var initAction = () => {
    backToLastPage('#btn_back');
    slide();
    clickToSlide();
    renderImgBox();
}

export var init = () => {
    loadData();
    initAction();
}
