import React from "react";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button";
import { addProduct } from "API/general";

class AddProduct extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newProducts: [{
                prod_name: "",
                count_unit: "",
                unit_price: ""
            }],
            submitting: false,
        }
    }

    handleItemInputChange = (index, type, value) => {
        let newProducts = this.state.newProducts;
        newProducts[index][type] = value;
        this.setState({newProducts: newProducts});
    }

    addMoreProductRow = () => {
        let newProducts = this.state.newProducts;
        newProducts.push({
            prod_name: "",
            count_unit: "",
            unit_price: ""
        })
        this.setState({newProducts: newProducts});
    }

    importExcel= () => {
        console.log("import Excel")
    }

    removeProductRow = index => {
        let newProducts = this.state.newProducts;
        newProducts.splice(index, 1);
        this.setState({newProducts: newProducts});
    }

    validateProduct = newProducts => {
        let isvalid = true;
        let required = ["prod_name", "count_unit", "unit_price"];
        if(newProducts.length < 1) isvalid = false;
        newProducts.forEach(product => {
            required.forEach(item => {
                if(!product[item] || product[item] ==  "") isvalid = false;
            })
        });
        return isvalid;
    }

    submitAddProducts = () => {
        let newProducts = this.state.newProducts;
        if(this.validateProduct(newProducts)){
            this.setState({submitting: true});
            addProduct(newProducts, (Alert, products) => {
                if(products){
                    this.props.dispatch({type: "UPDATE_PRODUCTS", payload: products});
                    this.setState({
                        newProducts: [],
                        submitting: false,
                    })
                }else{
                    this.setState({submitting: false});
                }
            })
        }else{
            console.log("product not valid!");
        }
    }

    render = () => {
        return (
            <div className="popUpWrapper" style={{display: this.props.visible ? "block" : "none"}}>
                <div className="popUpInner" style={{maxWidth: "650px"}}>
                    <div className="popUpHeader"
                        style={{paddingLeft: "10px", fontWeight: "bold"}}
                    >
                        THÊM SẢN PHẨM
                        <Button
                            color="info" size="sm"
                            onClick={this.importExcel}
                            style={{float: "right", marginRight: "5px", marginTop: "2px"}}
                        >Thêm từ Excel</Button>
                    </div>
                    <div style={{clear: "both"}}></div>
                    <div className="popUpBody">
                        {/* table */}
                        <div className="tbWrapper" style={{margin: "5px"}}>
                            <div className="tbHeader">
                                <div className="tbColumn stt">STT</div>
                                <div className="tbColumn prod_name">Tên sản phẩm</div>
                                <div className="tbColumn count_unit">Đơn vị tính</div>
                                <div className="tbColumn unit_price">Đơn giá (vnd)</div>
                                <div style={{float: "right", margin: "-9px 0px 0px 0px"}}>
                                    <Button
                                        color="rose" size="sm"
                                        onClick={this.addMoreProductRow}
                                    >Thêm dòng</Button>
                                </div>
                            </div>
                            <div className="tbData">
                                {this.state.newProducts.map((item, index) => {
                                    return (
                                        <div className="tbDataItem" key={index + 1}>
                                            <div className="tbColumn stt">{index + 1}</div>
                                            <div className="tbColumn prod_name"><input
                                                value={item.prod_name} onChange={event=>this.handleItemInputChange(index, "prod_name", event.target.value)}
                                                style={{height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                                placeholder="..."
                                            /></div>
                                            <div className="tbColumn count_unit"><input
                                                value={item.count_unit} onChange={event=>this.handleItemInputChange(index, "count_unit", event.target.value)}
                                                style={{height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                                placeholder="..."
                                            /></div>
                                            <div className="tbColumn unit_price"><input
                                                value={item.unit_price} onChange={event=>this.handleItemInputChange(index, "unit_price", event.target.value)}
                                                style={{height: "100%", width: "100%", padding: "3px 50x 3px 5px",margin: "0px 3px 0px 3px", border: "none"}}
                                                placeholder="..."
                                                type="number"
                                            /></div>
                                            <div style={{float: "right", margin: "-9px 16px 0px 0px"}}>
                                                <Button
                                                    color="warning" size="sm"
                                                    onClick={()=>this.removeProductRow(index)}
                                                >Xóa</Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="popUpFooter">
                        <div style={{display: "inline-block", float: "right", marginTop: "-3px"}}>
                            <Button
                                color="rose" size="sm"
                                onClick={this.props.onCancel}
                            >Thoát</Button>
                            <Button
                                color={this.state.submitting ? "default" : "info"} size="sm"
                                style={{marginRight: 5}}
                                onClick={this.state.submitting ? null : this.submitAddProducts}
                            >Thêm</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        
    }
}

export default connect(mapStateToProps)(AddProduct);