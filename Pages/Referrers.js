import React, { useState, useEffect } from "react";
import { Referrer } from "@/entities/Referrer";
import { User } from "@/entities/User";
import { ReferralRequest } from "@/entities/ReferralRequest";
import { Search, SlidersHorizontal, Building, Star, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ReferrerCard = ({ referrer, onSelect }) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(referrer)}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-slate-600 font-bold text-lg">{referrer.user?.full_name?.[0]}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{referrer.user?.full_name}</h3>
          <p className="text-blue-800 font-medium">{referrer.position}</p>
          <p className="text-sm text-slate-500 mt-1">{referrer.current_company}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Может зареферить в</h4>
        <div className="flex flex-wrap gap-2">
          {(referrer.companies_can_refer || []).slice(0, 3).map(company => (
            <Badge key={company} variant="secondary" className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              {company}
            </Badge>
          ))}
          {(referrer.companies_can_refer || []).length > 3 && <Badge variant="outline">+{(referrer.companies_can_refer || []).length - 3}</Badge>}
        </div>
      </div>
    </div>
  );
};

const ReferrerDetails = ({ referrer, isOpen, onClose, onRequest }) => {
  if (!referrer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full md:w-[500px] sm:max-w-none flex flex-col">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-slate-600 font-bold text-2xl">{referrer.user?.full_name?.[0]}</span>
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold">{referrer.user?.full_name}</SheetTitle>
              <SheetDescription className="text-blue-800 font-medium text-base">{referrer.position} в {referrer.current_company}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">О референсе</h3>
            <p className="text-slate-600">{referrer.bio || "Нет дополнительной информации."}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Компании для рефералов</h3>
            <div className="flex flex-wrap gap-2">
              {(referrer.companies_can_refer || []).map(company => (
                <Badge key={company} variant="outline" className="flex items-center gap-1.5">
                  <Building className="w-3 h-3" />
                  {company}
                </Badge>
              ))}
            </div>
          </div>

          <div>
 
