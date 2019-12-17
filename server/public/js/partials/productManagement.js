function renderProductManagementTable(){
    let { products, pagination, searchText, filterField } = pageData;
    let filteredProducts = [];
    if(searchText == ""){
        filteredProducts = products.map((item, index) => {return {...item, index: index}});
    }else{
        let filterAgent = (filterField && filterField != "") ? [filterField] : ["prod_id", "prod_name"];
        products.forEach(item => {
            for(let i = 0; i < filterAgent.length; i ++){
                if(item[filterAgent[i]] && item[filterAgent[i]].indexOf(searchText) > -1){
                    filteredProducts.push({...item, index: filteredProducts.length});
                    break;
                }
            }
        })
    }
    let max_pagination;
    if(filteredProducts.length % 20 == 0){
        max_pagination = filteredProducts.length/20;
        if(max_pagination == 0) max_pagination = 1;
    }else{
        max_pagination = parseInt(filteredProducts.length/20) + 1;
    }
    if(pagination > max_pagination){
        pagination = max_pagination;
        pageData.pagination = max_pagination;
    }
    let start = (pagination - 1)*20;
    let end = pagination * 20;
    let paginationProducts = filteredProducts.slice(start, end);
    let html =
    `<div class="th">
        <p title="Số thứ tự">#</p>
        <p title="Sản phẩm">Sản phẩm</p>
        <p title="Quy cách" class="sw1">Quy cách</p>
        <p title="Từ khóa tìm kiếm" class="sw1">Tìm kiếm</p>
        <p title="Phân loại nhóm 1" class="sw1">class1</p>
        <p title="Phân loại nhóm 2" class="sw1">class2</p>
        <p title="Đơn vị cơ bản" class="sw2">count_unit1</p>
        <p title="Giá cơ bản" class="sw2">unit_price1</p>
        <p title="Đơn vị bán" class="sw2">count_unit2</p>
        <p title="Tỷ số đơn vị" class="sw2">unit_relation2</p>
        <p title="Lượng mua tối thiểu" class="sw2">min_qty</p>
        <p title="Tăng tự động" class="sw2">qty_incre_step</p>
        <p title="Tồn kho" class="sw2">stock_qty</p>
        <p title="Mức ưu tiên" class="sw1">priority</p>
        <p><span class="switch">Action</span></p>
    </div>`;
    paginationProducts.forEach(item => {
        html +=
        `<div class="itemWrapper" id="${item.prod_id}">
            <p class="tag">#:</p><p class="value">${item.index + 1}</p>
            <p class="tag">Sản phẩm:</p><p class="value"><input name="prod_name" value="${item.prod_name}" placeholder="....."></p>
            <p class="tag">Quy cách:</p><p class="value sw1"><input name="prod_spec" value="${item.prod_spec ? item.prod_spec : ""}" placeholder="....."></p>
            <p class="tag">Tìm kiếm:</p><p class="value sw1"><input name="s_key" value="${item.s_key}" placeholder="....."></p>
            <p class="tag">class1:</p><p class="value sw1"><input name="class1" value="${item.class1}" placeholder="....."></p>
            <p class="tag">class2:</p><p class="value sw1"><input name="class2" value="${item.class2}" placeholder="....."></p>
            <p class="tag">count_unit1:</p><p class="value sw2"><input name="count_unit1" value="${item.count_unit1}" placeholder="....."></p>
            <p class="tag">unit_price1:</p><p class="value sw2"><input name="unit_price1" type="number" value="${item.unit_price1}" placeholder="....."></p>
            <p class="tag">count_unit2:</p><p class="value sw2"><input name="count_unit2" value="${item.count_unit2}" placeholder="....."></p>
            <p class="tag">unit_relation2:</p><p class="value sw2"><input name="unit_relation2" type="number" value="${item.unit_relation2}" placeholder="....."></p>
            <p class="tag">min_qty:</p><p class="value sw2"><input name="min_qty" type="number" value="${item.min_qty}" placeholder="....."></p>
            <p class="tag">qty_incre_step:</p><p class="value sw2"><input name="qty_incre_step" type="number" value="${item.qty_incre_step}" placeholder="....."></p>
            <p class="tag">stock_qty:</p><p class="value sw2"><input name="stock_qty" type="number" value="${item.stock_qty}" placeholder="....."></p>
            <p class="tag">priority:</p><p class="value sw1"><input name="priority" type="number" value="${item.priority}" placeholder="....."></p>
            <p class="tag"><span class="switch">Action:</span></p>
            <p class="value">
                <span class="open">Mở</span>
                <span class="save">Lưu</span>
                <span class="del">Xóa</span>
            </p>
        </div>`;
    });
    let pagination_html = "";
    for(let i = 1; i <= max_pagination; i++){
        pagination_html +=
        `<span class="pagination_item${i == pagination ? " active" : ""}">${i}</span>`
    }
    $(".productManagement .table").html(html);
    $(".productManagement .pagination").html(pagination_html);
}

