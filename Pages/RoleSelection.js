import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Users, ArrowRight, UserPlus } from "lucide-react";

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <UserPlus className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
          ReferNet
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Найдите референса для работы мечты или помогите другим получить оффер
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link to={createPageUrl("Register", "type=job_seeker")} className="block">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer h-full group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Я ищу работу
                </h3>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  Найдите референса в вашей целевой компании и получите приглашение на собеседование
                </p>
                <div className="flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                  <span className="mr-2">Начать поиск</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to={createPageUrl("Register", "type=referrer")} className="block">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer h-full group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Я могу дать реферал
                </h3>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  Помогите соискателям найти работу в вашей компании и получайте вознаграждение
                </p>
                <div className="flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                  <span className="mr-2">Начать помогать</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm">
            Уже есть аккаунт? 
            <button 
              onClick={() => window.location.href = createPageUrl("Dashboard")}
              className="text-white hover:text-blue-100 underline ml-1"
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
