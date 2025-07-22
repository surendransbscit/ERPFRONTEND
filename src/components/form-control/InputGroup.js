import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { RSelect } from "../Component";
import makeAnimated from "react-select/animated";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "../Component";
import { min } from "moment/moment";
import StoneForm from "../common/modal/StoneModal";
import { toastfunc } from "../sds-toast-style/toast-style";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import "../../assets/css/datePicker.css";
import Select from "react-select";
import { useFormContext } from "react-hook-form";
export const handleKeyDown = (e, props) => {
  if (
    (e.keyCode > 57 || e.keyCode < 48) &&
    !(e.keyCode > 95 && e.keyCode < 106) &&
    !["Backspace", "Tab", "Dot", ".", "ArrowRight", "ArrowLeft"].includes(e.key)
  ) {
    e.preventDefault();
  }

  if (props?.handleDecimalDigits) {
    // Handle Decimal Places
    const { value } = e.target;
    const decimalIndex = value.indexOf(".");
    const digitsAfterDecimal = value.length - decimalIndex - 1;
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab"
    ) {
      return;
    }
    if (decimalIndex >= 1) {
      if (
        digitsAfterDecimal > props?.decimalValues &&
        props?.decimalValues > 0
      ) {
        e.preventDefault();
      }
    }
  }
  if (props?.handleDot) {
    //Prevent Dot
    if (e.key === ".") {
      e.preventDefault();
      return;
    }
  }
};

export const InputGroupField = ({ register, ...props }) => {
  const inputId1 = props?.inputId1;
  const maxValue1 = props?.maxInput1;
  const minValue1 = props?.minInput1;
  const maxValueError1 = props?.maxErrorInput1;
  const minValueError1 = props?.minErrorInput1;
  const readOnly1 = props?.readOnly1;
  const disabled1 = props?.disabled1;

  const inputId2 = props?.inputId2;
  const maxValue2 = props?.maxInput2;
  const minValue2 = props?.minInput2;
  const maxValueError2 = props?.maxErrorInput2;
  const minValueError2 = props?.minErrorInput2;
  const readOnly2 = props?.readOnly2;
  const disabled2 = props?.disabled2;
  useEffect(() => {
    if (
      props?.setValue1 &&
      inputId1 !== undefined &&
      props?.value1 !== undefined &&
      props?.value1 !== null
    ) {
      props?.setValue1(inputId1, props?.value1);
    }
  }, [props?.value1, props?.setValue1, inputId1]);

  useEffect(() => {
    if (
      props?.setValue2 &&
      inputId2 !== undefined &&
      props?.value2 !== undefined &&
      props?.value2 !== null
    ) {
      props?.setValue1(inputId2, props?.value2);
    }
  }, [props?.value2, props?.setValue2, inputId2]);

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-control-wrap">
        <div className="input-group">
          <input
            className="form-control form-control-sm no-spinner"
            id={inputId1}
            type="number"
            readOnly={readOnly1}
            tabIndex={props?.tabIndex1}
            placeholder={props?.placeholder1}
            disabled={props?.isDisabled1}
            {...register(`${inputId1}`, {
              required: {
                value: props?.isRequired,
                message: props?.reqValueError,
              },
              min: {
                value: minValue1,
                message: minValueError1,
              },
              max: {
                value: maxValue1,
                message: maxValueError1,
              },
              minLength: {
                value: props?.minLength1,
                message: props?.minLengthError,
              },
              maxLength: {
                value: props?.maxLength1,
                message: props?.maxLengthError,
              },
            })}
            value={props?.value1}
            onChange={(e) => {
              let inputValue = e.target.value;

              if (maxValue1 && inputValue > maxValue1) {
                inputValue = 0;
              }

              props?.SetInputValue1(inputValue);
              if (props.clearErrors) {
                props.clearErrors(inputId1);
              }
            }}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (props?.onKeyDown1) props.onKeyDown1(e);
              else if (props?.handleKeyDownEvents1) handleKeyDown(e, props);
            }}
          />
          <input
            className="form-control form-control-sm no-spinner"
            onWheel={(e) => e.target.blur()}
            id={inputId1}
            type="number"
            readOnly={readOnly2}
            disabled={props?.isDisabled2}
            placeholder={props?.placeholder2}
            tabIndex={props?.tabIndex2}
            {...register(`${inputId2}`, {
              required: {
                value: props?.isRequired2,
                message: props?.reqValueError2,
              },
              max: {
                value: maxValue2,
                message: maxValueError2,
              },
              min: {
                value: minValue2,
                message: minValueError2,
              },
            })}
            value={props?.value2}
            onChange={(e) => {
              props?.SetInputValue2(e.target.value);
              if (props.clearErrors) {
                props.clearErrors(inputId2);
              }
            }}
            onKeyDown={(evt) => {
              if (evt.target.value.length >= 0 && evt.target.value.length < 2) {
                if (
                  (evt.keyCode > 57 || evt.keyCode < 48) &&
                  !["Backspace", "Tab"].includes(evt.key)
                ) {
                  evt.preventDefault();
                }
              }
            }}
          />
        </div>
        {props.message && <span className="text-danger">{props.message}</span>}
      </div>
    </>
  );
};

