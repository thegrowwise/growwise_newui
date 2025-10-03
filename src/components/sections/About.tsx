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