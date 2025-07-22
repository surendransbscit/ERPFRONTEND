// import React, { useEffect } from "react";
// import { RSelect } from "../../Component";
// import makeAnimated from "react-select/animated";
// import { useProducts } from "../../filters/filterHooks";

// const ProductDropdownMulti = ({ register, selectedCategory, ...props }) => {
//   const animatedComponents = makeAnimated();
//   const { products } = useProducts();

//   const allOption = { label: "All", value: "all" };

//   let filteredProducts = products;

//   if (selectedCategory) {
//     filteredProducts = filteredProducts.filter(
//       (item) => item.cat_id === selectedCategory
//     );
//   }

//   let productData = [];
//   if (products.length > 0) {
//     if (props?.sales_mode) {
//       productData = products
//         .filter((obj) => {
//           return (
//             !props?.sales_mode ||
//             parseInt(obj.sales_mode) === parseInt(props?.sales_mode)
//           );
//         })
//         .map((obj) => ({
//           label: obj.product_name,
//           value: obj.pro_id,
//         }));
//     } else {
//       productData = products?.map((obj) => {
//         return {
//           label: obj.product_name,
//           value: obj.pro_id,
//         };
//       });
//     }
//   }

//   const isAllSelected = () => {
//     return props?.value?.length === productData.length;
//   };

//   const allOptions = isAllSelected()
//     ? productData
//     : [allOption, ...productData];

//   const handleChange = (selectedOptions) => {
//     if (selectedOptions.some((option) => option.value === "all")) {
//       props.SetValue(productData);
//     } else {
//       props.SetValue(selectedOptions);
//     }
//   };

//   return (
//     <>
//       {props.label && (
//         <label className="form-label" htmlFor="site-name">
//           {props?.label}
//         </label>
//       )}
//       <div className="form-control-wrap">
//         <div className="form-control-select">
//           <RSelect
//             closeMenuOnSelect={false}
//             components={animatedComponents}
//             value={props?.value}
//             onChange={handleChange}
//             isMulti
//             options={allOptions}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductDropdownMulti;

import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useProducts } from "../../filters/filterHooks";

const ProductDropdownMulti = ({ register, selectedCategory, ...props }) => {
  const animatedComponents = makeAnimated();
  const { products } = useProducts();

  const allOption = { label: "All", value: "all" };

  let filteredProducts = products;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (item) => item.cat_id === selectedCategory
    );
  }

  const productData = filteredProducts.map((obj) => ({
    label: obj.product_name,
    value: obj.pro_id,
  }));

  const isAllSelected = () => {
    return props?.value?.length === productData.length;
  };

  const allOptions = isAllSelected()
    ? productData
    : [allOption, ...productData];

  const handleChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "all")) {
      props.SetValue(productData);
    } else {
      props.SetValue(selectedOptions);
    }
  };

  return (
    <>
      {props.label && (
        <label className="form-label" htmlFor="site-name">
          {props?.label}
        </label>
      )}
      <div className="form-control-wrap">
        <div className="form-control-select">
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={props?.value}
            onChange={handleChange}
            isMulti
            options={allOptions}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDropdownMulti;
