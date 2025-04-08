import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { MapPin, Phone, User, Hash } from "lucide-react";
import { Toast } from "primereact/toast";

import { classNames } from "primereact/utils";
import { creatOrder } from "../pages/admin/api/ProductAPI";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } else if (field === "customerCode" && !validateCustomerCode(customerCode)) {
        error = "Customer code is required";
      } else if (field === "email" && !email) {
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

  const prepareOrderPayload = () => {
    const now = new Date();
    const orderTime = now.toISOString();

    return {
      customerName,
      customerCode,
      email,
      phoneNumber: phone,
      streetAddress: deliveryAddress.street,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      zipCode: deliveryAddress.zipCode,
      country: deliveryAddress.country,
      sendInvoiceToEmail: sendInvoice,
      orderTime, // Adding current time to the order
      orderItemsList: items.map((item, index) => ({
        orderId: index + 1,
        productName: item.product.name,
        productCode: "70",
        unitPrice: item.product.price,
        quantity: item.quantity,
      })),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setIsSubmitting(true);

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

    if (!isValid) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields correctly",
        life: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const orderPayload = prepareOrderPayload();
      console.log("Submitting order:", orderPayload);

      const response = await creatOrder(orderPayload);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Order submitted successfully",
        life: 3000,
      });

      // Reset form after successful submission
      setCustomerName("");
      setCustomerCode("");
      setEmail("");
      setPhone("");
      setDeliveryAddress({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
      setSendInvoice(false);
      setSubmitted(false);

      console.log("Order creation response:", response);
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to submit order. Please try again.",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            {items.length === 0 ? (
              <p className="italic text-gray-500">Your cart is empty</p>
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
            <div className="pt-4 mt-4 border-t">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Customer Code
                  </label>
                  <div className="relative">
                    <Hash className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
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

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    <label className="block mb-2 text-sm font-medium text-gray-700">
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

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sendInvoice}
                    onChange={(e) => setSendInvoice(e.target.checked)}
                    className="border-gray-300 rounded"
                  />
                  <span className="ml-2">Send invoice to email</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
