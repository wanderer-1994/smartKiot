function renderBigCart(){
    let cart_content = pageData.cart_content
    let html = '';
    if(cart_content.length == 0){
        html += `<div class="tb_header">
                    <p class="col_1"></p>
                    <p class="col_2">Sản phẩm</p>
                    <p class="col_3">Đơn giá</p>
                    <p class="col_4">Số lượng</p>
                    <p class="col_5">Thành tiền</p>
                    <p class="col_6">Xóa</p>
                </div>
                <div style="clear:both"></div>
                <div class="tb_data" style="text-align:center"><span class="cartEmpty">Bạn chưa có sản phẩm nào trong giỏ hàng</span></div>`;
    }else{
        let total_temp_check = 0;
        let tableData = '';
        for(let i = 0; i < cart_content.length; i++){
            total_temp_check += parseFloat(cart_content[i].order_qty) * parseFloat(cart_content[i].unit_price1) * parseFloat(cart_content[i].unit_relation2);
            tableData +=
            `<div class="tb_data">\
                <p class="col_1"><img id ="${cart_content[i].prod_id}" class="product_link" src="${domain}/images/${cart_content[i].img_link}" alt="${cart_content[i].prod_name}"></p>\
                <p class="col_2">${cart_content[i].prod_name}</p></li>\
                <p class="col_3">${cart_content[i].unit_price1.toLocaleString()} đ/${cart_content[i].count_unit1}</p>\
                <p class="col_4"><span class="hidden">SL:&emsp;</span><input type="number" value="${cart_content[i].order_qty}" id="${cart_content[i].prod_id}"> <span>${cart_content[i].count_unit2}</span></p>\
                <p class="col_5"><span class="hidden">TT:&emsp;</span><span>${parseInt(parseFloat(cart_content[i].order_qty)*parseFloat(cart_content[i].unit_relation2)*parseFloat(cart_content[i].unit_price1)).toLocaleString()}</span> đ</p>\
                <p class="col_6"><i id="${cart_content[i].prod_id}" class="far fa-times-circle delete"></i></p>\
            </div>`;
        }
        html +=
        `<ul>
            <li class="prod_qty"><span class="tag">Số sản phẩm:</span><span class="value">${cart_content.length}</span></li>
            <li class="total_temp_check"><span class="tag">Tạm tính:</span><span class="value">${parseInt(total_temp_check).toLocaleString()}</span> đ</li>
        </ul>
        <div class="submit_order">
            <button class="submit_order_button"><i class="fas fa-file-alt"></i> Đặt hàng</button>
        </div>
        <div class="tb_header">
            <p class="col_1"></p>
            <p class="col_2">Sản phẩm</p>
            <p class="col_3">Đơn giá</p>
            <p class="col_4">Số lượng</p>
            <p class="col_5">Tạm tính</p>
            <p class="col_6">Xóa</p>
        </div>
        <div style="clear:both"></div>
        ${tableData}
        <h3>***Vui lòng kiểm tra kĩ thông tin giao hàng trước khi đặt hàng!</h3>`;
    }
    $('.big_cart').html(html);
}
//request update_cart: delete 1 product
function removeProductFromCart(prod_id, cb){ 
    $.post(`${domain}/cap_nhat_gio_hang`, {
        delete: true,
        prod_id: prod_id,
    }, data => {
        if(cb) cb(data);
    })
}
//request update_cart: change qty
function updateQty_big_cart(prod_id, new_order_qty, cb){
    $.post(domain + '/cap_nhat_gio_hang', {
        updateQty: true,
        prod_id: prod_id,
        new_order_qty: new_order_qty,
    }, data => {
        if(cb) cb(data);
    })
}
//submit order request
function dat_hang(){
    //Validate thông tin phải được điền
    let shipInfo = new Object;
    shipInfo.receiver = $('.customer_info input[name=receiver]').val();
    shipInfo.receiver_tel = $('.customer_info input[name=receiver_tel]').val();
    shipInfo.district = $('.customer_info select[name=district] option:selected').val();
    shipInfo.ward = $('.customer_info select[name=ward]').val();
    shipInfo.street = $('.customer_info select[name=street]').val();
    shipInfo.apart_num = $('.customer_info input[name=apart_num]').val();
    shipInfo.notShip = $('.customer_info input[name=notShip]').is(":checked") ? 1 : 0;
    shipInfo.saveInfo = $('.customer_info input[name=saveInfo]').is(":checked");
    if(shipInfo.receiver.toString().length < 1 || shipInfo.receiver_tel.toString().length < 1 || shipInfo.district.toString().length < 1 || shipInfo.ward.toString().length < 1 || shipInfo.street.toString().length < 1 || shipInfo.apart_num == 0 || shipInfo.apart_num == ''){
        showAlert(['<p style="color:red">Quý khách vui lòng kiểm tra đầy đủ thông tin giao hàng!</p>']);
    }else{
        $('.customer_info .footer .submit').html('Đang xử lý...');
        $.post(domain + '/dat_hang', shipInfo, data => {
            if(data.Alert && data.Alert.length > 0){
                showAlert(data.Alert);
            }
            if(data.isSuccess){
                let message;
                if(shipInfo.notShip){
                    message =
                    `<p style="color: #d2ac30; border-bottom: 1px solid #dedede; padding-bottom: 5px;">ĐẶT HÀNG THÀNH CÔNG!</p>\
                    <p style="margin-top: 10px; color:  #4caf50">Đơn hàng của quý khách sẽ sẵn sàng tại sạp vào sáng ngày hôm sau.</p>
                    <p style="margin-top: 7px; color:  #4caf50">DICHOVUI xin chân thành cảm ơn!</p>
                    <p style="margin-top: 7px; color:  #4caf50">Quý khách kiểm tra đơn hàng <a style="font-size: 14px; color: red" href="${domain}/lich_su_mua_hang">TẠI ĐÂY</a></p>`;
                }else{
                    message =
                    `<p style="color: #d2ac30; border-bottom: 1px solid #dedede; padding-bottom: 5px;">ĐẶT HÀNG THÀNH CÔNG!</p>\
                    <p style="margin-top: 10px; color:  #4caf50">Đơn hàng này sẽ được giao lúc 7:30 - 10:30 sáng ngày hôm sau.</p>
                    <p style="margin-top: 7px; color:  #4caf50">DICHOVUI xin chân thành cảm ơn!</p>
                    <p style="margin-top: 7px; color:  #4caf50">Quý khách kiểm tra đơn hàng <a style="font-size: 14px; color: red" href="${domain}/lich_su_mua_hang">TẠI ĐÂY</a></p>`;
                }
                showAlert([message]);
            }
            if(data.new_cart){
                pageData.cart_content = data.new_cart;
                renderBigCart();
            }
            $('.customer_info .footer .submit').html('Xác nhận');
            $(".customer_info").fadeOut(200);
        })
    }
}
//manipulate on big_cart area
$('.big_cart').on('click', '.product_link, .delete, .submit_order', event => {
    event.preventDefault();
    switch(event.target.className.toLowerCase()){
        case 'product_link':
            let prod_id = $(event.target).attr("id");
            let product;
            let respective_cart_item;
            if(prod_id && prod_id != ""){
                product = pageData.products.find(item => {return item.prod_id == prod_id});
                respective_cart_item = pageData.cart_content.find(item => {return item.prod_id == prod_id});
            }
            prodDetail.product = product;
            prodDetail.product_in_cart = respective_cart_item;
            prodDetail.order_qty = respective_cart_item ? respective_cart_item.order_qty : product.min_qty;
            showProdDetail();
            break;
        case 'far fa-times-circle delete':
            removeProductFromCart($(event.target).attr('id'), data => {
                if(data.new_cart){
                    pageData.cart_content = data.new_cart;
                    renderBigCart();
                }
                if(data.Alert && data.Alert.length > 0){
                    showAlert(data.Alert);
                }
            });
            break;
        case 'submit_order_button':
            // let service_stop_mesg =
            // `<h4 style="color:red">ĐI CHỢ VUI TẠM DỪNG NHẬN ĐƠN HÀNG</h4>
            // <ul style="text-align:justify; margin:10px">
            //     <li style="margin-bottom:8px">Từ 09/08/2019, Đi chợ vui tạm dừng nhận đơn hàng để hoàn thiện quy trình cũng như để phục vụ khách hàng tốt nhất.</li>
            //     <li style="margin-bottom:8px">Đi chợ vui vô cùng xin lỗi quý khách vì sự bất tiện này!</li>
            //     <li style="margin-bottom:8px">Đi chợ vui sẽ sớm hoạt động trở lại. Theo dõi trang <a target="balnk" style="color:blue; font-weight:bold; font-size:1.1em" href="https://www.facebook.com/Dichovui.vn">Fanpage</a> của chúng tôi để nhận được thông báo mới nhất.</li>
            // </ul>`
            // showAlert([service_stop_mesg]);
            $(".customer_info").fadeIn(200);
            break;
        default:
    }
})
//controll cart_container input of order_qty on change
$('.big_cart').on('change', function(event){
    if(event.target.nodeName.toLowerCase() == "input"){
        let prod_id = $(event.target).attr("id");
        let product_in_cart = pageData.cart_content.find(item => {return item.prod_id == prod_id});
        let new_order_qty = $(event.target).val();
        if(!(new_order_qty/2)){
            $(event.target).val(product_in_cart.order_qty);
        }else{
            if(new_order_qty < product_in_cart.min_qty) new_order_qty = product_in_cart.min_qty;
            updateQty_big_cart(product_in_cart.prod_id, Math.round(new_order_qty), data => {
                if(data.new_cart) pageData.cart_content = data.new_cart;
                renderBigCart();
            });
        };
    }
})

