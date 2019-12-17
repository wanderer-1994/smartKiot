import React from "react";
import { connect } from "react-redux";
import store from "redux/store";
import Button from "components/CustomButtons/Button";

class ImportWarehouse extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [...this.props.products],
            addedQty: [], // [{prod_id: 1, qty: 2}, {prod_id: 4, qty: 9}]
            searchText: "",
            pagination: {current: 1, pageSize: 10},
        }
    }

    componentDidMount = () => {
        let fakeData = [
            {
                prod_id: 1,
                prod_name: "Vít",
                count_unit: "10pcs",
                unit_price: 20000,
            },
            {
                prod_id: 2,
                prod_name: "Búa",
                count_unit: "1pcs",
                unit_price: 50000,
            }
        ];
        this.setState({products: fakeData});

        store.subscribe(() => {
            let products = store.getState().products;
            if(products !== this.state.products)
                this.setState({products: [...products]});
        })
    }

    handleSearchInputChange = event => {
        this.setState({
            searchText: event.target.value,
            pagination: {...this.state.pagination, current: 1}
        });
    }

    handleProductInputChange = (event, prod_id, field) => {
        console.log(event, prod_id, field);
    }

    render = () => {
        const filterData = this.state.products;

        return (
            <div className="PageWrapper0">
                <div className="headerWrapper">
                    <input
                        className="searchInput"
                        style={{color: "red", borderColor: "green"}}
                        type="text"
                        value={this.state.searchText}
                        placeholder="Tìm sản phẩm..."
                        onChange={event => this.handleSearchInputChange(event)}
                    />
                    <Button
                        color="rose" size="sm"
                        style={{float: "right", marginRight: 5}}
                    >Nhập kho</Button>
                </div>
                <div style={{marginTop: 5, padding: "0px 5px 0px 5px"}}>
                    <div className="tbWrapper">
                        <div className="tbHeader">
                            <div className="tbColumn stt">STT</div>
                            <div className="tbColumn prod_name">Tên sản phẩm</div>
                            <div className="tbColumn stock_qty">Tồn kho</div>
                            <div className="tbColumn count_unit">Đơn vị tính</div>
                            <div className="tbColumn unit_price">Đơn giá (vnd)</div>
                        </div>
                        <div className="tbData">
                            {filterData.length < 1 ? <div className="tbDataItem" style={{textAlign: "center", fontSize: 16}}>Không có sản phẩm nào</div> : null}
                            {filterData.map((item, index) => {
                                return (
                                    <div className="tbDataItem" key={item.prod_id}>
                                        <div className="tbColumn stt">{index + 1}</div>
                                        <div className="tbColumn prod_name">{item.prod_name}</div>
                                        <div className="tbColumn stock_qty">{item.stock_qty}</div>
                                        <div className="tbColumn count_unit">{item.count_unit}</div>
                                        <div className="tbColumn unit_price">{item.unit_price}</div>
                                        <div className="tbColumn import_qty"><input
                                            value={item.import_qty} onChange={event=>this.handleItemInputChange(item.prod_id, event.target.value)}
                                            style={{height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                            placeholder="..."
                                            type="number"
                                        /></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(ImportWarehouse);