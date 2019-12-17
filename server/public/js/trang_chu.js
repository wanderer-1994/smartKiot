//General controll onpageload
$(document).ready(function(){

    //Submit search request
    $('form .submit').on('click', function(){
        $(this).parent('form').trigger('submit');
    })
    //Submit search request continue...
    $('.search_box form').on('submit', function(event){
        event.preventDefault();
        var q = $('.search_box input').val();
        if(q.length < 2){
            $('.Alert .inner .alert_content').html('<p>Vui lòng nhập nhiều hơn 2 kí tự để tìm kiếm.</p>');
            $('.Alert').fadeIn(200);
        }else{
            $.get('http://dichovui.vn/tim_kiem?q=' + q, function(data){
                if(data.Alert){
                    $('.Alert .inner .alert_content').html(data.Alert);
                    $('.Alert').fadeIn(200);
                }
                if(data.products){
                    $('.prod_show').html('Đang tìm kiếm...');
                    setTimeout(function(){
                        render_prod_show(data.products);
                    }, 200);
                    $('.search_box input').val('');
                    $('.search_box input').attr('placeholder', q + '...');
                }
            })
        }
        //Blur search_box input field
        $('.search_box').trigger('blur');
    })
    //Hide search on mobile when user exit search by phone button
    $('.search_box').on('blur', function(){
        if($('.search_box form').css('top') == '-50px'){
            $('.search_box form').css('top', '0px');
        }
    });
    //Menu dropdown show/hide
    $('.drop_down_header').on('click', function(){
        $(this).nextAll('ul').toggle(200);
    })
    //Dropdown menu auto hide when mouseleave
    $('.drop_down_header').on('click', function(){
        $(this).parent().on('mouseleave', function(){
            $(this).children('.drop_down_header').nextAll('ul').css('display', 'none');
            $(this).off('mouseleave');
        })
    })
    //Show/hide search input field when display on mobile
    $('.fake_icon').on('click', function(){
        if($(this).nextAll('form').css('top') == '0px'){
            $(this).nextAll('form').css('top', '-50px');
            $(this).nextAll('form').children('input').focus();
        }else{
            $('.search_box').trigger('blur');
        }
    })
    //Sequentially show banner when display on mobile
    var banner = 0;
    setInterval(function(){
        if(banner < 3){banner += 1;}else{banner = 0;}
        for(i = 0; i < 4; i++){
            if(i == banner){
                $('.banner div').eq(i).css('z-index', 1);
            }else{
                $('.banner div').eq(i).css('z-index', 0);
            }
        }
    }, 1000)
    //General controll on Alert handling
    $('.Alert .inner .confirm').click(function(){
        $('.Alert').fadeOut(200);
        $('.Alert .inner .alert_content').html('');
    })
});