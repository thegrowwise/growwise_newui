import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'STEAM Programs - GrowWise',
    es: 'Programas STEAM - GrowWise',
    zh: 'STEAM项目 - GrowWise',
    hi: 'STEAM कार्यक्रम - GrowWise'
  };

  const descriptions = {
    en: 'Explore our comprehensive STEAM programs including ML/AI coding, game development, robotics, and more. Prepare your child for the future.',
    es: 'Explora nuestros programas STEAM integrales incluyendo programación ML/IA, desarrollo de juegos, robótica y más. Prepara a tu hijo para el futuro.',
    zh: '探索我们全面的STEAM项目，包括ML/AI编程、游戏开发、机器人技术等。为您的孩子准备未来。',
    hi: 'ML/AI कोडिंग, गेम डेवलपमेंट, रोबोटिक्स और अधिक सहित हमारे व्यापक STEAM कार्यक्रमों का अन्वेषण करें। अपने बच्चे को भविष्य के लिए तैयार करें।'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default function SteamPage() {
  const t = useTranslations('steam');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('programs.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('programs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* ML/AI Coding */}
            <div className="bg-white/80 backdrop-blur-3xl rounded-2xl shadow-[0px_20px_60px_rgba(31,57,109,0.15)] border border-white/50 overflow-hidden hover:shadow-[0px_30px_80px_rgba(31,57,109,0.25)] transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1F396D] to-[#F16112] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('programs.mlAi.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('programs.mlAi.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li>• {t('programs.mlAi.features.python')}</li>
                  <li>• {t('programs.mlAi.features.machineLearning')}</li>
                  <li>• {t('programs.mlAi.features.dataScience')}</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#d54f0a] hover:to-[#F16112] transition-all duration-300">
                  {t('programs.mlAi.cta')}
                </button>
              </div>
            </div>

            {/* Game Development */}
            <div className="bg-white/80 backdrop-blur-3xl rounded-2xl shadow-[0px_20px_60px_rgba(31,57,109,0.15)] border border-white/50 overflow-hidden hover:shadow-[0px_30px_80px_rgba(31,57,109,0.25)] transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('programs.gameDev.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('programs.gameDev.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li>• {t('programs.gameDev.features.roblox')}</li>
                  <li>• {t('programs.gameDev.features.scratch')}</li>
                  <li>• {t('programs.gameDev.features.unity')}</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#d54f0a] hover:to-[#F16112] transition-all duration-300">
                  {t('programs.gameDev.cta')}
                </button>
              </div>
            </div>

            {/* Robotics */}
            <div className="bg-white/80 backdrop-blur-3xl rounded-2xl shadow-[0px_20px_60px_rgba(31,57,109,0.15)] border border-white/50 overflow-hidden hover:shadow-[0px_30px_80px_rgba(31,57,109,0.25)] transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1F396D] to-[#29335C] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('programs.robotics.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('programs.robotics.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li>• {t('programs.robotics.features.arduino')}</li>
                  <li>• {t('programs.robotics.features.programming')}</li>
                  <li>• {t('programs.robotics.features.automation')}</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#d54f0a] hover:to-[#F16112] transition-all duration-300">
                  {t('programs.robotics.cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
            {t('cta.title')}
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              {t('cta.primaryCta')}
            </button>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105">
              {t('cta.secondaryCta')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
