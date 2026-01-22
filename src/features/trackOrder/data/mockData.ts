import type { TrackOrderData } from "../types";

export const mockTrackOrderData: TrackOrderData = {
  orderNumber: "12345",
  status: "out_for_delivery",
  store: "Fresh Market Store",
  items: [
    { id: 1, name: "Organic Bananas", quantity: 2, price: "$4.50" },
    { id: 2, name: "Fresh Milk", quantity: 1, price: "$3.00" },
    { id: 3, name: "Whole Grain Bread", quantity: 1, price: "$2.00" },
  ],
  paymentMethod: "cash_on_delivery",
  itemsSubtotal: "$9.50",
  deliveryFee: "Free delivery",
  deliveryIsFree: true,
  totalAmount: "$10.50",
  driver: {
    name: "Ahmed Hassan",
    image: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=3b82f6&color=fff&size=128",
    vehicleType: "Motorcycle Delivery",
    phoneNumber: "+971 50 123 4567",
    vehicle: "Honda CB 150R",
    plateNumber: "DXB-1234",
    location: {
      lat: 40.7282,
      lng: -73.8567,
    },
    eta: "12 min",
  },
  destination: {
    lat: 40.7282,
    lng: -73.8449,
    address: "123 Main Street, Queens, NY",
  },
  eta: "15 min",
};

