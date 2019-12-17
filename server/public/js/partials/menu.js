(() => {
    let link_list = $(".menu a");
    for(let i = 0; i < link_list.length; i++){
        let element = $(link_list[i]);
        if((element.attr("href") == window.location.href) || (element.attr("href") + "/" == window.location.href)){
            element.css("color", "yellow");
            break;
        }
    }
})()
//Menu dropdown show/hide
$('.menu .drop_down_header').on('click', function(){
    changeElementTextColorAnimation($(this))
    $(this).nextAll('ul').toggle(200);
})
$(".menu").on("click", event => {
    if(event.target.nodeName.toLowerCase() == "a"){
        changeElementTextColorAnimation($(event.target));
    }
})
$(".menu .guest_menu li").on("click", event => {
    let ele_list = $(":hover");
    let li_element;
    for(let i = 0; i < ele_list.length; i++){
        if($(ele_list[i]).prop("tagName") == "LI") li_element = ele_list[i];
    }
    changeElementTextColorAnimation($(li_element));
    let type = $(li_element).attr("name");
    if(type == "logIn"){
        reverseLogInSignIn("logIn", "signIn");
        openAuthentication();
    }
    if(type == "signIn"){
        reverseLogInSignIn("signIn", "logIn");
        openAuthentication();
    }
})
