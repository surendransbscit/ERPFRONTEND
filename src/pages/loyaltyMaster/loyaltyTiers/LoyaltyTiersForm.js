import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import {
  createLoyaltyTier,
  getLoyaltyTierById,
  updateLoyaltyTierById,
} from "../../../redux/thunks/loyaltyMaster";
import ReactQuill from "react-quill";

const LoyaltyTiersForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.LoyaltyTierReducer
  );
  const { loyaltyTierInfo } = useSelector((state) => state.LoyaltyTierReducer);

  const [name, setName] = useState("");
  const [minLifeSpend, setMinLifeSpend] = useState(0);
  const [multiplier, setMultiplier] = useState();
  const [description, setDescription] = useState();

  const [active, setActive] = useState(true);

  const { transformWord } = useContext(WordTransformerContext);

  const postData = async () => {
    const adddata = {
      tier_name: name,
      min_lifetime_spend: minLifeSpend,
      multiplier,
      benefits_desc: description,
    };
    try {
      await dispatch(createLoyaltyTier(adddata)).unwrap();
      toastsuccess("Loyalty Tier Added successfully");
      navigate(`${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      tier_name: name,
      min_lifetime_spend: minLifeSpend,
      multiplier,
      benefits_desc: description,
    };
    await dispatch(createLoyaltyTier(adddata));
    if (isError === false) {
      toastsuccess("Loyalty Tier Added successfully");
      setName("");
      setMinLifeSpend(0);
      setMultiplier("");
      setDescription("");

    }
  };

  const handleChange = (value) => {
    setDescription(value);
  };

  useEffect(() => {
    id !== undefined && dispatch(getLoyaltyTierById(id));
  }, [dispatch, id]);

  useEffect(() => {
    loyaltyTierInfo != undefined &&
      (setName(loyaltyTierInfo?.tier_name),
      setMinLifeSpend(loyaltyTierInfo?.min_lifetime_spend),
      setMultiplier(loyaltyTierInfo?.multiplier),
      setDescription(loyaltyTierInfo?.benefits_desc),
      reset());
  }, [loyaltyTierInfo, reset]);

  const putData = async () => {
    const adddata = {
      tier_name: name,
      min_lifetime_spend: minLifeSpend,
      multiplier,
      benefits_desc: description,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateLoyaltyTierById(reduxData));
    if (isError === false) {
      toastsuccess("Loyalty Tier Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers/list`);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Loyalty Tier"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/loyalty_master/loyalty_tiers/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Name <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Tier Name"
                    value={name}
                    SetValue={(value) => {
                      setName(value);
                      clearErrors("name");
                    }}
                    message={errors.name && "Tier name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="minLifeSpend">
                    Min Life Spend
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"minLifeSpend"}
                    placeholder="Min Life Spend"
                    value={minLifeSpend}
                    SetValue={setMinLifeSpend}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="multiplier">
                    Multiplier
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"multiplier"}
                    placeholder="Multiplier"
                    value={multiplier}
                    SetValue={(value) => {
                      setMultiplier(value);
                      clearErrors("multiplier");
                    }}
                    message={errors.multiplier && "multiplier is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="g-3 align-center ">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="bannerName">
                    Description
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <ReactQuill value={description} onChange={handleChange} />
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default LoyaltyTiersForm;