$(".customer_info").on("click", event => {
    let className = event.target.className.toLowerCase();
    if(className.indexOf("submit") > -1) dat_hang();
    if(className.indexOf("cancel") > -1) $(".customer_info").fadeOut(200);
})
//Control receiver, receiver_tel, apart_num on change
$('.customer_info input[name=receiver]').on('change', function(){
    var raw_name = $(this).val().toString();
    var validated_name = '';
    for(let i = 0; i < raw_name.length; i++){
        if(!(/[\\\/'"=<>#\*%\$\&.,;()!~{}\[\]\d]|-{2}/.test(raw_name[i]))){
            validated_name += raw_name[i];
        }
    }
    while(validated_name.match(/\s\s/) != null){
        validated_name = validated_name.replace(/\s\s/, ' ');
    }
    if(validated_name[0] == ' '){
        validated_name = validated_name.substr(1, validated_name.length - 1);
    }
    if(validated_name[validated_name.length - 1] == ' '){
        validated_name = validated_name.substr(0, validated_name.length - 1);
    }
    $(this).val(validated_name);
})
$('.customer_info input[name=receiver_tel]').on('change', function(){
    var raw_tel = $(this).val();
    if(!(/^0[35789]\d{8}$/.test(raw_tel))){
        $(this).val('');
        $(this).attr('placeholder', raw_tel + '...');
        let message =
        `<p style="color: red">Để không mất liên lạc khi giao hàng, mong quý khách sử dụng số điện thoại di động (có 10 số).</p>`;
        showAlert([message]);
    }
})
function renderAddressWrapper(){
    let districtOptions = [];
    let wardOptions = [];
    let streetOptions = [];
    pageData.addresses.forEach(item => {
        let isExist = false;
        districtOptions.forEach(addedItem => {
            if(addedItem == item.district) isExist = true;
        })
        if(!isExist) districtOptions.push(item.district);
    })
    pageData.addresses.forEach(item => {
        if(item.district == shipAddress.district){
            let isExist = false;
            wardOptions.forEach(addedItem => {
                if(addedItem == item.ward) isExist = true;
            })
            if(!isExist) wardOptions.push(item.ward);
        }
    })
    pageData.addresses.forEach(item => {
        if(item.district == shipAddress.district && item.ward == shipAddress.ward){
            let isExist = false;
            streetOptions.forEach(addedItem => {
                if(addedItem == item.street) isExist = true;
            })
            if(!isExist) streetOptions.push(item.street);
        }
    })
    let districtOptionsHtml = `<option value="">- Chọn Quận -</option>`;
    let wardOptionsHtml = `<option value="">- Chọn Phường -</option>`;
    let streetOptionsHtml = `<option value="">- Chọn Đường -</option>`;
    districtOptions.forEach(item => {
        districtOptionsHtml += `<option ${item == shipAddress.district ? "selected" : ""} value="${item}">${item}</option>`
    })
    wardOptions.forEach(item => {
        wardOptionsHtml += `<option ${item == shipAddress.ward ? "selected" : ""} value="${item}">${item}</option>`
    })
    streetOptions.forEach(item => {
        streetOptionsHtml += `<option ${item == shipAddress.street ? "selected" : ""} value="${item}">${item}</option>`
    })
    let html =
    `<p class="address">ĐỊA CHỈ:</p>
    <p class="tag">Quận:<span style="color:red">*</span></p>
    <select class="value" name="district" class="district">
        ${districtOptionsHtml}
    </select>
    <p class="tag">Phường:<span style="color:red">*</span></p>
    <select class="value" name="ward">
        ${wardOptionsHtml}
    </select>
    <p class="tag">Đường:<span style="color:red">*</span></p>
    <select class="value" name="street">
        ${streetOptionsHtml}
    </select>
    <p class="tag">Số nhà:<span style="color:red">*</span></p>
    <input class="value" type="text" name="apart_num" placeholder="Nhập số nhà..." value="${shipAddress.apart_num}">`;
    $(".addressWrapper").html(html);
}
//Control dropdowns on district change
$('.customer_info .addressWrapper').on('change', event => {
    let waterfall = ["district", "ward", "street", "apart_num"];
    let name = $(event.target).attr("name");
    let index = waterfall.indexOf(name);
    for(let i = index + 1; i < waterfall.length; i++){
        shipAddress[waterfall[i]] = "";
    }
    shipAddress[name] = $(event.target).val();
    renderAddressWrapper();
})
