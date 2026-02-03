import React from 'react'
import { render, screen } from '@/test-utils'
import { PageTrackingWrapper } from '../PageTrackingWrapper'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const { usePathname } = require('next/navigation') as { usePathname: jest.Mock }

describe('PageTrackingWrapper', () => {
  beforeEach(() => {
    // reset globals
    ;(global as any).dataLayer = undefined
    ;(global as any).gtag = undefined
    document.title = 'Test Page'
    usePathname.mockReset()
  })

  it('pushes virtual_page_view to dataLayer on pathname changes', () => {
    const mockDL: any[] = []
    ;(global as any).dataLayer = mockDL

    usePathname.mockReturnValueOnce('/initial').mockReturnValueOnce('/next')

    const { rerender } = render(
      <PageTrackingWrapper>
        <div>child</div>
      </PageTrackingWrapper>
    )

    // initial push
    expect(mockDL.length).toBe(1)
    expect(mockDL[0]).toMatchObject({
      event: 'virtual_page_view',
      page_path: '/initial',
      page_title: 'Test Page',
      debug_mode: true,
    })

    // simulate pathname change
    rerender(
      <PageTrackingWrapper>
        <div>child</div>
      </PageTrackingWrapper>
    )

    expect(mockDL.length).toBe(2)
    expect(mockDL[1]).toMatchObject({
      event: 'virtual_page_view',
      page_path: '/next',
      page_title: 'Test Page',
      debug_mode: true,
    })
  })

  it('falls back to gtag when dataLayer is not present', () => {
    const gtag = jest.fn()
    ;(global as any).gtag = gtag

    usePathname.mockReturnValue('/only')

    render(
      <PageTrackingWrapper>
        <div>child</div>
      </PageTrackingWrapper>
    )

    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/only',
      page_title: 'Test Page',
      debug_mode: true,
    })
  })
})
