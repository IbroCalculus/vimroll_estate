# VIMROLL ESTATE

## Luxury Real Estate Discovery & Property Marketplace

**Portfolio project specification \| React.js \| JavaScript**

**Tagline:** Where Exceptional Living Begins.

------------------------------------------------------------------------

## 1. Project overview

Build a premium, fully responsive luxury real estate discovery and
property marketplace called **VIMROLL Estate**.

This is a flagship frontend portfolio project. It should demonstrate
advanced React.js development, premium UI/UX design, sophisticated
animations, component architecture, responsive layouts, and interactive
functionality.

The platform serves high-net-worth individuals, property investors,
luxury home buyers, real estate agents, and international property
seekers.

Users should be able to discover, explore, search, filter, compare,
save, and enquire about exclusive residential properties around the
world.

The experience should feel sophisticated, exclusive, trustworthy,
contemporary, and premium---not like a generic real estate template.

## 2. Brand identity and visual direction

### Brand

-   **Name:** VIMROLL Estate
-   **Tagline:** Where Exceptional Living Begins.
-   **Category:** Luxury real estate discovery and property marketplace.

### Design direction

Combine editorial minimalism with dramatic luxury imagery: - Warm ivory
and neutral backgrounds for the main experience. - Dark charcoal
sections for contrast and drama. - Champagne-gold accents used
sparingly. - Large architectural photography. - Generous whitespace. -
Elegant typography and refined spacing. - Minimal borders and subtle
shadows. - Strong visual hierarchy. - Carefully designed hover and focus
states.

### Colour palette

  Name                Hex         Usage
  ------------------- ----------- -----------------------
  Midnight Charcoal   `#171816`   Dark sections, footer
  Warm Ivory          `#F7F5F0`   Main background
  Champagne Gold      `#B69A69`   Accent details
  Soft Beige          `#E8E1D5`   Secondary backgrounds
  Deep Grey           `#41413D`   Body text
  White               `#FFFFFF`   Cards and surfaces

### Typography

-   Headings: Cormorant Garamond or Playfair Display.
-   Body and navigation: Manrope or Inter.
-   Prices and metadata: Manrope, medium or semibold.

Avoid overusing gold, gradients, rounded cards, and decorative effects.
The result should feel restrained and expensive.

## 3. Technology stack

Use JavaScript, not TypeScript.

  Technology                        Responsibility
  --------------------------------- -----------------------------------------
  React.js                          UI development
  Vite                              Development and build tooling
  Tailwind CSS                      Styling
  React Router                      Client-side routing
  Motion (formerly Framer Motion)   UI and component animations
  GSAP + ScrollTrigger              Advanced scroll and timeline animations
  Zustand                           Global client state
  TanStack Query                    Server-state management when needed
  React Hook Form                   Form handling
  Zod                               Form validation
  Lucide React                      Icons
  Leaflet or Mapbox                 Interactive maps
  React Helmet Async                Page metadata

Use mock data initially. Structure the application so a FastAPI backend
can be integrated later without rewriting the frontend.

Do not add libraries without a clear use case. Keep dependencies and
implementation maintainable.

## 4. Routes and page structure

Implement these routes:

  Route                  Page
  ---------------------- -----------------------
  `/`                    Homepage
  `/properties`          Property listings
  `/properties/:slug`    Property details
  `/collections`         Curated collections
  `/collections/:slug`   Collection details
  `/locations`           Destination discovery
  `/about`               About the brand
  `/contact`             Contact and enquiries
  `/saved`               Saved properties

All routes must work through internal navigation and direct URL entry,
including browser refresh. Include a useful not-found page.

## 5. Homepage requirements

The homepage should be the most visually impressive page.

### 5.1 Navigation

Include: - VIMROLL logo. - Home, Properties, Collections, Locations,
About, Contact. - Saved properties icon with a count where
appropriate. - Enquire CTA.

Behaviour: - Transparent over the hero image. - Transitions to a solid
ivory or charcoal background after scrolling. - Smooth hover and active
states. - Responsive mobile navigation drawer. - Correct keyboard and
focus behaviour.

### 5.2 Hero

Use a breathtaking full-screen or near-full-screen architectural
photograph of a luxury villa.

Content: - Eyebrow: `EXCEPTIONAL PROPERTIES. EXTRAORDINARY LIVING.` -
Heading: **Discover a World Beyond Ordinary.** - Description:
`Explore extraordinary residences curated for those who appreciate exceptional living.` -
Primary CTA: Explore Properties. - Secondary CTA: Discover Our
Collections.

