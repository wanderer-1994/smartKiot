function renderAdminManagementTable(){
    let { admins, pagination, searchText, filterField } = pageData;
    let filteredAdmins = [];
    if(searchText == ""){
        filteredAdmins = admins.map((item, index) => {return {...item, index: index}});
    }else{
        let filterAgent = (filterField && filterField != "") ? [filterField] : ["admin_id", "full_name", "admin_tel", "admin_level"];
        admins.forEach(item => {
            for(let i = 0; i < filterAgent.length; i ++){
                if(item[filterAgent[i]] && item[filterAgent[i]].indexOf(searchText) > -1){
                    filteredAdmins.push({...item, index: filteredAdmins.length});
                    break;
                }
            }
        })
    }
    let max_pagination;
    if(filteredAdmins.length % 20 == 0){
        max_pagination = filteredAdmins.length/20;
        if(max_pagination == 0) max_pagination = 1;
    }else{
        max_pagination = parseInt(filteredAdmins.length/20) + 1;
    }
    if(pagination > max_pagination){
        pagination = max_pagination;
        pageData.pagination = max_pagination;
    }
    let start = (pagination - 1)*20;
    let end = pagination * 20;
    let paginationAdmins = filteredAdmins.slice(start, end);
    let html =
    `<div class="th">
        <p title="Số thứ tự">#</p>
        <p title="Mã admin">ID</p>
        <p title="Admin">Nhân viên</p>
        <p title="Số điện thoại">SĐT</p>
        <p title="Mật khẩu">Mật khẩu</p>
        <p title="Đăng xuất">Cookie</p>
        <p title="Vai trò">Vai trò</p>
        <p>Action</p>
    </div>`;
    paginationAdmins.forEach(item => {
        html +=
        `<div class="itemWrapper" id="${item.admin_id}">
            <p class="tag">#:</p><p class="value">${item.index + 1}</p>
            <p class="tag">ID:</p><p class="value">${item.admin_id ? item.admin_id : ""}</p>
            <p class="tag">Nhân viên:</p><p class="value"><input name="full_name" value="${item.full_name ? item.full_name : ""}" placeholder="....."></p>
            <p class="tag">SĐT:</p><p class="value"><input name="admin_tel" value="${item.admin_tel ? item.admin_tel : ""}" placeholder="....."></p>
            <p class="tag">Mật khẩu:</p><p class="value"><input name="admin_pas" value="${item.admin_pas ? item.admin_pas : ""}" type="password" placeholder="....."></p>
            <p class="tag">Cookie:</p><p class="value"><input name="admin_cookie" value="${item.admin_cookie ? item.admin_cookie : ""}" type="password" placeholder="....."></p>
            <p class="tag">Vai trò:</p><p class="value"><input name="admin_level" value="${item.admin_level ? item.admin_level : ""}" placeholder="....."></p>
            <p class="tag">Action:</p>
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
    $(".adminManagement .table").html(html);
    $(".adminManagement .pagination").html(pagination_html);
}

function getAdminProfileFormData(element){
    let admin_id = $(element).attr("id");
    admin = new Object;
    admin.admin_id = admin_id;
    let text_inputs = element.getElementsByTagName("input");
    for(let i= 0; i < text_inputs.length; i++){
        let key = $(text_inputs[i]).attr("name");
        let value = $(text_inputs[i]).val();
        admin[key] = value;
    }
    return admin;
}

function updateAdmin(admin, cb){
    $.put(`${domain}/admin`, admin, data => {
        if(cb) cb(data);
    })
}

$(".adminManagement").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("pagination_item") > -1){
        changeElementTextColorAnimation($(event.target));
        let pagination = parseInt($(event.target).html());
        pageData.pagination = pagination;
        renderAdminManagementTable();
    }
    if(className.indexOf("clearFilter") > -1){
        changeElementTextColorAnimation($(event.target));
        pageData.searchText = "";
        pageData.filterField = "";
        $(".adminManagement .searchText").val("");
        $(".adminManagement .searchField").val("");
        renderAdminManagementTable();
    }
    if(className.indexOf("open") > -1){
        changeElementTextColorAnimation($(event.target));
        let user_id = $(event.target.parentNode.parentNode).attr("id");
        // openProductProfile(prod_id);
    }
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let adminProfile = getAdminProfileFormData(itemWrapper);
        updateAdmin(adminProfile, data => {
            if(data.isSuccess){
                let message =
                `<h4 style="text-align: center">Cập nhật thành công!</h4>`
                showAlert([message], "hideConfirm");
                pageData.admins = data.admins;
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
            if($(text_inputs[i]).attr("name") == "admin_pas") password_input = text_inputs[i];
            if($(text_inputs[i]).attr("name") == "admin_cookie") cookie_input = text_inputs[i];
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
$(".adminManagement").on("change", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("searchField") > -1){
        pageData.filterField = $(event.target).val();
        renderAdminManagementTable();
    }
})
$(".adminManagement").on("keyup", event => {
    let className = event.target.className;
    if(className.indexOf("searchText") > -1){
        pageData.searchText = $(event.target).val();
        renderAdminManagementTable();
    }
})

