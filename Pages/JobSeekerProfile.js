import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { JobSeeker } from "@/entities/JobSeeker";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, X, Upload, CheckCircle } from "lucide-react";

const POPULAR_COMPANIES = [
  "Яндекс", "Сбербанк", "Тинькофф", "VK", "Авито", "Ozon", "Wildberries", 
  "Тензор", "Альфа-Банк", "МТС", "Мегафон", "Билайн", "Kaspersky",
  "JetBrains", "Rambler", "X5 Retail Group", "Магнит"
];

const POPULAR_SKILLS = [
  "Python", "JavaScript", "Java", "React", "Node.js", "SQL", "Git",
  "Docker", "Kubernetes", "AWS", "HTML/CSS", "TypeScript", "Go", "C#",
  "Project Management", "Agile", "Scrum", "UI/UX Design", "Data Analysis"
];

export default function JobSeekerProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    target_companies: [],
    experience_years: "",
    current_position: "",
    skills: [],
    desired_salary: "",
    bio: "",
    status: "active"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const profiles = await JobSeeker.filter({ user_id: userData.id });
      if (profiles.length > 0) {
        const profileData = profiles[0];
        setProfile(profileData);
        setFormData({
          target_companies: profileData.target_companies || [],
          experience_years: profileData.experience_years || "",
          current_position: profileData.current_position || "",
          skills: profileData.skills || [],
          desired_salary: profileData.desired_salary || "",
          bio: profileData.bio || "",
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
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
        desired_salary: formData.desired_salary ? parseInt(formData.desired_salary) : 0
      };

      if (profile) {
        await JobSeeker.update(profile.id, profileData);
      } else {
        await JobSeeker.create(profileData);
      }
      
      loadProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, resume_url: file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsUploading(false);
  };

  const addCompany = (company) => {
    if (!formData.target_companies.includes(company)) {
      setFormData(prev => ({
        ...prev,
        target_companies: [...prev.target_companies, company]
      }));
    }
  };

  const removeCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      target_companies: prev.target_companies.filter(c => c !== company)
    }));
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Профиль соискателя</h1>
          <p className="text-slate-600">Заполните информацию о себе для поиска референсов</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Основная информация

