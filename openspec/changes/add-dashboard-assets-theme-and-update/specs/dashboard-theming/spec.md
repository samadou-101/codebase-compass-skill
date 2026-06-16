## ADDED Requirements

### Requirement: Dashboard supports light and dark themes
The generated dashboard SHALL support both a light theme and a dark theme using CSS custom properties defined in `codebase-compass/00-codebase-view/styles.css`.

#### Scenario: Default theme on first load
- **WHEN** a user opens `codebase-compass/00-codebase-view/index.html` for the first time
- **THEN** the dashboard renders in light mode

#### Scenario: Dark theme selection
- **WHEN** a user clicks the theme toggle button
- **THEN** the dashboard switches to dark mode and persists the choice in `localStorage`

#### Scenario: Returning user preference
- **WHEN** a user re-opens the dashboard after previously selecting dark mode
- **THEN** the dashboard renders in dark mode automatically

### Requirement: Theme palette preserves the purple accent
The light and dark palettes SHALL use `#7c4dff` as the primary accent color and `#9c7cff` as the hover accent color.

#### Scenario: Accent color visible in both themes
- **WHEN** the dashboard is rendered in light mode or dark mode
- **THEN** headings, active sidebar items, and interactive elements use the purple accent

### Requirement: Scrollbars adapt to the active theme
The dashboard scrollbar styles SHALL match the active theme using CSS custom properties for track and thumb colors.

#### Scenario: Light mode scrollbar
- **WHEN** the dashboard is in light mode
- **THEN** scrollbars use light-colored tracks and thumbs

#### Scenario: Dark mode scrollbar
- **WHEN** the dashboard is in dark mode
- **THEN** scrollbars use dark-colored tracks and thumbs
