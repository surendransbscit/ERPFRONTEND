import React from "react";
import "../../assets/css/previewTable.css";
import { Button } from "reactstrap";
import { Icon } from "../Component";
import CurrencyDisplay from "../common/moneyFormat/moneyFormat";
import "../../assets/css/datatable.css";
import { isUndefined } from "../common/calculations/ErpCalculations";
import { NumberInputField } from "../../components/form-control/InputGroup";
import { useForm, FormProvider } from "react-hook-form";

const PreviewTable = ({
  columns,
  data,
  onDelete,
  onEdit,
  isTotalReq = true,
  setData,
  isCheckBoxReq = false,
  tabIndex = "",
}) => {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  // Function to calculate total for numeric fields
  const calculateTotal = (field) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  const handelChange = (index, field, value) => {
    setData((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      let updateValue = {
        [field]: value,
      };
      updatedValues[index] = { ...updatedObject, ...updateValue };
      return updatedValues;
    });
  };

  return (
    <div
      className="table-responsive"
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <table className="table table-bordered">
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#f8f9fa",
          }}
        >
          <tr>
            <th
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#f8f9fa",
              }}
            >
              S.NO
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  textAlign: column?.textAlign,
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#f8f9fa",
                }}
              >
                {column.header}
              </th>
            ))}
            <th
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#f8f9fa",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 &&
            data?.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  {rowIndex + 1}{" "}
                  {isCheckBoxReq && (
                    <input
                      type="checkbox"
                      checked={item["isChecked"]} // Assuming `item[column.accessor]` holds the checkbox state
                      onChange={(e) =>
                        handelChange(rowIndex, "isChecked", e.target.checked)
                      } // Custom handler to manage checkbox state
                    />
                  )}{" "}
                </td>
                {columns?.map((column, colIndex) => (
                  <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                    {column.type === "number" ? (
                      <div style={{ width: "100px" }}>
                        <NumberInputField
                          register={register}
                          placeholder={column.header}
                          id={column.accessor + rowIndex}
                          value={item[column.accessor]}
                          isRequired={item.isChecked && item.isReq}
                          min={"0"}
                          max={
                            column?.setMax
                              ? column?.maxValue
                                ? column.maxValue
                                : item[column.maxValueAccessor]
                              : ""
                          }
                          setValue={setValue}
                          handleDot={true}
                          handleKeyDownEvents={false}
                          SetValue={(value) => {
                            if (column?.handelChange) {
                              column.handelChange(
                                rowIndex,
                                column.accessor,
                                value
                              );
                            }
                            clearErrors(column.accessor + rowIndex);
                          }}
                          minError={
                            column.header + " Should greater than or equal to 0"
                          }
                          maxError={
                            column.header + " Should greater than or equal to "
                          }
                          reqValueError={column.header + " is Required"}
                          message={
                            errors[column.accessor + rowIndex] &&
                            errors[column.accessor + rowIndex].message
                          }
                        />
                      </div>
                    ) : column.isCurrency ? (
                      <CurrencyDisplay
                        value={isUndefined(item[column.accessor])}
                      />
                    ) : column.decimal_places ? (
                      parseFloat(isUndefined(item[column.accessor])).toFixed(
                        column.decimal_places
                      )
                    ) : (
                      item[column.accessor]
                    )}
                  </td>
                ))}
                <td>
                  {onEdit && (
                    <Button
                      color="primary"
                      size="sm"
                      className="btn-icon btn-white btn-dim"
                      onClick={() => {
                        onEdit(rowIndex);
                      }}
                      tabIndex={tabIndex}
                    >
                      <Icon name="edit" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      color="primary"
                      size="sm"
                      className="btn-icon btn-white btn-dim"
                      onClick={() => {
                        onDelete(rowIndex);
                      }}
                      tabIndex={tabIndex}
                    >
                      <Icon name="trash-fill" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
        {isTotalReq && (
          <tfoot
            className="thead-light"
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              backgroundColor: "#f8f9fa",
            }}
          >
            <tr style={{ fontWeight: "bold" }}>
              <td
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#f8f9fa",
                }}
              >
                Total
              </td>
              {columns.map((column, index) => (
                <td
                  key={index}
                  style={{
                    textAlign: column?.textAlign,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {column.isTotalReq ? (
                    column.isCurrency ? (
                      <CurrencyDisplay
                        value={calculateTotal(column.accessor)}
                      />
                    ) : (
                      calculateTotal(column.accessor)
                    )
                  ) : (
                    ""
                  )}
                </td>
              ))}
              <td
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#f8f9fa",
                }}
              ></td>{" "}
              {/* Empty cell for Action column in footer */}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default PreviewTable;
