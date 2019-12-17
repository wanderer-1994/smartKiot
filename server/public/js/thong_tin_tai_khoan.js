//for user_info form submit
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

function luu_thong_tin_tai_khoan(){
    //Validate thông tin phải được điền
    let form = new Object;
    form.user_name = $('.customer_info input[name=user_name]').val();
    form.district = $('.customer_info select[name=district]').val();
    form.ward = $('.customer_info select[name=ward]').val();
    form.street = $('.customer_info select[name=street]').val();
    form.apart_num = $('.customer_info input[name=apart_num]').val();
    form.isChangePas = $('.customer_info input[name=isChangePas]').is(":checked");
    form.user_pas = $('.customer_info input[name=user_pas]').val();
    form.new_user_pas = $('.customer_info input[name=new_user_pas]').val();
    let AlertMessage = [];
    if(form.user_name.toString().length < 1 || form.district.toString().length < 1 || form.ward.toString().length < 1 || form.street.toString().length < 1 || form.apart_num == 0 || form.apart_num == ''){
        AlertMessage.push(`<p style="margin-top: 5px; color:red; text-align: left; padding: 0px 10px 0px 10px">Thông tin tài khoản chưa đủ hoặc không hợp lệ!</p>`)
    }
    if(form.isChangePas){
        if(form.user_pas.toString().length < 1){
            AlertMessage.push(`<p style="margin-top: 5px; color:red; text-align: left; padding: 0px 10px 0px 10px">Bạn chưa nhập mật khẩu cũ!</p>`);
        }
        if(/\s/.test(form.new_user_pas) || form.new_user_pas.length < 6){
            AlertMessage.push(`<p style="margin-top: 5px; color:red; text-align: left; padding: 0px 10px 0px 10px">Mật khẩu mới phải dài hơn 6 kí tự và không chứa khoảng trắng!</p>`);
        }
    }
    if(AlertMessage.length > 0){
        return showAlert(AlertMessage);
    }
    $.post(`${domain}/thong_tin_tai_khoan`, form, data => {
        if(data.Alert && data.Alert.length > 0){
            showAlert(data.Alert);
        }
        if(data.isSuccess){
            let message = `<p style="color: green">Cập nhật thành công!</p>`;
            showAlert([message], "hideConfirm");
        }
        if(data.forceRedirect){
            window.location.replace(data.forceRedirect);
        }
    })
}
    
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
//Control user name on change
$('.customer_info input[name=user_name]').on('change', event => {
    let raw_name = $(event.target).val().toString();
    let validated_name = '';
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
    $(event.target).val(validated_name);
})
$('.customer_info input[name=isChangePas]').on('change', event => {
    let checked = $(event.target).is(":checked");
    if(checked){
        return $(".customer_info .changePas").slideDown(200);
    }
    $(".customer_info .changePas").slideUp(200);
})
$('.customer_info form').on('submit', event => {
    event.preventDefault();
    changeElementTextColorAnimation($('.customer_info button.submit'));
    luu_thong_tin_tai_khoan();
})