function convertTimeStamp(timeStamp){
    let date = new Date(timeStamp);
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    if(d < 10) d = "0" + d;
    if(m < 10) m = "0" + m;
    return `${y}-${m}-${d}`;
}

function unifyOrders(ori_orders, ori_s_orders){
    let orders = [...ori_orders];
    let s_orders = [...ori_s_orders];
    s_orders.forEach(item => {
        for(let i = 0; i < orders.length; i++){
            if(orders[i].order_id == item.order_id){
                if(!orders[i].s_orders){
                    orders[i].s_orders = [item];
                }else{
                    orders[i].s_orders.push(item);
                }
                break;
            }
        }
    })
    return orders;
}

module.exports = {
    convertTimeStamp,
    unifyOrders
}