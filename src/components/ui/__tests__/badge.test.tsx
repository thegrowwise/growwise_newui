import React from 'react'
import { render, screen } from '@/test-utils'
import { Badge } from '../badge'

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('border-transparent bg-primary text-primary-foreground hover:bg-primary/80')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>)
    
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Badge ref={ref}>Ref Badge</Badge>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders with children content', () => {
    render(
      <Badge>
        <span>Badge with span</span>
      </Badge>
    )
    
    const badge = screen.getByText('Badge with span')
    expect(badge).toBeInTheDocument()
    expect(badge.parentElement).toHaveClass('inline-flex items-center rounded-full border')
  })

  it('renders with complex content', () => {
    render(
      <Badge>
        <span>Count: </span>
        <strong>42</strong>
      </Badge>
    )
    
    expect(screen.getByText(/Count:/)).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(
      <Badge
        role="status"
        aria-label="Status badge"
        data-testid="status-badge"
      >
        Active
      </Badge>
    )
    
    const badge = screen.getByTestId('status-badge')
    expect(badge).toHaveAttribute('role', 'status')
    expect(badge).toHaveAttribute('aria-label', 'Status badge')
  })

  it('handles different content types', () => {
    render(<Badge>{123}</Badge>)
    expect(screen.getByText('123')).toBeInTheDocument()

    render(<Badge>{true}</Badge>)
    expect(screen.getByText('true')).toBeInTheDocument()

    render(<Badge>{null}</Badge>)
    const badges = document.querySelectorAll('[data-slot="badge"]')
    const lastBadge = badges[badges.length - 1]
    expect(lastBadge).toBeInTheDocument()
    expect(lastBadge?.textContent).toBe('')
  })
})



