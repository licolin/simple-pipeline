import React, { useState } from "react";
import { CascadeSelect, CascadeSelectChangeEvent } from 'primereact/cascadeselect';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

interface CountryState {
    name: string;
    code: string;
}

interface Country {
    name: string;
    // code: string;
    states: CountryState[];
}

interface BasicDemoProps {
    data: Country[];
    node_id:string,
    onSelect: (selectedValue: string, node_id: string, name: string, in_out: string, param_type: string, node_real_id: string) => void;
    name:string,
    in_out:string,
    param_type:string,
    node_real_id:string,
    default_value:string,
}

// @ts-ignore
export default function BasicDemo({data,node_id,onSelect,name,in_out,param_type,node_real_id,default_value}:BasicDemoProps) {
    const [selectedCountryState, setSelectedCountryState] = useState(default_value);
    console.log("setSelectedCountryState "+selectedCountryState);
    function handleChanges(e: CascadeSelectChangeEvent){
        setSelectedCountryState(e.value.code+"."+e.value.name);
        console.log(e.value);
        console.log("params "+name);
        onSelect(e.value.code+"."+e.value.name,node_id,name,in_out,param_type,node_real_id);
    }

    return (
        <div className="card">
            <style>{`
                .p-cascadeselect-item-text {
                    font-size: 10px;
                    padding: 0.5px;
                }
                .p-cascadeselect-item {
                    padding: 1px;
                }
            `}</style>
            <CascadeSelect value={selectedCountryState}
                           onChange={(e: CascadeSelectChangeEvent) => handleChanges(e)}
                           options={data}
                           optionLabel="name" optionGroupLabel="name" optionGroupChildren={['states']}
                           className="text-xs" breakpoint="60px" placeholder="参数选择"
                           style={{minWidth: '', fontSize: "12px"}}/>
        </div>
    )
}