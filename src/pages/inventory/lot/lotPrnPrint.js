const LotPrnPrint = (itemDetails) => {
    let prn = ''
    let uniqueFileName = `labels_${Date.now()}_sds.prn`;

    itemDetails.forEach((element,index) => {
      let uid = element.uid;
      let lotDate = element.lot_date;
      let grossWeight = element.gwt;
      let Size = element?.size_name;
      let Pcs = element.pcs; 
      let supCode = element.supplier_code + '' +(parseFloat(element.sell_rate) > 0 ? ' - Rs.' + element?.sell_rate : ''); 
      let ProductLable = element.label_code; 
      let SizeLable = (Size == null || Size == undefined) ? '' : Size;
      let code=`^O0
^D0
^C1
^P1
^Q10.0,3.0
^W70
^L
W300,9,5,2,L,8,3,8,0
${uid}
AB,17,8,1,1,0,0,${uid}
AB,17,39,1,1,0,0,${lotDate}
AA,115,12,1,1,0,0,${ProductLable}
AA,115,39,1,1,0,0,${SizeLable}
AA,196,7,1,1,0,0,${supCode}
AA,196,26,1,1,0,0,Pcs:${Pcs}
AB,196,49,1,1,0,0,WT:${grossWeight}
E
`
      prn += code;

      prn += '\r\n';
        
    });

    const blob = new Blob([prn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = uniqueFileName;
    document.body.appendChild(a);
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

};

export default LotPrnPrint;
