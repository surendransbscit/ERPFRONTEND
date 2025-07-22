import React, { useEffect, useState } from "react";
import Head from "../../../../layout/head/Head";
import { toastfunc } from "../../../../components/sds-toast-style/toast-style";
import Content from "../../../../layout/content/Content";
import Select from "react-select";
import {PreviewCard, SaveButton, TextInputField } from "../../../../components/Component";
import { Col, Row } from "../../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { BranchDropdown } from "../../../../components/filters/retailFilters";
import { useBranches, useContainers } from "../../../../components/filters/filterHooks";
import IsRequired from "../../../../components/erp-required/erp-required";
import { assignTagToContainer, getTagDetailsByCode } from "../../../../redux/thunks/inventory";
import PreviewTable from "../../../../components/sds-table/PreviewTable";

const TaggingContainerForm = () => {
  
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: isSubmitting } = useSelector((state) => state.tagReducer);
  const { branches } = useBranches();
  const { containers } = useContainers();
  const [idBranch, setIdBranch] = useState("");
  const [idContainer, setIdContainer] = useState("");
  const [filterTag, setFilterTag] = useState(null);
  const [addFormData, setAddFormData] = useState([]);

  const containerOptions = containers?.map((item) => ({
    value: item.id_container,
    label: item.container_name,
  }));

  const columns = [
    { header: "Tag No", accessor: "tag_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Pcs", accessor: "tag_pcs", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "tag_gwt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "tag_lwt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "tag_nwt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Stn Wt", accessor: "tag_stn_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Dia Wt", accessor: "tag_dia_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
  ];

  const getTagDetails = async (tagCode) => {
    try {
      let requestData = { tagCode: tagCode, idBranch: idBranch };
      let response = {};
      response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      const tagDetails = addFormData?.filter( (result) => result.tag_code !== "" && result.tag_code === tagCode);
      if (tagDetails.length > 0) {
        toastfunc("Tag Code already exists");
        setFilterTag("");
      }else{
        setAddFormData((prevData) => [...prevData, response]);
        setFilterTag("");
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleTagSearch = async () => {
    if (filterTag === null || filterTag==="") {
      toastfunc("Please Enter The Tag Code");
    } 
    else if (idBranch === null || idBranch === "") {
      toastfunc("Please Select Branch");
    } 
    else if (idContainer === null || idContainer==="") {
      toastfunc("Please Select Container");
    }
    else {
      await getTagDetails(filterTag);
    }
  };

  useEffect(() => {
    if (filterTag && filterTag?.length > 5) {
      handleTagSearch();
    }
  }, [filterTag]);

  const deleteTagContainerItem = (idx) => {
      const updatedFormData = [...addFormData];
      updatedFormData.splice(idx, 1);
      setAddFormData(updatedFormData);
  };

  const onClickSave = async () => {
    const tag_container_details = addFormData?.map((obj) => {
      const container = {};
      container.tag = obj.tag_id;
      container.from_branch = obj.container;
      container.to_branch = obj.tag_current_branch;
      container.from_container = obj.container;
      container.to_container = idContainer.value;
      container.transaction_type = 1;
      container.status = 1;
      return container;
    });
    const adddata = {
      tag_container_details,
    };
    try {
      await dispatch(assignTagToContainer(adddata)).unwrap();
      setFilterTag(null);
      setAddFormData([]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <React.Fragment>
      <Head title="Assign Tag Container" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={isSubmitting || addFormData?.length <= 0}
                size="md"
                color="primary"
                onClick={onClickSave}
              >
                {isSubmitting ? "Saving" : "Save"}
              </SaveButton>
              <Button
                disabled={isSubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/inventory/tag/list`)}
              >
                Cancel
              </Button>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="form-group row g-4 form-control-sm">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                  <div className="form-control-wrap">
                    <BranchDropdown
                      register={register}
                      id={"idBranch"}
                      branches={branches}
                      selectedBranch={idBranch}
                      onBranchChange={setIdBranch}
                      isRequired={true}
                      clearErrors={clearErrors}
                      setValue={setValue}
                      message={errors.branch && "Branch is Required"}
                    />
                  </div>
                </div>
              </Col>
             
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="container">
                    Container
                    <IsRequired />
                  </label>
                  <div className="form-control-wrap">
                    <Select
                      value={addFormData?.to_container}
                      onChange={(e) => {
                       setIdContainer(e);
                      }}
                      options={containerOptions}
                      placeholder="Select container"
                      id={`to_container`}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }) }}
                    />
                    <input type="hidden" value={addFormData?.to_container} {...register(`to_container`)} />
                  </div>
                </div>
              </Col>
              
              <Col lg={3}>
                <div className="form-control-wrap">
                  <label className="form-label" htmlFor="filterTag">
                    Tag
                    <IsRequired />
                  </label>
                  <div className="input-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"filterTag"}
                      placeholder="Tag Code"
                      maxLength={255}
                      value={filterTag}
                      SetValue={setFilterTag}
                      clearErrors={clearErrors}
                      message={errors?.filterTag && "Tag is Required"}
                    />
                    <div className="input-group-append" style={{ height: "29px" }}>
                      <Button outline color="primary" className="btn-dim" onClick={handleTagSearch}>
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row md={12}>
              <PreviewTable
                columns={columns}
                data={addFormData}
                onDelete={deleteTagContainerItem}
                onEdit={""}
              />
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default TaggingContainerForm;
