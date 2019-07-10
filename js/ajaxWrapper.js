var AjaxWrapper = {

    ajax : null,

    init() {
        this.ajax = new XMLHttpRequest();  
        return this.ajax;
    },
 
    get(url, callback) {
        var request = this.init();
        request.open("GET", url)
        request.send();
        request.onload = () => {
            callback(JSON.parse(request.responseText));
        };
    },
 
    post(url, data, callback) {
        var request = this.init();
        request.open("POST", url);
        request.send(data);
        request.onload = () => {
            callback(JSON.parse(request.responseText));
        };
    }
 };