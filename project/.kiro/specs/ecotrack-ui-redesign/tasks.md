# Implementation Plan: EcoTrack UI Redesign

## Overview

This implementation plan transforms the EcoTrack carbon footprint tracking application with a complete UI redesign. The redesign applies a modern, clean design system to all six pages (Landing, Calculator, Dashboard, Recommendations, Progress, Profile) while maintaining existing functionality. Implementation follows a component-first approach, building from design tokens and reusable components up to complete page layouts.

## Tasks

- [x] 1. Establish Design System Foundation
  - Create design-tokens.css with CSS custom properties for colors, typography, spacing, shadows, and transitions
  - Update index.css with global styles, utility classes, and responsive breakpoints
  - Configure Tailwind CSS to use custom design tokens
  - Create TypeScript type definitions for design tokens (ColorToken, SpacingToken, etc.)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [x] 2. Build Core UI Component Library
  - [x] 2.1 Create Button component with variants
    - Implement Button.tsx in src/components/ui/ with primary, ghost, and light variants
    - Support small, medium, and large sizes
    - Add icon positioning (left/right) and loading states
    - Implement hover animations (translateY -2px, enhanced shadow)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [ ]* 2.2 Write component tests for Button
    - Test all variants render with correct classes
    - Test click handlers and disabled states
    - Test loading state displays spinner
    - Test accessibility with jest-axe

  - [x] 2.3 Create Card component with variants
    - Implement Card.tsx with default, feature-mint, feature-sky, and feature-cream variants
    - Support compact, standard, and large padding options
    - Add hoverable prop for interactive cards
    - Implement hover animations (translateY -5px, enhanced shadow)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 2.4 Write component tests for Card
    - Test all variants render correctly
    - Test padding options
    - Test hover behavior for hoverable cards

  - [x] 2.5 Create Input and FormField components
    - Implement Input.tsx with error state styling
    - Implement FormField.tsx with label, helper text, and error display
    - Add focus animations (green border, white background)
    - Style error states (red border, light red background)
    - _Requirements: 4.1, 4.2, 4.4, 4.6, 4.7_

  - [ ]* 2.6 Write component tests for Input and FormField
    - Test error state styling
    - Test focus behavior
    - Test label association for accessibility

  - [x] 2.7 Create OptionCard component
    - Implement OptionCard.tsx for selectable card-based inputs
    - Display icon, label, and checkmark when selected
    - Implement selection states (green border, green background, checkmark)
    - Add hover effects
    - _Requirements: 4.3, 4.5_

  - [ ]* 2.8 Write component tests for OptionCard
    - Test selection behavior
    - Test disabled state
    - Test icon and checkmark display

- [x] 3. Checkpoint - Core components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Build Chart Wrapper Components
  - [-] 4.1 Create CustomBarChart component
    - Wrap Recharts BarChart with consistent styling
    - Apply design token colors for bars
    - Configure axis styling (muted text, subtle lines)
    - Implement rounded bar corners and tooltips
    - _Requirements: 5.3, 6.2, 18.1, 18.2, 18.6_

  - [-] 4.2 Create CustomLineChart component
    - Wrap Recharts LineChart for trend visualization
    - Apply smooth curve styling with 2px stroke
    - Add data point markers (4px radius)
    - Configure tooltips and axis styling
    - _Requirements: 8.1, 18.1, 18.3, 18.6_

  - [-] 4.3 Create CustomPieChart component
    - Wrap Recharts PieChart for distribution visualization
    - Implement donut style (inner/outer radius)
    - Apply category color-coding
    - Add 3° padding angle between slices
    - _Requirements: 6.2, 18.1, 18.4, 18.6_

  - [ ]* 4.4 Write integration tests for chart components
    - Test chart rendering with sample data
    - Test tooltip display on hover
    - Test responsive behavior

