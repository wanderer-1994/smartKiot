//For render order_history
function renderMoreHistoryOrders(orders, s_orders, isFirstTime){ //render first time sẽ hiển thị chưa mua hàng khi không có đơn hàng. các lần render sau không hiển thị
    let added_html = '';
    let d = new Date();
    let hr = d.getHours();
    let year = d.getFullYear()%100;
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let access_date = year*10000 + month*100 + date;
    if(orders.length <= 0 && isFirstTime){
        added_html += `<div class="order_wrapper" style="text-align:center"><p class="orderEmpty">Bạn chưa mua đơn hàng nào</p></div>`;
    }else{
        for(let i = 0; i < orders.length; i++){
            added_html += `<div class="order_wrapper">\
                            <div class="order_header">\
                                <p class="col_1">${orders[i].order_id}</p>\
                                <p class="col_2">${orders[i].status}</p>\
                                <p class="col_3"><i class="fas fa-arrow-circle-down"></i></p>`;
            let order_issue_date = parseInt(orders[i].order_id.toString().substr(0, 6));
            if(order_issue_date >= access_date && hr < 23){
                if(orders[i].status == "Chờ giao"){
                    added_html +=   `<p class="col_4"><span class="order_cancel" id="${orders[i].order_id}" data-status="wait" style="color:blue">Hủy đơn</span></p>`;
                }
                if(orders[i].status == "Đã hủy"){
                    added_html +=   `<p class="col_4"><span class="order_cancel" id="${orders[i].order_id}" data-status="canceled" style="color:red">Mua lại</span></p>`;
                }
                if(orders[i].status != "Chờ giao" && orders[i].status != "Đã hủy"){
                    added_html +=   `<p class="col_4">...</p>`;
                }
            }else{
                added_html +=   `<p class="col_4">...</p>`;
            }
            added_html +=       `<div style="clear:both"></div>\
                            </div>\
                            <div class="order_details_wrapper">\
                                <div class="order_shipping">\
                                    <p>Ngày đặt:</p><i>${orders[i].order_id.toString().substr(4,2)}/${orders[i].order_id.toString().substr(2,2)}/20${orders[i].order_id.toString().substr(0,2)}</i><br>\
                                    <p>Ngày giao:</p><i>07:30 - 10:30 ngày ${orders[i].ship_date.toString().substr(6,2)}/${orders[i].ship_date.toString().substr(4,2)}/${orders[i].ship_date.toString().substr(0,4)}</i><br>\
                                    <p>Người nhận:</p><i>${orders[i].receiver} - ${orders[i].receiver_tel}</i><br>\
                                    <p>Địa chỉ giao:</p><i>${orders[i].apart_num} ${orders[i].street}, ${orders[i].ward}, ${orders[i].district}</i><br>\
                                </div>`;
            if(s_orders[i] == null || s_orders[i] == 0){
                added_html +=   `<div class="s_orders_wrapper">\
                                    <div class="s_orders_data">\
                                        Không có sản phẩm nào!\
                                    </div>\
                                </div>`;
            }else{
                added_html += `<div class="s_orders_wrapper">\
                                <div class="s_orders_header">\
                                    <div class="prod_info">\
                                        <p class="temp">Sản phẩm/</p>\
                                        <p class="actual">Đơn giá</p>\
                                    </div>\
                                    <div class="order_info">\
                                        <p class="temp">SL đặt/</p>\
                                        <p class="actual">Thực giao</p>\
                                    </div>\
                                    <div class="check_info">\
                                        <p class="temp">Tạm tính/</p>\
                                        <p class="actual">Thực tính</p>\
                                    </div>\
                                    <p style="clear:both"></p>\
                                </div>`;
                    let ord_temp_check = 0;
                    let ord_actual_check = 0;
                    for(let j = 0; j < s_orders[i].length; j++){
                        if(s_orders[i][j] != 0){
                            let s_ord_temp_check = parseInt(parseFloat(s_orders[i][j].order_qty)*parseFloat(s_orders[i][j].unit_relation2)*parseFloat(s_orders[i][j].unit_price1));
                            let s_ord_actual_check = parseInt(parseFloat(s_orders[i][j].ship_qty || 0)*parseFloat(s_orders[i][j].unit_price1));
                            ord_temp_check += s_ord_temp_check;
                            ord_actual_check += s_ord_actual_check;
                            added_html += `<div class="s_orders_data">\
                                                <div class="prod_info">\
                                                    <p class="temp">${s_orders[i][j].prod_name}</p>\
                                                    <p class="actual">${s_orders[i][j].unit_price1.toLocaleString()}/${s_orders[i][j].count_unit1}</p>\
                                                </div>\
                                                <div class="order_info">\
                                                    <p class="temp">${s_orders[i][j].order_qty} ${s_orders[i][j].count_unit2}</p>\
                                                    <p class="actual">${s_orders[i][j].ship_qty || 0} ${s_orders[i][j].count_unit1}</p>\
                                                </div>\
                                                <div class="check_info">\
                                                    <p class="temp">${s_ord_temp_check.toLocaleString()} đ</p>\
                                                    <p class="actual">${s_ord_actual_check.toLocaleString()} đ</p>\
                                                </div>\
                                                <p style="clear:both"></p>\
                                            </div>`;
                        }
                    }
                added_html += `</div>\
                            <div class="total_check">\
                                <span class="temp tag">Tổng tạm tính:</span><span class="temp value">${ord_temp_check.toLocaleString()} đ</span><br>\
                                <span class="actual tag">Tổng thực tính:</span><span class="actual value">${ord_actual_check.toLocaleString()} đ</span>\
                            </div>`;
            }
            added_html += '</div>\
                        </div>';
        };
    }
    $('.order_show .orders_info_general_wrapper').append(added_html);
    if(orders.length == 0 || pageData.orders.length < pageData.pagination){
        $('.order_show .load_more').html("Hết!");
        $('.order_show .load_more').attr("class", "load_more");
        $('.order_show .load_more').css("display", "none");
    }else{
        $('.order_show .load_more').html("Các đơn hàng cũ hơn...");
        $('.order_show .load_more').attr("class", "active load_more");
    }
};
//General wrapper manipulation
$('.order_show').on('click', event => {
    event.preventDefault();
    //show/hide order details
    let className = event.target.className.toLowerCase();
    if(className == 'fas fa-arrow-circle-down'){
        changeElementTextColorAnimation($(event.target));
        if($(event.target).attr("data-Toggling")) return;
        $(event.target).attr("data-Toggling", true);
        $(event.target).parents('div[class=order_header]').next('div[class=order_details_wrapper]').slideToggle(400, () => {
            $(event.target).removeAttr("data-Toggling");
        });
    }
    //cancel order
    if(className == 'order_cancel'){
        if($(event.target).attr("data-processing")) return;
        $(event.target).attr("data-processing", true)
        let target = $(event.target);
        let order_id = target.attr('id');
        let order_status = target.attr('data-status');
        $.post(`${domain}/huy_don_hang`, {
            order_id: order_id,
            order_status: order_status,
        }, data => {
            if(data.Alert){
                showAlert(data.Alert);
            }
            if(data.cancel_success){
                target.html('Mua lại');
                target.attr('data-status', 'canceled');
                target.css('color', 'red');
                target.parent('p[class=col_4]').siblings('p[class=col_2]').html('Đã hủy');
            }
            if(data.restore_success){
                target.html('Hủy đơn');
                target.attr('data-status', 'wait');
                target.css('color', 'blue');
                target.parent('p[class=col_4]').siblings('p[class=col_2]').html('Chờ giao');
            }
            if(data.time_out){
                target.parent('p[class=col_6]').html('...');
            }
            $(event.target).removeAttr("data-processing");
        })
    }
    //load more order_history
    if(className.indexOf("active") > -1 && className.indexOf("load_more") > -1){
        changeElementTextColorAnimation($(event.target));
        if($(event.target).attr("data-processing")) return;
        $(event.target).attr("data-processing", true);
        let index = pageData.pagination;
        $.get(domain + '/lich_su_mua_hang_load_more/' + index, data => {
            if(data.Alert && data.Alert.length > 0){
                showAlert(data.Alert);
            }
            if(data.orders && data.s_orders){
                pageData.orders = [...pageData.orders, ...data.orders];
                pageData.s_orders = [...pageData.s_orders, ...data.s_orders];
                pageData.pagination += 5;
                renderMoreHistoryOrders(data.orders, data.s_orders, false);
            }
            $(event.target).removeAttr("data-processing");
        })
    }
})