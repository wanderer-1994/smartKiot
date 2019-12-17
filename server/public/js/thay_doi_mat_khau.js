$(document).ready(function(){
    //Content fadeIn effect
    $('.content').fadeIn(200);
    //General Alert handling
    $('.Alert .inner .confirm').click(function(){
        $('.Alert').fadeOut(200);
        $('.Alert .inner .alert_content').html('');
    })
    //Submit change password
    $('.content form').on('submit', function(event){
        event.preventDefault();
        var password = $('.password').val();
        var new_pas = $('.new_pas').val();
        var confirm_new_pas = $('.confirm_new_pas').val();
        var check_pas = (/\s/.test(password) || (password.length < 6));
        var check_new_pas = (/\s/.test(new_pas) || (new_pas.length < 6));
        var check_confirm_new_pas = (new_pas == confirm_new_pas);
        if(check_pas || check_new_pas || !check_confirm_new_pas){
            var Alert = '<p style="color:red">THÔNG TIN KHÔNG HỢP LỆ</p><br>\
                        <ul style="text-align: justify; margin-left: 20px;">';
            if(check_pas){
                Alert += '<li style="color:red">Mật khẩu không đúng, vui lòng kiểm tra lại!</li>';
            }
            if(check_new_pas){
                Alert += '<li style="color:red">Mật khẩu mới phải dài ít nhất 6 kí tự và không chứa khoảng trắng!</li>';
            }
            if(!check_confirm_new_pas){
                Alert += '<li style="color:red">Xác nhận mật khẩu mới không khớp!</li>';
            }
            Alert += '</ul>';
            $('.Alert .inner .alert_content').html(Alert);
            $('.Alert').fadeIn(200);
        }else{
            $.post(host + '/thay_doi_mat_khau', {
                password: password,
                new_pas: new_pas,
                confirm_new_pas: confirm_new_pas,
            }, function(data){
                if(data.Alert){
                    $('.Alert .inner .alert_content').html(data.Alert);
                    $('.Alert').fadeIn(200);
                }
            })
        }
    })
})