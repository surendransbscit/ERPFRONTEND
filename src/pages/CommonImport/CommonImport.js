import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../components/Component";
import { Col, Row, Icon } from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { Input, Button } from "reactstrap";
import { BranchDropdown } from "../../components/filters/retailFilters";
import { useBranches } from "../../components/filters/filterHooks";
import IsRequired from "../../components/erp-required/erp-required";
import { importData } from "../../redux/thunks/importExport";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const CommonImport = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.orderReducer
  );

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  const { branches } = useBranches();

  const [importName, setImportName] = useState();
  const [tableValue, setTableValue] = useState();
  const [uploadfile, setuploadfile] = useState("");
  const [uploadfile2, setuploadfile2] = useState("");

  const [branch, SetBranch] = useState();
  let ids = [];
  ids = uploadfile;

  const saveData = async () => {
    const adddata = {
      file: uploadfile,
      file2: uploadfile2,
      branch: branch,
      actionType: parseInt(importName),
    };
    try {
      await dispatch(importData(adddata)).unwrap();
      reset();
      SetBranch();
      setImportName();
      setTableValue();
      setuploadfile("");
      //   toastsuccess("Branch Added successfully");
      //   navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTableValue(importName);
  }, [importName]);

  const customer_columns = [
    { header: "FirstName", example: "John", textAlign: "center" },
    { header: "LastName", example: "Doe", textAlign: "center" },
    { header: "Email", example: "example@gmail.com", textAlign: "center" },
    { header: "Mobile", example: "1111111111", textAlign: "center" },
    // { header: "Address 1", accessor: "line1", textAlign: "center" },
    // { header: "Address 2", accessor: "line2", textAlign: "center" },
    // { header: "DOB", accessor: "date_of_birth", textAlign: "center" },
    // { header: "Pincode", accessor: "pincode", textAlign: "center" },
  ];

  const MetalProductCategoryColumns = [
    {
      header: "Metal",
      example: "Example Gold",
      textAlign: "center",
      req: true,
    },
    {
      header: "Category",
      example: "Example 22k Gold",
      textAlign: "center",
      req: true,
    },
    {
      header: "Product",
      example: "Example Chain",
      textAlign: "center",
      req: true,
    },
    {
      header: "Design",
      example: "Example Hand Made Chain",
      textAlign: "center",
      req: false,
    },
    {
      header: "SubDesign",
      example: "12G S Chain",
      textAlign: "center",
      req: false,
    },
  ];

  const tagColumns = [
    {
      header: "CATEGORY",
      example: "GOLD ORNAMENTS",
      textAlign: "center",
      req: true,
    },
    { header: "Product", example: "BRACELET", textAlign: "center", req: true },
    {
      header: "Design",
      example: "BRACELET LADIES",
      textAlign: "center",
      req: true,
    },
    {
      header: "SubDesign",
      example: "BRACELET LADIES",
      textAlign: "center",
      req: true,
    },
    { header: "Purity", example: "75", textAlign: "center", req: true },
    { header: "Pieces", example: "1", textAlign: "center", req: true },
    { header: "GrossWt", example: "21.62", textAlign: "center", req: true },
    { header: "NetWt", example: "15.35", textAlign: "center", req: true },
    { header: "LessWt", example: "6.27", textAlign: "center", req: true },
    { header: "Wastage", example: "17", textAlign: "center", req: true },
    { header: "P.WastageWt", example: "0", textAlign: "center", req: true },
    { header: "MCType", example: "1", textAlign: "center", req: true },
    { header: "MCValue", example: "34", textAlign: "center", req: true },
    { header: "SalesValue", example: "0", textAlign: "center", req: true },
    { header: "Branch", example: "SDS BR1", textAlign: "center", req: true },
    { header: "TagNumber", example: "1", textAlign: "center", req: true },
    { header: "PurchaseCost", example: "0", textAlign: "center", req: true },
    {
      header: "TagDate",
      example: "24/10/2023",
      textAlign: "center",
      req: true,
    },
    { header: "HUID1", example: "", textAlign: "center", req: false },
    { header: "HUID2", example: "", textAlign: "center", req: false },
    {
      header: "KARIGAR",
      example: "MILAN JEWELLERS",
      textAlign: "center",
      req: true,
    },
    { header: "Section", example: "BR", textAlign: "center", req: true },
  ];

  const tagStnColumns = [
    { header: "Tag Number", example: "HOHHOT", textAlign: "center", req: true },
    { header: "Less Wt", example: "Yes", textAlign: "center", req: true },
    {
      header: "StoneName",
      example: "COLOUR STONE",
      textAlign: "center",
      req: true,
    },
    { header: "Pieces", example: "1", textAlign: "center", req: true },
    { header: "Weight", example: "6.27", textAlign: "center", req: true },
    { header: "Unit", example: "GRAM", textAlign: "center", req: true },
    {
      header: "CAL TYPE",
      example: "PER PIECE",
      textAlign: "center",
      req: true,
    },
    { header: "Rate/Gram", example: "4200", textAlign: "center", req: true },
    { header: "Amount", example: "4200", textAlign: "center", req: true },
  ];

  const importOptions = [
    {
      label: "Customer",
      value: 1,
    },
    {
      label: "Metal, Product, Category",
      value: 2,
    },
    {
      label: "Tag",
      value: 3,
    },
    {
      label: "Employee",
      value: 4,
    },
    {
      label: "Tag Status",
      value: 5,
    },
    {
      label: "Scheme Accounts",
      value: 6,
    },
  ];

  return (
    <React.Fragment>
      <Head title="Common Import" />
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
            <Col md={5} className="text-right flex">
              <Button
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
              >
                Cancel
              </Button>{" "}
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="primary"
                onClick={handleSubmit(saveData)}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-1 form-control-sm align-center">
              <Col lg="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="importName">
                    Import Name
                  </label>
                  <div className="form-group">
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <select
                          className="form-control form-select"
                          id="importName"
                          value={importName}
                          onChange={(e) => {
                            setImportName(e.target.value);
                          }}
                          placeholder="Import Name"
                        >
                          <option label="Select Import Name" value=""></option>
                          {importOptions?.map((item, index) => (
                            <option key={index} value={item?.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {tableValue == 1 ||
                (tableValue == 6 && (
                  <Col lg="3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="branch">
                        Select Branch for Customers
                      </label>
                      <BranchDropdown
                        register={register}
                        id={"branch"}
                        branches={branches}
                        selectedBranch={branch}
                        onBranchChange={SetBranch}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.branch && "Branch is Required"}
                      />
                    </div>
                  </Col>
                ))}

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="upload">
                    Upload (CSV)
                  </label>
                  <div className="form-file">
                    <Input
                      //   {...register("uploadfile", {
                      //     required: "CSV File is required",
                      //   })}
                      type="file"
                      accept="csv/*"
                      id="uploadfile"
                      onChange={(e) => {
                        setuploadfile(e.target.files[0]);
                      }}
                    />
                  </div>
                  {/* {errors?.uploadfile && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {errors.uploadfile.message}
                    </span>
                  )} */}
                </div>
              </Col>
              {tableValue == 3 && (
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="upload">
                      Upload Tag Stone (CSV) (Optional)
                    </label>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="csv/*"
                        id="uploadfile2"
                        onChange={(e) => {
                          setuploadfile2(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                </Col>
              )}
            </Row>

            <Row className="mt-2" md={12}>
              <h4 className="mt-3">CSV Format</h4>
              {tableValue == 1 && (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {customer_columns?.map((column, index) => (
                            <th
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {customer_columns?.map((column, index) => (
                            <td
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.example}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {tableValue == 2 && (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {MetalProductCategoryColumns?.map((column, index) => (
                            <th
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.header}
                              {/* {column.req == false && <span className="text-danger">{` (not Mandatory)`}</span>} */}
                              {column.req == true && <IsRequired />}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {MetalProductCategoryColumns?.map((column, index) => (
                            <td
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.example}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {tableValue == 3 && (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {tagColumns?.map((column, index) => (
                            <th
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.header}
                              {/* {column.req == false && <span className="text-danger">{` (not Mandatory)`}</span>} */}
                              {column.req == true && <IsRequired />}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tagColumns?.map((column, index) => (
                            <td
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.example}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h6 className="mt-3">Tag Stone (Optional)</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {tagStnColumns?.map((column, index) => (
                            <th
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.header}
                              {/* {column.req == false && <span className="text-danger">{` (not Mandatory)`}</span>} */}
                              {column.req == true && <IsRequired />}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tagStnColumns?.map((column, index) => (
                            <td
                              key={index}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.example}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default CommonImport;
