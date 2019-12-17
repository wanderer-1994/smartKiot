// showProdDetail is called in trang_chu
var prodDetail = new Object;
function showProdDetail(prod_id){
    let product = prodDetail.product;
    let order_qty = prodDetail.order_qty;
    let html =
    `<div class='prod_name'>
        <p>${product.prod_name}</p>
    </div>
    <div class='image_container'>
        <img src="${domain}/images/${product.img_link}" alt="${product.prod_name}">
    </div>
    <div class='order_info'>
        <div class='price'>
            <h4 style="font-weight: bold">Đơn giá:</h4>
            <p>${product.unit_price1.toLocaleString()} đ/${product.count_unit1}</p>
        </div>
        <div class='order_qty'>
            <h4 style="font-weight: bold">Số lượng đặt hàng:</h4>
            <div class="qty_box_wrapper">
                <i class="far fa-minus-square decreasement"></i>
                <input class="qty" value=${parseInt(order_qty)} >
                <p>${product.count_unit2}</p>
                <i class="far fa-plus-square increasement"></i>
            </div>
            <div style="clear:both"></div>
        </div>
        <div class='temp_check'>
            <h4 style="font-weight: bold">Tạm tính:</h4>
            <p><span class="check">${parseInt(parseFloat(order_qty)*parseFloat(product.unit_relation2)*parseFloat(product.unit_price1)).toLocaleString()}</span> vnđ</p>
        </div>
        <div class='submit_add_to_cart'>
            <button class="submit" id=${product.prod_id}><i class="fas fa-cart-plus fa-lg"></i>${prodDetail.product_in_cart ? " Cập nhật " : " Thêm vào giỏ "}</button>
        </div>
    </div>
    <p style="clear:both"></p>
    <div class='description'>
        <h4 style="font-weight: bold">Mô tả sản phẩm:</h4>
        <p>${product.description}</p>
    </div>
    <div style='clear:both'></div>`;
    $(".prod_detail .inner .detail_content").html(html);
    $(".prod_detail").fadeIn(200);
}

function closeProdDetail(){
    $('.prod_detail').fadeOut(200);
    $('.prod_detail .inner .detail_content').html('');
    prodDetail = {};
}

function addToCart(prod_id, order_qty, cb){
    $.post(`${domain}/them_vao_gio_hang`, {
        prod_id: prod_id,
        order_qty: order_qty
    }, data => {
        if(cb) cb(data);
    })
};

$(".prod_detail").on("click", event => {
    event.preventDefault();
    let className = event.target.className.toLowerCase() || "";
    if(className.indexOf("increasement") > -1){
        prodDetail.order_qty += prodDetail.product.qty_incre_step;
        showProdDetail();
    }
    if(className.indexOf("decreasement") > -1){
        prodDetail.order_qty -= prodDetail.product.qty_incre_step;
        if(prodDetail.order_qty < 0) prodDetail.order_qty = 0;
        showProdDetail();
    }
    if(className.indexOf("submit") > -1){
        let { product, order_qty } = prodDetail;
        $(event.target).html('<i class="fas fa-sync-alt"></i> Đang xử lý...');
        addToCart(product.prod_id, order_qty, response => {
            if(response.isSuccess){
                $(event.target).html(`<i class="fas fa-cart-arrow-down fa-lg"></i>${prodDetail.product_in_cart ? " Đã cập nhật " : " Đã thêm vào giỏ "}`);
                pageData.cart_content = response.cart_content;
                if(typeof renderProduct == "function") renderProduct();
                if(typeof renderBigCart == "function") renderBigCart();
                setTimeout(() => {
                    closeProdDetail();
                }, 400)
                prodDetail = {};
            }
            if(response.Alert && response.Alert.length > 0){
                prodDetail = {};
                setTimeout(() => {
                    closeProdDetail();
                }, 400)
                showAlert(response.Alert);
            }
            if(response.requireAuth){
                openAuthentication();
                $(event.target).html(`<i class="fas fa-cart-plus fa-lg"></i>Thêm vào giỏ`);
            }
        });

    }
    if(className.indexOf("close") > -1 || className.indexOf("fa-times") > -1){
        closeProdDetail();
    }
})

$(".prod_detail").on("keyup", event => {
    let className = event.target.className.toLowerCase() || "";
    if(className.indexOf("qty") > -1){
        let new_value = parseInt(event.target.value);
        let new_check;
        if(isNaN(new_value)){
            new_value = "";
            new_check = "0"
        }else{
            let product = prodDetail.product;
            new_check = parseInt(parseFloat(new_value)*parseFloat(product.unit_relation2)*parseFloat(product.unit_price1)).toLocaleString();
        }
        prodDetail.order_qty = new_value;
        event.target.value = new_value;
        $(".prod_detail .check").html(new_check);
    }
})

$(".prod_detail").on("focusout", event => {
    let className = event.target.className.toLowerCase() || "";
    if(className.indexOf("qty") > -1){
        let value = parseInt(event.target.value);
        let product = prodDetail.product;
        if(isNaN(value) || value == 0){
            value = 0;
            prodDetail.order_qty = value;
            event.target.value = value;
            let new_check = parseInt(parseFloat(value)*parseFloat(product.unit_relation2)*parseFloat(product.unit_price1)).toLocaleString();
            $(".prod_detail .check").html(new_check);
        }else if(value < parseInt(product.min_qty)){
            value = parseInt(product.min_qty);
            prodDetail.order_qty = value;
            event.target.value = value;
            let new_check = parseInt(parseFloat(value)*parseFloat(product.unit_relation2)*parseFloat(product.unit_price1)).toLocaleString();
            $(".prod_detail .check").html(new_check);
        }
    }
}) 