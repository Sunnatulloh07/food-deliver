import OrdersData from "../shared/dashboard/ordersData"
import InvoiceCharts from "../shared/dashboard/charts/invoiceCharts"

function DashobardData() {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
    <div className="w-full flex items-center justify-between">
      <div className="w-[56%]">
        <h3 className="text-2xl">Recents Orders</h3>
        <OrdersData isDashboard />
      </div>
      <div className="w-[43%]">
        <h3 className="text-2xl">Orders Analytics</h3>
        <InvoiceCharts />
      </div>
    </div>
    </div>
  )
}

export default DashobardData