//for search page
function render_prod_show(products){
    html = '';
    if(typeof products == 'undefined'|| products == null || typeof products[0] == 'undefined' || products[0] == null){
        html += '<br>\
                <h2 style="color: red">Không tìm thấy sản phẩm nào.</h2><br>';
    }else{ 
        for(i = 0; i < products.length; i++){
            html += '<div class = "product_box">\
                <div class = "product_name"><p>' + products[i].prod.prod_name + '</p></div>\
                <img id="' + products[i].prod.prod_id + '" class=product_link src="' + host + '/images/' + products[i].prod.img_link + '" alt="' + products[i].prod.prod_name + '">\
                <div class = "product_price"><p>' + products[i].prod.unit_price1.toLocaleString() + ' đ/' + products[i].prod.count_unit1  + '</h3></div>\
            </div>';
        };
    }
    html += '<p style="clear:both"></p>';
    $('.prod_show').html(html);
}
//for prod_detail request
function chi_tiet_san_pham(prod_id){
    $.get(host + '/chi_tiet_san_pham/'+ prod_id, function(data){
        $('.prod_detail .inner .detail_content').html(data);
        $('.prod_detail').fadeIn(200);
    });
}
//General controll onpageload
$(document).ready(function(){
    //Prod_detail request
    $('body').on('click', '.product_link, .delete', function(event){
        event.preventDefault();
        switch(event.target.className.toLowerCase()){
            case 'product_link':
                chi_tiet_san_pham(parseInt($(event.target).attr('id')));
                break;
            default:
        }
    })
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
            $.get(host + '/tim_kiem?q=' + q, function(data){
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
        if($(this).nextAll('form').css('top')=='0px'){
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
    //General controll on Prod_detail request
    $('.prod_detail .inner .close').click(function(){
        $('.prod_detail').fadeOut(200);
        $('.prod_detail .inner .detail_content').html('');
    })
    //General controll on Alert handling
    $('.Alert .inner .confirm').click(function(){
        $('.Alert').fadeOut(200);
        $('.Alert .inner .alert_content').html('');
    })
});