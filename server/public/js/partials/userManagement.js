function renderUserManagementTable(){
    let { users, pagination, searchText, filterField } = pageData;
    let filteredUsers = [];
    if(searchText == ""){
        filteredUsers = users.map((item, index) => {return {...item, index: index}});
    }else{
        let filterAgent = (filterField && filterField != "") ? [filterField] : ["user_id", "user_name", "user_tel", "province", "district", "ward", "street", "apart_num"];
        users.forEach(item => {
            for(let i = 0; i < filterAgent.length; i ++){
                if(item[filterAgent[i]] && item[filterAgent[i]].indexOf(searchText) > -1){
                    filteredUsers.push({...item, index: filteredUsers.length});
                    break;
                }
            }
        })
    }
    let max_pagination;
    if(filteredUsers.length % 20 == 0){
        max_pagination = filteredUsers.length/20;
        if(max_pagination == 0) max_pagination = 1;
    }else{
        max_pagination = parseInt(filteredUsers.length/20) + 1;
    }
    if(pagination > max_pagination){
        pagination = max_pagination;
        pageData.pagination = max_pagination;
    }
    let start = (pagination - 1)*20;
    let end = pagination * 20;
    let paginationUsers = filteredUsers.slice(start, end);
    let html =
    `<div class="th">
        <p title="Số thứ tự" >#</p>
        <p title="Mã khách hàng" >ID</p>
        <p>Khách hàng</p>
        <p title="Số điện thoại" class="sw2">SĐT</p>
        <p title="Mật khẩu" class="sw2">Mật khẩu</p>
        <p title="Đăng xuất" class="sw2">Cookie</p>
        <p title="Ngày đăng ký" class="sw2">Ngày ĐK</p>
        <p title="Đơn hàng đã mua" class="sw2">Đơn hàng</p>
        <p class="sw1">Tỉnh</p>
        <p class="sw1">Quận</p>
        <p class="sw1">Phường</p>
        <p class="sw1">Đường</p>
        <p class="sw1">Số nhà</p>
        <p><span class="switch">Action</span></p>
    </div>`;
    paginationUsers.forEach(item => {
        html +=
        `<div class="itemWrapper" id="${item.user_id}">
            <p class="tag">#:</p><p class="value">${(item.index + 1)}</p>
            <p class="tag">ID:</p><p class="value">${item.user_id}</p>
            <p class="tag">Khách hàng:</p><p class="value"><input name="user_name" value="${item.user_name ? item.user_name : ""}" placeholder="....."></p>
            <p class="tag sw2">SĐT:</p><p class="value sw2"><input name="user_tel" value="${item.user_tel ? item.user_tel : ""}" placeholder="....."></p>
            <p class="tag sw2">Mật khẩu:</p><p class="value sw2"><input name="user_pas" value="${item.user_pas ? item.user_pas : ""}" type="password" placeholder="....."></p>
            <p class="tag sw2">Cookie:</p><p class="value sw2"><input name="user_cookie" value="${item.user_cookie ? item.user_cookie : ""}" type="password" placeholder="....."></p>
            <p class="tag sw2">Ngày ĐK:</p><p class="value sw2"><input name="join_date" value="${item.join_date ? item.join_date : ""}" placeholder="....."></p>
            <p class="tag sw2">Đơn hàng:</p><p class="value sw2"><input name="order_fulfill" value="${item.order_fulfill ? item.order_fulfill : ""}" placeholder="....."></p>
            <p class="tag sw1">Tỉnh:</p><p class="value sw1"><input name="province" value="${item.province ? item.province : ""}" placeholder="....."></p>
            <p class="tag sw1">Quận:</p><p class="value sw1"><input name="district" value="${item.district ? item.district : ""}" placeholder="....."></p>
            <p class="tag sw1">Phường:</p><p class="value sw1"><input name="ward" value="${item.ward ? item.ward : ""}" placeholder="....."></p>
            <p class="tag sw1">Đường:</p><p class="value sw1"><input name="street" value="${item.street ? item.street : ""}" placeholder="....."></p>
            <p class="tag sw1">Số nhà:</p><p class="value sw1"><input name="apart_num" value="${item.apart_num ? item.apart_num : ""}" placeholder="....."></p>
            <p class="tag"><span class="switch">Action:</span></p>
            <p class="value">
                <span class="open">Mở</span>
                <span class="save">Lưu</span>
                <span class="show_pas" title="Hiển thị mật khẩu">Hiện MK</span>
            </p>
        </div>`;
    });
    let pagination_html = "";
    for(let i = 1; i <= max_pagination; i++){
        pagination_html +=
        `<span class="pagination_item${i == pagination ? " active" : ""}">${i}</span>`
    }
    $(".userManagement .table").html(html);
    $(".userManagement .pagination").html(pagination_html);
}