- [ ] 5. Build Layout Components
  - [-] 5.1 Update Navbar component
    - Implement navigation links (Calculator, Dashboard, Progress, Profile)
    - Highlight current page in navigation
    - Add logo with green leaf icon and "EcoTrack" text
    - Implement mobile hamburger menu
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ] 5.2 Update Footer component
    - Display logo, tagline, and footer links
    - Apply consistent styling (border-top, muted colors)
    - Implement responsive layout (stack on mobile)
    - _Requirements: 10.1_

  - [~] 5.3 Create Container component
    - Implement max-width constraint (1160px)
    - Add horizontal padding (32px desktop, 20px mobile)
    - Apply centering with auto margins
    - _Requirements: 16.1, 16.5_

  - [ ]* 5.4 Write component tests for layout components
    - Test navigation interactions
    - Test mobile menu toggle
    - Test responsive container sizing

- [~] 6. Checkpoint - Component library complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Redesign Landing Page
  - [~] 7.1 Implement hero section
    - Display headline "Small Choices. Big Impact." with subtitle
    - Add EcoEarthIllustration SVG component (Earth with hands and plant)
    - Implement "Calculate My Footprint" primary button
    - Add "Learn how it works" ghost button
    - Style with green color scheme and animations
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [~] 7.2 Implement feature cards section
    - Create three feature cards: "Calculate", "Get AI Insights", "Track Progress"
    - Display icons, descriptions, and action links for each
    - Apply colored backgrounds (mint, sky, cream)
    - Implement hover animations
    - _Requirements: 2.4, 2.6_

  - [~] 7.3 Implement "How it works" section
    - Display section with steps list
    - Show step numbers, descriptions, and checkmarks
    - Apply section styling with background color
    - _Requirements: 2.1, 2.6_

  - [~] 7.4 Implement CTA section
    - Display call-to-action card with green background
    - Add decorative leaf icon and circular decorations
    - Implement "Start Your Eco Journey" button
    - _Requirements: 2.3, 2.5_

  - [~] 7.5 Make Landing Page responsive
    - Stack hero columns vertically on mobile
    - Display feature cards in single column on mobile
    - Adjust typography sizes for mobile
    - Implement hamburger menu for navigation
    - _Requirements: 2.7, 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ]* 7.6 Write integration tests for Landing Page
    - Test navigation to calculator page
    - Test all CTA button interactions
    - Test responsive layout changes

- [ ] 8. Redesign Calculator Page
  - [~] 8.1 Implement calculator page structure
    - Display page title and introductory text
    - Create multi-step form layout with sections
    - Add progress sidebar with section indicators
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [~] 8.2 Implement form sections
    - Create Transportation section with icon, title, description
    - Create Electricity section
    - Create Food section
    - Create Waste section
    - Create Travel section
    - Apply consistent styling with rounded cards
    - _Requirements: 3.5, 3.6_

  - [~] 8.3 Implement form input components
    - Render text inputs with rounded corners and focus styles
    - Render number inputs with unit labels (km, kWh)
    - Implement option cards for multiple choice with icons
    - Display helper text below inputs
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [~] 8.4 Implement form validation
    - Validate required fields
    - Display error messages for invalid data
    - Show red borders and error text for validation errors
    - Clear errors on input change
    - _Requirements: 3.8, 4.7_

  - [~] 8.5 Implement form navigation
    - Add "Next" and "Back" buttons
    - Display "Calculate Footprint" button on final section
    - Update progress indicator as user completes sections
    - Disable buttons appropriately
    - _Requirements: 3.4, 3.7_

  - [~] 8.6 Make Calculator Page responsive
    - Stack sidebar and form vertically on mobile
    - Display option cards in single column on mobile
    - Adjust form panel padding for small screens
    - Stack navigation buttons vertically on mobile
    - _Requirements: 16.1, 16.2, 16.4, 16.5, 16.6_

  - [ ]* 8.7 Write integration tests for Calculator Page
    - Test multi-step form navigation
    - Test form validation
    - Test form submission
    - Test progress indicator updates

