# Changelog

## [1.1.0] - 2025-10-21

### Added
- Reusable `sidebar`, `navbar`, and `footer` components that can be embedded via `data-include`, enabling single-source maintenance for navigation and branding elements.
- New high-value pages (`reports.html`, `calendar.html`, `billing.html`, `support.html`) that showcase premium analytics, scheduling, billing, and customer-success experiences to lift the product’s value proposition.
- Configurable UI controls, including analytics timeline blocks, view toggle capsules, and Settings navigation cards, with supporting CSS for polished glassmorphism visuals.
- `ComponentLoader`, `NavbarController`, and enhanced `SidebarController` logic to hydrate components, populate contextual actions, and display workspace health metrics across the suite.

### Changed
- Updated existing pages to consume the shared components, removing duplicated markup while wiring per-page metadata through `data-*` attributes.
- Refined theme styling and interaction states (e.g., KPI timelines, icon toggles, navigation badges) to maintain consistency across all layouts and viewports.
- Standardised footer content and introduced professional upgrade messaging to reinforce the Baktify brand identity.

### Fixed
- Cleansed lingering encoding artefacts in legacy markup and scripts to preserve ASCII-safe content across the codebase.

