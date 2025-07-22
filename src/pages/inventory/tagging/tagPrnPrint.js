
const TagPrnPrint = (itemDetails,userInfo) => {

    let prn = ''
    let uniqueFileName = `labels_${Date.now()}_sds.prn`;
    let template = userInfo?.settings?.tag_print_template;
    itemDetails.forEach((element,index) => {
      let tagcode = element.tag_code;
      let metal = element?.metal;
      let stnPcs = element.stn_pcs;
      let productName = element.product_name;
      let grossWeight = element.tag_gwt;
      let netWeight = element.tag_nwt;
      let Size = element?.size_name;
      let wastagePercentage = element.tag_wastage_percentage; 
      let mc = element.total_mc_value;
      let sellRate = element.tag_sell_rate;
      let fixedRateType = element.fixed_rate_type;
      let purityName = element.purity_name;
      let monthSupCode = element.month_sup_code;
      let SizeLable = (Size == null || Size == undefined) ? '' : Size;
      let VaLable = `VA:${parseInt(wastagePercentage)}%`
      let McLable = `MC:${mc}`
      let CompanyName = userInfo?.user?.company_name;
      let huid = element?.tag_huid != null ||element?.tag_huid != undefined ? element.tag_huid : '';

      let GrossWtLable =  `WT:${grossWeight}`

      if (fixedRateType == 1) {
        sellRate = element.tag_sell_rate;
      } else {
        sellRate = element.tag_item_cost;
      }
      let salesMode = element.sales_mode;
      let mc_va = ''
      let stoneLable = ''

      if (salesMode == 0) {
        McLable =  `Rs:${sellRate}/-`
        VaLable =``
        GrossWtLable = ''
      }
      if (parseInt(stnPcs) > 0) {
        stoneLable = `Stn : ${stnPcs}`
      }
      let code = ''
      if (template == 1) {
       code=`^O0
^D0
^C1
^P1
^Q10.0,3.0
^W70
^L
W300,9,5,2,L,8,3,8,0
${tagcode}
AB,17,8,1,1,0,0,${tagcode}
AB,17,39,1,1,0,0,${purityName}
AA,115,12,1,1,0,0,${monthSupCode}
AA,115,39,1,1,0,0,${SizeLable}
AA,196,7,1,1,0,0,${McLable}
AA,196,26,1,1,0,0,${VaLable}
AB,196,49,1,1,0,0,${GrossWtLable}
E
`
        prn += code;

        
        prn += '\r\n';
        
      } else if (template == 2) {

        let grossWeightLable = 'G.WT:'

        if (parseInt(stnPcs) == 0) {
          grossWeightLable = '';
          grossWeight = '';
        }

        if (salesMode == 0) {
          grossWeightLable =  `Rs:`
          grossWeight =`${sellRate}/-`
        }

        if (metal == 2) {
          purityName =''
        }
        code=`<xpml><page quantity='0' pitch='15.000 mm'></xpml>G0
n
M0500
MT
O0214
V0
t1
Kf0070
SG
c0000
e
<xpml></page></xpml><xpml><page quantity='1' pitch='15.0 mm'></xpml>L
D11
H17
PG
pG
SG
ySPM
A2
4911C1200160028${CompanyName}
4911C1000070041${stoneLable}
4911C0800070054${purityName}
1W1c77000001000562000000000SA${tagcode}
ySW1
1911S5000450118P008P008${tagcode}
1911S5000320118P008P008${grossWeightLable}
1911S5000310154P008P008${grossWeight}
1911S5000180118P008P008N.WT:
1911S5000170152P008P008${netWeight}
1911S5000040118P008P008${huid}
Q0001
E
<xpml></page></xpml><xpml><end/></xpml>`
prn += code;

  
  prn += '\r\n';
    

      }else{
        SizeLable = (Size == null || Size == undefined) ? '' : `Sz:${SizeLable}`;
        code=`I8,A,001
Q125,024
q1020
S2
D08
ZT
JF
O
R58,0
F100
N
A700,85,2,4,1,1,N,"${tagcode}"
A700,55,2,4,1,1,N,"G:${grossWeight}gm"
A700,20,2,3,1,1,N,"${SizeLable}"
A500,90,2,3,1,1,N,"${productName}"
A500,60,2,1,1,2,N,"VA:${wastagePercentage}/gm"
A500,30,2,1,1,2,N,"Mc:${mc}/-"

b320,10,Q,m2,s3,eL,iA,"${tagcode}"
P1
`
prn += code;

        
        prn += '\r\n';
      }
      
      // prn += '\r\n';
    });

    const blob = new Blob([prn], { type: 'text/plain' });
    // const encoder = new TextEncoder(); // UTF-8 by default, no BOM
    // const binaryData = encoder.encode(prn);
    // const blob = new Blob([binaryData], { type: 'application/octet-stream' });
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

export default TagPrnPrint;
