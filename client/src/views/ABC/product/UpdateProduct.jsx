import React from "react";
import { connect } from "react-redux";
import store from "redux/store";
import Button from "components/CustomButtons/Button";
import { filterProductBySearchText } from "facilities/facilities";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import AddProduct from "./Component/AddProduct";
import { updateProduct, deleteProduct } from "API/general";

class UpdateProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [...this.props.products],
            tempProducts: [],
            searchText: "",
            pagination: {current: 1, pageSize: 10, selectDisplay: false},
            add_visible: false,
            submitting: false,
        }
    }

    componentDidMount = () => {
        store.subscribe(() => {
            let products = store.getState().products;
            if(products !== this.state.products){
                let tempProducts = [];
                this.state.tempProducts.forEach(item => {
                    for(let i = 0; i < products.length; i++ ){
                        if(products[i].prod_id === item.prod_id){
                            tempProducts.push(item);
                            break;
                        }
                    }
                })
                this.setState({
                    products: [...products],
                    tempProducts: tempProducts,
                });
            }
        })
    }

    handleSearchInputChange = event => {
        this.setState({
            searchText: event.target.value,
            pagination: {...this.state.pagination, current: 1, selectDisplay: false},
        });
    }

    handleItemInputChange = (prod_id, type, value) => {
        let tempProducts = this.state.tempProducts;
        let product = tempProducts.find(item => {
            return item.prod_id == prod_id;
        });
        let productA = this.state.products.find(item => {
            return item.prod_id == prod_id
        });
        if(product && product.prod_id){
            let isEqual = true;
            product[type] = value;
            let compare = ["prod_name", "stock_qty", "count_unit", "unit_price"];
            compare.forEach(item => {
                if(product[item] != productA[item]){
                    isEqual = false;
                }
            })
            if(isEqual){
                let index = tempProducts.indexOf(product);
                tempProducts.splice(index, 1);
            }
        }else{
            product = {...productA};
            product[type] = value;
            tempProducts.push(product);
        }
        this.setState({tempProducts: tempProducts});
    }

    handlePaginationChange = pagination => {
        this.setState({pagination: pagination});
    }

    openAddProductPopUp = () => {
        this.setState({add_visible: true})
    }

    closeAddProductPopUp = () => {
        this.setState({add_visible: false})
    }

    handleUpdateProduct = () => {
        let updatedProducts = this.state.tempProducts;
        if(updatedProducts.length < 1) return;
        this.setState({submitting: true});
        updateProduct(updatedProducts, (Alert, products) => {
            if(products){
                this.setState({
                    tempProducts: [],
                    submitting: false,
                }, () => {
                    this.props.dispatch({type: "UPDATE_PRODUCTS", payload: products});
                })
            }else{
                this.setState({submitting: false});
            }
        })
    }

    handleDeleteProduct = prod_id => {
        this.setState({submitting: true});
        deleteProduct(prod_id, (Alert, products) => {
            if(products){
                this.props.dispatch({type: "UPDATE_PRODUCTS", payload: products});
            }
            this.setState({submitting: false});
        })
    }

    render = () => {
        const { products, searchText, pagination } = this.state;
        const { filterData, NoOfPage } = filterProductBySearchText(products, searchText, pagination);
        if(pagination.current > NoOfPage) this.setState({pagination: {...pagination, current: NoOfPage}})
        let paginationSelect = [];
        for(let i=0; i<NoOfPage; i++){
            paginationSelect.push(
                <div key={i+1} className={i + 1 == pagination.current ? "paginationItem active" : "paginationItem"}
                    onClick={() => this.handlePaginationChange({...this.state.pagination, current: (i+1), selectDisplay: false})}
                >{i + 1}</div>
            )
        }

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
                        color="info" size="sm"
                        style={{float: "right", marginRight: 5}}
                        onClick={()=>this.openAddProductPopUp()}
                    >Thêm sản phẩm</Button>
                </div>
                <div style={{marginTop: 5, padding: "0px 5px 0px 5px"}}>
                    {/* table */}
                    <div className="tbWrapper">
                        <div className="tbHeader">
                            <div className="tbColumn stt">STT</div>
                            <div className="tbColumn prod_name">Tên sản phẩm</div>
                            <div className="tbColumn stock_qty">Tồn kho</div>
                            <div className="tbColumn count_unit">Đơn vị tính</div>
                            <div className="tbColumn unit_price">Đơn giá (vnd)</div>
                            <div style={{float: "right", margin: "-9px 0px 0px 0px"}}>
                                <Button
                                    color={this.state.tempProducts.length > 0 ? "rose" : "rose"} size="sm"
                                    onClick={!this.state.submitting ? () => {this.handleUpdateProduct()} : null}
                                >Cập nhật</Button>
                            </div>
                        </div>
                        <div className="tbData">
                            {filterData.length < 1 ? <div className="tbDataItem" style={{textAlign: "center", fontSize: 16}}>Không có sản phẩm nào</div> : null}
                            {filterData.map((actual_item, index) => {
                                let color = "";
                                let item = this.state.tempProducts.find(temp_item => {return temp_item.prod_id == actual_item.prod_id});
                                if(item){
                                    color = "red";
                                }else{
                                    item = actual_item;
                                }
                                return (
                                    <div className="tbDataItem" key={item.prod_id}>
                                        <div className="tbColumn stt">{index + 1}</div>
                                        <div className="tbColumn prod_name"><input
                                            value={item.prod_name} onChange={event=>this.handleItemInputChange(item.prod_id, "prod_name", event.target.value)}
                                            style={{color: color, height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                            placeholder="..."
                                        /></div>
                                        <div className="tbColumn stock_qty"><input
                                            value={item.stock_qty} onChange={event=>this.handleItemInputChange(item.prod_id, "stock_qty", event.target.value)}
                                            style={{color: color, height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                            placeholder="..."
                                            type="number"
                                        /></div>
                                        <div className="tbColumn count_unit"><input
                                            value={item.count_unit} onChange={event=>this.handleItemInputChange(item.prod_id, "count_unit", event.target.value)}
                                            style={{color: color, height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                            placeholder="..."
                                        /></div>
                                        <div className="tbColumn unit_price"><input
                                            value={item.unit_price} onChange={event=>this.handleItemInputChange(item.prod_id, "unit_price", event.target.value)}
                                            style={{color: color, height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                            placeholder="..."
                                            type="number"
                                        /></div>
                                        <div style={{float: "right", margin: "-9px 15px 0px 0px"}}>
                                            <Button
                                                color="warning" size="sm"
                                                onClick={!this.state.submitting ? () => {this.handleDeleteProduct(item.prod_id)} : null}
                                            >Xóa</Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="paginationBar" style={{marginTop: "5px"}}>
                        <div className="paginationFloatRightWrapper">
                            <div className="paginationTotalItem">Tổng: <span>{filterData.length}</span> sản phẩm</div>
                            <div className="paginationItem prev"
                                style={this.state.pagination.current == 1 ? {backgroundColor: "#efefef", cursor: "text"} : null}
                                onClick={this.state.pagination.current == 1 ? null : () => this.handlePaginationChange({current: this.state.pagination.current - 1})}
                            ><NavigateBefore/></div>
                            <div className="paginationItem"
                                onClick={() => this.handlePaginationChange({...this.state.pagination, selectDisplay: !this.state.pagination.selectDisplay})}
                            >{this.state.pagination.current}</div>
                            <div className="paginationItem next"
                                style={this.state.pagination.current == NoOfPage ? {backgroundColor: "#efefef", cursor: "text"} : null}
                                onClick={this.state.pagination.current == NoOfPage ? null : () => this.handlePaginationChange({current: this.state.pagination.current + 1})}
                            ><NavigateNext/></div>
                            <div className="paginationItem pageSize" style={{cursor: "text"}}>
                                <select name="pageSize"
                                    onChange={event => this.handlePaginationChange({...this.state.pagination, pageSize: event.target.value})}
                                    value={this.state.pagination.pageSize}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                    <option value="0">Tất cả</option>
                                </select>
                                /trang
                            </div>
                        </div>
                    </div>
                    <div className="paginationSelect" style={{display: this.state.pagination.selectDisplay == false ? "none" : "block"}}>
                        <div className="paginationFloatRightWrapper">
                            {paginationSelect}
                        </div>
                    </div>
                </div>
                <AddProduct
                    visible={this.state.add_visible}
                    onCancel={this.closeAddProductPopUp}
                />
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(UpdateProduct);