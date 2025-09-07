'use client';

import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Target, 
  Heart, 
  Award, 
  Users, 
  Star, 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Globe, 
  Shield, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Zap, 
  Brain, 
  Code, 
  Calculator, 
  PenTool, 
  Gamepad2,
  MessageCircle,
  ArrowRight,
  Quote,
  Sparkles,
  Crown,
  Rocket,
  ThumbsUp
} from "lucide-react";

const AboutUsPage: React.FC = () => {
  const [activeTeamMember, setActiveTeamMember] = useState(0);

  // Mission, Vision, Values data
  const coreValues = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower every student with personalized education that builds strong academic foundations while fostering creativity, critical thinking, and a lifelong love of learning.",
      gradient: "from-[#1F396D] to-[#29335C]",
      bgColor: "bg-[#1F396D]/10"
    },
    {
      icon: Heart,
      title: "Our Vision", 
      description: "To be the leading educational center in the Tri-Valley area, transforming students into confident, capable learners ready for future academic and career success.",
      gradient: "from-[#F16112] to-[#F1894F]",
      bgColor: "bg-[#F16112]/10"
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Excellence in education, personalized attention, innovative teaching methods, strong community partnerships, and unwavering commitment to student success.",
      gradient: "from-[#F1894F] to-[#F16112]",
      bgColor: "bg-[#F1894F]/10"
    }
  ];

  // Our story and achievements
  const achievements = [
    {
      icon: Users,
      title: "300+ Students Served",
      description: "Since 2019, we've helped over 300 students achieve their academic goals",
      value: "300+",
      color: "text-[#1F396D]",
      bgColor: "bg-[#1F396D]/10"
    },
    {
      icon: Star,
      title: "98% Satisfaction Rate",
      description: "Consistently high parent and student satisfaction scores",
      value: "98%",
      color: "text-[#F16112]",
      bgColor: "bg-[#F16112]/10"
    },
    {
      icon: TrendingUp,
      title: "95% Improvement Rate",
      description: "95% of students show measurable improvement within first semester",
      value: "95%",
      color: "text-[#F1894F]",
      bgColor: "bg-[#F1894F]/10"
    },
    {
      icon: Award,
      title: "5+ Years of Excellence",
      description: "Recognized as a leading educational center in Dublin and Tri-Valley area",
      value: "2019",
      color: "text-[#29335C]",
      bgColor: "bg-[#29335C]/10"
    }
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "With over 15 years in education, Dr. Chen founded GrowWise to provide personalized learning experiences that help every student reach their full potential.",
      expertise: ["Educational Leadership", "Curriculum Development", "Student Assessment"],
      education: "Ph.D. in Education, Stanford University"
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Math Instructor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "A passionate mathematics educator who believes every student can excel in math with the right approach and support.",
      expertise: ["Advanced Mathematics", "DUSD Accelerated Programs", "SAT/ACT Prep"],
      education: "M.S. in Mathematics, UC Berkeley"
    },
    {
      name: "Lisa Thompson",
      role: "English & Writing Specialist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "An award-winning educator specializing in reading comprehension, creative writing, and helping students find their unique voice.",
      expertise: ["Reading Enrichment", "Creative Writing", "ESL Support"],
      education: "M.A. in English Literature, UCLA"
    },
    {
      name: "David Kim",
      role: "STEAM Program Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "A tech industry veteran turned educator, passionate about introducing young minds to coding, robotics, and entrepreneurship.",
      expertise: ["Python Programming", "AI/ML Education", "Young Entrepreneurship"],
      education: "B.S. Computer Science, MIT"
    }
  ];

  // Educational philosophy
  const educationalApproach = [
    {
      icon: UserCheck,
      title: "Personalized Learning",
      description: "Every student receives instruction tailored to their unique learning style, pace, and academic goals through individualized assessment and customized lesson plans.",
      benefits: ["Individual assessment", "Custom lesson plans", "Progress tracking"]
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "With maximum 6 students per K-12 class and 4 per STEAM class, every student receives the attention and support they need to succeed.",
      benefits: ["Max 6:1 ratio for K-12", "Max 4:1 ratio for STEAM", "Individual attention"]
    },
    {
      icon: Lightbulb,
      title: "Innovative Methods",
      description: "We combine proven traditional teaching methods with cutting-edge educational technology and hands-on learning experiences.",
      benefits: ["Latest EdTech tools", "Interactive learning", "Real-world applications"]
    },
    {
      icon: Target,
      title: "Goal-Oriented Approach",
      description: "We set clear, measurable goals for each student and track progress regularly to ensure continuous improvement and success.",
      benefits: ["SMART goal setting", "Regular assessments", "Parent communication"]
    }
  ];

  // Community involvement - Removed Scholarship Programs
  const communityImpact = [
    {
      icon: Building,
      title: "Local School Partnerships",
      description: "Collaborating with Dublin Unified School District and surrounding schools to support student success"
    },
    {
      icon: Users,
      title: "Parent Workshops",
      description: "Regular workshops helping parents support their children's learning journey at home"
    },
    {
      icon: Globe,
      title: "STEM Outreach",
      description: "Community events and coding workshops to inspire the next generation of innovators"
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "Parent of Sofia (Grade 7)",
      content: "GrowWise has been transformational for Sofia. She went from struggling with math to being excited about algebra. The personalized approach really works!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Alex Chen",
      role: "High School Senior",
      content: "The Python programming course at GrowWise opened up a whole new world for me. I'm now pursuing computer science in college thanks to the foundation I built here.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Robert Johnson",
      role: "Parent of Emma (Grade 4)",
      content: "The reading enrichment program helped Emma develop a genuine love for books. Her confidence and comprehension have improved dramatically.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-[#F16112]">GrowWise</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Since 2019, GrowWise has been transforming education in Dublin, CA, through personalized K-12 instruction 
              and innovative STEAM programs. We empower every student with the skills, knowledge, and confidence they need to succeed.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1F396D] mb-2">2019</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F16112] mb-2">300+</div>
              <div className="text-sm text-gray-600">Students Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F1894F] mb-2">25+</div>
              <div className="text-sm text-gray-600">Courses Offered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#29335C] mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F16112]">Foundation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything we do is guided by our core mission, vision, and values that put student success at the center.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our <span className="text-[#F16112]">Story</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2019 in the heart of Dublin, California, GrowWise was born from a simple but powerful vision: 
                  every child deserves personalized education that meets them where they are and helps them reach their full potential.
                </p>
                <p>
                  What started as a small tutoring center has grown into a comprehensive educational institution serving families 
                  throughout the Tri-Valley area. Our founder, Dr. Sarah Chen, recognized that traditional one-size-fits-all 
                  education wasn't serving the diverse learning needs of today's students.
                </p>
                <p>
                  Today, GrowWise stands as a testament to what's possible when passionate educators combine proven teaching 
                  methods with innovative technology and genuine care for each student's success. We've helped over 300 students 
                  not just improve their grades, but develop confidence, curiosity, and a lifelong love of learning.
                </p>
              </div>
              
              <div className="mt-8">
                <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-6 py-3">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get to Know Us
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F16112]">Achievements</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to student success and educational excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className={`${achievement.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${achievement.color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${achievement.color} mb-2`}>
                      {achievement.value}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educational Approach Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Educational <span className="text-[#F16112]">Approach</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe effective education requires more than delivering content. Our approach is built on four core principles 
              that ensure every student receives the support they need to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationalApproach.map((approach, index) => {
              const IconComponent = approach.icon;
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#F16112]/10 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-[#F16112]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{approach.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{approach.description}</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-[#F16112]">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our passionate educators bring years of experience and genuine care for student success to every lesson.
            </p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community <span className="text-[#F16112]">Impact</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe in giving back to the community that supports us, creating opportunities for all students to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityImpact.map((impact, index) => {
              const IconComponent = impact.icon;
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our <span className="text-[#F16112]">Families</span> Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what parents and students say about their GrowWise experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112]" />
                    ))}
                  </div>
                  
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-[#F16112]/20 absolute -top-2 -left-2" />
                    <p className="text-gray-700 italic leading-relaxed pl-6">
                      "{testimonial.content}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1F396D]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Visit Our <span className="text-[#F1894F]">Dublin</span> Center
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Located in the heart of Dublin, CA, our modern facility provides the perfect environment for learning and growth.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-sm text-white/80">4564 Dublin Blvd, Dublin, CA</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-sm text-white/80">(925) 456-4606</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6 text-[#F1894F]" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-white/80">connect@thegrowwise.com</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule a Tour
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-3">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;



