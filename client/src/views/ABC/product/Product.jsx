import React from "react";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button";
import store from "redux/store";
import { filterProductBySearchText } from "utils/utilities";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import ImportWarehouse from "./Component/ImportWarehouse";

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            products: [...this.props.products],
            searchText: "",
            pagination: {current: 1, pageSize: 10, selectDisplay: false},
            choosen: [],
        }
    }

    componentDidMount = () => {
        store.subscribe(() => {
            let products = store.getState().products;
            if(products !== this.state.products)
                this.setState({products: products});
        })
    }

    handleSearchInputChange = event => {
        this.setState({
            searchText: event.target.value,
            pagination: {...this.state.pagination, current: 1, selectDisplay: false},
        });
    }

    handleAllCheckBoxChange = event => {
        if(event.target.checked === false){
            this.setState({choosen: []});
        }else{
            let choosen = [];
            this.state.products.forEach(item => {
                choosen.push(item.prod_id);
            });
            this.setState({choosen: choosen});
        };
    }

    handleItemCheckBoxChange = (event, prod_id) => {
        console.log(event);
    }

    handlePaginationChange = pagination => {
        this.setState({
            pagination: {...this.state.pagination, ...pagination}
        });
    }

    render = () => {
        const { products, searchText, pagination } = this.state;
        const { filterData, NoOfPage, TotalItem, StartIndex } = filterProductBySearchText(products, searchText, pagination);
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
                        color="rose" size="sm"
                        style={{float: "right", marginRight: 5}}
                    >Tạo hóa đơn</Button>
                    <Button
                        color="info" size="sm"
                        style={{float: "right", marginRight: 5}}
                    >Nhập kho</Button>
                </div>
                <div style={{marginTop: 5, padding: "0px 5px 0px 5px"}}>
                    {/* table */}
                    <div className="tbWrapper">
                        <div className="tbHeader">
                            <div className="tbColumn stt">STT</div>
                            <div className="tbColumn prod_name">Tên sản phẩm</div>
                            <div className="tbColumn check_box">
                                <input type="checkbox"
                                    onChange={event => this.handleAllCheckBoxChange(event)}
                                />
                            </div>
                            <div className="tbColumn stock_qty">Tồn kho</div>
                            <div className="tbColumn count_unit">Đơn vị tính</div>
                            <div className="tbColumn unit_price">Đơn giá (vnd)</div>
                        </div>
                        <div className="tbData">
                            {filterData.length < 1 ? <div className="tbDataItem" style={{textAlign: "center", fontSize: 16}}>Không có sản phẩm nào</div> : null}
                            {filterData.map((item, index) => {
                                let isCheck = false;
                                this.state.choosen.forEach(id_item => {
                                    if(id_item === item.prod_id) isCheck = true;
                                })
                                return (
                                    <div className="tbDataItem" key={item.prod_id}>
                                        <div className="tbColumn stt">{StartIndex + index + 1}</div>
                                        <div className="tbColumn prod_name">{item.prod_name}</div>
                                        <div className="tbColumn check_box">
                                            <input type="checkbox" checked={isCheck}
                                                onChange={event => this.handleItemCheckBoxChange(event, item.prod_id)}
                                            />
                                        </div>
                                        <div className="tbColumn stock_qty">{item.stock_qty}</div>
                                        <div className="tbColumn count_unit">{item.count_unit}</div>
                                        <div className="tbColumn unit_price">{item.unit_price}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="paginationBar" style={{marginTop: "5px"}}>
                        <div className="paginationFloatRightWrapper">
                            <div className="paginationTotalItem">Tổng: <span>{TotalItem}</span> sản phẩm</div>
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
                                    <option value="15">15</option>
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
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(Product);