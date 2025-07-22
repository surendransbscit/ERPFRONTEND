import React from 'react';
import { useSelector } from 'react-redux';
import { isUndefined } from '../calculations/ErpCalculations';


export const formatCurrencyInINR = (value, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrencyInINRWithOutDecmal = (value, currency = 'INR') => {
  // return new Intl.NumberFormat('en-IN', {
  //   style: 'currency',
  //   currency: currency,
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // }).format(value);
  return Math.round(value)
};

export const formatProductDesign= (product, design) => {
    let maxTotal = 9;
    let hyphen = '-';
    let maxCombo = maxTotal - hyphen.length; // 9

    // If product name is short, allow design to take more
    let productLen = Math.min(product.length, 4);
    let designLen = maxCombo - productLen;

    // If product name is very short, design gets more room
    if (product.length < 4) {
        productLen = product.length;
        designLen = maxCombo - productLen;
    }

    // Slice both names
    let productPart = product.slice(0, productLen);
    let designPart = design.slice(0, designLen);

    return `${productPart}-${designPart}`;
}

const CurrencyDisplay = ({ value }) => {
  const { userInfo }= useSelector((state) => state.authUserReducer);
  return <span>{formatCurrencyInINR((isUndefined(value)),(userInfo?.user?.currency_code))}</span>;
};

export function numberToWords(num) {
  if (num === 0) return "Zero";

  const belowTwenty = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function helper(n) {
      if (n === 0) return "";
      else if (n < 20) return belowTwenty[n] + " ";
      else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      else return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
  }

  let result = "";
  let i = 0;

  while (num > 0) {
      if (num % 1000 !== 0) {
          result = helper(num % 1000) + thousands[i] + " " + result;
      }
      num = Math.floor(num / 1000);
      i++;
  }

  return result.trim();
}




export default CurrencyDisplay;