function openProductProfile(prod_id){
    let product = pageData.products.find(item => {return item.prod_id == prod_id});
    let html =
    `<div class="textInfo">
        <p class="tag">ID sản phẩm:</p><p class="value"><input name="prod_id" type="number" value="${product.prod_id}" disabled></p><br>
        <p class="tag">Tên sản phẩm:<span class="required">*</span></p><p class="value"><input name="prod_name" type="text" value="${product.prod_name}"></p><br>
        <p class="tag">Từ khóa:</p><p class="value"><input name="s_key" type="text" value="${product.s_key}"></p><br>
        <p class="tag">Quy cách:<span class="required">*</span></p><p class="value"><input name="prod_spec" type="text" value="${product.prod_spec || ""}"></p><br>
        <p class="tag">Phân loại 1:<span class="required">*</span></p><p class="value"><input name="class1" type="text" value="${product.class1}"></p><br>
        <p class="tag">Phân loại 2:<span class="required">*</span></p><p class="value"><input name="class2" type="text" value="${product.class2}"></p><br>
        <p class="tag">Đơn vị giá 1:<span class="required">*</span></p><p class="value"><input name="count_unit1" type="text" value="${product.count_unit1}"></p><br>
        <p class="tag">Giá bán 1:<span class="required">*</span></p><p class="value"><input name="unit_price1" type="number" value="${product.unit_price1}"></p><br>
        <p class="tag">Đơn vị bán 2:<span class="required">*</span></p><p class="value"><input name="count_unit2" type="text" value="${product.count_unit2}"></p><br>
        <p class="tag">Tỉ lệ giá 2:<span class="required">*</span></p><p class="value"><input name="unit_relation2" type="number" value="${product.unit_relation2}"></p><br>
        <p class="tag">Số lượng tối thiểu:<span class="required">*</span></p><p class="value"><input name="min_qty" type="number" value="${product.min_qty}"></p><br>
        <p class="tag">qty_incre_step:<span class="required">*</span></p><p class="value"><input name="qty_incre_step" type="number" value="${product.qty_incre_step}"></p><br>
        <p class="tag">Priority:</p><p class="value"><input name="priority" type="number" value="${product.priority}"></p><br>
        <p class="tag">Stock qty:</p><p class="value"><input name="stock_qty" type="number" value="${product.stock_qty}"></p><br>
        <p class="tag">Description:</p><p class="value"><textarea name="description" type="text" value="">${product.description}</textarea></p><br>
    </div>
    <div class="imgContainer">
        <span class="required">*</span>
        <div class="imgWrapper">
            <img src="${domain}/images/${product.img_link}" alt="${product.prod_name}">
        </div>
        <input class="imgInput" name="prod_img" type="file">
    </div>`;
    $(".productProfile .inner .inner_content").html(html);
    $(".productProfile .inner .footer .inner_button.save").attr("data-type", "update");
    $(".productProfile").fadeIn(100);
}

function closeProductProfile(){
    $(".productProfile .inner .inner_content").html("");
    $(".productProfile").fadeOut(100);
}

