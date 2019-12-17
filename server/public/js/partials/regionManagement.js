function renderRegionManagementTable(){
    let { addresses, pagination, searchText, filterField } = pageData;
    let filteredAddresses = [];
    if(searchText == ""){
        filteredAddresses = addresses.map((item, index) => {return {...item, index: index}});
    }else{
        let filterAgent = (filterField && filterField != "") ? [filterField] : ["province", "district", "ward", "street"];
        addresses.forEach(item => {
            for(let i = 0; i < filterAgent.length; i ++){
                if(item[filterAgent[i]] && item[filterAgent[i]].indexOf(searchText) > -1){
                    filteredAddresses.push({...item, index: filteredAddresses.length});
                    break;
                }
            }
        })
    }
    let max_pagination;
    if(filteredAddresses.length % 20 == 0){
        max_pagination = filteredAddresses.length/20;
        if(max_pagination == 0) max_pagination = 1;
    }else{
        max_pagination = parseInt(filteredAddresses.length/20) + 1;
    }
    if(pagination > max_pagination){
        pagination = max_pagination;
        pageData.pagination = max_pagination;
    }
    let start = (pagination - 1)*20;
    let end = pagination * 20;
    let paginationAddresses = filteredAddresses.slice(start, end);
    let html =
    `<div class="th">
        <p title="Số thứ tự" >#</p>
        <p>Tỉnh thành</p>
        <p>Quận</p>
        <p>Phường</p>
        <p>Đường</p>
        <p><span class="switch">Action</span></p>
    </div>`;
    paginationAddresses.forEach(item => {
        html +=
        `<div class="itemWrapper" id="${item.id}">
            <p class="tag">#:</p><p class="value">${(item.index + 1)}</p>
            <p class="tag">Tỉnh thành:</p><p class="value"><input name="province" value="${item.province ? item.province : ""}" placeholder="....."></p>
            <p class="tag">Quận:</p><p class="value"><input name="district" value="${item.district ? item.district : ""}" placeholder="....."></p>
            <p class="tag">Phường:</p><p class="value"><input name="ward" value="${item.ward ? item.ward : ""}" placeholder="....."></p>
            <p class="tag">Đường:</p><p class="value"><input name="street" value="${item.street ? item.street : ""}" placeholder="....."></p>
            <p class="tag">Action:</p>
            <p class="value">
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
    $(".regionManagement .table").html(html);
    $(".regionManagement .pagination").html(pagination_html);
}

function openRegionProfile(){
    let html =
    `<div class="textInfo">
        <div class="tag">Tỉnh thành:<span class="required">*</span></div>
        <div class="value">
            <div class="customInputWrapper" name="province" onmouseleave="checkEmptyAddressOnMouseLeave(this)">
                <input name="province" value="" onfocusout="checkEmptyAddressList(this.parentNode)">
                <div class="selectContainer" name="province"></div>
            </div>
        </div><br>
        <div class="tag">Quận:<span class="required">*</span></div>
        <div class="value">
            <div class="customInputWrapper" name="district"  onmouseleave="checkEmptyAddressOnMouseLeave(this)">
                <input name="district" value="" onfocusout="checkEmptyAddressList(this.parentNode)">
                <div class="selectContainer" name="district"></div>
            </div>
        </div><br>
        <div class="tag">Phường:<span class="required">*</span></div>
        <div class="value">
            <div class="customInputWrapper" name="ward"  onmouseleave="checkEmptyAddressOnMouseLeave(this)">
                <input name="ward" value="" onfocusout="checkEmptyAddressList(this.parentNode)">
                <div class="selectContainer" name="ward"></div>
            </div>
        </div><br>
        <div class="tag">Đường:<span class="required">*</span></div>
        <div class="value">
            <div class="customInputWrapper" name="street"  onmouseleave="checkEmptyAddressOnMouseLeave(this)">
                <input name="street" value="" onfocusout="checkEmptyAddressList(this.parentNode)">
                <div class="selectContainer" name="street"></div>
            </div>
        </div><br>
    </div>`;
    $(".regionProfile .inner .inner_content").html(html);
    $(".regionProfile").fadeIn(100);
}

function closeRegionProfile(){
    $(".regionProfile .inner .inner_content").html("");
    $(".regionProfile").fadeOut(100); 
}

function renderAddressList(element){
    let addressList = [];
    let html = "";
    let addresses = pageData.addresses;
    let address_type = $(element).attr("name");
    let currentInputValue = $(element).children("input").val();
    if(address_type == "province"){
        addresses.forEach(item => {
            let isAdded = addressList.indexOf(item.province) > -1;
            if(!isAdded && (!currentInputValue || item.province.indexOf(currentInputValue) > -1)){
                addressList.push(item.province);
                html += `<p class="customInput_selectItem">${item.province}</p>`;
            }
        });
    };
    if(address_type == "district"){
        let selectedProvince = $(".regionProfile input[name=province]").val();
        addresses.forEach(item => {
            let isAdded = addressList.indexOf(item.district) > -1;
            if(!isAdded && (item.province == selectedProvince) && (!currentInputValue || item.district.indexOf(currentInputValue) > -1)){
                addressList.push(item.district);
                html += `<p class="customInput_selectItem">${item.district}</p>`;
            }
        });
    };
    if(address_type == "ward"){
        let selectedDistrict = $(".regionProfile input[name=district]").val();
        addresses.forEach(item => {
            let isAdded = addressList.indexOf(item.ward) > -1;
            if(!isAdded && (item.district == selectedDistrict) && (!currentInputValue || item.ward.indexOf(currentInputValue) > -1)){
                addressList.push(item.ward);
                html += `<p class="customInput_selectItem">${item.ward}</p>`;
            }
        });
    }
    if(address_type == "street"){
        let selectedWard = $(".regionProfile input[name=ward]").val();
        addresses.forEach(item => {
            let isAdded = addressList.indexOf(item.street) > -1;
            if(!isAdded && (item.ward == selectedWard) && (!currentInputValue || item.street.indexOf(currentInputValue) > -1)){
                addressList.push(item.street);
                html += `<p class="customInput_selectItem">${item.street}</p>`;
            }
        });
    }
    $(element).children(".selectContainer").html(html);
    $(element).css("z-index", 100);
}

function emptyAddressList(element){
    $(element).children(".selectContainer").html("");
    $(element).css("z-index", "");
}

function checkEmptyAddressList(element){
    let name = $(element).attr("name");
    let isfocusout = true;
    let hover_list = $(":hover");
    for(let i = 0; i < hover_list.length; i++){
        if($(hover_list[i]).attr("name") == name){
            isfocusout = false;
            break;
        }
    }
    setTimeout(() => {
        if($(":focus").length > 0 || isfocusout) emptyAddressList(element);
    }, 100)
}

function checkEmptyAddressOnMouseLeave(element){
    let name = $(element).attr("name");
    if($(":focus").attr("name") != name) emptyAddressList(element);
}

function emptyInputOnParentChange(name){
    let itemListToEmpty = [];
    if(name == "province") itemListToEmpty = ["district", "ward", "street"];
    if(name == "district") itemListToEmpty = ["ward", "street"];
    if(name == "ward") itemListToEmpty = ["street"];
    itemListToEmpty.forEach(item => {
        $(`.regionProfile input[name=${item}]`).val("");
    })
}

function checkParentInputValid(name){
    let parentInputName;
    if(name == "province") return true;
    if(name == "district") parentInputName= "province";
    if(name == "ward") parentInputName= "district";
    if(name == "street") parentInputName= "ward";
    let parentInputVal = $(`.regionProfile input[name=${parentInputName}]`).val();
    if(parentInputVal && parentInputVal != ""){
        return true;
    }else{
        return false;
    }
}

function getAddressProfileFormData(element){
    if(element){ // Nếu lấy profile từ regionManagementTable
        let id = $(element).attr("id");
        address = new Object;
        address.id = id;
        let text_inputs = element.getElementsByTagName("input");
        for(let i= 0; i < text_inputs.length; i++){
            let key = $(text_inputs[i]).attr("name");
            let value = $(text_inputs[i]).val();
            address[key] = value;
        }
        return address;
    }else{ // Nếu lấy profile từ regionProfile
        let address = new Object;
        let text_inputs = $(".regionProfile .inner .inner_content input");
        for(let i= 0; i < text_inputs.length; i++){
            let key = $(text_inputs[i]).attr("name");
            let value = $(text_inputs[i]).val();
            address[key] = value;
        }
        return address;
    }  
}

function addNewRegion(address, cb){
    $.post(`${domain}/region`, address, data => {
        if(cb) cb(data);
    })
}

function openAddressDeleteConfirm(id){
    let address = pageData.addresses.find(item => {return item.id == id});
    let html =
    `<p>Xóa <span>${address.province}</span> - <span>${address.district}</span> - <span>${address.ward}</span> - <span>${address.street}</span>!</p>`;
    $(".regionDelConfirm .inner .inner_content").html(html);
    $(".regionDelConfirm .inner .footer .inner_button.del").attr("data-id", id);
    $(".regionDelConfirm").fadeIn(100);
}

function closeAddressDeleteConfirm(){
    $(".regionDelConfirm .inner .inner_content").html("");
    $(".regionDelConfirm .inner .footer .inner_button.del").removeAttr("data-id");
    $(".regionDelConfirm").fadeOut(100);
}

function updateAddress(address, cb){
    $.put(`${domain}/region`, address, data => {
        if(cb) cb(data);
    })
}

function deleteAddress(id, cb){
    $.delete(`${domain}/region`, {
        id: id
    }, data => {
        if(cb) cb(data);
    })
}

$(".regionManagement").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("pagination_item") > -1){
        changeElementTextColorAnimation($(event.target));
        let pagination = parseInt($(event.target).html());
        pageData.pagination = pagination;
        renderRegionManagementTable();
    };
    if(className.indexOf("clearFilter") > -1){
        changeElementTextColorAnimation($(event.target));
        pageData.searchText = "";
        pageData.filterField = "";
        $(".regionManagement .searchText").val("");
        $(".regionManagement .searchField").val("");
        renderRegionManagementTable();
    };
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let regionProfile = getAddressProfileFormData(itemWrapper);
        updateAddress(regionProfile, data => {
            if(data.isSuccess){
                let message =
                `<h4 style="text-align: center">Cập nhật thành công!</h4>`
                showAlert([message], "hideConfirm");
                pageData.addresses = data.addresses;
            }
            if(data.Alert){
                showAlert(data.Alert);
            }
        });
    };
    if(className.indexOf("del") > -1){
        changeElementTextColorAnimation($(event.target));
        let itemWrapper = event.target.parentNode.parentNode;
        let id = $(itemWrapper).attr("id");
        openAddressDeleteConfirm(id);
    };
    if(className.indexOf("addRegion") > -1){
        changeElementTextColorAnimation($(event.target));
        openRegionProfile();
    }
})
$(".regionManagement").on("change", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("searchField") > -1){
        pageData.filterField = $(event.target).val();
        renderRegionManagementTable();
    }
})
$(".regionManagement").on("keyup", event => {
    let className = event.target.className;
    if(className.indexOf("searchText") > -1){
        pageData.searchText = $(event.target).val();
        renderRegionManagementTable();
    }
})
$(".regionProfile").on("click", event => { // chưa xong phần save
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("save") > -1){
        changeElementTextColorAnimation($(event.target));
        let regionProfile = getAddressProfileFormData();
        addNewRegion(regionProfile, data => {
            if(data.isSuccess){
                let message =
                `<h4 style="text-align: center">Thêm thành công!</h4>`
                showAlert([message], "hideConfirm");
                pageData.addresses = data.addresses;
                renderRegionManagementTable();
            }
            if(data.Alert){
                showAlert(data.Alert);
            }
            closeRegionProfile();
        });
    }
    if(className.indexOf("close") > -1){
        changeElementTextColorAnimation($(event.target));
        closeRegionProfile();
    }
    if(className.indexOf("customInput_selectItem") > -1){
        changeElementTextColorAnimation($(event.target));
        let input_element = $(event.target).parent(".selectContainer").parent(".customInputWrapper").children("input");
        if(input_element.attr("name") == "street"){
            showAlert([`<p style="text-align: center; color: red">Không chọn trùng đường!!!</p>`]);
        }else{
            input_element.val($(event.target).html());
        }
        let wrapper = $(event.target).parent(".selectContainer").parent(".customInputWrapper");
        emptyAddressList(wrapper);
    }
})
$(".regionProfile").on("focusin", event => {
    let tagName = event.target.tagName.toLowerCase();
    if(tagName.indexOf("input") > -1){
        let parentItem = event.target.parentNode;
        renderAddressList(parentItem);
    }
})
$(".regionProfile").on("keyup", event => {
    let tagName = event.target.tagName.toLowerCase();
    if(tagName.indexOf("input") > -1){
        let name = $(event.target).attr("name");
        emptyInputOnParentChange(name);
        let parentItem = event.target.parentNode;
        if(!checkParentInputValid(name)){
            showAlert([`<p style="text-align: center; color: red">Vui lòng điền các mục phía trên trước !!!</p>`]);
            $(event.target).val("");
        }
        renderAddressList(parentItem);
    }
})
$(".regionDelConfirm").on("click", event => {
    event.preventDefault();
    let className = event.target.className;
    if(className.indexOf("del") > -1){
        changeElementTextColorAnimation($(event.target));
        let id = $(event.target).attr("data-id");
        deleteAddress(id, data => {
            if(data.isSuccess){
                let index;
                for(let i = 0; i < pageData.addresses.length; i++){
                    if(pageData.addresses[i].id == id){
                        index = i;
                        break;
                    }
                }
                pageData.addresses.splice(index, 1);
                showAlert([`<p>Xóa thành công!</p>`], "hideConfirm");
                renderRegionManagementTable();
            };
            if(data.Alert){
                showAlert(data.Alert);
            }
            closeAddressDeleteConfirm();
        })
    }
    if(className.indexOf("cancel") > -1){
        changeElementTextColorAnimation($(event.target));
        closeAddressDeleteConfirm();
    }
})
