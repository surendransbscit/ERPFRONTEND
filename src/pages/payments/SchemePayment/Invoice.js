import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const InvoiceTitle = () => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <Text style={styles.reportTitle}>Xpress Enterprises</Text>
    </View>
  </View>
);

const Address = () => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <View>
        <Text style={styles.invoice}>Invoice </Text>
        <Text style={styles.invoiceNumber}>
          Invoice number: 232{" "}
        </Text>
      </View>
      <View>
        <Text style={styles.addressTitle}>7, Ademola Odede, </Text>
        <Text style={styles.addressTitle}>Ikeja,</Text>
        <Text style={styles.addressTitle}>Lagos, Nigeria.</Text>
      </View>
    </View>
  </View>
);

const UserAddress = () => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <View style={{ maxWidth: 200 }}>
        <Text style={styles.addressTitle}>Bill to </Text>
        <Text style={styles.address}>dssfdfsdf</Text>
      </View>
      <Text style={styles.addressTitle}>32422</Text>
    </View>
  </View>
);
const TableHead = () => (
  <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
    <View style={[styles.theader, styles.theader2]}>
      <Text>Items</Text>
    </View>
    <View style={styles.theader}>
      <Text>Price</Text>
    </View>
    <View style={styles.theader}>
      <Text>Qty</Text>
    </View>
    <View style={styles.theader}>
      <Text>Amount</Text>
    </View>
  </View>
);

const TableBody = () =>
  
    <Fragment >
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.tbody, styles.tbody2]}>
          <Text>fgyuh</Text>
        </View>
        <View style={styles.tbody}>
          <Text>678 </Text>
        </View>
        <View style={styles.tbody}>
          <Text>ghj</Text>
        </View>
        <View style={styles.tbody}>
          <Text>y0</Text>
        </View>
      </View>
    </Fragment>


const TableTotal = () => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.total}>
      <Text></Text>
    </View>
    <View style={styles.total}>
      <Text> </Text>
    </View>
    <View style={styles.tbody}>
      <Text>Total</Text>
    </View>
    <View style={styles.tbody}>
      <Text>
        rer
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: "column",
  },

  spaceBetween: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#3E3E3E",
  },

  titleContainer: { flexDirection: "row", marginTop: 24 },


  reportTitle: { fontSize: 16, textAlign: "center" },

  addressTitle: { fontSize: 11, fontStyle: "bold" },

  invoice: { fontWeight: "bold", fontSize: 20 },

  invoiceNumber: { fontSize: 11, fontWeight: "bold" },

  address: { fontWeight: 400, fontSize: 10 },

  theader: {
    marginTop: 20,
    fontSize: 10,
    fontStyle: "bold",
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 20,
    backgroundColor: "#DEDEDE",
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  total: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1.5,
    borderColor: "whitesmoke",
    borderBottomWidth: 1,
  },

  tbody2: { flex: 2, borderRightWidth: 1 },
});

const Invoice = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  );
};
export default Invoice;
