# Requirements Document

## Introduction

EcoTrack is a carbon footprint tracking web application that helps users calculate, understand, and reduce their environmental impact. This requirements document defines the redesign of the EcoTrack user interface to align with a modern, clean design reference provided by stakeholders. The redesign will transform all existing pages—Landing, Calculator, Dashboard (Results), Recommendations, Progress, and Profile—to match the reference design's visual language while maintaining existing functionality.

The application currently uses React, TypeScript, Tailwind CSS, and Lucide icons on the frontend, with a Flask backend and ML model for carbon footprint predictions. The redesign will focus on the frontend visual presentation, component structure, and user experience.

## Glossary

- **UI_System**: The complete user interface redesign system including all components, pages, styles, and design tokens
- **Design_Reference**: The provided set of reference screenshots showing the target visual design
- **Landing_Page**: The home page that introduces EcoTrack and encourages users to calculate their footprint
- **Calculator_Page**: The multi-step form where users input lifestyle data to calculate their carbon footprint
- **Dashboard_Page**: The results page displaying calculated carbon footprint with visualizations
- **Recommendations_Page**: The page showing AI-powered suggestions to reduce carbon footprint
- **Progress_Page**: The page displaying historical tracking data and eco score
- **Profile_Page**: The user profile management and settings page
- **Design_Tokens**: The standardized color palette, typography, spacing, and other design primitives
- **Component_Library**: The reusable React components implementing the design system
- **Visual_Identity**: The cohesive visual language including colors, typography, iconography, and spacing
- **Carbon_Footprint**: A measure of greenhouse gas emissions expressed in tonnes CO2 equivalent per year
- **Eco_Score**: A numerical score (0-100) representing user's sustainability performance

## Requirements

### Requirement 1: Design System Foundation

**User Story:** As a developer, I want a comprehensive design system foundation, so that the UI redesign is consistent, maintainable, and matches the design reference.

#### Acceptance Criteria

