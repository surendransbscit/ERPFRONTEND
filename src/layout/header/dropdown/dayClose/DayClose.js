import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toastsuccess } from "../../../../components/sds-toast-style/toast-style";
import DayCloseModel from "../../../../components/modals/DayCloseModel";
import { dayClose } from "../../../../redux/thunks/retailMaster";
import { useBillSettingContext } from "../../../../contexts/BillSettingContext";
import { Navigate } from "react-router";

const DayClose = () => {
    const {
        register,
        handleSubmit,
        clearErrors,
        setValue,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const [openDayCloseModal, setOpenDayCloseModal] = useState(false);
    const toggle = () => setOpenDayCloseModal(!openDayCloseModal);
    const [idBranch, setIdBranch] = useState("");
    const { billSettingType } = useBillSettingContext();
    const DayClose = async () => {
        const adddata = {
            id_branch: idBranch
        };
        try {
            await dispatch(dayClose(adddata)).unwrap();
            toggle();
            toastsuccess("Day closed  successfully");
            Navigate(`${process.env.PUBLIC_URL}/`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                className="user-dropdown"
                onClick={handleSubmit(toggle)}
            >
                <div className="user-info d-none d-md-block">
                    <div style={{ "fontSize": "20px !important", "fontWeight": "900", "cursor": "pointer","color":(billSettingType==1 ? "white" : "red") }}>DAY CLOSE</div>
                </div>

            </div>
            <DayCloseModel
                modal={openDayCloseModal}
                toggle={toggle}
                title={"Day Close"}
                name={"Day Close"}
                clickAction={DayClose}
                idBranch={idBranch}
                setIdBranch={setIdBranch}
            />
        </>
    );
};

export default DayClose;
