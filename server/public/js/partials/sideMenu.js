(() => {
    let link_list = $(".sideMenu li");
    for(let i = 0; i < link_list.length; i++){
        let element = $(link_list[i]);
        if((element.children("a").attr("href") == window.location.href) || (element.children("a").attr("href") + "/" == window.location.href)){
            element.children("a").css("color", "black");
            element.css("background-color", "yellow");
            break;
        }
    }
})()