export const TextInputField = ({ register, message, ...props }) => {
  const inputid = props?.id;
  useEffect(() => {
    if (
      props?.setValue &&
      props?.id !== undefined &&
      props?.value !== undefined &&
      props?.value !== null
    ) {
      props?.setValue(props?.id, props?.value);
    }
  }, [props?.value, props?.setValue, props?.id]);

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}

      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm"
          id={inputid}
          disabled={props?.isDisabled}
          type="text"
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: "This field is Required",
            },
            maxLength: {
              value: props?.maxLength,
              message: props?.maxLengthError,
            },
          })}
          value={props?.value}
          tabIndex={props?.tabIndex}
          onChange={(e) => {
            let inputValue = e.target.value;
            if (props?.maxLength && inputValue.length > props?.maxLength) {
              inputValue = inputValue.slice(0, props?.maxLength);
            }
            props?.SetValue(inputValue);

            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
          onBeforeInput={props?.handleOnBeforeInput}
          onKeyDown={props?.handleKeyDown}
          onPaste={props?.onPaste}
          style={props?.style} // Apply the style
          autoComplete="off" 
        />
        {message && <span className="text-danger">{message}</span>}
      </div>
    </>
  );
};

export const NumberInputField = ({
  register,
  id,
  value,
  placeholder,
  isRequired,
  min,
  max,
  readOnly,
  setValue,
  SetValue,
  clearErrors,
  minError,
  maxError,
  reqValueError,
  message,
  label,
  maxLength,
  minLength,
  ...props
}) => {
  useEffect(() => {
    if (setValue && id !== undefined && value !== undefined && value !== null) {
      setValue(id, value);
    }
  }, [value, setValue, id]);
  const isMinAvailable = min !== undefined && min !== null;
  return (
    <>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm no-spinner"
          id={id}
          type="number"
          readOnly={readOnly}
          placeholder={placeholder}
          tabIndex={props?.tabIndex}
          {...register(id, {
            required: {
              value: isRequired,
              message: reqValueError,
            },
            min: {
              value: min && (min !== "" ? min : ""),
              message: minError,
            },
            max: {
              value: max?.max,
              message: maxError,
            },
            minLength: {
              value: minLength,
              message: props?.minLengthError,
            },
            maxLength: {
              value: maxLength,
              message: props?.maxLengthError,
            },
          })}
          value={value}
          onChange={(e) => {
            const { value } = e.target;
            const decimalIndex = value.indexOf(".");
            const digitsAfterDecimal = value.length - decimalIndex - 1;
            if (decimalIndex >= 1) {
              if (
                digitsAfterDecimal > props?.decimalValues &&
                props?.decimalValues > 0
              ) {
                e.preventDefault();
              }
            }
            let inputValue = e.target.value;
            if (maxLength && inputValue.length > maxLength) {
              inputValue = inputValue.slice(0, maxLength);
            }
            if (parseFloat(inputValue) > parseFloat(max) && max !== undefined) {
              //inputValue = max;
              inputValue = "";
            }

            // if (isMinAvailable && inputValue < min) {
            //   inputValue = min;
            // }
            SetValue && SetValue(inputValue);
            setValue && setValue(id, inputValue);
            clearErrors && clearErrors(id);
          }}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(evt) => {
            if (props?.handleformKeyDown) {
                props?.handleformKeyDown(evt);
              }
            handleKeyDown(evt, props);
          }}
          style={{ textAlign: props?.textAlign, fontSize: props?.fontSize }}
        />
      </div>
      {message && <span className="text-danger">{message}</span>}
    </>
  );
};
export const SwitchInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  return (
    <>
      <div className="form-group">
        <div className="custom-control custom-control-sm custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            {...register(`${inputid}`, {
              required: {
                value: props?.isRequired,
              },
            })}
            id={inputid}
            name={inputid}
            checked={props?.checked}
            onChange={(e) => props?.SetValue(e.target.checked)}
          />

          <label className="custom-control-label" htmlFor={inputid}>
            {props?.checked == true ? "Active" : "Inactive"}
          </label>
        </div>
      </div>
    </>
  );
};

