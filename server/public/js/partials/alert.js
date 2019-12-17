function showAlert(Alert, option, timer){
    let html = ``;
    Alert.forEach(item => {
        html += item;
    })
    $('.Alert .inner .alert_content').html(html);
    if(option == "hideConfirm"){
        $('.Alert .inner .confirm').css("display", "none");
        setTimeout(() => {
            closeAlert();
        }, timer || 500)
    }
    $('.Alert').fadeIn(200);
}

function closeAlert(){
    $('.Alert .inner .alert_content').html()
    $('.Alert').fadeOut(200, () => {
        $('.Alert .inner .confirm').css("display", "block");
    });
}

$(".Alert .inner .confirm").on("click", () => {
    closeAlert();
})