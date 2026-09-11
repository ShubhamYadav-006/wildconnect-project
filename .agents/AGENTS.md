# WildConnect Project Rules

## CSS Styling Guidelines

1. **Do NOT use Tailwind CSS.**
   - No Tailwind utility classes.
   - No `@apply` directive.
   - No Tailwind-specific syntax.
   - No inline utility class names.

2. **Use only normal CSS files.**

3. **Keep all CSS files inside the existing `src/styles` folder.**
   - Recommended structure:
     ```text
     src/
     ├── components/
     ├── pages/
     └── styles/
         ├── common/
         ├── home/
         ├── pages/
         ├── dashboard/
         ├── admin/
         └── globals/
     ```

4. **Every React component/page must have its own CSS file.**
   - Example:
     - Component: `components/HeroSection.tsx`
     - CSS file: `styles/home/HeroSection.css`
     - Import: `import "../../styles/home/HeroSection.css";`

5. **Use semantic and meaningful CSS class names.**
   - Example:
     - `hero-section`
     - `hero-container`
     - `hero-content`
     - `hero-title`
     - `hero-subtitle`
     - `hero-buttons`
     - `hero-image`
   - Avoid generic names like:
     - `container`
     - `wrapper`
     - `box`
     - `div1`

6. **Organize every CSS file with comments.**
   - Example:
     ```css
     /* ==========================================
        Hero Section
     ========================================== */
     .hero-section {
     }

     /* ==========================================
        Hero Content
     ========================================== */
     .hero-content {
     }
     ```

7. **Create reusable global CSS files whenever necessary.**
   - Path: `styles/globals/`
   - Files: `variables.css`, `buttons.css`, `forms.css`, `cards.css`, `animations.css`, `typography.css`, `utilities.css`

8. **Never write inline CSS unless absolutely necessary.**

9. **Use Flexbox and CSS Grid instead of Tailwind utilities.**

10. **Use CSS media queries for responsiveness.**
    - Example:
      ```css
      @media (max-width: 1024px) {
      }
      @media (max-width: 768px) {
      }
      @media (max-width: 480px) {
      }
      ```

11. **Keep all existing functionality unchanged.**
    - Do not modify business logic.
    - Do not modify routing.
    - Do not modify API calls.
    - Do not modify authentication.
    - Do not modify state management.

12. **Only redesign the UI when requested.**

13. **Write clean, production-ready, maintainable code.**

14. **Preserve comments in both TSX and CSS files.**

15. **Whenever generating code:**
    - First provide the TSX file.
    - Then provide the corresponding CSS file.
    - Mention exactly where each file should be placed.