Add a property search panel near the bottom of the hero with: -
Location. - Property type. - Price range. - Bedrooms. - Search button.

The search should work and navigate to the property listing page with
the selected criteria applied.

### 5.3 Featured properties

Show 3--4 premium property cards. Each card should contain: -
High-quality property image. - Property title. - City/country. - Price
and currency. - Bedrooms and bathrooms. - Floor area. - Favourite
button. - View property action. - Optional featured or exclusive label.

Use subtle image zoom and refined hover transitions.

### 5.4 Brand introduction

Create an editorial section with the heading:

**Not Just Properties. A Different Perspective on Living.**

Include: - Large architectural image. - Short brand description. -
Complementary image or visual detail. - Link to the About page.

### 5.5 Explore by destination

Feature destinations such as: - Dubai. - London. - New York. - Paris. -
Marbella. - Lagos.

Each destination should have a large image, destination name, short
descriptor, property count, and link to filtered listings.

### 5.6 Exclusive collections

Show curated categories: - Waterfront Estates. - Modern Masterpieces. -
Private Villas. - Penthouse Living. - Architectural Icons.

Each collection should have an image, title, short description, and
link.

### 5.7 Why VIMROLL

Communicate: - Carefully curated listings. - Verified property
information. - Dedicated property consultants. - International property
network.

Do not make unverifiable claims about actual certification or
verification. Treat these as brand positioning in the demo.

### 5.8 Call to action

Use a large dark section with the heading:

**Your Next Chapter Begins With the Right Address.**

CTA: Speak With Our Consultants.

### 5.9 Footer

Include: - Brand logo and description. - Main navigation. - Property
categories. - Contact information. - Social links. - Newsletter
subscription. - Copyright information.

Newsletter submission should validate the email and provide clear
success/error feedback. If there is no backend, clearly treat it as a
demo interaction rather than pretending an email was sent.

## 6. Property listing page

Create a polished search and discovery experience.

Features: 1. Search by location and keywords. 2. Filter by property
type. 3. Minimum and maximum price. 4. Bedrooms. 5. Bathrooms. 6.
Property size. 7. Sort by price ascending/descending. 8. Sort by newest.
9. Active filter chips. 10. Clear all filters. 11. Grid and list view
toggle. 12. Pagination or load more. 13. Favourite actions. 14. Results
count. 15. Map view and split map/list view.

All filters must work together. Changing filters should update the
visible results and result count. Empty results should display a helpful
empty state and an option to clear filters.

## 7. Property details page

This should be one of the most polished pages.

### Property header

-   Property title.
-   Location.
-   Price.
-   Property reference number.
-   Save button.
-   Share button.

### Image gallery

-   Large primary image.
-   Thumbnail images.
-   View all photos action.
-   Fullscreen lightbox.
-   Previous/next controls.
-   Keyboard navigation and Escape-to-close.

### Property overview

-   Description.
-   Bedrooms.
-   Bathrooms.
-   Floor area.
-   Property type.
-   Year built, when available.

### Amenities

Examples: - Swimming pool. - Private garden. - Smart home. - Gym. -
Ocean view. - Private parking. - Security system.

### Additional sections

-   Detailed property description.
-   Location map.
-   Nearby landmarks or neighbourhood description where supported by
    mock data.
-   Similar properties.
-   Consultant information.
-   Enquiry form.
-   Request a viewing action.

The enquiry panel may be sticky on desktop, but must not obstruct
content on mobile.

## 8. Collections page and collection details

The collections index should feel like a luxury editorial magazine.

Each collection needs: - Large cover image. - Collection title. - Short
description. - Number of properties. - Explore collection action.

Collection detail pages should include an editorial introduction and the
matching property listings.

## 9. Locations page

Create a destination discovery experience.

Each location should include: - Large destination photograph. - City and
country. - Short introduction. - Property count. - Explore properties
CTA.

Selecting a destination should navigate to `/properties` with the
location filter applied.

## 10. Saved properties

Implement: - Saved property grid. - Remove from saved. - Compare
properties. - Persistent favourites using localStorage. - Clear empty
state with a link back to listings.

The saved count in the navigation should update immediately.

## 11. Property comparison

Allow users to compare at least two properties.

Compare relevant fields: - Price. - Location. - Property type. -
Bedrooms. - Bathrooms. - Floor area. - Amenities.

Provide a clear way to remove a property from the comparison. Ensure the
comparison layout is usable on mobile, potentially with horizontal
scrolling or a responsive stacked layout.

