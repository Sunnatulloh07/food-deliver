"use client";

import { CircularProgress } from "@/components/ui/circular-progress";
import { DashboardCardType } from "@/configs/types";

function DashboardCard({
  title,
  icon,
  color,
  percentage,
  amount,
}: DashboardCardType) {
  return (
    <div className="aspect-video rounded-xl bg-[#111C42] p-5">
      <div className="flex w-full justify-between items-center">
        <div>
          <span className="text-3xl text-[#46CBA0]">{icon}</span>
          <h3 className="pt-3 text-2xl">{amount}</h3>
        </div>
        <div>
          <CircularProgress
            color={color}
            value={percentage}
            size={50}
            showValue
            valueClassName="text-[12px]"
            strokeWidth={4}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <h5 className="py-3 text-2xl text-[#46CBA0]">{title}</h5>
      </div>
    </div>
  );
}

export default DashboardCard;