function openAddProduct(){
    let html =
    `<div class="textInfo">
        <p class="tag">Tên sản phẩm:<span class="required">*</span></p><p class="value"><input name="prod_name" type="text" value=""></p><br>
        <p class="tag">Từ khóa:</p><p class="value"><input name="s_key" type="text" value=""></p><br>
        <p class="tag">Quy cách:<span class="required">*</span></p><p class="value"><input name="prod_spec" type="text" value=""></p><br>
        <p class="tag">Phân loại 1:<span class="required">*</span></p><p class="value"><input name="class1" type="text" value=""></p><br>
        <p class="tag">Phân loại 2:<span class="required">*</span></p><p class="value"><input name="class2" type="text" value=""></p><br>
        <p class="tag">Đơn vị giá 1:<span class="required">*</span></p><p class="value"><input name="count_unit1" type="text" value=""></p><br>
        <p class="tag">Giá bán 1:<span class="required">*</span></p><p class="value"><input name="unit_price1" type="number" value=""></p><br>
        <p class="tag">Đơn vị bán 2:<span class="required">*</span></p><p class="value"><input name="count_unit2" type="text" value=""></p><br>
        <p class="tag">Tỉ lệ giá 2:<span class="required">*</span></p><p class="value"><input name="unit_relation2" type="number" value=""></p><br>
        <p class="tag">Số lượng tối thiểu:<span class="required">*</span></p><p class="value"><input name="min_qty" type="number" value=""></p><br>
        <p class="tag">qty_incre_step:<span class="required">*</span></p><p class="value"><input name="qty_incre_step" type="number" value=""></p><br>
        <p class="tag">Priority:</p><p class="value"><input name="priority" type="number" value=""></p><br>
        <p class="tag">Stock qty:</p><p class="value"><input name="stock_qty" type="number" value=""></p><br>
        <p class="tag">Description:</p><p class="value"><textarea name="description" type="text" value=""></textarea></p><br>
    </div>
    <div class="imgContainer">
        <span class="required">*</span>
        <div class="imgWrapper">
            <img src="" alt="Tải ảnh">
        </div>
        <input class="imgInput" name="prod_img" type="file">
    </div>`;
    $(".productProfile .inner .inner_content").html(html);
    $(".productProfile .inner .footer .inner_button.save").attr("data-type", "add");
    $(".productProfile").fadeIn(100);
}

function addNewProduct(productProfile, cb){
    $.ajax({
        type: "POST",
        enctype: "mutipart/form-data",
        url: `${domain}/product`,
        processData: false,
        contentType: false,
        cache: false,
        data: productProfile,
        success: data => {
            if(cb) cb(data);
        }
    })
}

function updateProduct(productProfile, cb){
    $.ajax({
        type: "PUT",
        enctype: "mutipart/form-data",
        url: `${domain}/product`,
        processData: false,
        contentType: false,
        cache: false,
        data: productProfile,
        success: data => {
            if(cb) cb(data);
        }
    })
}

function getProductProfileFormData(){
    let formData = new FormData();
    let text_inputs = $(".productProfile .textInfo input");
    for(let i= 0; i < text_inputs.length; i++){
        let key = $(text_inputs[i]).attr("name");
        let value = $(text_inputs[i]).val();
        if(key == "stock_qty" || key == "priority"){ // mysql database yêu cầu thuộc tính là number
            if(isNaN(parseInt(value))){
                value = 0;
            }else{
                value = parseInt(value);
            }
        }
        formData.append(key, value);
    }
    let description_input = $(".productProfile .textInfo textarea")[0];
    formData.append("description", $(description_input).val())
    let prod_image_input = $(".productProfile .imgContainer .imgInput")[0];
    formData.append("prod_img", prod_image_input.files[0]);
    return formData;
}

function getTableItemProfileFormData(element){
    let prod_id = $(element).attr("id");
    let formData = new FormData();
    formData.append("prod_id", prod_id);
    let text_inputs = element.getElementsByTagName("input");
    for(let i= 0; i < text_inputs.length; i++){
        let key = $(text_inputs[i]).attr("name");
        let value = $(text_inputs[i]).val();
        if(key == "stock_qty" || key == "priority"){ // mysql database yêu cầu thuộc tính là number
            if(isNaN(parseInt(value))){
                value = 0;
            }else{
                value = parseInt(value);
            }
        }
        formData.append(key, value);
    }
    return formData;
}

function openProductDeleteConfirm(prod_id){
    let product = pageData.products.find(item => {return item.prod_id == prod_id});
    let html =
    `<p class="title">Xóa <span>${product.prod_name}</span>!</p>
    <p class="annotation">ID: <span>${product.prod_id}</span></p>`

    $(".productDelConfirm .inner .inner_content").html(html);
    $(".productDelConfirm .inner .footer .inner_button.del").attr("data-prod_id", prod_id);
    $(".productDelConfirm").fadeIn(100);
}

function closeProductDeleteConfirm(){
    $(".productDelConfirm .inner .inner_content").html("");
    $(".productDelConfirm .inner .footer .inner_button.del").removeAttr("data-prod_id");
    $(".productDelConfirm").fadeOut(100);
}

function deleteProduct(prod_id, cb){
    $.delete(`${domain}/product`, {
        prod_id: prod_id
    }, data => {
        if(cb) cb(data);
    })
}

