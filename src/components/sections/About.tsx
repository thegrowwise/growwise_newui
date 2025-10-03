"use client";

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { RootState } from '@/store'
import { fetchAboutRequested } from '@/store/slices/aboutSlice'
import { getIconComponent } from '@/lib/iconMap'

export default function About() {
  const t = useTranslations('about')
  const dispatch = useDispatch()
  const about = useSelector((s: RootState) => s.about.data)
  const loading = useSelector((s: RootState) => s.about.loading)

  useEffect(() => {
    if (!about && !loading) {
      dispatch(fetchAboutRequested())
    }
  }, [about, loading, dispatch])

  const stats = about?.hero?.stats ?? []
  const coreValues = about?.coreValues ?? []
  const discover = about?.discover
  const mission = about?.mission
  const support = about?.support
  const approach = about?.approach
  const cta = about?.cta

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-[#1F396D]/8 to-[#F16112]/8 backdrop-blur-[2px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('hero.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Statistics Section */}
        {stats.length > 0 && (
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((s: any, idx: number) => (
                <Card key={idx} className="text-center p-6 rounded-2xl">
                  <CardContent className="p-0">
                    <div className={`text-3xl font-bold ${s.color} mb-2`}>{s.value}</div>
                    <p className="text-gray-600 font-medium">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Discover GrowWise */}
        {discover && (
          <div className="bg-[#f5f2ef] rounded-3xl p-6 md:p-10 mb-16">
            <h3 className="text-3xl font-bold text-[#1F396D] mb-4">{discover.sectionTitle}</h3>
            <p className="text-[#29335C] font-semibold mb-4">{discover.lead}</p>
            <div className="space-y-4 text-gray-700 mb-6">
              {discover.paragraphs?.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {discover.cta && (
              <a href={discover.cta.href} className="inline-flex items-center bg-[#1F396D] text-white px-6 py-3 rounded-full">{discover.cta.label} →</a>
            )}
          </div>
        )}

        {/* Mission and Excellence */}
        {mission?.items?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-start">
            <div>
              <img src={mission.heroImage} alt="GrowWise" className="rounded-3xl w-full object-cover" />
            </div>
            <div className="space-y-10">
              {mission.items.map((m: any, idx: number) => (
                <div key={idx}>
                  <h4 className="text-3xl font-extrabold text-gray-900 mb-3">{m.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Educators and Students */}
        {support && (
          <div className="mb-16">
            <h3 className="text-4xl font-extrabold text-[#1F396D] text-center mb-10">{support.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1F396D] text-white rounded-3xl p-8">
                <h4 className="text-2xl font-semibold mb-3">{support.teacher.title}</h4>
                <p className="text-white/90">{support.teacher.content}</p>
              </div>
              <div className="rounded-3xl p-8 border border-[#F16112]/30">
                <h4 className="text-2xl font-semibold mb-3">{support.student.title}</h4>
                <p className="text-gray-700">{support.student.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Approach Pillars */}
        {approach && (
          <div className="mb-16">
            <div className="text-center mb-6">
              <div className="text-[#F1894F] uppercase tracking-wider text-sm font-semibold">{approach.subtitle}</div>
              <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{approach.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approach.pillars?.map((p: any, idx: number) => {
                const Icon = getIconComponent(p.icon)
                return (
                  <div key={idx} className="rounded-3xl p-6 bg-white shadow-sm border">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F16112]/20 to-[#1F396D]/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#1F396D]" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h4>
                    <p className="text-gray-600">{p.content}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {cta && (
          <div className="bg-gradient-to-br from-[#1F396D] to-[#29335C] text-white rounded-3xl p-10 mt-10">
            <div className="flex items-center justify-between flex-col md:flex-row gap-6">
              <h3 className="text-3xl font-extrabold text-center md:text-left">{cta.title}</h3>
              <a href={cta.primaryCta.href} className="bg-white text-[#1F396D] font-semibold px-6 py-3 rounded-full">{cta.primaryCta.label}</a>
            </div>
          </div>
        )}

        {/* Core Values */}
        {coreValues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((item: any, idx: number) => {
              const IconComponent = getIconComponent(item.icon)
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
                  <CardContent className="p-0">
                    <div className={`w-12 h-12 ${item.bgColor ?? 'bg-gray-100'} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-6 h-6 ${item.color ?? 'text-[#1F396D]'}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}