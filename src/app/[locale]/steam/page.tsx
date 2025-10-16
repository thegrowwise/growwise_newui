'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSteamRequested } from '@/store/slices/steamSlice';
import { getIconComponent } from '@/lib/iconMap';

export default function SteamPage() {
  const t = useTranslations('steam');
  const dispatch = useAppDispatch();
  const steamData = useAppSelector((s) => s.steam.data);
  const steamLoading = useAppSelector((s) => s.steam.loading);
  const steamError = useAppSelector((s) => s.steam.error);

  useEffect(() => {
    if (!steamData && !steamLoading) {
      dispatch(fetchSteamRequested());
    }
  }, [steamData, steamLoading, dispatch]);

  if (steamLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F16112]"></div>
      </div>
    );
  }

  if (steamError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading STEAM Programs</h2>
          <p className="text-gray-600">{steamError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Science, Technology, Engineering,<br />
                <span className="text-[#F16112]">Arts & Mathematics</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {steamData?.hero?.subtitle || 'Prepare for the future with hands-on STEAM education. From coding and game development to AI and entrepreneurship, our programs combine creativity with cutting-edge technology.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                  Explore Programs
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  Book Free Trial
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                {/* Placeholder for the technical lab image */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Technical Lab Environment</p>
                  <p className="text-gray-400 text-sm">Woman working on laptop in modern lab setting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our STEAM Programs Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {steamData?.programs?.title || 'Our STEAM Programs'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {steamData?.programs?.subtitle || 'Comprehensive technology education designed for future innovators'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steamData?.programs?.items?.slice(0, 4).map((program) => {
              const IconComponent = getIconComponent(program.icon);
              const bgColorClass = program.id === 1 ? 'bg-[#F16112]' : program.id === 4 ? 'bg-[#F1894F]' : 'bg-[#1F396D]';
              const textColorClass = program.id === 1 ? 'text-[#F16112]' : program.id === 4 ? 'text-[#F1894F]' : 'text-[#1F396D]';
              
              return (
                <div key={program.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 ${bgColorClass} rounded-lg flex items-center justify-center mb-6`}>
                    {IconComponent ? (
                      <IconComponent className="w-8 h-8 text-white" />
                    ) : (
                      <span className="text-white text-2xl">{program.id === 1 ? '🎮' : program.id === 2 ? '🐍' : program.id === 3 ? '🧠' : '💡'}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {program.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {program.features?.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className={`w-5 h-5 ${textColorClass} mr-3`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full ${bgColorClass} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center`}>
                    {program.cta || t('programs.startLearning') || 'Start Learning'}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game Development Mastery Section */}
      {steamData?.programs?.items?.[0]?.subItems && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('gameDevelopment.title') || 'Game Development'} <span className="text-[#F16112]">{t('gameDevelopment.titleHighlight') || 'Mastery'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('gameDevelopment.subtitle') || 'Master game creation with industry-standard tools and platforms'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steamData.programs.items[0].subItems.map((subItem, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-6">{subItem.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{subItem.name}</h3>
                  <p className="text-gray-600">{subItem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies & Tools We Teach Section */}
      {steamData?.features && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('technologies.title') || 'Technologies & Tools'} <span className="text-[#F16112]">{t('technologies.titleHighlight') || 'We Teach'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('technologies.subtitle') || 'Industry-standard tools and technologies for future-ready skills'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {steamData.features.map((feature, idx) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-4 hover:shadow-xl transition-all duration-300">
                      {IconComponent ? (
                        <IconComponent className="w-12 h-12 text-[#F16112]" />
                      ) : (
                        <span className="text-4xl">{feature.icon}</span>
                      )}
                    </div>
                    <p className="text-center font-semibold text-gray-900">{feature.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* AI & Machine Learning Section */}
      {steamData?.programs?.items?.[2]?.subItems && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('aiMachineLearning.title') || 'AI & Machine Learning'} <span className="text-[#F16112]">{t('aiMachineLearning.titleHighlight') || 'Programs'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('aiMachineLearning.subtitle') || 'Explore the future of technology with AI and machine learning'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steamData.programs.items[2].subItems.map((subItem, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-6">{subItem.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{subItem.name}</h3>
                  <p className="text-gray-600">{subItem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Young Entrepreneurs Program Section */}
      {steamData?.programs?.items?.[3]?.subItems && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('youngEntrepreneurs.title') || 'Young Entrepreneurs'} <span className="text-[#F16112]">{t('youngEntrepreneurs.titleHighlight') || 'Program'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('youngEntrepreneurs.subtitle') || 'Develop entrepreneurial skills and business mindset for future leaders'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steamData.programs.items[3].subItems.map((subItem, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-6">{subItem.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{subItem.name}</h3>
                  <p className="text-gray-600">{subItem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Success Stories Section */}
      {steamData?.successStories && steamData.successStories.length > 0 && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('successStories.title') || 'Student Success'} <span className="text-[#F16112]">{t('successStories.titleHighlight') || 'Stories'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('successStories.subtitle') || 'Real achievements from our STEAM program students'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steamData.successStories.map((story, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-[#F16112] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                      <p className="text-gray-600">{story.grade} • {story.program}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-[#F16112] text-white px-4 py-2 rounded-lg font-semibold">
                      {story.achievement}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">"{story.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Our STEAM Program Section */}
      {steamData?.programHighlights && steamData.programHighlights.length > 0 && (
        <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t('whyChoose.title') || 'Why Choose Our'} <span className="text-[#F16112]">{t('whyChoose.titleHighlight') || 'STEAM Program'}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('whyChoose.subtitle') || 'Comprehensive education that prepares students for the future'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steamData.programHighlights.map((highlight, idx) => {
                const IconComponent = getIconComponent(highlight.icon);
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-[#F16112] rounded-lg flex items-center justify-center mb-6">
                      {IconComponent ? (
                        <IconComponent className="w-8 h-8 text-white" />
                      ) : (
                        <span className="text-white text-2xl">✨</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{highlight.title}</h3>
                    <p className="text-gray-600 mb-6">{highlight.description}</p>
                    {highlight.stats && (
                      <div className="flex items-center gap-4">
                        {typeof highlight.stats === 'string' ? (
                          <div className="flex items-center">
                            <span className="text-3xl font-bold text-[#F16112] mr-2">{highlight.stats}</span>
                          </div>
                        ) : (
                          highlight.stats.map((stat, statIdx) => (
                            <div key={statIdx} className="flex items-center">
                              <span className="text-3xl font-bold text-[#F16112] mr-2">{stat.value}</span>
                              <span className="text-gray-600">{stat.label}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {steamData?.cta?.title || t('cta.title') || 'Ready to Start Your STEAM Journey?'}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {steamData?.cta?.subtitle || t('cta.subtitle') || 'Join thousands of students learning cutting-edge technology skills'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
              {steamData?.cta?.primaryCta || steamData?.cta?.primaryButton || t('cta.primaryCta') || 'Get Started Today'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              {steamData?.cta?.secondaryCta || steamData?.cta?.secondaryButton || t('cta.secondaryCta') || 'Schedule a Call'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}