$(".productManagement").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("pagination_item") > -1){
        changeElementTextColorAnimation($(event.target));
        let pagination = parseInt($(event.target).html());
        pageData.pagination = pagination;
        renderProductManagementTable();
    }
    if(className.indexOf("clearFilter") > -1){
        changeElementTextColorAnimation($(event.target));
        pageData.searchText = "";
        pageData.filterField = "";
        $(".productManagement .searchText").val("");
        $(".productManagement .searchField").val("");
        renderProductManagementTable();
    }
    if(className.indexOf("switch") > -1){
        changeElementTextColorAnimation($(event.target));
        let sw1_list = $(".productManagement .table p.sw1");
        let sw2_list = $(".productManagement .table p.sw2");
        for(let i = 0; i < sw1_list.length ; i++){
            $(sw1_list[i]).attr("class", "sw2");
        };
        for(let i = 0; i < sw2_list.length ; i++){
            $(sw2_list[i]).attr("class", "sw1")
        }
    }
    if(className.indexOf("open") > -1){
        changeElementTextColorAnimation($(event.target));
        let prod_id = $(event.target.parentNode.parentNode).attr("id");
        openProductProfile(prod_id);
    }
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let itemProfile = getTableItemProfileFormData(itemWrapper);
        updateProduct(itemProfile, data => {
            if(data.isSuccess){
                let message =
                `<h4 style="text-align: center">Cập nhật thành công!</h4>`
                showAlert([message], "hideConfirm");
                changeElementTextColorAnimation($(itemWrapper));
                pageData.products = data.products;
            }
            if(data.Alert){
                showAlert(data.Alert);
            }
        });
    }
    if(className.indexOf("del") > -1){
        changeElementTextColorAnimation($(event.target));
        let prod_id = $(event.target.parentNode.parentNode).attr("id");
        openProductDeleteConfirm(prod_id);
    }
    if(className.indexOf("addProduct") > -1){
        changeElementTextColorAnimation($(event.target));
        openAddProduct();
    }
})
$(".productManagement").on("change", event => {
    event.preventDefault();
    console.log("change")
    let className = event.target.className;
    if(className.indexOf("searchField") > -1){
        pageData.filterField = $(event.target).val();
        renderProductManagementTable();
    }
})
$(".productManagement").on("keyup", event => {
    let className = event.target.className;
    if(className.indexOf("searchText") > -1){
        pageData.searchText = $(event.target).val();
        renderProductManagementTable();
    }
})
$(".productProfile").on("click", event => {
    let className = event.target.className;
    // don't prevent normal image upload process
    if(className.indexOf("imgInput") > -1){
        return;
    }
    event.preventDefault();
    // handle add or update product profile
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let type = $(event.target).attr("data-type");
        let productProfile = getProductProfileFormData();
        if(type == "add"){
            addNewProduct(productProfile, data => {
                if(data.isSuccess){
                    let message =
                    `<h4 style="text-align: center">Thêm thành công!</h4>`
                    showAlert([message], "hideConfirm");
                    pageData.products = data.products;
                    renderProductManagementTable();
                }
                if(data.Alert){
                    showAlert(data.Alert);
                }
                closeProductProfile();
            });
        }else if(type == "update"){
            updateProduct(productProfile, data => {
                if(data.isSuccess){
                    let message =
                    `<h4 style="text-align: center">Cập nhật thành công!</h4>`
                    showAlert([message], "hideConfirm");
                    pageData.products = data.products;
                    renderProductManagementTable();
                }
                if(data.Alert){
                    showAlert(data.Alert);
                }
                closeProductProfile();
            });
        }
    }
    if(className.indexOf("close") > -1){
        changeElementTextColorAnimation($(event.target));
        closeProductProfile();
    }
})
$(".productProfile").on("change", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("imgInput") > -1){
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            $(".productProfile .imgContainer img").attr("src", reader.result)
        }
        reader.readAsDataURL(file);
    }
    
})
$(".productDelConfirm").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("del") > -1){
        changeElementTextColorAnimation($(event.target));
        let prod_id = $(event.target).attr("data-prod_id");
        deleteProduct(prod_id, data => {
            if(data.isSuccess){
                let index;
                for(let i = 0; i < pageData.products.length; i++){
                    if(pageData.products[i].prod_id == prod_id){
                        index = i;
                        break;
                    }
                }
                pageData.products.splice(index, 1);
                showAlert([`<p>Xóa thành công!</p>`], "hideConfirm");
                renderProductManagementTable();
            };
            if(data.Alert){
                showAlert(data.Alert);
            }
            closeProductDeleteConfirm();
        })
    }
    if(className.indexOf("cancel") > -1){
        changeElementTextColorAnimation($(event.target));
        closeProductDeleteConfirm();
    }
})