export const DropdownInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-control-wrap">
        <div className="form-control-select">
          <select
            className="form-control form-select"
            id={inputid}
            {...register(`${inputid}`, {
              required: {
                value: props?.isRequired,
              },
            })}
            placeholder={props?.placeholder}
            value={props?.value}
            onChange={(e) => {
              props?.SetValue(e.target.value);
            }}
          >
            <option label={props.optionLabel} value=""></option>
            {props?.selectOptions?.map((item, index) => (
              <option key={index} value={item?.value}>
                {item?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export const MultiDropdownInputField = ({ ...props }) => {
  const animatedComponents = makeAnimated();
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
            closeMenuOnSelect={true}
            components={animatedComponents}
            value={props?.value}
            onChange={(e) => props.SetValue(e)}
            isMulti={props?.isMulti}
            options={props?.selectOptions}
          />
        </div>
      </div>
    </>
  );
};

export const DateInputField = ({
  label,
  id,
  selected,
  minDate,
  SetValue,
  showYearDropdown,
  disabled,
  showMonthDropdown,
  maxDate,
  tabIndex = 1,
}) => {
  const [minimumDate, setMinimumDate] = useState(false);
  const [maximumDate, setMaximumDate] = useState(false);
  useEffect(() => {
    if (minDate) {
      setMinimumDate(minDate);
    }
  }, [minDate]);

  useEffect(() => {
    if (maxDate) {
      setMaximumDate(maxDate);
    }
  }, [maxDate]);

  return (
    <div>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <DatePicker
        id={id}
        minDate={minimumDate}
        maxDate={maximumDate}
        selected={selected}
        onChange={(date) => SetValue(date)}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        disabled={disabled}
        dateFormat="dd/MM/yyyy"
        onKeyDown={(e) => e.preventDefault()}
        className="form-control date-picker"
        dropdownMode="select"
        tabIndex={tabIndex}
        popperPlacement="bottom"
        popperModifiers={[
          {
            name: "zIndex",
            enabled: true,
            phase: "write",
            fn: ({ state }) => {
              state.styles.popper.zIndex = 9999;
            },
          },
        ]}
      />
    </div>
  );
};

export const TextareaInputField = ({ ...props }) => {
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-group">
        <div className="form-control-wrap">
          <textarea
            className="form-control form-control-sm"
            type="text"
            placeholder={props?.placeholder}
            value={props?.value}
            onChange={(e) => props.SetValue(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export const OutlinedInput = ({ label, size, id, icon }) => {
  return (
    <div className={`form-control-wrap`}>
      {icon && (
        <div className="form-icon form-icon-right xl">
          <Icon name={icon}></Icon>
        </div>
      )}
      <input
        type="text"
        className={`form-control`}
        id={id}
        placeholder={label}
      />
    </div>
  );
};

export const EmailInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  useEffect(() => {
    if (
      props?.setValue &&
      props?.id !== undefined &&
      props?.value !== undefined &&
      props?.value !== null
    ) {
      props?.setValue(props?.id, props?.value);
    }
  }, [props?.value, props?.setValue, props?.id]);
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="email">
          {props?.label}
        </label>
      )}

      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm"
          id={inputid}
          type="text"
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: "Email is required",
            },
            pattern: {
              value: /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/,
              message: "Invalid Email id",
            },
          })}
          value={props?.value}
          onChange={(e) => {
            props?.SetValue(e.target.value);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
        />
      </div>
    </>
  );
};

export const GstInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  useEffect(() => {
    if (
      props?.setValue &&
      props?.id !== undefined &&
      props?.value !== undefined &&
      props?.value !== null
    ) {
      props?.setValue(props?.id, props?.value);
    }
  }, [props?.value, props?.setValue, props?.id]);
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="gst">
          {props?.label}
        </label>
      )}

      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm"
          id={inputid}
          type="text"
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: "GST number is required",
            },
            pattern: {
              value:
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
              // /^([0-9]{2})([A-Z]{5})([0-9]{4})([A-Z]{1})([0-9]{1})([A-Z]{1})([A-Z]{1})$/,
              message: "Format : 33AAACH7409R1Z4 / 33AAACH7409RRZS",
            },
          })}
          value={props?.value}
          // onKeyDown={(evt) => {
          //   if (evt.target.value.length >= 0 && evt.target.value.length < 2) {
          //     if (
          //       (evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }
          //   if (evt.target.value.length >= 2 && evt.target.value.length < 7) {
          //     if (
          //       !(evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }
          //   if (evt.target.value.length >= 7 && evt.target.value.length < 11) {
          //     if (
          //       (evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }
          //   if (evt.target.value.length >= 11 && evt.target.value.length < 12) {
          //     if (
          //       !(evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }
          //   if (evt.target.value.length >= 12 && evt.target.value.length < 13) {
          //     if (
          //       (evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }
          //   if (evt.target.value.length >= 13 && evt.target.value.length < 14) {
          //     if (
          //       !(evt.keyCode > 57 || evt.keyCode < 48) &&
          //       !["Backspace", "Tab"].includes(evt.key)
          //     ) {
          //       evt.preventDefault();
          //     }
          //   }

          //   if (
          //     evt.target.value.length == 15 &&
          //     !["Backspace", "Tab"].includes(evt.key)
          //   ) {
          //     evt.preventDefault();
          //   }
          // }}
          onKeyDown={(evt) => {
            const { key, target } = evt;
            const value = target.value;
            const length = value.length;

            const isAlpha = /^[A-Z]$/i.test(key);
            const isDigit = /^[0-9]$/.test(key);
            const isAllowed = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
            ].includes(key);

            if (length === 0 || length < 2) {
              // State code: digits only
              if (!isDigit && !isAllowed) evt.preventDefault();
            } else if (length >= 2 && length < 7) {
              // PAN: first 5 characters (alphabets only)
              if (!isAlpha && !isAllowed) evt.preventDefault();
            } else if (length >= 7 && length < 11) {
              // PAN: next 4 digits
              if (!isDigit && !isAllowed) evt.preventDefault();
            } else if (length === 11) {
              // PAN: last character (alphabet)
              if (!isAlpha && !isAllowed) evt.preventDefault();
            } else if (length === 12) {
              // Entity code: alphanumeric
              if (!isAlpha && !isDigit && !isAllowed) evt.preventDefault();
            } else if (length === 13) {
              // Default character: usually 'Z' (alphabet)
              if (!isAlpha && !isAllowed) evt.preventDefault();
            } else if (length === 14) {
              // Checksum: alphanumeric
              if (!isAlpha && !isDigit && !isAllowed) evt.preventDefault();
            } else if (length >= 15 && !isAllowed) {
              // Prevent typing beyond 15 characters
              evt.preventDefault();
            }
          }}
          onChange={(e) => {
            props?.SetValue(e.target.value);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
        />
      </div>
    </>
  );
};

