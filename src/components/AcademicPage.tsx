// AcademicPage migrated from Vite project
import React, { useState } from "react";
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

const whyChooseAcademic = [
	{
		icon: Calculator,
		title: "Math Mastery",
		description: "Personalized math instruction for all levels, aligned with DUSD & PUSD curriculum.",
		bgColor: "bg-gradient-to-br from-[#1F396D] to-[#29335C]",
		color: "text-[#1F396D]",
	},
	{
		icon: BookOpen,
		title: "English Excellence",
		description: "Comprehensive English language arts skills from reading to writing.",
		bgColor: "bg-gradient-to-br from-[#F16112] to-[#F1894F]",
		color: "text-[#F16112]",
	},
	{
		icon: UserCheck,
		title: "Personalized Support",
		description: "One-on-one guidance to help students excel academically.",
		bgColor: "bg-gradient-to-br from-[#F1894F] to-[#F16112]",
		color: "text-[#F1894F]",
	},
	{
		icon: Lightbulb,
		title: "Engaging Curriculum",
		description: "Innovative and interactive curriculum for deeper learning.",
		bgColor: "bg-gradient-to-br from-[#1F396D] to-[#F16112]",
		color: "text-[#1F396D]",
	},
];

const successStories = [
	{
		name: "Ava Patel",
		grade: "Grade 7",
		subject: "Math",
		improvement: "+30% Improvement",
		quote: "GrowWise helped me understand math concepts I struggled with for years!",
		image: "/assets/0fb554c814973287034758481cdce9617220c706.png",
	},
	{
		name: "Liam Chen",
		grade: "Grade 9",
		subject: "English",
		improvement: "+2 Grade Levels",
		quote: "My writing and grammar improved so much thanks to GrowWise!",
		image: "/assets/3e32d074ecb0cbbf1938d278ea2251c0bae43f37.png",
	},
	{
		name: "Sophia Kim",
		grade: "Grade 5",
		subject: "Math & English",
		improvement: "Top 5% in Class",
		quote: "I love the fun lessons and friendly teachers at GrowWise!",
		image: "/assets/4d5f8738dc90c959ab8bf4453a752c35ebcfde0b.png",
	},
];