- [~] 9. Checkpoint - Calculator page complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Redesign Dashboard (Results) Page
  - [~] 10.1 Implement total footprint display
    - Display large number showing total CO2e/year
    - Add circular badge with green icon
    - Show comparison badge (above/below/equal to average)
    - Display equivalence message (e.g., "Equivalent to -14 trees per year")
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 5.7_

  - [~] 10.2 Implement breakdown visualizations
    - Display bar chart showing emissions by category
    - Show category icons, labels, and values
    - Implement horizontal progress bars for each category
    - Apply category color-coding consistently
    - Sort categories from highest to lowest emissions
    - _Requirements: 5.3, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [~] 10.3 Implement metric cards
    - Display key metrics in card layout
    - Show icons, labels, and values
    - Apply hover animations
    - Style primary metric card with green gradient
    - _Requirements: 5.7, 12.3, 12.4_

  - [~] 10.4 Implement pie chart distribution
    - Display donut chart showing category breakdown
    - Add center label with total percentage
    - Apply category colors
    - Show legend with category names
    - _Requirements: 6.2, 6.3, 18.4_

  - [~] 10.5 Make Dashboard Page responsive
    - Stack layout from multi-column to single column on mobile
    - Adjust metric cards grid for smaller screens
    - Reduce chart heights on mobile
    - Adjust card padding for mobile
    - _Requirements: 16.1, 16.4, 16.5_

  - [ ]* 10.6 Write integration tests for Dashboard Page
    - Test data display with sample carbon results
    - Test chart rendering
    - Test comparison badge logic
    - Test responsive layout

- [ ] 11. Create Recommendations Display
  - [~] 11.1 Implement recommendations page structure
    - Display page title "AI-Powered Recommendations"
    - Group recommendations by category
    - Apply card layouts with consistent styling
    - _Requirements: 7.1, 7.2, 7.5_

  - [~] 11.2 Implement recommendation cards
    - Display each recommendation with potential reduction amount
    - Show category icon and title
    - List specific actionable tips as bullet points
    - Highlight reduction potential in green text
    - Sort by highest-impact first
    - _Requirements: 7.3, 7.4, 7.6, 7.7_

  - [~] 11.3 Make Recommendations Page responsive
    - Stack recommendation cards on mobile
    - Adjust card padding for mobile
    - Ensure icons and text scale appropriately
    - _Requirements: 16.1, 16.5_

  - [ ]* 11.4 Write integration tests for Recommendations Page
    - Test recommendations display with sample data
    - Test category grouping
    - Test sorting by impact

- [ ] 12. Create Progress Tracking Page
  - [~] 12.1 Implement progress page structure
    - Display line chart showing monthly footprint trend
    - Add date labels on x-axis and emission values on y-axis
    - _Requirements: 8.1, 8.7_

  - [~] 12.2 Implement eco score display
    - Show "Your Eco Score" with progress bar
    - Display numerical score out of 100
    - Apply green styling for score indicator
    - _Requirements: 8.2_

  - [~] 12.3 Implement achievements section
    - Display unlocked milestones with icons
    - Show achievement cards with descriptions
    - _Requirements: 8.3_

  - [~] 12.4 Implement change indicators
    - Display change percentage with colored arrows
    - Use green styling and downward arrows for decreases
    - Use red/orange styling and upward arrows for increases
    - _Requirements: 8.4, 8.5, 8.6_

  - [~] 12.5 Make Progress Page responsive
    - Adjust chart height for mobile screens
    - Stack achievement cards vertically on mobile
    - Reduce padding and margins on mobile
    - _Requirements: 16.1, 16.5_

  - [ ]* 12.6 Write integration tests for Progress Page
    - Test line chart rendering with historical data
    - Test eco score calculation and display
    - Test change indicators with different scenarios

- [ ] 13. Create Profile and Settings Interface
  - [~] 13.1 Implement profile page structure
    - Display user profile information (name, email)
    - Show "My Impact" summary section
    - Apply card layouts matching interface style
    - _Requirements: 9.1, 9.2, 9.4_

  - [~] 13.2 Implement profile actions
    - Add navigation to settings, notifications
    - Implement "Log Out" button with icon
    - Wire up logout to clear session and navigate to landing
    - _Requirements: 9.3, 9.5, 9.6_

  - [~] 13.3 Make Profile Page responsive
    - Stack profile cards on mobile
    - Adjust button sizing for mobile
    - Ensure touch targets meet 44x44px minimum
    - _Requirements: 16.1, 16.5, 16.6_

  - [ ]* 13.4 Write integration tests for Profile Page
    - Test profile information display
    - Test logout functionality
    - Test navigation to settings

