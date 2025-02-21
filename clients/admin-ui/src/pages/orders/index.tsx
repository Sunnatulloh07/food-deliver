import OrdersData from "@/components/shared/dashboard/ordersData";
import React from "react";

function Orders() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center pt-3">All Orders</h1>
      <OrdersData />
    </div>
  );
}

export default Orders;
