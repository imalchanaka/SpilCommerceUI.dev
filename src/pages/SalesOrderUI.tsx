import { IgrButton, IgrInput } from "igniteui-react";
import {
  IgrDataGrid,
  IgrDataGridModule,
  IgrNumericColumn,
  IgrTextColumn,
} from "igniteui-react-grids";
import React, { useState } from "react";
// import {
//   IgrDataGrid,
//   IgrDataGridModule,
//   IgrTextColumn,
//   IgrNumericColumn,
// } from "igniteui-react-grids";
// import { IgrInput } from "igniteui-react-inputs";
// import { IgrComboBox } from "igniteui-react-dropdowns";
// import { IgrButton } from "igniteui-react-buttons";

IgrDataGridModule.register();

const SalesOrderUI = () => {
  const [orderData, setOrderData] = useState([
    {
      itemType: "Glass",
      itemCode: "04CFL",
      description: "04MM CLEAR",
      price: 42.8,
      tax: "15% GST",
      qty: 0,
      width: 0,
      height: 0,
    },
    {
      itemType: "Consumable",
      itemCode: "12BK",
      description: "12 MM ALU BLACK",
      price: 0.0,
      tax: "15% GST",
      qty: 0,
      width: 0,
      height: 0,
    },
    {
      itemType: "Glass",
      itemCode: "04CFL",
      description: "04MM CLEAR",
      price: 42.8,
      tax: "15% GST",
      qty: 0,
      width: 0,
      height: 0,
    },
  ]);

  return (
    <div className="p-4">
      {/* Customer Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <IgrInput
          placeholder="Customer Name"
          value="Aspiring Glass 2024 Ltd."
        />
        <IgrInput placeholder="Address" value="4 Venture Crescent, Wanaka" />
        <IgrInput placeholder="Suburb" value="Otago" />
        <IgrInput placeholder="Post Code" value="9305" />
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <IgrInput placeholder="Order No" value="Auto Number" />
        <IgrInput placeholder="Order Date" value="13/03/2025" />
        <IgrInput placeholder="Due Date" value="18/03/2025" />
        {/* <IgrComboBox
          dataSource={["Truck", "Courier"]}
          placeholder="Delivery Method"
        /> */}
      </div>

      {/* Sales Order Data Grid */}
      <IgrDataGrid
        height="300px"
        width="100%"
        autoGenerateColumns={false}
        dataSource={orderData}
      >
        <IgrTextColumn field="itemType" headerText="Item Type" width="150" />
        <IgrTextColumn field="itemCode" headerText="Item Code" width="120" />
        <IgrTextColumn
          field="description"
          headerText="Item Description"
          width="250"
        />
        <IgrNumericColumn field="qty" headerText="Qty" width="80" />
        <IgrNumericColumn field="width" headerText="Width" width="100" />
        <IgrNumericColumn field="height" headerText="Height" width="100" />
        <IgrNumericColumn field="price" headerText="Price" width="120" />
        <IgrTextColumn field="tax" headerText="Tax Code" width="100" />
      </IgrDataGrid>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4">
        <IgrButton variant="contained">Save</IgrButton>
        <IgrButton variant="outlined">Delete Row</IgrButton>
        <IgrButton variant="text">Print</IgrButton>
      </div>
    </div>
  );
};

export default SalesOrderUI;