function getUserProfileFormData(element){
    let user_id = $(element).attr("id");
    user = new Object;
    user.user_id = user_id;
    let text_inputs = element.getElementsByTagName("input");
    for(let i= 0; i < text_inputs.length; i++){
        let key = $(text_inputs[i]).attr("name");
        let value = $(text_inputs[i]).val();
        user[key] = value;
    }
    return user;
}

function updateUser(user, cb){
    $.put(`${domain}/user`, user, data => {
        if(cb) cb(data);
    })
}

$(".userManagement").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("pagination_item") > -1){
        changeElementTextColorAnimation($(event.target));
        let pagination = parseInt($(event.target).html());
        pageData.pagination = pagination;
        renderUserManagementTable();
    }
    if(className.indexOf("clearFilter") > -1){
        changeElementTextColorAnimation($(event.target));
        pageData.searchText = "";
        pageData.filterField = "";
        $(".userManagement .searchText").val("");
        $(".userManagement .searchField").val("");
        renderUserManagementTable();
    }
    // added here
    if(className.indexOf("switch") > -1){
        changeElementTextColorAnimation($(event.target));
        if($(".userManagement .table").attr("data-switching")) return;
        $(".userManagement .table").attr("data-switching", true);
        let sw1_list = $(".userManagement .table p.sw1");
        let sw2_list = $(".userManagement .table p.sw2");
        for(let i = 0; i < sw1_list.length ; i++){
            let ori_class = $(sw1_list[i]).attr("class");
            let new_class = ori_class.replace("sw1", "sw2");
            $(sw1_list[i]).attr("class", new_class);
        };
        for(let i = 0; i < sw2_list.length ; i++){
            let ori_class = $(sw2_list[i]).attr("class");
            let new_class = ori_class.replace("sw2", "sw1");
            $(sw2_list[i]).attr("class", new_class)
        }
        $(".userManagement .table").removeAttr("data-switching");
    }
    if(className.indexOf("open") > -1){
        changeElementTextColorAnimation($(event.target));
        let prod_id = $(event.target.parentNode.parentNode).attr("id");
        // openProductProfile(prod_id);
    }
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let userProfile = getUserProfileFormData(itemWrapper);
        updateUser(userProfile, data => {
            if(data.isSuccess){
                let message =
                `<h4 style="text-align: center">Cập nhật thành công!</h4>`
                showAlert([message], "hideConfirm");
                pageData.users = data.users;
            }
            if(data.Alert){
                showAlert(data.Alert);
            }
        });
    }
    if(className.indexOf("show_pas") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let text_inputs = itemWrapper.getElementsByTagName("input");
        let password_input;
        let cookie_input;
        for(let i = 0; i < text_inputs.length; i++){
            if($(text_inputs[i]).attr("name") == "user_pas") password_input = text_inputs[i];
            if($(text_inputs[i]).attr("name") == "user_cookie") cookie_input = text_inputs[i];
        }
        if($(password_input).attr("type") == "password"){
            $(password_input).attr("type", "text");
            $(cookie_input).attr("type", "text");
        }else{
            $(password_input).attr("type", "password");
            $(cookie_input).attr("type", "password");
        }
    }
})
$(".userManagement").on("change", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("searchField") > -1){
        pageData.filterField = $(event.target).val();
        renderUserManagementTable();
    }
})
$(".userManagement").on("keyup", event => {
    let className = event.target.className;
    if(className.indexOf("searchText") > -1){
        pageData.searchText = $(event.target).val();
        renderUserManagementTable();
    }
})