export const PanInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="pan">
          {props?.label}
        </label>
      )}

      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm"
          id={inputid}
          type="text"
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: "PAN number is required",
            },
            pattern: {
              value: /^([A-Z]{5})([0-9]{4})([A-Z]{1})$/,
              message: "Format : ABCTY1234D",
            },
          })}
          value={props?.value}
          onKeyDown={(evt) => {
            if (evt.target.value.length >= 0 && evt.target.value.length < 5) {
              if (
                !(evt.keyCode > 57 || evt.keyCode < 48) &&
                !["Backspace", "Tab"].includes(evt.key)
              ) {
                evt.preventDefault();
              }
            }
            if (evt.target.value.length >= 5 && evt.target.value.length < 9) {
              if (
                (evt.keyCode > 57 || evt.keyCode < 48) &&
                !["Backspace", "Tab"].includes(evt.key)
              ) {
                evt.preventDefault();
              }
            }
            if (evt.target.value.length == 9) {
              if (
                !(evt.keyCode > 57 || evt.keyCode < 48) &&
                !["Backspace", "Tab"].includes(evt.key)
              ) {
                evt.preventDefault();
              }
            }
            if (
              evt.target.value.length == 10 &&
              !["Backspace", "Tab"].includes(evt.key)
            ) {
              evt.preventDefault();
            }
          }}
          onChange={(e) => {
            props?.SetValue(e.target.value);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
        />
      </div>
    </>
  );
};

