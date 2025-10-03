import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion'

describe('Accordion Components', () => {
  describe('Accordion', () => {
    it('renders with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      expect(screen.getByText('Trigger 1')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Accordion type="single" collapsible className="custom-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const accordion = screen.getByText('Trigger').closest('[data-orientation="vertical"]')
      expect(accordion).toHaveClass('custom-accordion')
    })
  })

  describe('AccordionItem', () => {
    it('renders with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const item = screen.getByText('Trigger').closest('[data-state="closed"]')
      expect(item).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const item = screen.getByText('Trigger').closest('[data-state="closed"]')
      expect(item).toHaveClass('custom-item')
    })
  })

  describe('AccordionTrigger', () => {
    it('renders with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger = screen.getByRole('button', { name: /trigger/i })
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveClass('flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180')
    })

    it('applies custom className', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="custom-trigger">Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger = screen.getByRole('button', { name: /trigger/i })
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('handles click events', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger = screen.getByRole('button', { name: /trigger/i })
      fireEvent.click(trigger)
      
      // Content should be visible after click
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('AccordionContent', () => {
    it('renders with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down')
    })

    it('applies custom className', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent className="custom-content">Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('Accordion Interactions', () => {
    it('expands and collapses on trigger click', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger = screen.getByRole('button', { name: /trigger/i })
      const content = screen.getByText('Content')
      
      // Initially closed
      expect(content.parentElement).toHaveAttribute('data-state', 'closed')
      
      // Click to open
      fireEvent.click(trigger)
      expect(content.parentElement).toHaveAttribute('data-state', 'open')
      
      // Click to close
      fireEvent.click(trigger)
      expect(content.parentElement).toHaveAttribute('data-state', 'closed')
    })

    it('handles multiple items', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Trigger 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger1 = screen.getByRole('button', { name: /trigger 1/i })
      const trigger2 = screen.getByRole('button', { name: /trigger 2/i })
      const content1 = screen.getByText('Content 1')
      const content2 = screen.getByText('Content 2')
      
      // Click first trigger
      fireEvent.click(trigger1)
      expect(content1.parentElement).toHaveAttribute('data-state', 'open')
      expect(content2.parentElement).toHaveAttribute('data-state', 'closed')
      
      // Click second trigger
      fireEvent.click(trigger2)
      expect(content1.parentElement).toHaveAttribute('data-state', 'closed')
      expect(content2.parentElement).toHaveAttribute('data-state', 'open')
    })

    it('handles multiple selection mode', () => {
      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Trigger 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger1 = screen.getByRole('button', { name: /trigger 1/i })
      const trigger2 = screen.getByRole('button', { name: /trigger 2/i })
      const content1 = screen.getByText('Content 1')
      const content2 = screen.getByText('Content 2')
      
      // Click first trigger
      fireEvent.click(trigger1)
      expect(content1.parentElement).toHaveAttribute('data-state', 'open')
      expect(content2.parentElement).toHaveAttribute('data-state', 'closed')
      
      // Click second trigger - both should be open
      fireEvent.click(trigger2)
      expect(content1.parentElement).toHaveAttribute('data-state', 'open')
      expect(content2.parentElement).toHaveAttribute('data-state', 'open')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      
      const trigger = screen.getByRole('button', { name: /trigger/i })
      const content = screen.getByText('Content')
      
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(content).toHaveAttribute('data-state', 'closed')
      
      fireEvent.click(trigger)
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(content).toHaveAttribute('data-state', 'open')
    })
  })
})



