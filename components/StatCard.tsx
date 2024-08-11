import clsx from "clsx";
import { Check } from 'lucide-react';
import Image from "next/image";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  count: number;
  label: string;
  icon: string;
  icons?: true | false;
};
export const StatCard = ({ count = 0, label, icon, type,icons }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        {!icons ? <Image
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />: <Check className='text-green-400 h-10 w-10' />}
        
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular !text-[28px] text-white text-nowrap">{label}</p>
    </div>
  );
};