- [~] 14. Checkpoint - All pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement Responsive Layouts
  - [~] 15.1 Configure responsive breakpoints
    - Set mobile breakpoint at 800px
    - Set extra-small mobile at 430px
    - Implement responsive utilities in CSS
    - _Requirements: 16.1, 16.7_

  - [~] 15.2 Implement mobile navigation
    - Create hamburger menu toggle button
    - Implement overlay navigation for mobile
    - Add open/close animations
    - Ensure mobile menu is keyboard accessible
    - _Requirements: 10.6, 16.2, 16.6_

  - [~] 15.3 Optimize mobile layouts
    - Stack all multi-column layouts on mobile
    - Adjust font sizes for readability (10-20% smaller)
    - Reduce padding and margins for content space
    - Ensure horizontal scrolling is prevented
    - _Requirements: 16.3, 16.4, 16.5_

  - [ ]* 15.4 Test responsive layouts manually
    - Test on mobile viewports (375px, 414px)
    - Test on tablet viewports (768px, 1024px)
    - Test on desktop viewports (1440px, 1920px)
    - Verify breakpoint transitions are smooth

- [ ] 16. Implement Animations and Transitions
  - [~] 16.1 Add hover animations
    - Implement button hover effects (translateY -2px)
    - Implement card hover effects (translateY -3px to -5px)
    - Add shadow enhancements on hover
    - Set transition duration to 200-250ms
    - _Requirements: 2.6, 11.4, 12.4, 17.1, 17.4, 17.5_

  - [~] 16.2 Add focus and input animations
    - Animate input border color change (200ms)
    - Animate input background change on focus
    - Add selection animations for option cards
    - _Requirements: 4.4, 4.5, 17.6_

  - [~] 16.3 Add chart animations
    - Animate chart rendering on initial load
    - Animate progress bars with 400-600ms duration
    - Use ease-in-out timing function
    - _Requirements: 17.2, 17.3, 18.7_

  - [~] 16.4 Implement prefers-reduced-motion support
    - Detect user's motion preference setting
    - Disable animations when prefers-reduced-motion is enabled
    - Maintain functionality without animations
    - _Requirements: 17.7_

  - [ ]* 16.5 Test animation performance
    - Verify 60fps for all animations
    - Test reduced motion setting
    - Check for janky animations on slower devices

- [ ] 17. Implement Loading and Empty States
  - [~] 17.1 Create loading indicators
    - Implement loading spinner component with green color
    - Add loading states to buttons with spinner
    - Create skeleton loaders for content being fetched
    - Disable interactive elements during loading
    - _Requirements: 19.1, 19.3, 19.4, 19.6_

  - [~] 17.2 Create empty state components
    - Display friendly messages when no data is available
    - Add icons and call-to-action for empty states
    - Style with muted colors and centered layout
    - _Requirements: 19.2, 19.5_

  - [~] 17.3 Implement error handling UI
    - Display error messages in red text with icons
    - Show inline error messages for failed operations
    - Provide retry buttons for recoverable errors
    - _Requirements: 19.7_

  - [ ]* 17.4 Write component tests for loading and empty states
    - Test loading spinner display
    - Test skeleton loader rendering
    - Test empty state messaging