const AcademicPage = ({ setCurrentPage }: { setCurrentPage?: (page: string) => void }) => {
	const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-white to-gray-50">
			{/* Academic Programs Section */}
			<section className="py-20 px-4 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
							Academic{" "}
							<span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
								Programs
							</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Personalized learning for K-12 students in Math and English
						</p>
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
											<h3 className="text-xl font-bold text-[#1F396D]">Math Session</h3>
										</div>
										<p className="text-gray-700 leading-relaxed">
											Practice math problems and concepts with step-by-step guidance and instant feedback.
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
											<h3 className="text-xl font-bold text-[#F16112]">English Session</h3>
										</div>
										<p className="text-gray-700 leading-relaxed">
											Writing practice and grammar editing with real-time feedback to strengthen clarity and structure.
										</p>
									</CardContent>
								</Card>
							</div>

							{/* Session Pricing */}
							<Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 mt-12">
								<CardContent className="p-8 text-center">
									<h3 className="text-2xl font-bold text-gray-900 mb-4">Session Pricing</h3>
									<div className="flex items-center justify-center gap-8 mb-6">
										<div className="text-center">
											<div className="text-3xl font-bold text-[#1F396D] mb-2">FREE</div>
											<div className="text-sm text-gray-600">for GrowWisers</div>
										</div>
										<div className="w-px h-12 bg-gray-300"></div>
										<div className="text-center">
											<div className="text-3xl font-bold text-[#F16112] mb-2">$8</div>
											<div className="text-sm text-gray-600">for non-GrowWisers</div>
										</div>
									</div>
									<p className="text-gray-600 text-lg mb-6">
										Helps build speed, accuracy, and confidence under pressure.
									</p>
									<Button className="bg-gradient-to-r from-[#1F396D] to-[#F16112] hover:from-[#29335C] hover:to-[#F1894F] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
										Register for Practice Sessions
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
							Why Choose Our{" "}
							<span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">
								Academic Programs
							</span>
							?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Comprehensive support designed for K-12 academic excellence
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{whyChooseAcademic.map((item, index) => (
							<Card
								key={index}
								className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 text-center ring-1 ring-white/30"
							>
								<CardContent className="p-8 relative">
									{/* Glass reflection overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
									<div className="relative z-10">
										<div
											className={`${item.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 ring-1 ring-white/20`}
										>
											<item.icon
												className={`w-10 h-10 ${item.color} drop-shadow-sm`}
											/>
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
							WHY CHOOSE US
						</Badge>
						<h2 className="text-3xl lg:text-4xl font-bold text-[#1F396D] mb-4">
							Why Choose GrowWise for Education Courses?
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
											<h4 className="font-bold text-lg text-[#1F396D] mb-2">
												Personalized Attention
											</h4>
											<p className="text-gray-600 leading-relaxed">
												We provide individualized support to ensure each student reaches their maximum potential and academic goals.
											</p>
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
											<h4 className="font-bold text-lg text-[#1F396D] mb-2">
												Engaging Curriculum
											</h4>
											<p className="text-gray-600 leading-relaxed">
												Innovative and interactive curriculum and engaging thinking learning experience for each student.
											</p>
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
											<h4 className="font-bold text-lg text-[#1F396D] mb-2">
												Expert Instructors
											</h4>
											<p className="text-gray-600 leading-relaxed">
												Our courses are taught by experienced educators who are passionate about teaching and dedicated to student success.
											</p>
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
											<h4 className="font-bold text-lg text-[#1F396D] mb-2">
												Comprehensive Support
											</h4>
											<p className="text-gray-600 leading-relaxed">
												We offer resources and support to help students excel in their studies and achieve sustained success.
											</p>
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
						<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
							Student Success Stories
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Real results from our academic programs
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{successStories.map((story, index) => (
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
					<h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
						Ready to Excel in Academics?
					</h2>
					<p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
						Join hundreds of students who have improved their academic performance with our personalized programs.
					</p>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" size="lg">
							Book Free Assessment
							<ChevronRight className="ml-2 w-5 h-5" />
						</Button>
						<Button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105" size="lg">
							Learn More
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
								Choose Your{" "}
								<span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
									Academic Path
								</span>
							</AlertDialogTitle>
							<AlertDialogDescription className="text-lg text-gray-600 leading-relaxed">
								Select the subject that matches your learning goals and start your academic journey
							</AlertDialogDescription>
						</AlertDialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Math Courses Option */}
							<Card 
								onClick={() => {
									setCurrentPage?.('math-courses');
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
										<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1F396D] transition-colors">
											Math Courses
										</h3>
										
										<p className="text-gray-600 mb-6 leading-relaxed">
											Master mathematics from basics to advanced levels with personalized instruction
										</p>
										
										{/* Features */}
										<div className="space-y-2 mb-6 text-left w-full">
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
												<span className="text-sm text-gray-700">DUSD & PUSD Aligned</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
												<span className="text-sm text-gray-700">Grade-Level & Accelerated</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
												<span className="text-sm text-gray-700">One-on-One Support</span>
											</div>
										</div>
									</div>

									{/* Enhanced CTA Button */}
									<Button className="w-full bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
										View More
										<ChevronRight className="ml-2 w-4 h-4" />
									</Button>
								</CardContent>
							</Card>

							{/* English Courses Option */}
							<Card 
								onClick={() => {
									setCurrentPage?.('english-courses');
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
										<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F16112] transition-colors">
											English Language Arts
										</h3>
										
										<p className="text-gray-600 mb-6 leading-relaxed">
											Comprehensive English language arts skills from reading to writing excellence
										</p>
										
										{/* Features */}
										<div className="space-y-2 mb-6 text-left w-full">
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
												<span className="text-sm text-gray-700">Reading Comprehension</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
												<span className="text-sm text-gray-700">Essay Writing</span>
											</div>
											<div className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" />
												<span className="text-sm text-gray-700">Grammar & Vocabulary</span>
											</div>
										</div>
									</div>

									{/* Enhanced CTA Button */}
									<Button className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
										View More
										<ChevronRight className="ml-2 w-4 h-4" />
									</Button>
								</CardContent>
							</Card>
						</div>

						{/* Modal Footer */}
						<div className="text-center mt-8">
							<p className="text-sm text-gray-500">
								Not sure which path to choose?{" "}
								<Button
									variant="ghost"
									className="text-[#1F396D] font-medium hover:underline p-0 h-auto"
									onClick={() => setIsLearnMoreModalOpen(false)}
								>
									Contact us for guidance
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