export const AadharInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="aadhar">
          {props?.label}
        </label>
      )}

      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm"
          id={inputid}
          type="text"
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: "Aadhaar number is required",
            },
            pattern: {
              value: /^\d{12}$/, // Only 12 digits
              message: "Aadhaar number must be a 12-digit number",
            },
          })}
          value={props?.value}
          onKeyDown={(e) => {
            // Restrict input to digits only
            if (
              !/^[0-9]$/.test(e.key) && // Allow numbers
              e.key !== "Backspace" && // Allow Backspace
              e.key !== "Delete" && // Allow Delete
              e.key !== "ArrowLeft" && // Allow Left Arrow
              e.key !== "ArrowRight" && // Allow Right Arrow
              e.key !== "Tab" // Allow Tab
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            props?.SetValue(e.target.value);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
        />
      </div>
    </>
  );
};

export const LessWeightInputField = ({ register, ...props }) => {
  const inputid = props?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const toggleModal = () => {
    if (props?.gross_weight > 0) {
      setIsModalOpen(!isModalOpen);
    } else {
      toastfunc("Please Enter the Gross Weight");
    }
  };

  const handleSave = (data) => {
    setFormData(data);
    let stnWeight = 0;
    let diaWeight = 0;
    data.forEach((val) => {
      if (val.weight > 0) {
        if (val.stone_type === 2) {
          stnWeight += parseFloat(val.weight);
        } else {
          let weight = val.weight;
          if (val.divided_by_value > 0) {
            weight = parseFloat(val.weight / val.divided_by_value);
          }
          diaWeight += parseFloat(weight);
        }
      }
    });
    let less_weight = parseFloat(stnWeight) + parseFloat(diaWeight);
    setTotalWeight(parseFloat(less_weight).toFixed(3));
    props.SetValue(parseFloat(less_weight).toFixed(3));
    props.SetStnWeight(parseFloat(stnWeight).toFixed(3));
    props.SetDiaWeight(parseFloat(diaWeight).toFixed(3));
    props.SetStoneDetails(data);
    toggleModal();
  };

  return (
    <div className={`form-control-wrap`}>
      <div className="form-icon form-icon-right">
        <Icon name="plus" onClick={toggleModal}></Icon>
      </div>
      <StoneForm
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSave={handleSave}
        uom={props?.uom}
        gross_weight={props?.gross_weight}
        initialStoneDetails={formData}
      />
      <input
        className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
        id={inputid}
        type="number"
        placeholder={props?.placeholder}
        readOnly
        {...register(`${inputid}`, {
          required: {
            value: props?.isRequired,
            message: "Gross weight is required",
          },
        })}
        value={totalWeight}
        onChange={(e) => {
          props?.SetValue(e.target.value);
          if (props.clearErrors) {
            props.clearErrors(inputid);
          }
        }}
      />
    </div>
  );
};

export const InputFieldWithDropdown = forwardRef(
  (
    {
      register,
      setValue,
      onDropDownChange,
      min,
      max,
      isMaxWidthReq = 1,
      ...props
    },
    ref
  ) => {
    const inputid = props?.id;
    const options = props?.options;
    const maxValueError = props?.maxError;
    const minValueError = props?.minError;

    const handleOptionSelectChange = (value) => {
      onDropDownChange(value);
      setValue(props.optionId, value);
    };
    const selectedOption =
      props?.selectedOption ||
      options.find((option) => option.isDefault)?.value;
    const selectedOptionLabel =
      options.find((option) => option.value === selectedOption)?.label ||
      "Select";
    useEffect(() => {
      if (
        setValue &&
        inputid !== undefined &&
        props?.value !== undefined &&
        props?.value !== null
      ) {
        setValue(inputid, props?.value);
      }
    }, [props?.value, setValue, inputid]);

    useEffect(() => {
      if (props?.optionId && selectedOption !== undefined) {
        setValue(props?.optionId, selectedOption);
      }
    }, [selectedOption, setValue, props?.optionId]);
    return (
      <>
        {props.label && <label className="form-label">{props?.label}</label>}

        <div className="form-control-wrap input-group gross_weight">
            <input
              className={`form-control form-control-sm ${props?.type == 'number' ? 'no-spinner' : ''}`}
              id={inputid}
              type={props?.type}
              placeholder={props?.placeholder}
              readOnly={props?.readOnly}
              disabled={props?.isDisabled}
              tabIndex={props?.tabIndex}
              {...register(`${inputid}`, {
                required: {
                  value: props?.isRequired,
                  message: props?.requiredMessage,
                },
                min: {
                  value: min && (min !== "" ? min : ""),
                  message: minValueError,
                },
                max: {
                  value: props?.max && (props?.max !== "" ? props?.max : ""),
                  message: maxValueError,
                },
                minLength: {
                  value: props?.minLength,
                  message: props?.minLengthError,
                },
                maxLength: {
                  value: props?.maxLength,
                  message: props?.maxLengthError,
                },
              })}
              value={props?.value}
              onChange={(e) => {
                let inputValue = e.target.value;
                const { value } = e.target;
                const decimalIndex = value.indexOf(".");
                const digitsAfterDecimal = value.length - decimalIndex - 1;
                if (decimalIndex >= 1) {
                  if (
                    digitsAfterDecimal > props?.decimalValues &&
                    props?.decimalValues > 0
                  ) {
                    e.preventDefault();
                    return;
                  }
                }
                if (props?.maxLength && inputValue.length > props?.maxLength) {
                  inputValue = inputValue.slice(0, props?.maxLength);
                }
                if (parseFloat(max) < parseFloat(inputValue)) {
                  if (props?.setMaxValueExists) {
                    inputValue = max;
                  } else {
                    inputValue = "";
                  }
                }
                // if (!isNaN(parseFloat(min)) && parseFloat(min) > parseFloat(inputValue) ) {
                //   inputValue = '';
                // }

                props?.SetValue(inputValue);
                if (props.clearErrors) {
                  props.clearErrors(inputid);
                }
              }}
              // onBlur={props?.handleOnBlurEvent}
              onKeyDown={(e) => {
                if (props?.handleKeyDownEvents) {
                  handleKeyDown(e, props);
                }
                if (props?.handleFormKeyDownEvents) {
                  props?.handleFormKeyDownEvents(e);
                }
              }}
              onWheel={(e) => e.target.blur()}
              ref={ref}
            />
            <UncontrolledButtonDropdown
              className="input-group-append"
              style={{ maxWidth: isMaxWidthReq === 1 ? "50%" : "100%" }}
              tabIndex="-1"
            >
              <DropdownToggle
                tag="button"
                className="btn btn-outline-primary btn-dim dropdown-toggle"
              >
                <span>{selectedOptionLabel}</span>
                <Icon name="chevron-down" className="mx-n1"></Icon>
              </DropdownToggle>
              <DropdownMenu>
                <ul className="link-list-opt no-bdr">
                  {options?.map((option) => (
                    <li key={option.value}>
                      <DropdownItem
                        disabled={props?.isSelectDisabled}
                        key={option.value}
                        onClick={() => handleOptionSelectChange(option.value)}
                      >
                        {option.label}
                      </DropdownItem>
                    </li>
                  ))}
                </ul>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <input
              type="hidden"
              value={selectedOption || ""}
              {...register(props?.optionId)}
            />
            {props.message && (
              <span className="text-danger">{props.message}</span>
            )}
        </div>
      </>
    );
  }
);

export const InputGroupDropdown = ({
  register,
  setValue,
  onDropDownChange,
  min,
  placeholder,
  max,
  dropdownId,
  clearErrors,
  onTypeChange,
  isRequired,
  selectedType,
  mainDropdownOptions,
  ...props
}) => {
  const inputid = props?.id;
  const options = props?.options;

  const mainOptions = mainDropdownOptions?.map((order) => ({
    value: order.order_id,
    label: order.order_no,
  }));

  const handleOptionSelectChange = (value) => {
    onDropDownChange(value);
    setValue(props.optionId, value);
  };

  const defaultFinYear = options?.find((option) => option.is_active == true);
  const selectedOption = props?.selectedOption || defaultFinYear?.fin_id;
  const selectedOptionLabel =
    options?.find((option) => option.fin_id == selectedOption)?.fin_year_name ||
    "Select";

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    onTypeChange(value);
    setValue(dropdownId, value);
    clearErrors(dropdownId);
  };

  useEffect(() => {
    if (setValue && defaultFinYear && props?.optionId) {
      setValue(props.optionId, defaultFinYear.fin_id);
    }
  }, [defaultFinYear, setValue, props?.optionId]);

  useEffect(() => {
    if (
      setValue &&
      inputid !== undefined &&
      props?.fin_id !== undefined &&
      props?.value !== null
    ) {
      setValue(inputid, props?.value);
    }
  }, [props?.value, setValue, inputid]);

  useEffect(() => {
    if (props?.optionId && selectedOption !== undefined) {
      setValue(props?.optionId, selectedOption);
    }
  }, [selectedOption, setValue, props?.optionId]);

  return (
    <>
      {props.label && <label className="form-label">{props?.label}</label>}

      <div className="form-control-wrap input-group gross_weight">
        <UncontrolledButtonDropdown className="input-group-append">
          <DropdownToggle
            tag="button"
            className="btn btn-outline-primary btn-dim dropdown-toggle"
          >
            <span>{selectedOptionLabel}</span>
            <Icon name="chevron-down" className="mx-n1"></Icon>
          </DropdownToggle>
          <DropdownMenu>
            <ul className="link-list-opt no-bdr">
              {options?.map((option) => (
                <li key={option.value}>
                  <DropdownItem
                    key={option.fin_id}
                    onClick={() => handleOptionSelectChange(option.fin_id)}
                  >
                    {option.fin_year_name}
                  </DropdownItem>
                </li>
              ))}
            </ul>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <input type="hidden" value={""} {...register(props?.optionId)} />
        {props.message && <span className="text-danger">{props.message}</span>}
        <div style={{ width: props?.width }}>
          <Select
            value={
              mainOptions?.find((option) => option.value === selectedType) ||
              null
            }
            onChange={handleSelectChange}
            options={mainOptions}
            placeholder={placeholder}
            id={dropdownId}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
                fontSize: "12px",
              }),
            }}
            tabIndex={props?.tabIndex}
          />
          <input
            type="hidden"
            value={selectedType || ""}
            {...register(dropdownId, { required: isRequired })}
          />
        </div>
      </div>
    </>
  );
};

