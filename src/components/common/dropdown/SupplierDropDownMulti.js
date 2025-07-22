import React, { useEffect } from "react";
import { RSelect } from "../../Component";
import makeAnimated from "react-select/animated";
import { useProducts, useSupplierFilter } from "../../filters/filterHooks";

const SupplierDropDownMulti = ({ register, ...props }) => {
    const animatedComponents = makeAnimated();
    const { supplier } = useSupplierFilter();


    const allOption = { label: "All", value: "all" };

    let productData = [];
    if (supplier.length > 0) {
        productData = supplier?.map((obj) => {
            return {
                label: obj.supplier_name,
                value: obj.id_supplier,
            };
        });
    }

    const isAllSelected = () => {
        return props?.value?.length === productData.length;
    };

    const allOptions = isAllSelected() ? productData : [allOption, ...productData];

    const handleChange = (selectedOptions) => {
        if (selectedOptions.some((option) => option.value === "all")) {
            props.SetValue(productData);
        } else {
            props.SetValue(selectedOptions);
        }
    };

    return (
        <>
            {props.label && (
                <label className="form-label" htmlFor="site-name">
                    {props?.label}
                </label>
            )}
            <div className="form-control-wrap">
                <div className="form-control-select">
                    <RSelect
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={props?.value}
                        onChange={handleChange}
                        isMulti
                        options={allOptions}
                    />
                </div>
            </div>
        </>
    );
};

export default SupplierDropDownMulti;
