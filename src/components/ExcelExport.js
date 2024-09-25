import React from 'react';
import ReactExport from "react-data-export";
import {Button } from 'primereact/button';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class ExcelExport extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        
        
    }

    getImgPath = (col) => {
        if(!col)
        return '';
        let inpstrArr = col.split('/');
        if(inpstrArr.length < 2){
            return '';
        }else {
            return inpstrArr[inpstrArr.length-1];
        }
    }

    render() {

        
        console.log(this.props.data);
        console.log(this.props.collist);
        
        return (
            <ExcelFile element={ <Button style={{marginRight:'.25em'}} icon="pi pi-file-excel"  className="p-button-success" />}>
                
                <ExcelSheet data={this.props.data} name={this.props.name}>
                {/* <ExcelColumn label="active" value="active"/>
                <ExcelColumn label="Img-Path" value="imgpath"/>
                <ExcelColumn label="Cat-Name-Eng" value="eng-name"/>
                <ExcelColumn label="Cat-Descpt-Eng" value="eng-descpt"/>
                <ExcelColumn label="Cat-Name-Tel" value="tel-name"/>
                <ExcelColumn label="Cat-Descpt-Tel" value="tel-descpt"/>
                <ExcelColumn label="Par-Category" value="parent"/>
                <ExcelColumn label="Seq" value="seq"/>
                <ExcelColumn label="Upcoming" value="upcoming"/> */}


                    {this.props.collist.map((it)=>{
                        
                        return <ExcelColumn label={it.header} value={it.value} key={it.header}/>
                        
                        
                        
                    })}
                    
                    
                </ExcelSheet>
               
            </ExcelFile>
        );
    }

    
}

export default ExcelExport;