import { fetchData, postData } from '../../commons/basic/ajax';

var initData = () => {

}


var initAction = () => {

}

var submit = () => {
    $('#btn_sumbit').click((e) => {
    	postData('/')
    });
}

export var init = () => {
    initData();
    initAction();
}
