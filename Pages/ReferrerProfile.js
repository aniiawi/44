import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Referrer } from "@/entities/Referrer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Plus, X, Briefcase } from "lucide-react";

const POPULAR_COMPANIES = [
  "Яндекс", "Сбербанк", "Тинькофф", "VK", "Авито", "Ozon", "Wildberries", 
  "Тензор", "Альфа-Банк", "МТС", "Мегафон", "Билайн", "Kaspersky",
  "JetBrains", "Rambler", "X5 Retail Group", "Магнит"
];

const POPULAR_SPECIALIZATIONS = [
  "Frontend", "Backend", "Fullstack", "DevOps", "Data Science", "Analyst",
  "QA", "Mobile (iOS/Android)", "Product Manager", "Project Manager", 
  "UI/UX Designer", "Marketing", "HR", "Sales"
];

export default function ReferrerProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    current_company: "",
    position: "",
    companies_can_refer: [],
    specializations: [],
    bio: "",
    referral_fee: "",
    status: "active"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const profiles = await Referrer.filter({ user_id: userData.id });
      if (profiles.length > 0) {
        const profileData = profiles[0];
        setProfile(profileData);
        setFormData({
          current_company: profileData.current_company || "",
          position: profileData.position || "",
          companies_can_refer: profileData.companies_can_refer || [],
          specializations: profileData.specializations || [],
          bio: profileData.bio || "",
          referral_fee: profileData.referral_fee || "",
          status: profileData.status || "active"
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const profileData = {
        ...formData,
        user_id: user.id,
        referral_fee: formData.referral_fee ? parseInt(formData.referral_fee) : 0,
      };

      if (profile) {
        await Referrer.update(profile.id, profileData);
      } else {
        await Referrer.create(profileData);
      }
      
      loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  const addCompany = (company) => {
    if (!formData.companies_can_refer.includes(company)) {
      setFormData(prev => ({ ...prev, companies_can_refer: [...prev.companies_can_refer, company] }));
    }
  };

  const removeCompany = (company) => {
    setFormData(prev => ({ ...prev, companies_can_refer: prev.companies_can_refer.filter(c => c !== company) }));
  };
  
  const addSpecialization = (spec) => {
    if (!formData.specializations.includes(spec)) {
      setFormData(prev => ({ ...prev, specializations: [...prev.specializations, spec] }));
    }
  };

  const removeSpecialization = (spec) => {
    setFormData(prev => ({ ...prev, specializations: prev.specializations.filter(s => s !== spec) }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Профиль референса</h1>
          <p className="text-slate-600">Эта информация будет видна соискателям</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5" />Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Текущая компания</Label>
                  <Input id="company" value={formData.current_company} onChange={(e) => setFormData(prev => ({ ...prev, current_company: e.target.value }))} placeholder="Яндекс"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Должность</Label>
                  <Input id="position" value={formData.position} onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))} placeholder="Senior Backend Engineer"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Расскажите о своем опыте и чем можете помочь..." rows={4}/>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />Возможности для рефералов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Компании, куда можете зареферить</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.companies_can_refer.map((c) => (<Badge key={c} variant="secondary" className="flex items-center gap-1">{c}<Button type="button" variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeCompany(c)}><X className="w-3 h-3" /></Button></Badge>))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_COMPANIES.filter(c => !formData.companies_can_refer.includes(c)).map((c) => (<Button key={c} type="button" variant="outline" size="sm" onClick={() => addCompany(c)} className="text-xs"><Plus className="w-3 h-3 mr-1" />{c}</Button>))}