export const TitleInputFieldWithDropdown = forwardRef(
  ({
  register,
  setValue,
  onDropDownChange,
  ...props
},
ref
)=> {
  const inputid = props?.id;
  const options = props?.options;
  const maxValue = props?.max;
  const minValue = props?.min;
  const maxValueError = props?.maxError;
  const minValueError = props?.minError;

  const handleOptionSelectChange = (event) => {
    const value = event.target.value;
    onDropDownChange(value);
    setValue(props.optionId, value);
  };

  const capitalizeWords = (e) => {
    return e
      .toLowerCase()
      .split(" ")
      .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
  };

  return (
    <>
      {props.label && <label className="form-label">{props?.label}</label>}

      <div className="form-control-wrap input-group">
        <select
        // ref={ref}
          className="form-control form-control-sm"
          id={props.optionId}
          name={props.optionName}
          style={{ width: props.option_width }}
          onChange={handleOptionSelectChange}
          value={props?.selectedOption}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
  //         ref={(el) => {
  //   ref && typeof ref === "function" ? ref(el) : ref && (ref.current = el);
  // }}
          
          className="form-control form-control-sm"
          id={inputid}
          autoFocus={props?.inputAutofocus}
          type={props?.type}
          style={{ width: `${props?.text_width}px` }}
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: props?.requiredMessage,
            },
            min: {
              value: minValue,
              message: minValueError,
            },
            max: {
              value: maxValue,
              message: maxValueError,
            },
          })}
          value={props?.value}
          onChange={(e) => {
            props?.SetValue(capitalizeWords(e.target.value));
            setValue(inputid, capitalizeWords(e.target.value));
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
          // // onKeyDown={(evt) => {
          // //   const invalidChars = ["+", "-", "=", "/", ":", ";", "[", "]", ",", ".","?"];
          // //   if (invalidChars.includes(evt.key) || !(evt.keyCode > 57 || evt.keyCode < 48) && !["Backspace", "Tab"].includes(evt.key)) {
          // //     evt.preventDefault();
          // //   }
          // // }}
          onKeyDown={(evt) => {
            const invalidChars = /[^a-zA-Z\s]/; // Allows only letters and spaces
            if (invalidChars.test(evt.key) || evt.key === "Shift") {
              evt.preventDefault();
            }
          }}
          // ref={ref}
        />

        <input
          type="hidden"
          value={props?.selectedOption || ""}
          {...register(props?.optionId)}
        />
        {props.message && <span className="text-danger">{props.message}</span>}
      </div>
    </>
  );
  }
);

