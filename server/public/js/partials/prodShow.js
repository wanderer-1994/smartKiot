function renderProduct(){
    let { pagination, products, cart_content } = pageData;
    let html = "";
    if(products.length == 0){
        html += 
        '<div style="background-color: white; text-align: center; padding: 20px; border-radius: 10px; font-style: italic; color: green;">\
            <i style="margin-bottom: 20px; color: white; background-color: green; border: 1px solid green; border-radius: 50%; font-size: 50px" class="fas fa-smile"></i>\
            <p style="margin-bottom: 5px;">Oops! Không tìm thấy sản phẩm nào.</p>\
            <p>Quý khách vui lòng thử các lựa chọn khác.</p>\
        </div>';
    }
    for(let i = 0; i < pagination; i++){
        let matchCart = cart_content.find(item => {return item.prod_id == products[i].prod_id});
        if(!matchCart){
            html +=
            `<div class="product_box">
                <div class="product_image"><img id="${products[i].prod_id}" class="product_link" src="${domain}/images/${products[i].img_link}" alt="${products[i].prod_name}"></div>
                <div class="product_price"><p><i class="fas fa-tags"></i>&nbsp;${products[i].unit_price1.toLocaleString()} đ/${products[i].count_unit1}</h3></div>
                <div class="product_spec"><p><i class="fas fa-cut"></i>&nbsp;${(products[i].prod_spec && products[i].prod_spec != "") ? products[i].prod_spec : "..."}</p></div>
                <div class="product_name"><p id="${products[i].prod_id}" class="product_link">${products[i].prod_name}</p></div>
                <div class="product_order"><div id="${products[i].prod_id}" class = "cart_add">THÊM VÀO GIỎ</div></div>   
            </div>`
        }else{
            html +=
            `<div class="product_box">
                <div class="product_image"><img id="${products[i].prod_id}" class="product_link" src="${domain}/images/${products[i].img_link}" alt="${products[i].prod_name}"></div>
                <div class="product_price"><p><i class="fas fa-tags"></i>&nbsp;${products[i].unit_price1.toLocaleString()} đ/${products[i].count_unit1}</h3></div>
                <div class="product_spec"><p><i class="fas fa-cut"></i>&nbsp;${(products[i].prod_spec && products[i].prod_spec != "") ? products[i].prod_spec : "..."}</p></div>
                <div class="product_name"><p id="${products[i].prod_id}" class="product_link">${products[i].prod_name}</p></div>
                <div class="product_order"><div class = "order_action">
                    <div class="cart_minus"><i id="${products[i].prod_id}" class="fas fa-minus"></i></div>
                    <div class="cart_qty">${matchCart.order_qty} ${matchCart.count_unit2}</div>
                    <div class="cart_plus"><i id="${products[i].prod_id}" class="fas fa-plus"></i></i></div>
                </div></div>    
            </div>`
        }
    }
    html += `<p style="clear:both"></p>`;
    $(".prod_show").html(html);
}

$('.prod_show').on('click', event => {
    event.preventDefault();
    let prod_id = $(event.target).attr("id");
    let product;
    let respective_cart_item;
    if(prod_id && prod_id != ""){
        product = pageData.products.find(item => {return item.prod_id == prod_id});
        respective_cart_item = pageData.cart_content.find(item => {return item.prod_id == prod_id});
    }
    let className = event.target.className.toLowerCase();
    if(className.indexOf("product_link") > -1){
        changeElementTextColorAnimation($(event.target));
        prodDetail.product = product;
        prodDetail.product_in_cart = respective_cart_item;
        prodDetail.order_qty = respective_cart_item ? respective_cart_item.order_qty : product.min_qty;
        showProdDetail();
    }else if(className.indexOf("cart_add") > -1){
        changeElementTextColorAnimation($(event.target));
        addToCart(prod_id, product.min_qty, response => {
            if(response.isSuccess){
                pageData.cart_content = response.cart_content;
                renderProduct();
            }
            if(response.Alert && response.Alert.length > 0){
                showAlert(response.Alert);
            }
            if(response.requireAuth){
                openAuthentication();
            }
            //render lại cart_count
        });
    }else if(className.indexOf("fa-minus") > -1){
        changeElementTextColorAnimation($(event.target));
        let new_order_qty = respective_cart_item.order_qty - product.qty_incre_step;
        addToCart(prod_id, new_order_qty, response => {
            if(response.isSuccess){
                pageData.cart_content = response.cart_content;
                renderProduct();
            }
            if(response.Alert && response.Alert.length > 0){
                showAlert(response.Alert);
            }
            if(response.requireAuth){
                openAuthentication();
            }
            //render lại cart_count
        })
    }else if(className.indexOf("fa-plus") > -1){
        changeElementTextColorAnimation($(event.target));
        let new_order_qty = respective_cart_item.order_qty + product.qty_incre_step;
        addToCart(prod_id, new_order_qty, response => {
            if(response.isSuccess){
                pageData.cart_content = response.cart_content;
                renderProduct();
            }
            if(response.Alert && response.Alert.length > 0){
                showAlert(response.Alert);
            }
            if(response.requireAuth){
                openAuthentication();
            }
            //render lại cart_count
        })
    }
})