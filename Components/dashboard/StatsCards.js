import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCards({ title, value, icon: Icon, bgColor, trend }) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${bgColor} opacity-10 rounded-full transform translate-x-6 -translate-y-6`}></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-sm text-slate-600 mt-2">
            <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