## 12. Contact and enquiry pages

Contact page: - Contact information. - Enquiry form. - Preferred contact
method. - Property of interest. - Message field. - Validation. -
Submission success state.

Property enquiry: - Name. - Email. - Phone (optional). - Preferred
contact method. - Message. - Property reference prefilled from the
current property.

Use React Hook Form and Zod if appropriate. Without a backend, show a
clear demo submission confirmation and do not claim that an enquiry was
actually delivered.

## 13. Animation and interaction requirements

Animations should feel expensive, intentional, smooth, and
restrained---not distracting.

### Use Motion for

-   Page transitions.
-   Modal and drawer transitions.
-   Hover interactions.
-   Staggered component entrances.
-   Property card interactions.
-   Layout transitions.
-   Favourite button feedback.

### Use GSAP and ScrollTrigger for

-   Hero text reveals.
-   Scroll-triggered image reveals.
-   Parallax effects.
-   Advanced editorial sequences.
-   Carefully controlled section transitions.

### Optional Lenis

Use Lenis only if smooth scrolling adds value. Avoid competing scroll
systems and ensure normal browser navigation and accessibility remain
reliable.

### Required motion details

  Element           Expected animation
  ----------------- ------------------------------------
  Hero heading      Staggered text reveal
  Hero image        Subtle scale/zoom or parallax
  Navigation        Scroll-based background transition
  Property cards    Image zoom and content reveal
  Buttons           Smooth hover and press states
  Page navigation   Subtle page transition
  Images            Scroll-triggered reveal
  Statistics        Animated number counters
  Search panel      Smooth dropdown transitions
  Gallery           Fullscreen lightbox transition
  Filters           Animated panel expansion
  Favourite         Heart scale feedback
  Mobile menu       Slide-in transition
  Footer            Subtle scroll reveal

Respect `prefers-reduced-motion`. Do not animate every element. Avoid
motion that delays interaction or harms performance.

## 14. Property mock data

Create at least 12--16 realistic listings across different destinations
and price ranges.

Suggested destinations: - Dubai, UAE. - London, United Kingdom. - New
York, USA. - Paris, France. - Marbella, Spain. - Lagos, Nigeria.

Use a consistent property schema, for example:

``` javascript
{
  id: 1,
  slug: "modern-waterfront-villa-dubai",
  title: "The Azure Residence",
  location: {
    city: "Dubai",
    country: "UAE",
    address: "Palm Jumeirah, Dubai"
  },
  price: 4500000,
  currency: "USD",
  propertyType: "Villa",
  bedrooms: 5,
  bathrooms: 6,
  area: 650,
  areaUnit: "sqm",
  yearBuilt: 2024,
  featured: true,
  createdAt: "2026-01-15",
  images: [
    "/images/property-1.jpg",
    "/images/property-2.jpg"
  ],
  amenities: [
    "Swimming Pool",
    "Private Garden",
    "Ocean View",
    "Smart Home"
  ],
  description: "A contemporary waterfront residence..."
}
```

Keep the data separate from UI components. Use realistic variation in
images, prices, amenities, property types, and descriptions. Do not
repeat the same image for every property.

Use high-quality architectural photography from reliable sources with
appropriate usage rights. Prefer locally stored, optimised assets for
the final deployment. Provide graceful fallbacks for missing images.

## 15. Suggested React architecture

Use a feature-oriented, component-based structure. Adapt it as needed,
but preserve separation of concerns.

