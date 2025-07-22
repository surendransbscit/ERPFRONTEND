import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RSelect } from "../../Component";
import makeAnimated from "react-select/animated";
import { getActiveOtherWeight } from "../../../redux/thunks/retailMaster";

const OtherWeightDownMulti = ({ register, ...props }) => {
    const animatedComponents = makeAnimated();
    const dispatch = useDispatch();
    const { activeOtherWeightList } = useSelector((state) => state.otherWeightReducer);
    useEffect(() => {
        dispatch(getActiveOtherWeight());
    }, [dispatch]);

    const OtherWeightData = activeOtherWeightList?.map((obj) => {
        const container = {};
        container.label = obj.name;
        container.value = obj.id_other_weight_master;
        return container;
    });

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
                        onChange={(e) => props.SetValue(e)}
                        isMulti
                        options={OtherWeightData}
                    />
                </div>
            </div>
        </>
    );
};

export default OtherWeightDownMulti;
