'use client';

import React, { useEffect, useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Star, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  MessageCircle,
  Quote} from "lucide-react";
import { getIconComponent } from '@/lib/iconMap';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAboutRequested } from '@/store/slices/aboutSlice';
import TestimonialsWithBackend from './TestimonialsWithBackend';
import { CONTACT_INFO } from '@/lib/constants';

export default function About() {
  const { openChatbot } = useChatbot();
  const t = useTranslations('about');
  const dispatch = useAppDispatch();
  const about = useAppSelector((s) => s.about.data);
  const aboutLoading = useAppSelector((s) => s.about.loading);
  const [activeTeamMember, setActiveTeamMember] = useState(0);

  useEffect(() => {
    if (!about && !aboutLoading) dispatch(fetchAboutRequested());
  }, [about, aboutLoading, dispatch]);

  // Data (from API via Redux) with fallbacks
  const coreValues = about?.coreValues ?? [];

  // Our story and achievements
  const achievements = about?.achievements ?? [];

  // Team members data
  const teamMembers = about?.teamMembers ?? [];

  // Educational philosophy
  const educationalApproach = about?.educationalApproach ?? [];

  // Community involvement - Removed Scholarship Programs
  const communityImpact = about?.communityImpact ?? [];

  const testimonials = about?.testimonials ?? [];

  return (
    <div className="min-h-screen section-gray">
      {/* Hero Section */}
      <section className="section-base section-white">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h1 className="title-hero mb-6">{about?.hero?.title || t('hero.title')}</h1>
            <p className="subtitle max-w-4xl mx-auto mb-8">{about?.hero?.subtitle || t('hero.subtitle')}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {about?.hero?.stats?.map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="section-base section-gray">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h2 className="title-section mb-4">{t('foundation.title')}</h2>
            <p className="subtitle-sm max-w-3xl mx-auto">{t('foundation.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = getIconComponent(value.icon);
              return (
                <Card key={index} className="card-xl hover:card-2xl transition-all duration-300 group">
                  <CardContent className="card-padding text-center">
                    <div className={`icon-badge bg-gradient-to-r ${value.gradient} mx-auto mb-6 icon-badge-hover`}>
                      <IconComponent className="icon-md-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-strong mb-4">{value.title}</h3>
                    <p className="text-muted leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-base section-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="title-section mb-6">{about?.story?.title || t('story.title')}</h2>
              <div className="space-y-6 text-muted leading-relaxed">
                {about?.story?.paragraphs?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                )) || (
                  <>
                    <p>{t('story.p1')}</p>
                    <p>{t('story.p2')}</p>
                    <p>{t('story.p3')}</p>
                  </>
                )}
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={openChatbot}
                  className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-6 py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('buttons.getToKnowUs')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=300&fit=crop"
                  alt="Students learning in classroom"
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1515378791036-0648a814a05f?w=300&h=300&fit=crop"
                  alt="STEAM learning activities"
                  className="w-full h-48 object-cover rounded-xl shadow-lg mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop"
                  alt="One-on-one tutoring session"
                  className="w-full h-48 object-cover rounded-xl shadow-lg -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=300&fit=crop"
                  alt="Modern learning environment"
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-base section-gray">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h2 className="title-section mb-4">{t('achievements.title')}</h2>
            <p className="subtitle-sm max-w-3xl mx-auto">{t('achievements.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <Card key={index} className="card-base card-hover group text-center">
                  <CardContent className="card-padding">
                    <div className={`${achievement.bgColor} icon-badge mx-auto mb-4 icon-badge-hover`}>
                      <IconComponent className={`w-8 h-8 ${achievement.color}`} />
                    </div>
                    <div className={`stat-number ${achievement.color} mb-2`}>
                      {achievement.value}
                    </div>
                    <h3 className="text-lg font-bold text-strong mb-2">{achievement.title}</h3>
                    <p className="text-muted-sm">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educational Approach Section */}
      <section className="section-base section-white">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h2 className="title-section mb-4">{t('approach.title')}</h2>
            <p className="subtitle-sm max-w-3xl mx-auto">{t('approach.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationalApproach.map((approach, index) => {
              const IconComponent = getIconComponent(approach.icon);
              return (
                <Card key={index} className="card-base card-hover group">
                  <CardContent className="card-padding">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#F16112]/10 icon-badge icon-badge-hover">
                        <IconComponent className="icon-md-orange" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-strong mb-3">{approach.title}</h3>
                        <p className="text-muted mb-4 leading-relaxed">{approach.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {approach.benefits.map((benefit, benefitIndex) => (
                            <Badge key={benefitIndex} className="bg-[#1F396D]/10 text-[#1F396D] hover:bg-[#1F396D]/20">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="section-base section-gray">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h2 className="title-section mb-4">{t('team.title')}</h2>
            <p className="subtitle-sm max-w-3xl mx-auto">{t('team.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => setActiveTeamMember(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#F16112] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-[#F16112] font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{member.bio}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Expertise:</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.expertise.slice(0, 2).map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-[#1F396D]/10 text-[#1F396D] text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Section - Now with 3 items */}
      <section className="section-base section-white">
        <div className="max-w-7xl mx-auto">
          <div className="center-text mb-12">
            <h2 className="title-section mb-4">{t('community.title')}</h2>
            <p className="subtitle-sm max-w-3xl mx-auto">{t('community.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityImpact.map((impact, index) => {
              const IconComponent = getIconComponent(impact.icon);
              return (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-[#F16112]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-[#F16112]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{impact.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{impact.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsWithBackend />

      {/* Location & Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1F396D]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">{t('location.title')}</h2>
          <p className="text-xl mb-8 text-white/90">{t('location.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">{t('labels.address')}</div>
                <div className="text-sm text-white/80">{CONTACT_INFO.address}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">{t('labels.phone')}</div>
                <div className="text-sm text-white/80">{CONTACT_INFO.phone}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">{t('labels.email')}</div>
                <div className="text-sm text-white/80">{CONTACT_INFO.email}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              {t('buttons.scheduleTour')}
            </Button>
            <Button 
              onClick={openChatbot}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('buttons.contactUs')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}