export const MobileNumberFieldWithCountryCode = ({
  register,
  setValue,
  SetOptionValue,
  onDropDownChange,
  disabled,
  ...props
}) => {
  const inputid = props?.id;
  const options = props?.options;
  const maxValue = props?.max;
  const minValue = props?.min;
  const maxValueError = props?.maxError;
  const minValueError = props?.minError;

  const defaultMobCode = options?.rows?.find((option) => option.is_default);

  const handleOptionSelectChange = (event) => {
    const value = event.target.value;
    onDropDownChange(value);
    setValue(props.optionId, value);
  };

  useEffect(() => {
    if (props?.selectedOption == 0 && defaultMobCode) {
      onDropDownChange(defaultMobCode?.mob_code);
      setValue(props.optionId, defaultMobCode?.mob_code);
    }
  }, [defaultMobCode]);

  return (
    <>
      {props.label && <label className="form-label">{props?.label}</label>}

      <div className="form-control-wrap input-group">
        <select
          disabled={disabled}
          className="form-control form-control-sm"
          id={props.optionId}
          name={props.optionName}
          style={{ width: props.option_width }}
          onChange={handleOptionSelectChange}
          value={props?.selectedOption}
        >
          {options?.rows?.map((option) => (
            <option
              selected={option.is_default}
              key={option.id_country}
              value={option.mob_code}
            >
              {option.mob_code}
            </option>
          ))}
        </select>
        <input
          disabled={disabled}
          className="form-control form-control-sm no-spinner"
                                    onWheel={(e) => e.target.blur()}
          id={inputid}
          type="number"
          style={{ width: `${props?.text_width}px` }}
          placeholder={props?.placeholder}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: props?.reqValueError,
            },
            maxLength: {
              value: maxValue,
              message: maxValueError,
            },
            minLength: {
              value: minValue,
              message: minValueError,
            },
          })}
          value={props?.value}
          onChange={(e) => {
            props?.SetValue(e.target.value);
            setValue(inputid, e.target.value);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
          onKeyDown={(evt) => {
            // if (evt.target.value.length >= 0 && evt.target.value.length < 2) {
            if (
              (evt.keyCode > 57 || evt.keyCode < 48) &&
              !(evt.keyCode > 95 && evt.keyCode < 106) &&
              !["Backspace", "Tab"].includes(evt.key)
            ) {
              evt.preventDefault();
            }
            // }
          }}
        />

        {/* <input type="hidden" value={props?.selectedOption || ""} {...register(props?.optionId)} /> */}
        {/* {props.message && <span className="text-danger">{props.message}</span>} */}
      </div>
    </>
  );
};

