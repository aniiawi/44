import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UserPlus, ArrowRight, ArrowLeft, Search, Users } from "lucide-react";

export default function Register() {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    linkedin_url: "",
    location: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type) {
      setUserType(type);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await User.updateMyUserData({
        user_type: userType,
        ...formData
      });
      
      // Redirect based on user type
      if (userType === "job_seeker") {
        navigate(createPageUrl("JobSeekerProfile"));
      } else {
        navigate(createPageUrl("ReferrerProfile"));
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goBack = () => {
    navigate(createPageUrl("Dashboard"));
  };

  const roleInfo = {
    job_seeker: {
      title: "Профиль соискателя",
      icon: Search,
      description: "Создайте профиль для поиска референсов"
    },
    referrer: {
      title: "Профиль референса", 
      icon: Users,
      description: "Настройте профиль для помощи соискателям"
    }
  };

  const currentRole = roleInfo[userType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={goBack}
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {currentRole ? <currentRole.icon className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Завершение регистрации</h1>
          <p className="text-blue-100">{currentRole?.description || "Настройте ваш профиль"}</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-slate-800 flex items-center justify-center gap-2">
              {currentRole && <currentRole.icon className="w-5 h-5" />}
              {currentRole?.title || "Настройка профиля"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn профиль</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Москва, Россия"
                  className="bg-white border-slate-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Сохранение...
                  </div>
                ) : (
                  <>
                    Продолжить к настройке профиля
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

