import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import { PreviewCard, UserAvatar } from "../../components/Component";
import { Col, Row } from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import {
  ProductDropdown,
  DesignDropdown,
} from "../../components/filters/retailFilters";
import { useProducts, useDesigns } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { getSupplierCatalogReport } from "../../redux/thunks/reports";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const SupplierCatalogReport = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const {
    register,

    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, suppliercatalogReport } = useSelector(
    (state) => state.reportReducer
  );
  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  const { products } = useProducts();
  const { designs } = useDesigns();

  const [filterProduct, setFilterProduct] = useState();
  const [filterDesign, setFilterDesign] = useState();

  const calculateSupplierCatalogValues = (field) => {
    return suppliercatalogReport?.rows?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = suppliercatalogReport?.columns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getMappingDetails = () => {
    if (filterProduct) {
      const postData = {
        product: filterProduct,
        design: filterDesign ? filterDesign : null,
      };
      dispatch(getSupplierCatalogReport(postData));
    } else {
      toastfunc("Select Product");
    }
  };

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  return (
    <React.Fragment>
      <Head title={`${title ? title : "Supplier Catalog"} - Report`} />
      {pagePermission?.view && (
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
                  color="secondary"
                  size="md"
                  onClick={() => getMappingDetails()}
                >
                  {issubmitting ? "Searching" : "Search"}
                </Button>
              </Col>
            </Row>

            <div className="custom-grid">
              <Row className="g-3 align-center">
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product">
                      Product
                      <IsRequired />
                    </label>
                    <ProductDropdown
                      register={register}
                      id={"filterProduct"}
                      products={products}
                      selectedProduct={filterProduct}
                      setValue={setValue}
                      onProductChange={(value) => {
                        setFilterProduct(value);
                      }}
                      placeholder={"Filter Product"}
                    />
                  </div>
                </Col>

                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="selectedDesign">
                      Design
                      <IsRequired />
                    </label>
                    <DesignDropdown
                      register={register}
                      id={"filterDesign"}
                      selectedProduct={filterProduct}
                      designs={designs}
                      selectedDesign={filterDesign}
                      setValue={setValue}
                      onDesignChange={(value) => {
                        setFilterDesign(value);
                      }}
                      placeholder={"Filter Design"}
                    />
                  </div>
                </Col>
              </Row>

              <Row className="mt-2" md={12}>
                {suppliercatalogReport !== null && (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO </th>
                          {suppliercatalogReport?.columns?.map(
                            (column, index) => (
                              <th
                                key={index}
                                style={{ textAlign: column?.textAlign }}
                              >
                                {column.Header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {suppliercatalogReport !== null &&
                          suppliercatalogReport?.rows?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1} </td>
                              {suppliercatalogReport?.columns?.map(
                                (column, colIndex) => (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                    }}
                                  >
                                    {column.type === "image" ? (
                                      item[column.accessor] ? (
                                        <img
                                          src={item[column.accessor]}
                                          alt={column.accessor}
                                          style={{
                                            maxWidth: "100px",
                                            maxHeight: "100px",
                                          }}
                                        />
                                      ) : (
                                        <UserAvatar text={item["image_text"]} />
                                      )
                                    ) : column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={item[column.accessor]}
                                      />
                                    ) : column.decimal_places ? (
                                      parseFloat(item[column.accessor]).toFixed(
                                        column.decimal_places
                                      )
                                    ) : (
                                      item[column.accessor]
                                    )}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                      </tbody>

                      <tfoot>
                        <tr style={{ fontWeight: "bold" }}>
                          <td>Total</td>
                          {suppliercatalogReport?.columns?.map(
                            (column, index) => (
                              <td
                                key={index}
                                style={{ textAlign: column?.textAlign }}
                              >
                                {column.isTotalReq ? (
                                  column.isCurrency ? (
                                    <CurrencyDisplay
                                      value={calculateSupplierCatalogValues(
                                        column.accessor
                                      )}
                                    />
                                  ) : (
                                    calculateSupplierCatalogValues(
                                      column.accessor
                                    )
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </Row>
            </div>
          </PreviewCard>
        </Content>
      )}
    </React.Fragment>
  );
};

export default SupplierCatalogReport;
