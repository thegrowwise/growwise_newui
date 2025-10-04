'use client';

import React, { useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar, 
  Users, 
  CheckCircle,
  Send,
  Star,
  ExternalLink,
  Navigation,
  Car,
  Zap,
  HelpCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  GraduationCap,
  Award,
  Building
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContactRequested } from '@/store/slices/contactSlice';
import { getIconComponent } from '@/lib/iconMap';

export default function Contact() {
  const { openChatbot } = useChatbot();
  const t = useTranslations('contact');
  const dispatch = useAppDispatch();
  const contact = useAppSelector((s) => s.contact.data);
  const contactLoading = useAppSelector((s) => s.contact.loading);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    program: '',
    gradeLevel: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (!contact && !contactLoading) dispatch(fetchContactRequested());
  }, [contact, contactLoading, dispatch]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const programs = contact?.programs ?? [];

  const contactInfo = contact?.contactInfo ?? [];

  const officeHours = contact?.officeHours ?? [];

  const faqs = contact?.faqs ?? [];

  const socialLinks = contact?.socialLinks ?? [];

  // Location details
  const locationDetails = contact?.locationDetails ?? {};

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-white shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('success.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('success.description')}
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-[#1F396D] hover:bg-[#29335C] text-white"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Message
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[#F16112] text-[#F16112] hover:bg-[#F16112] hover:text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call (925) 456-4606
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {contact?.hero?.title || t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {contact?.hero?.subtitle || t('subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-6 py-3">
              <Phone className="w-5 h-5 mr-2" />
{t('buttons.callNow')}
            </Button>
            <Button 
              onClick={openChatbot}
              variant="outline" 
              className="border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white px-6 py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
{t('buttons.startChat')}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {contact?.contactMethods?.title || t('contactMethods.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {contact?.contactMethods?.subtitle || t('contactMethods.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
                return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`${item.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="font-semibold text-gray-800 mb-1">{item.primary}</p>
                    <p className="text-sm text-gray-600 mb-3">{item.secondary}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </CardContent>
                </Card>
                );
              })}
            </div>
            </div>
      </section>

      {/* Main Contact Form and Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl h-full">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F16112] rounded-lg flex items-center justify-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    {contact?.form?.title || t('formSection.title')}
                  </CardTitle>
                  <p className="text-gray-600">
                    {contact?.form?.subtitle || t('formSection.subtitle')}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]"
                          required
                        />
                      </div>
                      </div>
                      
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]"
                        />
                      </div>
                      </div>
                      
                    {/* Program Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Interested Program *</Label>
                        <Select onValueChange={(value) => handleInputChange('program', value)}>
                          <SelectTrigger className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]">
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.value} value={program.value}>
                                {program.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Student Grade Level</Label>
                        <Select onValueChange={(value) => handleInputChange('gradeLevel', value)}>
                          <SelectTrigger className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]">
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="k">Kindergarten</SelectItem>
                            <SelectItem value="1-2">Grades 1-2</SelectItem>
                            <SelectItem value="3-5">Grades 3-5</SelectItem>
                            <SelectItem value="6-8">Grades 6-8</SelectItem>
                            <SelectItem value="9-10">Grades 9-10</SelectItem>
                            <SelectItem value="11-12">Grades 11-12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="e.g., Free Assessment Request, Program Information"
                        className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112]"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={5}
                        placeholder="Tell us about your child's learning goals, current challenges, or any specific questions about our programs..."
                        className="border-gray-300 focus:border-[#F16112] focus:ring-[#F16112] resize-none"
                        required
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-3">
                      <Label>Preferred Contact Method</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === 'email'}
                            onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                            className="text-[#F16112] focus:ring-[#F16112]"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={formData.preferredContact === 'phone'}
                            onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                            className="text-[#F16112] focus:ring-[#F16112]"
                          />
                          <span className="text-sm">Phone</span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                      <Send className="w-5 h-5 mr-2" />
{t('form.submit')}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to receive communications from GrowWise School. 
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-2 space-y-6 h-full">
              
              {/* Office Hours Card */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#F16112]" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                      schedule.isOpen ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                    }`}>
                      <span className={`font-medium ${schedule.isOpen ? 'text-green-800' : 'text-gray-700'}`}>
                        {schedule.day}
                      </span>
                      <span className={`${schedule.isOpen ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Evening and weekend appointments available by request.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Stay connected for updates and educational tips</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = getIconComponent(social.icon);
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 hover:bg-[#F16112] rounded-lg flex items-center justify-center transition-colors group"
                          aria-label={social.label}
                        >
                          <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-white" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="bg-gradient-to-br from-[#1F396D] to-[#29335C] text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#F1894F]" />
                    Why Choose GrowWise?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#F1894F]" />
                      <span className="text-sm">300+ Happy Students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-[#F1894F]" />
                      <span className="text-sm">98% Success Rate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#F1894F]" />
                      <span className="text-sm">Expert Teachers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#F1894F]" />
                      <span className="text-sm">5+ Years Experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our <span className="text-[#F16112]">Center</span>
            </h2>
            <p className="text-lg text-gray-600">
              Located in the heart of Dublin, CA, our facility provides an optimal learning environment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl overflow-hidden">
                <div className="relative">
                  <div className="h-96 lg:h-[500px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-121.9357!3d37.7021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fe72797a3f4b3%3A0x8e9e5e5e5e5e5e5e!2s4564%20Dublin%20Blvd%2C%20Dublin%2C%20CA%2094568%2C%20USA!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="GrowWise School Location"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  
                  {/* Map Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <a
                      href={locationDetails.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <ExternalLink className="w-5 h-5 text-[#1F396D] group-hover:scale-110 transition-transform duration-300" />
                    </a>
                    <a
                      href={locationDetails.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#F16112] p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Navigation className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#F16112]" />
                    Visit Our Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-[#F16112] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Free Parking</p>
                      <p className="text-gray-600 text-sm">Convenient on-site parking for all visitors</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#F1894F] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">Modern Facilities</p>
                      <p className="text-gray-600 text-sm">State-of-the-art classrooms and technology</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <a
                      href={locationDetails.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-[#1F396D] hover:bg-[#29335C] text-white">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </a>
                    <a
                      href={`tel:${locationDetails.phone}`}
                      className="block"
                    >
                      <Button className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Us
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-[#F16112]">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about GrowWise, our programs, and enrollment process.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F16112]/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-[#F16112]" />
                    </div>
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button 
              onClick={openChatbot}
              className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-6 py-2"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1F396D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">
            Don't wait - transform your child's learning journey today. Our expert team is ready to help you find the perfect program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3 text-lg">
              <Phone className="w-5 h-5 mr-2" />
              Call (925) 456-4606
            </Button>
            <Button 
              onClick={openChatbot}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-3 text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Schedule Free Assessment
            </Button>
        </div>
      </div>
    </section>
    </div>
  );
} 