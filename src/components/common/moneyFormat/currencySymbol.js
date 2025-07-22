import React from 'react';

const getCurrencySymbol = (currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    });
  
    // Format a dummy value to extract the currency symbol
    const parts = formatter.formatToParts(0);
    const currencySymbol = parts.find(part => part.type === 'currency').value;
  
    return currencySymbol;
  };

  export default getCurrencySymbol;