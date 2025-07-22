import React, { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomer } from "../../../redux/thunks/customer";

const CustomerAutoComplete = ({ id, placeholder, SetValue, SetSearchValue, searchValue ,tabIndex = 1, searchCustomerList, inputType, setInputType, isSearching, setIsSearching,
  SetCreateMobNum,
  navigateModalOpened,
  SetNavigateModal,
  setNavigateModalOpened,
  customer
 }) => {
  const dispatch = useDispatch();
  // const { searchCustomerList } = useSelector((state) => state.customerReducer);
  // const [isSearching, setIsSearching] = useState(false);
  // const [inputType, setInputType] = useState();

  // useEffect(() => {
  //   if (isSearching && searchValue.length > 0 && searchValue[0].label.length >= 5) {
  //     dispatch(searchCustomer({ mob_num: searchValue[0]?.label }));
  //   }
  // }, [isSearching, searchValue, dispatch]);

  useEffect(() => {
        if ( isSearching && searchValue?.length > 0 && inputType === "text" && searchValue[0]?.label.length > 0) 
        {
          const searchKey = inputType === "number" ? "mob_num" : "name";
          dispatch(searchCustomer({ [searchKey]: searchValue[0]?.label }));
        }
        if(isSearching && searchValue?.length > 0 && inputType === "number" && searchValue[0]?.label.length >= 5)
        {
          const searchKey = inputType === "number" ? "mob_num" : "name";
          dispatch(searchCustomer({ [searchKey]: searchValue[0]?.label }));
        }
      }, [isSearching, searchValue,dispatch, inputType]);

      useEffect(() => {
            if (searchValue?.length > 0) {
              const inputValue = searchValue[0]?.label;
        
              // Detect input type when user starts typing
              if (!inputType) {
                setInputType(/^\d/.test(inputValue) ? "number" : "text");
              }
        
              if (
                inputType === "number" &&
                isSearching &&
                inputValue.length >= 10 &&
                customer == null &&
                searchCustomerList?.length == 0 &&
                !navigateModalOpened
              ) {
                console.log("Opening Modal...");
                SetCreateMobNum(inputValue);
                SetNavigateModal(true);
                setNavigateModalOpened(true);
              }
        
              if (inputValue.length < 10) {
                setNavigateModalOpened(false);
              }
            }
          }, [isSearching, searchValue, searchCustomerList, inputType]);

  return (
    <div className="form-control-wrap">
      <Typeahead
        id={id}
        labelKey="label" // Matches the data structure
        onChange={(selected) => {
          if (selected.length > 0) {
            SetValue(selected[0].value); // Use 'value' as the ID field
            SetSearchValue(selected);
            setIsSearching(false);
          } else {
            SetValue(null);
            SetSearchValue([]);
          }
        }}
        options={searchCustomerList}
        placeholder={placeholder}
        selected={searchValue && searchValue?.length > 0 ? searchValue : []}
        onInputChange={(text) => {

          if (text.length === 0) {
            SetSearchValue([]);
            setInputType(null);
            return;
          }

          const firstChar = text.charAt(0);
          if (!inputType) {
            setInputType(
              /\d/.test(firstChar) ? "number" : "text"
            );
          }

          if(inputType === "number" && /^\d*$/.test(text)) 
          {
              setIsSearching(text.length >= 5);
              SetSearchValue([{ label: text }]);
          }

          if(inputType === "text" && /^[a-zA-Z\s]*$/.test(text)) 
          {
            setIsSearching(text.length > 0);
            SetSearchValue([{ label: text }]);
          }

          // if (text.length >= 5) {
          //   setIsSearching(true);
          //   SetSearchValue([{ label: text }]);
          // } else {
          //   SetSearchValue([]);
          // }
        }}
        inputProps={{ tabIndex: tabIndex }} 
      />
    </div>
  );
};

export default CustomerAutoComplete;
