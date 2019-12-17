var domain = "http://" + window.location.host;

function changeElementTextColorAnimation(element){
    if(element.attr("data-colorChanging")){
        return;
    }
    element.attr("data-colorChanging", "1");
    let original_color = element.css("color");
    element.css("color", "yellow");
    setTimeout(() => {
        element.css("color", original_color);
        element.removeAttr("data-colorChanging");
    }, 200)
}

$.put = (url, data, callback, type) => {
    if ( $.isFunction(data) ){
      type = type || callback,
      callback = data,
      data = {}
    }
   
    return $.ajax({
      url: url,
      type: 'PUT',
      success: callback,
      data: data,
      contentType: type
    });
}

$.delete = function(url, data, callback, type){
    if ( $.isFunction(data) ){
      type = type || callback,
          callback = data,
          data = {}
    }
    return $.ajax({
      url: url,
      type: 'DELETE',
      success: callback,
      data: data,
      contentType: type
    });
}