export const OrderNoWithFinYear = ({
  register,
  setValue,
  onDropDownChange,
  ...props
}) => {
  const inputid = props?.id;
  let options = [];
  if (props?.options?.length) {
    options = props?.options?.map((val) => ({
      value: val.pk_id,
      label: val.fin_year_code,
      isDefault: val.fin_status,
    }));
  }

  const handleOptionSelectChange = (value) => {
    onDropDownChange(value);
    setValue(props.optionId, value);
  };
  const selectedOption =
    props?.selectedOption || options?.find((option) => option.isDefault)?.value;
  const selectedOptionLabel =
    options?.find((option) => option.value === selectedOption)?.label ||
    "Select";

  useEffect(() => {
    if (
      setValue &&
      inputid !== undefined &&
      props?.value !== undefined &&
      props?.value !== null
    ) {
      setValue(inputid, props?.value);
    }
  }, [props?.value, setValue, inputid]);

  useEffect(() => {
    if (props?.optionId && selectedOption !== undefined) {
      setValue(props?.optionId, selectedOption);
      if (props?.selectedOption != selectedOption) {
        onDropDownChange(selectedOption);
      }
    }
  }, [selectedOption, setValue, props?.optionId]);
  return (
    <>
      {props.label && <label className="form-label">{props?.label}</label>}

      <div className="form-control-wrap input-group gross_weight">
        <UncontrolledButtonDropdown className="input-group-append">
          <DropdownToggle
            tag="button"
            className="btn btn-outline-primary btn-dim dropdown-toggle"
          >
            <span>{selectedOptionLabel}</span>
            <Icon name="chevron-down" className="mx-n1"></Icon>
          </DropdownToggle>
          <DropdownMenu>
            <ul className="link-list-opt no-bdr">
              {options?.map((option) => (
                <li key={option.value}>
                  <DropdownItem
                    key={option.value}
                    onClick={() => handleOptionSelectChange(option.value)}
                  >
                    {option.label}
                  </DropdownItem>
                </li>
              ))}
            </ul>
          </DropdownMenu>
        </UncontrolledButtonDropdown>

        <input
          className="form-control form-control-sm"
          id={inputid}
          type={props?.type}
          placeholder={props?.placeholder}
          readOnly={props?.readOnly}
          tabIndex={props?.tabIndex}
          {...register(`${inputid}`, {
            required: {
              value: props?.isRequired,
              message: props?.requiredMessage,
            },
          })}
          value={props?.value}
          onChange={(e) => {
            let inputValue = e.target.value;
            props?.SetValue(inputValue);
            if (props.clearErrors) {
              props.clearErrors(inputid);
            }
          }}
        />

        <input
          type="hidden"
          value={selectedOption || ""}
          {...register(props?.optionId)}
        />
        {props.message && <span className="text-danger">{props.message}</span>}
      </div>
    </>
  );
};



export const NumberInputFieldWithRef =  forwardRef(
({
  register,
  id,
  value,
  placeholder,
  isRequired,
  min,
  max,
  readOnly,
  setValue,
  SetValue,
  clearErrors,
  minError,
  maxError,
  reqValueError,
  message,
  label,
  maxLength,
  minLength,
  ...props
},ref) => {
  useEffect(() => {
    if (setValue && id !== undefined && value !== undefined && value !== null) {
      setValue(id, value);
    }
  }, [value, setValue, id]);
  const isMinAvailable = min !== undefined && min !== null;
  return (
    <>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="form-control-wrap">
        <input
          className="form-control form-control-sm no-spinner"
          id={id}
          type="number"
          readOnly={readOnly}
          placeholder={placeholder}
          tabIndex={props?.tabIndex}
          {...register(id, {
            required: {
              value: isRequired,
              message: reqValueError,
            },
            min: {
              value: min && (min !== "" ? min : ""),
              message: minError,
            },
            max: {
              value: max?.max,
              message: maxError,
            },
            minLength: {
              value: minLength,
              message: props?.minLengthError,
            },
            maxLength: {
              value: maxLength,
              message: props?.maxLengthError,
            },
          })}
          value={value}
          onChange={(e) => {
            const { value } = e.target;
            const decimalIndex = value.indexOf(".");
            const digitsAfterDecimal = value.length - decimalIndex - 1;
            if (decimalIndex >= 1) {
              if (
                digitsAfterDecimal > props?.decimalValues &&
                props?.decimalValues > 0
              ) {
                e.preventDefault();
              }
            }
            let inputValue = e.target.value;
            if (maxLength && inputValue.length > maxLength) {
              inputValue = inputValue.slice(0, maxLength);
            }
            if (parseFloat(inputValue) > parseFloat(max) && max !== undefined) {
              //inputValue = max;
              inputValue = "";
            }

            // if (isMinAvailable && inputValue < min) {
            //   inputValue = min;
            // }
            SetValue && SetValue(inputValue);
            setValue && setValue(id, inputValue);
            clearErrors && clearErrors(id);
          }}
          onWheel={(e) => e.target.blur()}
          onKeyDown={(evt) => {
            if (props?.handleformKeyDown) {
                props?.handleformKeyDown(evt);
              }
            handleKeyDown(evt, props);
          }}
          style={{ textAlign: props?.textAlign, fontSize: props?.fontSize }}
          ref ={ref}
        />
      </div>
      {message && <span className="text-danger">{message}</span>}
    </>
  );
});