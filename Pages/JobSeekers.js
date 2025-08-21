import React, { useState, useEffect } from "react";
import { JobSeeker } from "@/entities/JobSeeker";
import { User } from "@/entities/User";
import { ReferralRequest } from "@/entities/ReferralRequest";
import { Search, SlidersHorizontal, Briefcase, Star, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const JobSeekerCard = ({ seeker, onSelect }) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(seeker)}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-slate-600 font-bold text-lg">{seeker.user?.full_name?.[0]}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{seeker.user?.full_name}</h3>
          <p className="text-blue-800 font-medium">{seeker.current_position}</p>
          <p className="text-sm text-slate-500 mt-1">{seeker.experience_years} лет опыта</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Ключевые навыки</h4>
        <div className="flex flex-wrap gap-2">
          {(seeker.skills || []).slice(0, 4).map(skill => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
          {(seeker.skills || []).length > 4 && <Badge variant="outline">...</Badge>}
        </div>
      </div>
    </div>
  );
};

const JobSeekerDetails = ({ seeker, isOpen, onClose, onRefer }) => {
  if (!seeker) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full md:w-[500px] sm:max-w-none flex flex-col">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-slate-600 font-bold text-2xl">{seeker.user?.full_name?.[0]}</span>
            </div>
            <div>
              <SheetTitle className="text-2xl font-bold">{seeker.user?.full_name}</SheetTitle>
              <SheetDescription className="text-blue-800 font-medium text-base">{seeker.current_position}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">О соискателе</h3>
            <p className="text-slate-600">{seeker.bio || "Нет информации."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500">Опыт</h4>
              <p className="font-semibold">{seeker.experience_years} лет</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500">Желаемая зарплата</h4>
              <p className="font-semibold">{seeker.desired_salary ? `${seeker.desired_salary.toLocaleString()} руб.` : "Не указана"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Целевые компании</h3>
            <div className="flex flex-wrap gap-2">
              {(seeker.target_companies || []).map(company => (
                <Badge key={company} variant="outline" className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />{company}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Навыки</h3>
            <div className="flex flex-wrap gap-2">
              {(seeker.skills || []).map(skill => (
                <Badge key={skill} className="bg-blue-100 text-blue-800">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            {seeker.resume_url && (
              <a href={seeker.resume_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full"><FileText className="w-4 h-4 mr-2" />Посмотреть резюме</Button>
              </a>
            )}
          </div>
        </div>
        <div className="p-6 border-t">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => onRefer(seeker)}>
            <Star className="w-4 h-4 mr-2" />Предложить реферал
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};


export default function JobSeekers() {
  const [seekers, setSeekers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeeker, setSelectedSeeker] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [seekersData, usersData, currentUserData] = await Promise.all([
        JobSeeker.filter({ status: "active" }),
        User.list(),
        User.me()
      ]);

      const usersMap = new Map(usersData.map(u => [u.id, u]));
      
      const combinedData = seekersData.map(seeker => ({
        ...seeker,
        user: usersMap.get(seeker.user_id)
      })).filter(s => s.user); // Filter out seekers without a user, just in case

      setSeekers(combinedData);
      setCurrentUser(currentUserData);
    } catch (error) {
      console.error("Failed to fetch job seekers:", error);
    }
    setIsLoading(false);
  };

  const handleRefer = async (seeker) => {
    try {
      await ReferralRequest.create({
        job_seeker_id: seeker.user_id,
        referrer_id: currentUser.id,
        target_company: "TBD", // To be decided by referrer later
        message: `${currentUser.full_name} предлагает вам реферал.`,
        status: "pending"
      });
      setSelectedSeeker(null);
      // Add some success notification later
    } catch(e) {
      console.error("Failed to create referral request", e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">