- [ ] 18. Ensure Accessibility Compliance
  - [~] 18.1 Verify color contrast ratios
    - Check 4.5:1 contrast for normal text
    - Check 3:1 contrast for large text (18px+)
    - Check 3:1 contrast for focus indicators
    - Fix any contrast violations
    - _Requirements: 20.1_

  - [~] 18.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Verify logical tab order throughout pages
    - Add visible focus indicators to all focusable elements
    - Test for keyboard traps
    - _Requirements: 20.2, 20.3_

  - [~] 18.3 Add ARIA labels and semantic HTML
    - Add ARIA labels for icons and graphics
    - Use semantic HTML elements (nav, main, footer)
    - Add ARIA live regions for dynamic content
    - Ensure heading hierarchy is logical
    - _Requirements: 20.4, 20.5, 20.7_

  - [~] 18.4 Ensure form accessibility
    - Associate all form fields with labels
    - Add aria-invalid and aria-describedby for errors
    - Indicate required fields clearly
    - Provide field instructions as helper text
    - _Requirements: 20.6_

  - [~] 18.5 Add chart text alternatives
    - Provide aria-label for chart SVGs
    - Add role="img" to chart containers
    - Consider text summary for screen readers
    - _Requirements: 20.4_

  - [ ]* 18.6 Run automated accessibility tests
    - Run jest-axe on all components
    - Fix any violations found
    - Verify WCAG 2.1 AA compliance

  - [ ]* 18.7 Perform manual accessibility testing
    - Test with screen reader (NVDA or VoiceOver)
    - Test keyboard-only navigation through all pages
    - Verify focus management is correct

- [ ] 19. Final Integration and Polish
  - [~] 19.1 Wire all pages together
    - Ensure navigation flows work correctly
    - Test data persistence across pages
    - Verify localStorage integration
    - Connect all CTAs to correct destinations
    - _Requirements: 10.5, 9.6_

  - [~] 19.2 Apply final design polish
    - Review all spacing and alignment
    - Verify typography consistency
    - Check color usage against design tokens
    - Ensure shadow and border radius consistency
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [~] 19.3 Optimize performance
    - Check bundle sizes
    - Optimize images and illustrations
    - Review and lazy-load components if needed
    - Ensure fast page load times

  - [ ]* 19.4 Perform cross-browser testing
    - Test in Chrome (latest)
    - Test in Firefox (latest)
    - Test in Safari (latest)
    - Test in Edge (latest)
    - Test on mobile Safari (iOS)
    - Test on Chrome Mobile (Android)

  - [ ]* 19.5 Conduct final QA testing
    - Complete all user flows end-to-end
    - Test form validation thoroughly
    - Verify chart data accuracy
    - Test responsive design on real devices

- [~] 20. Final checkpoint - Production ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test-related tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- The design uses TypeScript and React (not pseudocode), so all implementation will be in TypeScript/React
- Property-based testing is NOT applicable for this UI redesign (per design document testing strategy)
- Testing strategy focuses on component tests, integration tests, visual regression, and manual accessibility testing
- All styling uses CSS custom properties (design tokens) for consistency and maintainability
- Responsive design adapts at 800px (mobile) and 430px (extra-small mobile) breakpoints
- Accessibility compliance targets WCAG 2.1 Level AA standards

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.5", "2.7"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.6", "2.8"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "5.1", "5.2", "5.3"] },
    { "id": 4, "tasks": ["4.4", "5.4"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3", "7.4"] },
    { "id": 6, "tasks": ["7.5", "7.6", "8.1", "8.2"] },
    { "id": 7, "tasks": ["8.3", "8.4", "8.5"] },
    { "id": 8, "tasks": ["8.6", "8.7"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3", "10.4"] },
    { "id": 10, "tasks": ["10.5", "10.6", "11.1", "11.2"] },
    { "id": 11, "tasks": ["11.3", "11.4", "12.1", "12.2", "12.3", "12.4"] },
    { "id": 12, "tasks": ["12.5", "12.6", "13.1", "13.2"] },
    { "id": 13, "tasks": ["13.3", "13.4"] },
    { "id": 14, "tasks": ["15.1", "15.2", "15.3"] },
    { "id": 15, "tasks": ["15.4", "16.1", "16.2", "16.3", "16.4"] },
    { "id": 16, "tasks": ["16.5", "17.1", "17.2", "17.3"] },
    { "id": 17, "tasks": ["17.4", "18.1", "18.2", "18.3", "18.4", "18.5"] },
    { "id": 18, "tasks": ["18.6", "18.7"] },
    { "id": 19, "tasks": ["19.1", "19.2", "19.3"] },
    { "id": 20, "tasks": ["19.4", "19.5"] }
  ]
}
```
