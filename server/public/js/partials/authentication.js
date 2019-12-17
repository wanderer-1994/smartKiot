function openAuthentication(){
    $(".Authentication").fadeIn(200);
}
function reverseLogInSignIn(active, inactive){
    $(`.Authentication .${active}`).attr("class", `${active} active`);
    $(`.Authentication .${active}`).attr("class", `${active} active`);
    $(`.Authentication .${inactive}`).attr("class", `${inactive}`);
    $(`.Authentication .${inactive}`).attr("class", `${inactive}`);
}
$(".Authentication .header .logIn").on("click", event => {
    changeElementTextColorAnimation($(event.target));
    if($(".Authentication .header .logIn").attr("class").indexOf("active") > -1) return;
    reverseLogInSignIn("logIn", "signIn");
})
$(".Authentication .header .signIn").on("click", event => {
    changeElementTextColorAnimation($(event.target));
    if($(".Authentication .header .signIn").attr("class").indexOf("active") > -1) return;
    reverseLogInSignIn("signIn", "logIn");
})
$(".Authentication .body .openForgotPas").on("click", () => {
    $(".Authentication .authentication_content").css("display", "none");
    $(".Authentication .forgotPas").css("display", "block");
})
$(".Authentication .forgotPas .back").on("click", () => {
    $(".Authentication .authentication_content").css("display", "block");
    $(".Authentication .forgotPas").css("display", "none");
})
$(".Authentication .closeAuthentication").on("click", () => {
    $(".Authentication").fadeOut(200);
    $(".Authentication .authentication_content").css("display", "block");
    $(".Authentication .forgotPas").css("display", "none");
})

$('.Authentication .logIn .submit').on('click', event => {
    changeElementTextColorAnimation($(event.target));
    let user_tel = $(".Authentication .logIn input[name=user_tel]").val();
    let user_pas = $(".Authentication .logIn input[name=user_pas]").val();
    let check_phone = /^\d+$/.test(user_tel);
    let check_pass = (/\s/.test(user_pas) || (user_pas.length < 6));
    if(!check_phone || check_pass){
        let Alert =
        `<p style="color:red; padding-bottom: 5px; border-bottom: 1px solid #dedede">THÔNG TIN KHÔNG HỢP LỆ!</p>
        <ul style="color:green; text-align: left; margin: 10px 30px 10px 30px">`;
        if(!check_phone){
            Alert += `<li style="margin: 5px 0px 5px 20px;">Số điện thoại không đúng!</li>`;
        }
        if(check_pass){
            Alert += `<li style="margin: 5px 0px 5px 20px;">Mật khẩu phải dài ít nhất 6 kí tự và không chứa khoảng trắng!</li>`;
        }
        Alert += `</ul>`;
        showAlert([Alert]);
    }else{
        $.post(`${domain}/dang_nhap`, {
            user_tel: user_tel,
            user_pas: user_pas,
        }, data => {
            if(data.Alert){
                showAlert(data.Alert);
            }
            if(data.isSuccess){
                window.location.reload();
            }
        })
    }
})

$('.Authentication .signIn .submit').on('click', event => {
    changeElementTextColorAnimation($(event.target));
    let user_tel = $(".Authentication .signIn input[name=user_tel]").val();
    let user_pas = $(".Authentication .signIn input[name=user_pas]").val();
    let re_pas = $(".Authentication .signIn input[name=re_pas]").val();
    let check_phone = /^0[35789]\d{8}$/.test(user_tel);
    let check_pass = (/\s/.test(user_pas) || (user_pas.length < 6));
    let check_re_pas = re_pas == user_pas;
    if(!check_phone || check_pass || !check_re_pas){
        let Alert =
        `<p style="color:red; padding-bottom: 5px; border-bottom: 1px solid #dedede">THÔNG TIN KHÔNG HỢP LỆ!</p>
        <ul style="color:green; text-align: left; margin: 10px 30px 10px 30px">`;
        if(!check_phone){
            Alert += `<li style="margin: 5px 0px 5px 20px;">Vui lòng sử dụng số điện thoại di động!</li>`
        }
        if(check_pass){
            Alert += `<li style="margin: 5px 0px 5px 20px;">Mật khẩu phải dài ít nhất 6 kí tự và không chứa khoảng trắng!</li>`;
        }
        if(!check_re_pas){
            Alert += `<li style="margin: 5px 0px 5px 20px;">Mật khẩu không khớp!</li>`;
        }
        Alert += `</ul>`;
        showAlert([Alert]);
    }else{
        $.post(`${domain}/dang_ky`, {
            user_tel: user_tel,
            user_pas: user_pas,
            re_pas: re_pas
        }, data => {
            if(data.Alert){
                showAlert(data.Alert);
            }
            if(data.telExisted){
                let message =
                `<p style="color: red; text-align: center; padding: 10px 30px 10px 30px;">Số điện thoại đã tồn tại!</p>`
                showAlert([message]);
            }
            if(data.isSuccess){
                let message =
                `<p style="color: green; text-align: center; padding: 10px 30px 5px 30px;">Đăng ký thành công.</p>
                <p style="color: green; text-align: center; padding: 0px 30px 10px 30px;">Bắt đầu mua sắm nào!</p>`
                showAlert([message], "hideConfirm", 2000);
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
            }
        })
    }
})