1. THE UI_System SHALL define Design_Tokens for the primary green color (#118865), green-dark color (#087053), neutral colors (ink, muted, line, cream), and background colors
2. THE UI_System SHALL define typography tokens for font families (DM Sans for body, Fraunces for display), font sizes, font weights, and letter spacing
3. THE UI_System SHALL define spacing tokens for consistent padding, margins, and gaps throughout the interface
4. THE UI_System SHALL define border radius tokens for rounded corners (small: 12px, medium: 16px, large: 18px, pill: 999px)
5. THE UI_System SHALL define shadow tokens for card elevations and hover states
6. WHEN any component uses colors, THE component SHALL reference Design_Tokens rather than hardcoded values
7. WHEN any component uses typography, THE component SHALL reference typography tokens for consistent text rendering

### Requirement 2: Landing Page Redesign

**User Story:** As a user visiting EcoTrack, I want a welcoming landing page that clearly explains the value proposition, so that I understand what the service offers and feel motivated to start.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a hero section with the headline "Small Choices. Big Impact." and a subtitle explaining the value proposition
2. THE Landing_Page SHALL display an illustration of Earth with hands holding it and a plant growing from the top
3. THE Landing_Page SHALL display a "Calculate My Footprint" primary button that navigates to the Calculator_Page
4. THE Landing_Page SHALL display three feature cards titled "Calculate", "Get AI Insights", and "Track Progress" with icons, descriptions, and action links
5. THE Landing_Page SHALL use a clean green color scheme with white card backgrounds and subtle shadows
6. WHEN the user hovers over interactive elements, THE Landing_Page SHALL provide visual feedback with color changes and subtle animations
7. THE Landing_Page SHALL be responsive and adapt layout for mobile devices (stacking columns vertically)

### Requirement 3: Calculator Page Structure

**User Story:** As a user, I want a clear and organized calculator form, so that I can easily input my lifestyle data without confusion.

#### Acceptance Criteria

1. THE Calculator_Page SHALL display a page title "Carbon Footprint Calculator" and introductory text
2. THE Calculator_Page SHALL organize input fields into sections: Transportation, Electricity, Food, Waste, and Travel
3. THE Calculator_Page SHALL display a sidebar showing progress through the form with section indicators
4. WHEN the user completes a section, THE Calculator_Page SHALL update the progress indicator to show completion
5. THE Calculator_Page SHALL display each section with an icon, title, and descriptive text
6. THE Calculator_Page SHALL display input fields with labels, placeholder text, and helpful tips
7. THE Calculator_Page SHALL display a green "Calculate Footprint" button at the bottom of the form
8. THE Calculator_Page SHALL validate user input and display error messages for invalid data

### Requirement 4: Form Input Components

**User Story:** As a user filling out the calculator form, I want intuitive input controls, so that I can quickly and accurately provide my information.

#### Acceptance Criteria

1. THE Calculator_Page SHALL render text input fields with rounded corners, light background, and green focus border
2. THE Calculator_Page SHALL render number input fields with unit labels (e.g., "km/month", "kWh/month")
3. THE Calculator_Page SHALL render option cards for multiple choice questions with icons and checkmarks for selection
4. WHEN the user focuses an input field, THE input field SHALL change background to white and border to green
5. WHEN the user selects an option card, THE option card SHALL display green border, green text, and a checkmark icon
6. THE Calculator_Page SHALL display helper text below input fields to guide users on what to enter
7. WHEN validation fails for an input, THE input field SHALL display red border and error message text

### Requirement 5: Dashboard Results Display

**User Story:** As a user who has calculated my footprint, I want clear visualizations of my results, so that I can understand my environmental impact.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL display the total carbon footprint as a large number in tonnes CO2e/year
2. THE Dashboard_Page SHALL display a circular chart or badge showing the total footprint prominently
3. THE Dashboard_Page SHALL display a breakdown bar chart showing emissions by category (Transportation, Electricity, Food, Waste, Travel)
4. THE Dashboard_Page SHALL display a comparison badge showing whether the footprint is above, below, or equal to the regional average
5. THE Dashboard_Page SHALL display an equivalence message (e.g., "Equivalent to -14 trees per year")
6. WHEN displaying the comparison, THE Dashboard_Page SHALL use green styling for below-average footprints and red/orange for above-average
7. THE Dashboard_Page SHALL use consistent card layouts with white backgrounds, rounded corners, and subtle shadows

### Requirement 6: Breakdown Visualizations

**User Story:** As a user reviewing my results, I want detailed breakdowns by category, so that I can identify which areas contribute most to my footprint.

#### Acceptance Criteria

1. THE Dashboard_Page SHALL display each category with an icon, label, and emission value
2. THE Dashboard_Page SHALL display horizontal bar charts showing relative contribution of each category
3. THE Dashboard_Page SHALL color-code each category consistently throughout the interface
4. WHEN rendering bar charts, THE Dashboard_Page SHALL scale bars proportionally to emission values
5. THE Dashboard_Page SHALL display category icons in rounded square containers with colored backgrounds
6. THE Dashboard_Page SHALL sort categories from highest to lowest emissions in the breakdown display

### Requirement 7: Recommendations Display

**User Story:** As a user seeking to reduce my footprint, I want personalized recommendations, so that I know what actions to take.

#### Acceptance Criteria

1. THE Recommendations_Page SHALL display a page title "AI-Powered Recommendations"
2. THE Recommendations_Page SHALL group recommendations by category (Transportation, Electricity, Food, Waste)
3. THE Recommendations_Page SHALL display each recommendation with a potential reduction amount (e.g., "-0.7 tonnes CO2e/year")
4. THE Recommendations_Page SHALL display specific actionable tips as bullet points under each recommendation
5. THE Recommendations_Page SHALL use card layouts with icons, titles, and descriptions
6. THE Recommendations_Page SHALL highlight reduction potential in green text to emphasize positive impact
7. WHEN recommendations are generated, THE Recommendations_Page SHALL prioritize highest-impact actions first

### Requirement 8: Progress Tracking Visualization

**User Story:** As a returning user, I want to see my progress over time, so that I can track improvements and stay motivated.

#### Acceptance Criteria

1. THE Progress_Page SHALL display a line chart showing monthly carbon footprint trend
2. THE Progress_Page SHALL display "Your Eco Score" with a progress bar and numerical score out of 100
3. THE Progress_Page SHALL display an achievements section showing unlocked milestones
4. THE Progress_Page SHALL display change indicators (e.g., "↓ 18% since last month") with colored arrows
5. WHEN footprint decreases, THE Progress_Page SHALL use green styling and downward arrows
6. WHEN footprint increases, THE Progress_Page SHALL use red/orange styling and upward arrows
7. THE Progress_Page SHALL display historical data with date labels on the x-axis and emission values on the y-axis

### Requirement 9: Profile and Settings Interface

**User Story:** As a user, I want to manage my profile and settings, so that I can control my account preferences.

#### Acceptance Criteria

1. THE Profile_Page SHALL display user profile information including name and email
2. THE Profile_Page SHALL display a "My Impact" summary section
3. THE Profile_Page SHALL provide navigation to settings, notifications, and log out
4. THE Profile_Page SHALL use consistent card layouts matching the rest of the interface
5. THE Profile_Page SHALL display profile actions as buttons with icons
6. WHEN the user clicks "Log Out", THE Profile_Page SHALL clear session and navigate to Landing_Page

### Requirement 10: Navigation and Header

**User Story:** As a user navigating the application, I want a clear navigation system, so that I can easily move between sections.

#### Acceptance Criteria

1. THE UI_System SHALL display a navigation header with the EcoTrack logo and main navigation links
2. THE UI_System SHALL display navigation links for Calculator, Dashboard, Progress, and Profile
3. THE UI_System SHALL highlight the current page in the navigation
4. THE UI_System SHALL display the logo with a green leaf icon and "EcoTrack" text
5. WHEN the user clicks a navigation link, THE UI_System SHALL navigate to the corresponding page
6. THE UI_System SHALL collapse navigation into a hamburger menu on mobile devices
7. THE UI_System SHALL maintain the header at the top of the page with consistent height (82px)

### Requirement 11: Button Components

**User Story:** As a user interacting with the interface, I want consistent and intuitive buttons, so that I can easily identify and activate actions.

#### Acceptance Criteria

1. THE Component_Library SHALL provide a primary button style with green background, white text, and rounded corners
2. THE Component_Library SHALL provide a ghost button style with transparent background, border, and colored text
3. THE Component_Library SHALL provide a light button style with white background and green text
4. WHEN the user hovers over a button, THE button SHALL animate with a subtle upward translation and enhanced shadow
5. WHEN a button is disabled, THE button SHALL display reduced opacity (40%) and no hover effects
6. THE Component_Library SHALL support button sizes (small, medium, large) with appropriate padding
7. THE Component_Library SHALL support button icons positioned before or after text

### Requirement 12: Card Components

**User Story:** As a user viewing content, I want consistent card layouts, so that information is organized and easy to scan.

#### Acceptance Criteria

1. THE Component_Library SHALL provide card components with white background, rounded corners (18px), and 1px border
2. THE Component_Library SHALL provide feature cards with colored backgrounds (mint, sky, cream)
3. THE Component_Library SHALL provide metric cards for displaying statistics with icons and values
4. WHEN the user hovers over interactive cards, THE card SHALL animate with upward translation and enhanced shadow
5. THE Component_Library SHALL support card padding variants (compact: 20px, standard: 28px, large: 34px)
6. THE Component_Library SHALL support card header sections with icons, titles, and subtitles

### Requirement 13: Typography System

**User Story:** As a user reading content, I want clear and consistent typography, so that information is easy to read and understand.

#### Acceptance Criteria

1. THE UI_System SHALL use DM Sans font family for body text, labels, and UI elements
2. THE UI_System SHALL use Fraunces font family for display headings and emphasized text
3. THE UI_System SHALL define heading styles (H1: 48-70px, H2: 34-49px, H3: 18-22px) with tight letter spacing
4. THE UI_System SHALL define body text styles (large: 15px, medium: 13-14px, small: 11-12px)
5. THE UI_System SHALL use italics for emphasized portions of headings rendered in Fraunces font
6. THE UI_System SHALL maintain consistent line heights (1.0-1.1 for headings, 1.6-1.7 for body text)
7. THE UI_System SHALL use font weights (regular: 400, medium: 500, semibold: 600, bold: 700)

### Requirement 14: Color System

**User Story:** As a user experiencing the interface, I want a cohesive color palette, so that the design feels unified and reinforces the environmental theme.

#### Acceptance Criteria

1. THE UI_System SHALL use #118865 as the primary green color for buttons, links, and accents
2. THE UI_System SHALL use #087053 as the green-dark color for hover states and emphasis
3. THE UI_System SHALL use #173d39 as the ink color for primary text
4. THE UI_System SHALL use #65827e as the muted color for secondary text
5. THE UI_System SHALL use #d9e9e1 as the line color for borders and dividers
6. THE UI_System SHALL use #f8fbf7 as the background color for pages
7. THE UI_System SHALL use #f4f8ed as the cream color for alternate backgrounds
8. WHEN displaying success or positive metrics, THE UI_System SHALL use green tones
9. WHEN displaying warnings or above-average metrics, THE UI_System SHALL use orange/red tones (#e85b5b, #d4562f)

### Requirement 15: Icon System

**User Story:** As a user viewing the interface, I want consistent iconography, so that visual cues are easy to recognize and understand.

#### Acceptance Criteria

1. THE UI_System SHALL use Lucide React icon library for all icons
2. THE UI_System SHALL use icons to represent categories: Transportation, Electricity, Food, Waste, Travel
3. THE UI_System SHALL display icons in circular or rounded square containers with colored backgrounds
4. THE UI_System SHALL size icons consistently within their context (small: 16-18px, medium: 20-24px, large: 28-32px)
5. THE UI_System SHALL use Leaf icon for branding and environmental themes
6. THE UI_System SHALL use BarChart3, Sparkles, Sprout icons for feature cards
7. THE UI_System SHALL use Check, CircleCheck icons for completion and validation states

### Requirement 16: Responsive Layout

**User Story:** As a mobile user, I want the interface to adapt to my screen size, so that I can use EcoTrack on any device.

#### Acceptance Criteria

1. THE UI_System SHALL adapt layouts from multi-column to single-column below 800px viewport width
2. THE UI_System SHALL collapse the navigation header into a hamburger menu below 800px viewport width
3. THE UI_System SHALL stack feature cards vertically on mobile devices
4. THE UI_System SHALL adjust typography sizes for mobile screens (reduce by 10-20%)
5. THE UI_System SHALL reduce padding and margins on mobile screens to maximize content space
6. THE UI_System SHALL maintain minimum touch target sizes of 44x44px for interactive elements on mobile
7. WHEN viewport width is below 430px, THE UI_System SHALL apply extra compact spacing and typography

### Requirement 17: Animation and Transitions

**User Story:** As a user interacting with the interface, I want smooth animations, so that the experience feels polished and responsive.

#### Acceptance Criteria

1. THE UI_System SHALL apply transition duration of 200-250ms for hover effects
2. THE UI_System SHALL apply transition duration of 400-600ms for progress indicators and data visualizations
3. THE UI_System SHALL use ease-in-out timing function for most transitions
4. WHEN buttons are hovered, THE button SHALL translate upward by 2-3px with shadow enhancement
5. WHEN cards are hovered, THE card SHALL translate upward by 3-5px with shadow enhancement
6. WHEN input fields receive focus, THE border color transition SHALL complete in 200ms
7. THE UI_System SHALL respect user's prefers-reduced-motion settings to disable animations when requested

### Requirement 18: Chart and Visualization Components

**User Story:** As a user viewing data, I want clear and attractive visualizations, so that I can quickly understand my carbon footprint metrics.

#### Acceptance Criteria

1. THE UI_System SHALL use Recharts library for rendering charts and visualizations
2. THE UI_System SHALL render bar charts with rounded corners and consistent colors
3. THE UI_System SHALL render line charts with smooth curves and data point markers
4. THE UI_System SHALL render pie/donut charts with category color-coding
5. WHEN rendering charts, THE UI_System SHALL include axis labels, legends, and tooltips
6. WHEN the user hovers over chart elements, THE chart SHALL display tooltip with detailed values
7. THE UI_System SHALL animate chart rendering with smooth transitions on initial load

### Requirement 19: Loading and Empty States

**User Story:** As a user waiting for data, I want clear feedback, so that I know the application is working and when data is unavailable.

#### Acceptance Criteria

1. THE UI_System SHALL display loading indicators when fetching data or performing calculations
2. THE UI_System SHALL display empty state messages when no data is available
3. THE UI_System SHALL use skeleton loaders for content that is being fetched
4. WHEN calculation is in progress, THE Calculator_Page SHALL display loading spinner and progress message
5. WHEN no historical data exists, THE Progress_Page SHALL display an empty state message encouraging first calculation
6. THE UI_System SHALL disable interactive elements while operations are in progress
7. THE UI_System SHALL display error messages in red text with icons when operations fail

### Requirement 20: Accessibility Compliance

**User Story:** As a user with accessibility needs, I want an inclusive interface, so that I can use EcoTrack regardless of my abilities.

#### Acceptance Criteria

1. THE UI_System SHALL provide sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)
2. THE UI_System SHALL provide keyboard navigation for all interactive elements
3. THE UI_System SHALL provide focus indicators for keyboard navigation
4. THE UI_System SHALL provide ARIA labels for icons, charts, and interactive elements
5. THE UI_System SHALL provide alt text for images and illustrations
6. THE UI_System SHALL ensure form inputs have associated labels
7. THE UI_System SHALL support screen readers with semantic HTML and ARIA attributes
