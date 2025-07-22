import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, NumberInputField, UserAvatar } from "../../../components/Component";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import { BranchDropdown, LotDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useActiveLot, useMcVaSetiings, useProductSections, useSubDesigns, useDesigns, useProducts, usePurities, useCurrentMetalRate, useMetalPurityRate, useTaxGroup, useCategories, useSize, useUom } from "../../../components/filters/filterHooks";
import { Button, Label } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import useTaggingFormHandling from "./useTaggingFormHandling";
import SalesForm from "../../../components/common/salesForm/salesForm";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import IsRequired from "../../../components/erp-required/erp-required";
import DeleteModal from "../../../components/modals/DeleteModal";
import { useHotkeys } from "react-hotkeys-hook";
import { v4 as uuid } from "uuid";
import TaggingTable from "./taggingTable";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { getLogProductDetails } from "../../../redux/thunks/inventory";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import TagLotBalanceModal from "../../../components/modals/TagLotBalanceModal";
import { isUndefined } from "../../../components/common/calculations/ErpCalculations";
const TagForm = () => {
  const dispatch = useDispatch()
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const methods = useForm();
  const salesFormRef = useRef(null); // Child component reference
  const tableRef = useRef(null); // Child component reference
  const tableFormRef = useRef(null); // Child component reference
  const { lot } = useActiveLot();
  const { branches } = useBranches();
  const [branchLot, setBranchLot] = useState([]);
  const [idLotInwardDetail, setIdLotInwardDetail] = useState(0);
  const [singleLotItem, setSingleLotItems] = useState({});
  const [purchaseTouch, setPurchaseTouch] = useState(0);
  const [purchaseWastage, setPurchaseWastage] = useState(0);
  const [pureWeightCalType, setPureWeightCalcType] = useState(1);
  const [purchaseMcType, setPurchaseMcType] = useState(1);
  const [purchaseMc, setPurchaseMc] = useState(0);
  const [purchaseRateType, setPurchaseRateType] = useState(1);
  const [purchaseRate, setPurchaseRate] = useState(0);
  const [lotItemDetails, setLotItemDetails] = useState([]);
  const [totalTags, setTotalTags] = useState(1);
  const [modal, SetModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");
  const [deleteModal, SetDeleteModal] = useState(false);
  const [checkWeightModal, SetCheckWeightModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [triggerTableReset, setTriggerTableReset] = useState(false);
  const deleteToggle = () => SetDeleteModal(!deleteModal);
  const checkWeightToggle = () => SetCheckWeightModal(!checkWeightModal);
  const [previewData, setPreviewData] = useState([]);
  const {
    idBranch,
    setIdBranch,
    tagBranch,
    setTagBranch,
    lotId,
    setLotId,
    isSubmitted,
    onClickSave,
    tagDetails,
    tagListCol,
    fetchLotBalanceDetails,
    balancePcs,
    balanceWeight,
    tagImages,
    SetTagImages,
    deleteTagById,
    handleEdit,
    tagEditData,
    tagId,
    setTagId,
    getTagDetails,
    onClickBulkSave,
    setBalanceWeight,
    setBalancePcs,
    setTagDetails,
    item,
    setItem,
    settings
  } = useTaggingFormHandling(); //Custom hook for Handling Tag Form
  const [maxPiece, setMaxPiece] = useState(balancePcs);
  const [maxGrossWeight, setMaxGrossWeight] = useState(balanceWeight);
  const [maxWeightTolarance, setMaxWeightTolarance] = useState(0);

  const [supplier, setSupplier] = useState();
  const { mcVaSetiings } = useMcVaSetiings();
  const { purities } = usePurities();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { size } = useSize();
  const { uom } = useUom();
  const { sections } = useProductSections();
  const { metalRates } = useCurrentMetalRate();
  const { metalPurityRate } = useMetalPurityRate();
  const { taxGroup } = useTaxGroup();
  const { categories } = useCategories();
  const { lotProductDetails } = useSelector((state) => state.lotReducer);
  // console.log(lotProductDetails);

  const lotProductDetailsColumn = [
    { header: "Product Name", accessor: "product_name", textAlign: "center" },
    { header: "Pcs", accessor: "lot_pcs", textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "lot_gwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Nwt", accessor: "lot_nwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Stone Wt", accessor: "lot_stn_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Dia Wt", accessor: "lot_dia_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Pcs", accessor: "tag_pcs", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Gwt", accessor: "tag_gwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Lwt", accessor: "tag_lwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Nwt", accessor: "tag_nwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Stone Wt", accessor: "tag_stn_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Dia Wt", accessor: "tag_dia_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Pcs", accessor: "balance_pcs", textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "balance_gwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Lwt", accessor: "balance_lwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Nwt", accessor: "balance_nwt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Stone Wt", accessor: "balance_stn_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },
    { header: "Dia Wt", accessor: "balance_dia_wt", textAlign: "right", isTotalReq: true, decimal_places: 3 },


  ]


  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
      divided_by_value: val.divided_by_value,
    }));
  }
  const toggle = () => {
    SetModal(!modal);
  };



  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDropChange = async (acceptedFiles, set) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles?.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    set(filesWithPreview);
  };

  const handleCheckWeight = () => {
    if (lotId == undefined || lotId == null || lotId == "") {
      toastfunc("Select Lot to check weight.")
    }
    else {
      checkWeightToggle()
    }
  }

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/inventory/lot/list`);
    }
  }, [add, id, navigate]);

  const selectedCatalog = (data) => {
    if (
      lotId !== null &&
      lotId !== "" &&
      data.selectedProduct !== null &&
      (settings?.is_design_and_pur_req_in_lot == "1" ? data.selectedDesign !== null &&
        (settings?.is_sub_design_req === "1" ? data.selectedSubDesign !== null : true) : true)
    ) {
      const lotDetails = lot.find((val) => val.lot_no === lotId);
      console.log(lotDetails, 'lotDetails')
      // let itemDetails = lotDetails.item_details.find(
      //   (val) =>
      //     val.id_product === data.selectedProduct &&
      //     (settings?.is_design_and_pur_req_in_lot == "1" ?
      //       (val.id_design === data.selectedDesign || val.id_design == null) &&
      //       (val.id_sub_design === data.selectedSubDesign || val.id_sub_design == null) : true)
      // );
      // console.log(itemDetails, 'itemDetails')
      if (data?.idLotInwardDetail != undefined) {
        console.log(data.idLotInwardDetail,"idLotInwardDetail");
        setIdLotInwardDetail(data.idLotInwardDetail);
      }
    }
  };

  useEffect(() => {
    if (idBranch !== "" && idBranch !== null) {
      let lotInfo = lot.filter((val) => val.id_branch === idBranch);
      setBranchLot(lotInfo);
      console.log(branchLot);
    }
    console.log(idBranch, lot, "LOT");
  }, [idBranch,lot]);



  useEffect(() => {
    if (lotId !== "" && lotId !== null) {
      let selectedLotDetail = lot.find((val) => val.lot_no === lotId);
      setLotItemDetails(selectedLotDetail.item_details);
      if(selectedLotDetail.item_details.length==1){
          let lotItemDetails = selectedLotDetail.item_details[0];
          setIdLotInwardDetail(lotItemDetails.id_lot_inward_detail);
          setSingleLotItems(lotItemDetails);
      }
    }
  }, [lotId]);

  useEffect(() => {
    const getLotBalance = async () => {
      if (idLotInwardDetail !== 0) {
        const lotBalanceDetails = await fetchLotBalanceDetails(idLotInwardDetail);
        if (lotBalanceDetails) {
          let lotWtTolarance = 0
          if (lotBalanceDetails.id_metal == 1){
             lotWtTolarance = isUndefined(settings?.gold_lot_wt_tolarance)
          }else{
             lotWtTolarance = isUndefined(settings?.silver_lot_wt_tolarance)
          }
          setMaxWeightTolarance(lotWtTolarance);
          setMaxPiece(lotBalanceDetails.balance_pcs);
          setMaxGrossWeight(lotBalanceDetails.balance_gwt);
          setPurchaseTouch(lotBalanceDetails.purchase_touch);
          setPurchaseWastage(lotBalanceDetails.purchase_va);
          setPureWeightCalcType(lotBalanceDetails.pure_wt_cal_type);
          setPurchaseMcType(lotBalanceDetails.purchase_mc_type);
          setPurchaseMc(lotBalanceDetails.purchase_mc);
          setPurchaseRateType(lotBalanceDetails.purchase_rate_type);
          setPurchaseRate(lotBalanceDetails.purchase_rate);
          setItem(lotBalanceDetails);
        }
      }
    };
    getLotBalance();
    console.log(idLotInwardDetail,"idLotInwardDetailChanged");
  }, [idLotInwardDetail]);

  useEffect(() => {
    if (parseInt(totalTags) > 1 && item) {

      let pcs = parseInt(parseInt(item.balance_pcs) / parseInt(totalTags))
      let wt = parseFloat(parseFloat(item.balance_gwt) / parseInt(totalTags))
      setMaxPiece(pcs);
      setMaxGrossWeight(parseFloat(wt).toFixed(3));



      if (pcs < 1) {
        toastfunc("Invalid Pcs");
        setTotalTags(1);

      } else if (wt < 0) {
        toastfunc("Invalid Wt");
        setTotalTags(1);
      }

    } else {
      if (item) {
        let prev = tagDetails.filter((val) => val?.isNotSaved === true && val.tag_lot_inward_details == idLotInwardDetail);
        console.log(prev,"prev","idLotInwardDetail");
        if (prev.length > 0) {
          let usedPcs = prev.reduce((sum, items) => sum + parseFloat(items.tag_pcs), 0);
          let usedGwt = prev.reduce((sum, items) => sum + parseFloat(items.tag_gwt), 0);
          let maxPcs= parseFloat(item.balance_pcs) - parseFloat(usedPcs);
          let maxGwt= parseFloat(item.balance_gwt) - parseFloat(usedGwt);
          console.log("balance : ", maxPcs, maxGwt, usedGwt)
          setMaxPiece(maxPcs);
          setMaxGrossWeight(maxGwt);
        }else{
          setMaxPiece(item.balance_pcs);
          setMaxGrossWeight(item.balance_gwt);
          console.log(item.balance_pcs,item,"balance_pcs");
        }
      }

    }
    if (item) {
      setBalancePcs(item.balance_pcs)
      setBalanceWeight(item.balance_gwt)
    }
    console.log("balance", balancePcs, totalTags, balanceWeight)

  }, [totalTags, item]);

  const handleSave = () => {

    if (salesFormRef.current) {
      if (totalTags > 1) {
        handleAddToPreview();
      } else {
        let prev = tagDetails.filter((val) => val?.isNotSaved === true)
        console.log(tableFormRef, tableFormRef?.current)
        if (prev.length > 0) {
          tableFormRef.current.validate().then((isValid) => {
            if (isValid) {
              onClickBulkSave(prev, tagId, setTagDetails);
              setTotalTags(1);
              if(tableFormRef.current){
                tableFormRef.current.resetForm();
              }
            } else {
              console.log("Form validation failed.");
            }
          });

        } else {
          salesFormRef.current.submit();
        }
      }
    }
  //  setTabIndex(4);
  };

  const resetForm = () => {
    if (salesFormRef.current) {
      salesFormRef.current.resetForm();
    }
  };
  const resetLotForm = () => {
    if (salesFormRef.current) {
      salesFormRef.current.resetForm(2);
    }
  };
  const handleAddToPreview = () => {
    if (salesFormRef?.current) {
      salesFormRef.current.validate().then((isValid) => {
        if (isValid) {
          const formData = salesFormRef.current.getValues(); // Get form data from SalesForm component
          console.log(formData, "formData")
          const duplicatedTags = Array?.from({ length: totalTags }, (_, i) => ({
            ...getTagDetails(formData),
            product_name: formData.productName,
            design_name: formData.designName,
            sub_design_name: formData.subDesignName,
            tagId: uuid(), // Unique tag ID for each duplicate
            index: i + 1, // Optional: Index of the tag for clarity
            isNotSaved: true,
            tag_lot_inward_details: idLotInwardDetail,
          }));
          console.log(duplicatedTags)
          setTagDetails(duplicatedTags); // Add the new entries to preview data
          setTotalTags(1);
          resetForm();
        } else {
          console.log("Form validation failed.");
        }
      });

    }
  };

  
  const handleAddToPrev = () => {
    if (salesFormRef?.current) {
      salesFormRef.current.validate().then((isValid) => {
        if (isValid) {
          const formData = salesFormRef.current.getValues(); // Get form data from SalesForm component
          console.log(formData, "formData")
          const duplicatedTags = {
            ...getTagDetails(formData),
            product_name: formData.productName,
            design_name: formData.designName,
            sub_design_name: formData.subDesignName,
            tagId: uuid(), // Unique tag ID for each duplicate
            isNotSaved: true,
            tag_lot_inward_details: idLotInwardDetail,
          };
          console.log(duplicatedTags)
          setTagDetails((prevData) => [...prevData,duplicatedTags]); // Add the new entries to preview data
          setIdLotInwardDetail(0);
          resetForm();
        } else {
          console.log("Form validation failed.");
        }
      });

    }
  };

  // While change the lot need to reset the child component form
  const handleLotChange = (newLotId) => {
    setLotId(newLotId);
    dispatch(getLogProductDetails({ "lot_id": newLotId }))
    const lotDetails = lot.find((val) => val.lot_no === newLotId);
    if(lotDetails){
      setSupplier(lotDetails.id_supplier)
    }else{
      setSupplier(null);
    }
    resetLotForm();
  };
  const handleTagFormSubmit = async (formData) => {
    console.log(formData);
    formData.idLotInwardDetail = idLotInwardDetail;
    formData.totalTags = totalTags;
    let responce = onClickSave(formData, tagId);
    setTagId("");
    return responce
  };


  const handleDelete = (index) => {
    setDeleteIndex(index);
    SetDeleteModal(true);
  };

  const deleteTag = () => {
    deleteTagById(tagDetails[deleteIndex], deleteIndex);
    SetDeleteModal(false);
    setDeleteIndex("");
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    handleSave();
  }, 
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );
  useHotkeys("ctrl+a", (event) => {
    event.preventDefault();
    handleAddToPrev();
  }, 
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  return (
    <React.Fragment>
      <Head title="Tag Add" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row md={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
              {/* <Col md={2}>
                <ModifiedBreadcrumb />
              </Col> */}
              <Col md={2}>
                <Label>
                  Entry Branch
                  <IsRequired />
                </Label>
                <div className="form-group">
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
                    tabIndex={tabIndex}
                  ></BranchDropdown>
                </div>
              </Col>
              <Col md={2}>
                <Label>
                  To Branch
                  <IsRequired />
                </Label>
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={tagBranch}
                    onBranchChange={setTagBranch}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.branch && "Branch is Required"}
                    tabIndex={tabIndex}
                  ></BranchDropdown>
                </div>
              </Col>
              <Col md={3}>
                <Label>
                  Select Lot
                  <IsRequired />
                </Label>
                <div className="form-group">
                  <LotDropdown
                    register={register}
                    id={"lotId"}
                    lot={branchLot}
                    selectedLot={lotId}
                    onLotChange={handleLotChange}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.lotId && "Lot is Required"}
                    tabIndex={tabIndex}
                  ></LotDropdown>
                </div>
              </Col>

              <Col md={1}>
                <Label>
                  {" "}
                  Nos.Tags
                  <IsRequired />
                </Label>
                <div className="form-group">
                  <NumberInputField
                    register={register}
                    placeholder="Tags"
                    id={"totalTags"}
                    value={totalTags}
                    isRequired={true}
                    min={1}
                    setValue={setValue}
                    SetValue={setTotalTags}
                    minError={"Sell Should greater than 0"}
                    reqValueError={"Sell weight is Required"}
                    message={errors.sellRate && errors.sellRate.message}
                  ></NumberInputField>
                </div>
              </Col>

              <Col md={4} className="text-right">
                
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/inventory/tag/list`)}
                >
                  Cancel
                </Button>{" "}
                <Button color="primary" disabled={isSubmitted} tabIndex={19} size="md" onClick={handleSave}>
                  {isSubmitted ? "Saving" : totalTags == 1 ? "Save[Ctrl+s]" : "Add to Preview[Ctrl+s]"}
                </Button>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Button color="primary" size="md" onClick={() => handleCheckWeight()}>
                  {"Check Weight"}
                </Button>
              </Col>

            </Row>

            <Row md={12}>
              <SalesForm
                ref={salesFormRef}
                getValues={methods.getValues}
                isSizeReq={true}
                onSubmit={handleTagFormSubmit}
                selectedCatalog={selectedCatalog}
                maxPiece={maxPiece}
                maxGrossWeight={maxGrossWeight}
                purchaseTouch={purchaseTouch}
                purchaseWastage={purchaseWastage}
                pureWeightCalType={pureWeightCalType}
                purchaseMcType={purchaseMcType}
                purchaseMc={purchaseMc}
                purchaseRate={purchaseRate}
                purchaseRateType={purchaseRateType}
                isTagging={true}
                tabIndex={tabIndex}
                lotItemDetails={lotItemDetails}
                initialState={tagEditData}
                isHuidReq={parseInt(totalTags) > 1 ? false : true}
                isHuidMandatory={parseInt(totalTags) > 1 ? false : (settings?.is_huid_required == '1')}
                supplier={supplier}
                singleLotItem={singleLotItem}
                maxWeightTolarance = {maxWeightTolarance}
              />
            </Row>
            <Row md={12}>
              <Col md="12">
                <div className="custom-grid mb-2 mt-1">
                  <Row md={12}>
                    <Col md={6}>
                      <Button onClick={() => toggle()}>Add Images</Button>
                    </Col>
                    <Col md={6}>
                      {tagImages?.map((file) => {
                        if (file?.default == true) {
                          return (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img style={{ width: "150px", height: "170px" }} src={file.preview} alt="preview" />
                              </div>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row md={12}>
              {/* <PreviewTable
                columns={previewDetails}
                data={tagDetails}
                numericFields={""}
                onDelete={handleDelete}
                onEdit={handleEdit}
              /> */}
              <TaggingTable
                ref={tableFormRef}
                numericFields={""}
                onDelete={handleDelete}
                onEdit={handleEdit}
                columns={tagListCol}
                data={tagDetails}
                setData={setTagDetails}
                SetTagImages={SetTagImages}
                deleteModal={deleteModal}
                mcVaSetiings={mcVaSetiings}
                sections={sections}
                uom={uom}
                size={size}
                subDesigns={subDesigns}
                designs={designs}
                products={products}
                purities={purities}
                categories={categories}
                taxGroup={taxGroup}
                metalPurityRate={metalPurityRate}
                metalRates={metalRates}
                lotItemDetails={lotItemDetails}
                maxGrossWeight={balanceWeight}
                maxPiece={balancePcs}
              />
            </Row>
          </FormProvider>
        </PreviewCard>
        <MultiImageDropzone
          isDefaultReq={true}
          modal={modal}
          toggle={toggle}
          files={tagImages}
          setFiles={SetTagImages}
          handleDropChange={handleDropChange}
        />
        <DeleteModal
          actionName={""}
          modal={deleteModal}
          toggle={deleteToggle}
          name={"Tag"}
          title={"Tag"}
          clickAction={deleteTag}
        ></DeleteModal>
        <TagLotBalanceModal
          modal={checkWeightModal}
          toggle={checkWeightToggle}
          columns={lotProductDetailsColumn}
          data={lotProductDetails}
        />
      </Content>
    </React.Fragment>
  );
};

export default TagForm;