``` text
vimroll-estate/
├── public/
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Container.jsx
│   │   │   ├── SectionHeading.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loader.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageLayout.jsx
│   │   ├── property/
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyGrid.jsx
│   │   │   ├── PropertyGallery.jsx
│   │   │   ├── PropertyFilters.jsx
│   │   │   └── PropertySearch.jsx
│   │   └── animations/
│   │       ├── Reveal.jsx
│   │       └── PageTransition.jsx
│   ├── features/
│   │   ├── properties/
│   │   ├── favorites/
│   │   ├── collections/
│   │   └── enquiries/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Properties.jsx
│   │   ├── PropertyDetails.jsx
│   │   ├── Collections.jsx
│   │   ├── CollectionDetails.jsx
│   │   ├── Locations.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── SavedProperties.jsx
│   ├── data/
│   │   ├── properties.js
│   │   ├── locations.js
│   │   └── collections.js
│   ├── hooks/
│   ├── store/
│   │   └── favoritesStore.js
│   ├── utils/
│   ├── routes/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

Avoid oversized components. Keep reusable UI, feature logic, data, and
state management appropriately separated. Do not create empty
abstraction layers that add complexity without value.

## 16. Responsive design

Optimise and test at these viewport ranges: - Desktop: 1440px and
above. - Laptop: 1024--1439px. - Tablet: 768--1023px. - Mobile:
375--767px.

Pay particular attention to: - Mobile navigation. - Property search
usability. - Property card layouts. - Image galleries. - Filter
drawers. - Enquiry panels. - Typography scaling. - Map/list layouts.

No horizontal overflow, clipped content, broken layouts, or tiny touch
targets.

## 17. Quality, accessibility, and performance

Implement: - Semantic HTML. - Accessible labels and form errors. -
Keyboard-accessible navigation and controls. - Meaningful image alt
text. - Visible focus indicators. - Reduced-motion support. - Lazy
loading for below-the-fold images. - Responsive image sizes. - Loading,
empty, and error states. - Appropriate page titles and metadata. - Clean
browser console. - No broken internal links. - No non-functional
buttons. - No unnecessary re-renders. - Reasonable bundle size.

Test all routes and important interactions on desktop and mobile.

## 18. Development phases

Build incrementally. Do not attempt to generate the entire application
in one response.

### Phase 1 --- Foundation

-   Create Vite React project.
-   Configure Tailwind CSS.
-   Install required dependencies.
-   Set up routes.
-   Establish design tokens, typography, spacing, and global styles.
-   Establish folder architecture.

### Phase 2 --- Shared layout

-   Navigation.
-   Footer.
-   Page container.
-   Buttons.
-   Common components.
-   Mobile navigation.

### Phase 3 --- Homepage

-   Hero.
-   Search panel.
-   Featured properties.
-   Brand introduction.
-   Destinations.
-   Collections.
-   Why VIMROLL.
-   CTA and footer.
-   Core animations.

### Phase 4 --- Property discovery

-   Property mock data.
-   Property cards.
-   Search.
-   Filters.
-   Sorting.
-   Grid/list view.
-   Pagination or load more.

### Phase 5 --- Property details

-   Dynamic slug routing.
-   Gallery and lightbox.
-   Overview and amenities.
-   Map.
-   Similar properties.
-   Enquiry panel.

### Phase 6 --- Supporting pages

-   Collections.
-   Collection details.
-   Locations.
-   About.
-   Contact.

### Phase 7 --- Interactive functionality

-   Favourites and persistence.
-   Property comparison.
-   Map/list interactions.
-   Forms and validation.
-   Newsletter feedback.

### Phase 8 --- Refinement

-   Responsive testing.
-   Accessibility.
-   Performance.
-   Animation polish.
-   Error and empty states.
-   Browser console checks.

### Phase 9 --- Deployment

-   Production build.
-   Deploy frontend to Vercel.
-   Publish source code on GitHub.
-   Write a comprehensive README.
-   Add screenshots and project description.

## 19. Working instructions for the AI coding assistant

1.  Work phase by phase and wait for confirmation before moving to the
    next major phase.
2.  Before each phase, briefly explain the implementation plan and
    identify the files to be created or changed.
3.  Provide complete, working code for each file rather than
    disconnected snippets.
4.  Preserve existing functionality when modifying files.
5.  Do not silently replace working code with simplified versions.
6.  Explain important architectural decisions briefly.
7.  Do not leave unfinished sections or non-functional buttons.
8.  Use consistent design tokens and reusable components.
9.  Use JavaScript and JSX, not TypeScript.
10. Test the development build after meaningful implementation
    milestones.
11. If an external service requires credentials, explain the setup and
    provide a working fallback where possible.
12. Ask for clarification only when a decision genuinely blocks
    implementation.

## 20. Definition of done

The project is portfolio-ready when: - All nine routes work. - The
homepage has a distinctive premium visual identity. - Property search,
filtering, and sorting work. - Property detail pages load from dynamic
slugs. - Image galleries and lightboxes work. - Favourites persist
across reloads. - Property comparison works. - Contact and newsletter
forms validate and show honest feedback. - Maps display property
locations. - Layouts work on desktop, tablet, and mobile. - Animations
are smooth and respect reduced-motion settings. - There are no broken
links, missing assets, or console errors. - Production build succeeds. -
The project is deployed and has a clear GitHub README.

**Final quality bar:** VIMROLL Estate should look like a high-end
international luxury property platform, not a tutorial project. Visual
quality and functional engineering are equally important.
