// AcademicPage migrated from Vite project
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "../components/ui/alert-dialog";
import { ImageWithFallback } from "./gw/ImageWithFallback";
import { Calculator, BookOpen, CheckCircle, ChevronRight, PenTool, UserCheck, Lightbulb, GraduationCap, HeartHandshake, X } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchAcademicRequested } from '@/store/slices/academicSlice';
import { getIconComponent } from '@/lib/iconMap';

// Data moved to Redux-Saga via public/api/mock/academic.json

const AcademicPage = ({ setCurrentPage }: { setCurrentPage?: (page: string) => void }) => {
    const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);
    const t = useTranslations('academic');
    const router = useRouter();
    const dispatch = useDispatch();
    const academic = useSelector((state: RootState) => state.academic.data);
    const loading = useSelector((state: RootState) => state.academic.loading);

    useEffect(() => {
        if (!academic && !loading) {
            dispatch(fetchAcademicRequested());
        }
    }, [academic, loading, dispatch]);

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-white to-gray-50">
			{/* Academic Programs Section */}
			<section className="py-20 px-4 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            {t('programs.titlePrefix')}{" "}
							<span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
                                {t('programs.titleHighlight')}
							</span>
						</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('programs.subtitle')}</p>
					</div>

					<Card className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.12)] border border-white/40 overflow-hidden">
						<CardContent className="p-12">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
								{/* Math Session */}
								<Card className="bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10 border-l-4 border-[#1F396D] hover:shadow-lg transition-all duration-300">
									<CardContent className="p-8">
										<div className="flex items-center gap-3 mb-4">
											<div className="p-3 bg-[#1F396D] rounded-lg">
												<Calculator className="w-6 h-6 text-white" />
											</div>
                                            <h3 className="text-xl font-bold text-[#1F396D]">{t('programs.mathSessionTitle')}</h3>
										</div>
										<p className="text-gray-700 leading-relaxed">
                                            {t('programs.mathSessionDesc')}
										</p>
									</CardContent>
								</Card>

								{/* English Session */}
								<Card className="bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10 border-l-4 border-[#F16112] hover:shadow-lg transition-all duration-300">
									<CardContent className="p-8">
										<div className="flex items-center gap-3 mb-4">
											<div className="p-3 bg-[#F16112] rounded-lg">
												<PenTool className="w-6 h-6 text-white" />
											</div>
                                            <h3 className="text-xl font-bold text-[#F16112]">{t('programs.englishSessionTitle')}</h3>
										</div>
										<p className="text-gray-700 leading-relaxed">
                                            {t('programs.englishSessionDesc')}
										</p>
									</CardContent>
								</Card>
							</div>

							{/* Session Pricing */}
							<Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 mt-12">
								<CardContent className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('programs.pricingTitle')}</h3>
									<div className="flex items-center justify-center gap-8 mb-6">
										<div className="text-center">
                                            <div className="text-3xl font-bold text-[#1F396D] mb-2">{t('programs.pricingFree')}</div>
                                            <div className="text-sm text-gray-600">{t('programs.pricingFreeNote')}</div>
										</div>
										<div className="w-px h-12 bg-gray-300"></div>
										<div className="text-center">
                                            <div className="text-3xl font-bold text-[#F16112] mb-2">{t('programs.pricingPaid')}</div>
                                            <div className="text-sm text-gray-600">{t('programs.pricingPaidNote')}</div>
										</div>
									</div>
                                    <p className="text-gray-600 text-lg mb-6">{t('programs.pricingDesc')}</p>
                                    <Button className="bg-gradient-to-r from-[#1F396D] to-[#F16112] hover:from-[#29335C] hover:to-[#F1894F] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                        {t('programs.registerCta')}
										<ChevronRight className="ml-2 w-5 h-5" />
									</Button>
								</CardContent>
							</Card>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Why Choose Our Academic Programs */}
			<section className="py-20 px-4 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            {t('why.title').replace('Academic Programs', '')}{" "}
							<span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">
                                {t('programs.titleHighlight')}
							</span>
                            ?
						</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('why.subtitle')}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(academic?.whyChooseAcademic || []).map((item, index) => (
							<Card
								key={index}
								className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 text-center ring-1 ring-white/30"
							>
								<CardContent className="p-8 relative">
									{/* Glass reflection overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
									<div className="relative z-10">
                                        <div className={`${item.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 ring-1 ring-white/20`}>
                                            {(() => { const Icon = getIconComponent(item.icon); return <Icon className={`w-10 h-10 ${item.color} drop-shadow-sm`} />; })()}
                                        </div>
										<h3 className="text-xl font-bold text-gray-900 mb-4 drop-shadow-sm">
											{item.title}
										</h3>
										<p className="text-gray-600 leading-relaxed">
											{item.description}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose GrowWise Section */}
			<section className="py-16 px-4 lg:px-8 relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-32 left-16 w-40 h-40 bg-[#1F396D]/8 rounded-full blur-3xl"></div>
					<div className="absolute bottom-20 right-20 w-56 h-56 bg-[#F16112]/10 rounded-full blur-3xl"></div>
				</div>

				<div className="max-w-7xl mx-auto relative z-10">
					{/* Section Header */}
					<div className="text-center mb-12">
                        <Badge className="bg-[#F16112] text-white mb-4 px-6 py-2 rounded-full">
                            {t('whyGrowwise.badge')}
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F396D] mb-4">
                            {t('whyGrowwise.title')}
                        </h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Left side - Student Image */}
						<div className="relative">
							<Card className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.12)] border border-white/40 overflow-hidden">
								<CardContent className="p-0">
									<ImageWithFallback
										src="https://images.unsplash.com/photo-1532788592275-3f310c81dd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjBsZWFybmluZyUyMHdpdGglMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1NzI2Nzg1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
										alt="Happy student learning with headphones"
										className="w-full h-auto object-cover"
									/>
								</CardContent>
							</Card>
						</div>

						{/* Right side - Benefits */}
						<div className="space-y-8">
							{/* Personalized Attention */}
							<Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											<UserCheck className="w-6 h-6 text-white" />
										</div>
										<div>
                                            <h4 className="font-bold text-lg text-[#1F396D] mb-2">{t('whyGrowwise.personalizedAttention.title')}</h4>
                                            <p className="text-gray-600 leading-relaxed">{t('whyGrowwise.personalizedAttention.desc')}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Engaging Curriculum */}
							<Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											<Lightbulb className="w-6 h-6 text-white" />
										</div>
										<div>
                                            <h4 className="font-bold text-lg text-[#1F396D] mb-2">{t('whyGrowwise.engagingCurriculum.title')}</h4>
                                            <p className="text-gray-600 leading-relaxed">{t('whyGrowwise.engagingCurriculum.desc')}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Expert Instructors */}
							<Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#F16112] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											<GraduationCap className="w-6 h-6 text-white" />
										</div>
										<div>
                                            <h4 className="font-bold text-lg text-[#1F396D] mb-2">{t('whyGrowwise.expertInstructors.title')}</h4>
                                            <p className="text-gray-600 leading-relaxed">{t('whyGrowwise.expertInstructors.desc')}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Comprehensive Support */}
							<Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div className="p-3 bg-gradient-to-br from-[#F1894F] to-[#F16112] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											<HeartHandshake className="w-6 h-6 text-white" />
										</div>
										<div>
                                            <h4 className="font-bold text-lg text-[#1F396D] mb-2">{t('whyGrowwise.comprehensiveSupport.title')}</h4>
                                            <p className="text-gray-600 leading-relaxed">{t('whyGrowwise.comprehensiveSupport.desc')}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Student Success Stories */}
			<section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-white to-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('stories.title')}</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('stories.subtitle')}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(academic?.successStories || []).map((story, index) => (
							<Card
								key={index}
								className="bg-white/80 backdrop-blur-lg rounded-[28px] shadow-[0px_20px_40px_0px_rgba(31,57,109,0.12)] border border-white/40 hover:shadow-[0px_30px_60px_0px_rgba(31,57,109,0.18)] transition-all duration-500 hover:-translate-y-2"
							>
								<CardContent className="p-8">
									<div className="text-center mb-6">
										<ImageWithFallback
											src={story.image}
											alt={story.name}
											className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-[#F16112]"
										/>
										<h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
										<p className="text-gray-600">
											{story.grade} • {story.subject}
										</p>
									</div>

									<div className="text-center mb-6">
										<Badge className="bg-[#F16112] text-white px-4 py-2 rounded-full">
											{story.improvement}
										</Badge>
									</div>

									<p className="text-gray-700 italic leading-relaxed text-center">
										"{story.quote}"
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 lg:px-8 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{t('cta.title')}</h2>
                    <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">{t('cta.subtitle')}</p>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" size="lg">
                            {t('cta.primary')}
							<ChevronRight className="ml-2 w-5 h-5" />
						</Button>
                        <Button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105" size="lg">
                            {t('cta.secondary')}
						</Button>
					</div>
				</div>
			</section>

			{/* Learn More Modal */}
			<AlertDialog open={isLearnMoreModalOpen} onOpenChange={setIsLearnMoreModalOpen}>
				<AlertDialogContent className="bg-white/90 backdrop-blur-3xl border-2 border-white/60 shadow-[0px_40px_120px_rgba(31,57,109,0.3)] rounded-[32px] max-w-2xl p-0 overflow-hidden ring-1 ring-white/30">
					{/* Enhanced Background gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/8 via-transparent to-[#F16112]/8"></div>
					<div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
					
					{/* Custom Close Button */}
					<button
						onClick={() => setIsLearnMoreModalOpen(false)}
						className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/60 group"
					>
						<X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
					</button>
					
					<div className="relative z-10 p-8">
						<AlertDialogHeader className="text-center mb-8">
                            <AlertDialogTitle className="text-3xl font-bold text-gray-900 mb-4">
                                {t('modal.titlePrefix')}{" "}
								<span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
                                    {t('modal.titleHighlight')}
								</span>
							</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg text-gray-600 leading-relaxed">{t('modal.subtitle')}</AlertDialogDescription>
						</AlertDialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Math Courses Option */}
                            <Card 
                                onClick={() => {
                                    router.push('/courses/math');
                                    setIsLearnMoreModalOpen(false);
                                }}
								className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full"
							>
								{/* Enhanced Background gradient */}
								<div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/15 opacity-60"></div>
								<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
								
								<CardContent className="p-8 text-center flex flex-col items-center justify-between relative z-10 h-full">
									<div className="flex flex-col items-center">
										{/* Ultra Glass Icon */}
										<div className="mb-6 flex justify-center">
											<div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0px_15px_40px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
												<Calculator className="w-10 h-10 text-[#1F396D] drop-shadow-sm" />
											</div>
										</div>

										{/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1F396D] transition-colors">{t('modal.mathTitle')}</h3>
										
                                        <p className="text-gray-600 mb-6 leading-relaxed">{t('modal.mathDesc')}</p>
										
										{/* Features */}
										<div className="space-y-2 mb-6 text-left w-full">
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.aligned')}</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.grade')}</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.oneOnOne')}</span>
											</div>
										</div>
									</div>

									{/* Enhanced CTA Button */}
                                        <Button onClick={(e) => { e.stopPropagation(); router.push('/courses/math'); setIsLearnMoreModalOpen(false); }} className="w-full bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
                                            {t('modal.viewMore')}
										<ChevronRight className="ml-2 w-4 h-4" />
									</Button>
								</CardContent>
							</Card>

							{/* English Courses Option */}
                            <Card 
                                onClick={() => {
                                    router.push('/courses/english');
                                    setIsLearnMoreModalOpen(false);
                                }}
								className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full"
							>
								{/* Enhanced Background gradient */}
								<div className="absolute inset-0 bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/15 opacity-60"></div>
								<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
								
								<CardContent className="p-8 text-center flex flex-col items-center justify-between relative z-10 h-full">
									<div className="flex flex-col items-center">
										{/* Ultra Glass Icon */}
										<div className="mb-6 flex justify-center">
											<div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0px_15px_40px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
												<BookOpen className="w-10 h-10 text-[#F16112] drop-shadow-sm" />
											</div>
										</div>

										{/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F16112] transition-colors">{t('modal.englishTitle')}</h3>
										
                                        <p className="text-gray-600 mb-6 leading-relaxed">{t('modal.englishDesc')}</p>
										
										{/* Features */}
										<div className="space-y-2 mb-6 text-left w-full">
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.reading')}</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.writing')}</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{t('modal.features.grammar')}</span>
											</div>
										</div>
									</div>

									{/* Enhanced CTA Button */}
                                    <Button onClick={(e) => { e.stopPropagation(); router.push('/courses/english'); setIsLearnMoreModalOpen(false); }} className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
                                        {t('modal.viewMore')}
										<ChevronRight className="ml-2 w-4 h-4" />
									</Button>
								</CardContent>
							</Card>
						</div>

						{/* Modal Footer */}
						<div className="text-center mt-8">
                            <p className="text-sm text-gray-500">
                                {t('modal.guidance.prompt')}{" "}
								<Button
									variant="ghost"
									className="text-[#1F396D] font-medium hover:underline p-0 h-auto"
									onClick={() => setIsLearnMoreModalOpen(false)}
								>
                                    {t('modal.guidance.cta')}
								</Button>
							</p>
						</div>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AcademicPage;
