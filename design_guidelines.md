# Design Guidelines: Dynamic Landing Page

## Design Approach
**System**: Minimalist Single-Page Layout with Existing Theme Integration

This is a focused, vertical-scroll landing page designed to showcase essential brand elements and key CTAs. The design prioritizes centered alignment, clean hierarchy, and seamless integration with your existing website's visual language.

## Layout System

**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, and 24 for consistent vertical rhythm
- Mobile (base): Compact spacing (py-8 to py-12 between sections)
- Desktop (lg:): Generous spacing (py-16 to py-24 between sections)

**Container Strategy**:
- Overall page: Full viewport height minimum with centered vertical layout
- Content wrapper: max-w-4xl mx-auto px-6 for optimal readability
- All elements: Centered alignment (text-center, mx-auto)

## Typography

**Hierarchy**:
1. Logo: Large scale on desktop (h-16 to h-20), proportionally smaller on mobile (h-12)
2. Tagline "Space energy for earth": Hero-sized text (text-4xl lg:text-5xl), medium weight
3. Navigation links: Standard link sizing (text-lg), clear touch targets

**Font Treatment**: Inherit from existing CSS for consistency

## Component Structure

**1. Header Section** (py-12 lg:py-16)
- Logo: Centered, prominent sizing, adequate breathing room below

**2. Team Image Section** (py-8 lg:py-12)
- Full-width contained image (max-w-3xl mx-auto)
- Aspect ratio: Preserve original, likely landscape orientation
- Rounded corners (rounded-xl) for polish
- Add subtle shadow for depth

**3. Tagline Section** (py-6 lg:py-8)
- Bold, impactful typography
- Letter spacing for emphasis (tracking-wide)

**4. Icon & Flag Section** (py-4)
- US flag: Small circular badge (w-8 h-8 to w-10 h-10)
- Positioned centrally above links

**5. Navigation Links Section** (py-8 lg:py-12)
- Vertical stack on mobile, horizontal arrangement on desktop (flex-col md:flex-row)
- Three links: LinkedIn logo/link, "Partner with Us", "Explore Open Roles"
- Spacing between: gap-6 md:gap-8
- LinkedIn: Icon-based (32x32 to 40x40 px), clickable with external link indicator
- Text links: Clear hover states, underline decoration on hover

## Responsive Behavior

**Breakpoints**:
- Mobile (base): Single column, reduced spacing, smaller logo/images
- Tablet (md:768px): Transition to horizontal link layout
- Desktop (lg:1024px): Full spacing, maximum visual impact

**Image Handling**:
- Team picture: Responsive sizing (w-full on mobile, constrained max-w-3xl on desktop)
- Logo: Scale proportionally with viewport
- Flag icon: Fixed small size across breakpoints
- LinkedIn icon: Consistent size with adequate touch target (min 44x44px)

## Images

**Team Picture**:
- Placement: Second section after logo
- Description: Professional team photo, likely group shot in office/workspace setting
- Treatment: High-quality, well-lit image that conveys professionalism and approachability
- Aspect: Landscape orientation preferred (16:9 or 3:2)
- Note: This is NOT a hero background image - it's a contained, centered photograph

**US Flag Icon**:
- Small circular/ball treatment (emoji or icon)
- Centered placement above links

**LinkedIn Logo**:
- Standard LinkedIn brand icon (blue background with white "in")
- Clickable, leads to company LinkedIn profile

## Interaction Design

**Links**:
- LinkedIn: Icon button with hover scale (hover:scale-110 transition)
- "Partner with Us" & "Explore Open Roles": Text links with underline on hover
- All links: Smooth transitions (transition-all duration-200)
- Clear focus states for accessibility

**Visual Polish**:
- Subtle fade-in on page load (optional enhancement)
- No complex animations - maintain simplicity
- Ensure adequate contrast for all text elements against background

## Integration with Existing Theme

**CSS Application**:
- Apply existing color variables for links, backgrounds, and borders
- Inherit typography scale and font families from main site
- Match button/link styling if existing patterns are defined
- Maintain brand consistency in all interactive elements

## Accessibility

- Semantic HTML structure (header, main, nav elements)
- Descriptive alt text for team image and logos
- Adequate color contrast for all text
- Keyboard-navigable links with visible focus indicators
- Proper heading hierarchy (h1 for logo/brand, appropriate levels for other content)