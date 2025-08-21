import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Search, FileText, Users, ArrowRight } from "lucide-react";

export default function QuickActions({ userType }) {
  const jobSeekerActions = [
    {
      title: "Настроить профиль",
      description: "Заполните анкету и загрузите резюме",
      icon: User,
      link: createPageUrl("JobSeekerProfile"),
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      title: "Найти референсов",
      description: "Просмотрите список доступных референсов",
      icon: Search,
      link: createPageUrl("Referrers"),
      bgColor: "from-emerald-500 to-emerald-600"
    }
  ];

  const referrerActions = [
    {
 
