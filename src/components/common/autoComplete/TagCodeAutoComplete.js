import React, { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { getTagCodeBySearch } from "../../../redux/thunks/inventory";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";


const TagCodeAutoComplete = ({ id, placeholder, SetValue, SetSearchValue, searchValue,selectedBranch }) => {
  const dispatch = useDispatch();
  const { tagList } = useSelector((state) => state.tagReducer);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {

    if (isSearching && searchValue.length > 0 && searchValue[0].label.length >= 4 && selectedBranch) {
        dispatch(getTagCodeBySearch({ id_branch:selectedBranch,tag_code : searchValue[0]?.label }));
    }else if(isSearching && searchValue.length > 0 && searchValue[0].label.length >= 4){
            toastfunc("Please Select Branch")
    }
  }, [isSearching,searchValue,selectedBranch, dispatch]);



  return (
    <div className="form-control-wrap">
      <Typeahead
        id={id}
        labelKey="label" // Matches the data structure
        onChange={(selected) => {
          if (selected.length > 0) {
            SetValue(selected[0].value,selected[0]); // Use 'value' as the ID field
            SetSearchValue(selected);
            setIsSearching(false);  
          } else {
            SetValue(null);
            SetSearchValue([]);
          }
        }}
        options={tagList}
        placeholder={placeholder}
        selected={searchValue && searchValue.length > 0 ? searchValue : []}
        onInputChange={(text) => {
          if (text.length >= 5) {
            setIsSearching(true);  
            SetSearchValue([{ label: text }]);
          } else {
            SetSearchValue([]);
          }
        }}
      />
    </div>
  );
};

export default TagCodeAutoComplete;
