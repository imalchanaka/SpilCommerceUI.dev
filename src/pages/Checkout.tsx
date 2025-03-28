import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { MapPin, Phone, User, Hash } from "lucide-react";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

interface ValidationErrors {
  customerName?: string;
  customerCode?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const Checkout = () => {
  const toast = useRef<Toast>(null);
  const { items } = useSelector((state: RootState) => state.cart);
  const [customerName, setCustomerName] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendInvoice, setSendInvoice] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateZipCode = (zipCode: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const validateCustomerCode = (code: string) => {
    const codeRegex = /^CUST-\d{3,}$/;
    return codeRegex.test(code);
  };

  const getFormErrorMessage = (field: keyof ValidationErrors) => {
    let error = "";

    if (submitted) {
      if (field === "customerName" && !customerName) {
        error = "Customer name is required";
      } else if (field === "customerName" && customerName.length < 2) {
        error = "Name must be at least 2 characters long";
      } else if (field === "customerCode" && !customerCode) {
        error = "Customer code is required";
      }
      //  else if (
      //   field === "customerCode" &&
      //   !validateCustomerCode(customerCode)
      // ) {
      //   error = "Invalid format. Use CUST-XXX format";
      // }
      else if (field === "email" && !email) {
        error = "Email is required";
      } else if (field === "email" && !validateEmail(email)) {
        error = "Invalid email format";
      } else if (field === "phone" && !phone) {
        error = "Phone number is required";
      } else if (field === "phone" && !validatePhone(phone)) {
        error = "Invalid phone number format";
      } else if (field === "street" && !deliveryAddress.street) {
        error = "Street address is required";
      } else if (field === "city" && !deliveryAddress.city) {
        error = "City is required";
      } else if (field === "state" && !deliveryAddress.state) {
        error = "State is required";
      } else if (field === "zipCode" && !deliveryAddress.zipCode) {
        error = "ZIP code is required";
      } else if (
        field === "zipCode" &&
        !validateZipCode(deliveryAddress.zipCode)
      ) {
        error = "Invalid ZIP code format";
      } else if (field === "country" && !deliveryAddress.country) {
        error = "Country is required";
      }
    }

    return error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid =
      [
        customerName,
        customerCode,
        email,
        phone,
        deliveryAddress.street,
        deliveryAddress.city,
        deliveryAddress.state,
        deliveryAddress.zipCode,
        deliveryAddress.country,
      ].every((field) => field.trim() !== "") &&
      validateEmail(email) &&
      validatePhone(phone) &&
      validateZipCode(deliveryAddress.zipCode) &&
      validateCustomerCode(customerCode);

    if (isValid) {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Order submitted successfully",
        life: 3000,
      });
      // Handle checkout logic here
      console.log("Form is valid, proceeding with checkout");
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields correctly",
        life: 3000,
      });
    }
  };

  const getInputClassName = (field: keyof ValidationErrors) => {
    const baseClasses =
      "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const error = getFormErrorMessage(field);
    return classNames(
      baseClasses,
      { "border-red-500 bg-red-50": error },
      { "border-gray-300": !error }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toast ref={toast} />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {items.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between py-2"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`pl-10 ${getInputClassName("customerName")}`}
                      placeholder="John Doe"
                    />
                  </div>
                  <small className="p-error">
                    {getFormErrorMessage("customerName")}
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={customerCode}
                      onChange={(e) => setCustomerCode(e.target.value)}
                      className={`pl-10 ${getInputClassName("customerCode")}`}
                      placeholder="CUST-123"
                    />
                  </div>
                  <small className="p-error">
                    {getFormErrorMessage("customerCode")}
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={getInputClassName("email")}
                    placeholder="your@email.com"
                  />
                  <small className="p-error">
                    {getFormErrorMessage("email")}
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`pl-10 ${getInputClassName("phone")}`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <small className="p-error">
                    {getFormErrorMessage("phone")}
                  </small>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          street: e.target.value,
                        })
                      }
                      className={`pl-10 ${getInputClassName("street")}`}
                      placeholder="123 Main St"
                    />
                  </div>
                  <small className="p-error">
                    {getFormErrorMessage("street")}
                  </small>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          city: e.target.value,
                        })
                      }
                      className={getInputClassName("city")}
                      placeholder="City"
                    />
                    <small className="p-error">
                      {getFormErrorMessage("city")}
                    </small>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          state: e.target.value,
                        })
                      }
                      className={getInputClassName("state")}
                      placeholder="State"
                    />
                    <small className="p-error">
                      {getFormErrorMessage("state")}
                    </small>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.zipCode}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          zipCode: e.target.value,
                        })
                      }
                      className={getInputClassName("zipCode")}
                      placeholder="12345"
                    />
                    <small className="p-error">
                      {getFormErrorMessage("zipCode")}
                    </small>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.country}
                      onChange={(e) =>
                        setDeliveryAddress({
                          ...deliveryAddress,
                          country: e.target.value,
                        })
                      }
                      className={getInputClassName("country")}
                      placeholder="Country"
                    />
                    <small className="p-error">
                      {getFormErrorMessage("country")}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendInvoice}
                    onChange={(e) => setSendInvoice(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2">Send invoice to email</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={items.length === 0}
              >
                Complete Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../store";
// import { MapPin, Phone, User, Hash } from "lucide-react";

// const Checkout = () => {
//   const { items } = useSelector((state: RootState) => state.cart);
//   const [customerName, setCustomerName] = useState("");
//   const [customerCode, setCustomerCode] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [sendInvoice, setSendInvoice] = useState(false);
//   const [deliveryAddress, setDeliveryAddress] = useState({
//     street: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "",
//   });

//   const total = items.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle checkout logic here
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div>
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//             {items.length === 0 ? (
//               <p className="text-gray-500 italic">Your cart is empty</p>
//             ) : (
//               items.map((item) => (
//                 <div
//                   key={item.product.id}
//                   className="flex justify-between py-2"
//                 >
//                   <span>
//                     {item.product.name} x {item.quantity}
//                   </span>
//                   <span>
//                     ${(item.product.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))
//             )}
//             <div className="mt-4 pt-4 border-t">
//               <div className="flex justify-between text-xl font-semibold">
//                 <span>Total:</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Customer Name
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <input
//                       type="text"
//                       value={customerName}
//                       onChange={(e) => setCustomerName(e.target.value)}
//                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                       placeholder="John Doe"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Customer Code
//                   </label>
//                   <div className="relative">
//                     <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <input
//                       type="text"
//                       value={customerCode}
//                       onChange={(e) => setCustomerCode(e.target.value)}
//                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                       placeholder="CUST-123"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="your@email.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                       placeholder="+1 (555) 000-0000"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Street Address
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     value={deliveryAddress.street}
//                     onChange={(e) =>
//                       setDeliveryAddress({
//                         ...deliveryAddress,
//                         street: e.target.value,
//                       })
//                     }
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="123 Main St"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     value={deliveryAddress.city}
//                     onChange={(e) =>
//                       setDeliveryAddress({
//                         ...deliveryAddress,
//                         city: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="City"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     State
//                   </label>
//                   <input
//                     type="text"
//                     value={deliveryAddress.state}
//                     onChange={(e) =>
//                       setDeliveryAddress({
//                         ...deliveryAddress,
//                         state: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="State"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ZIP Code
//                   </label>
//                   <input
//                     type="text"
//                     value={deliveryAddress.zipCode}
//                     onChange={(e) =>
//                       setDeliveryAddress({
//                         ...deliveryAddress,
//                         zipCode: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="12345"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Country
//                   </label>
//                   <input
//                     type="text"
//                     value={deliveryAddress.country}
//                     onChange={(e) =>
//                       setDeliveryAddress({
//                         ...deliveryAddress,
//                         country: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                     placeholder="Country"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="mb-6">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={sendInvoice}
//                   onChange={(e) => setSendInvoice(e.target.checked)}
//                   className="rounded border-gray-300"
//                 />
//                 <span className="ml-2">Send invoice to email</span>
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-200"
//             >
//               Complete Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// // import React, { useState } from 'react';
// // import { useSelector } from 'react-redux';
// // import { RootState } from '../store';

// // const Checkout = () => {
// //   const { items } = useSelector((state: RootState) => state.cart);
// //   const [email, setEmail] = useState('');
// //   const [sendInvoice, setSendInvoice] = useState(false);

// //   const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     // Handle checkout logic here
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto">
// //       <h1 className="text-3xl font-bold mb-8">Checkout</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
// //           {items.map((item) => (
// //             <div key={item.product.id} className="flex justify-between py-2">
// //               <span>{item.product.name} x {item.quantity}</span>
// //               <span>${(item.product.price * item.quantity).toFixed(2)}</span>
// //             </div>
// //           ))}
// //           <div className="mt-4 pt-4 border-t">
// //             <div className="flex justify-between text-xl font-semibold">
// //               <span>Total:</span>
// //               <span>${total.toFixed(2)}</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
// //           <form onSubmit={handleSubmit}>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Email Address
// //               </label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="w-full px-3 py-2 border rounded-md"
// //                 required
// //               />
// //             </div>

// //             <div className="mb-6">
// //               <label className="flex items-center">
// //                 <input
// //                   type="checkbox"
// //                   checked={sendInvoice}
// //                   onChange={(e) => setSendInvoice(e.target.checked)}
// //                   className="rounded border-gray-300"
// //                 />
// //                 <span className="ml-2">Send invoice to email</span>
// //               </label>
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
// //             >
// //               Complete Order
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Checkout;
