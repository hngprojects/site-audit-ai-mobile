# **Description**

<!--- Describe your changes in detail -->

This PR refactors the app file structure to follow kebab-case naming conventions and organizes screens into route groups for better code organization. All authentication screens have been moved to a dedicated `(auth)` route group, and the onboarding screen has been moved to an `(onboarding)` route group. Additionally, all stylesheet files have been renamed to follow kebab-case naming conventions.

# **Changes Proposed**

## **What were you told to do?**

- Scan through the entire app and modify file names to follow kebab-case naming conventions ("file-name")
- Move auth screens (signIn, signUp, forgotPassword) to a `(auth)` route group
- Move onboarding screen to an `(onboarding)` route group
- Update `_layout.tsx` files to follow the new conventions
- Update all imports to reflect the new file structure and naming

## **What did you do?**

1. **Created route groups:**
   - Created `app/(auth)/` folder with `_layout.tsx` for authentication screens
   - Created `app/(onboarding)/` folder with `_layout.tsx` for onboarding screen

2. **Renamed and reorganized files:**
   - Moved `signIn.tsx` → `app/(auth)/sign-in.tsx`
   - Moved `signUp.tsx` → `app/(auth)/sign-up.tsx`
   - Moved `forgotPassword.tsx` → `app/(auth)/forgot-password.tsx`
   - Moved `onboarding.tsx` → `app/(onboarding)/index.tsx`

3. **Updated stylesheets to kebab-case:**
   - `forgotPasswordStylesheet.ts` → `forgot-password-stylesheet.ts`
   - `signInStylesheet.ts` → `sign-in-stylesheet.ts`
   - `signUpStylesheet.ts` → `sign-up-stylesheet.ts`
   - `onboardingstylesheet.ts` → `onboarding-stylesheet.ts`
   - `languageScreenStylesheet.ts` → `language-screen-stylesheet.ts`

4. **Updated routing:**
   - Modified `app/_layout.tsx` to reference new route groups `(auth)` and `(onboarding)`
   - Updated all `router.push()` and `router.replace()` calls to use new kebab-case paths:
     - `/(auth)/sign-in`
     - `/(auth)/sign-up`
     - `/(auth)/forgot-password`
     - `/(onboarding)`

5. **Updated imports:**
   - Updated all stylesheet imports to use new kebab-case filenames
   - Updated asset paths in moved files to reflect new directory structure

6. **Cleanup:**
   - Deleted old files after migration to prevent conflicts

## Types of changes

<!--- What types of changes does your code introduce? Put an `x` in all the boxes that apply: -->

- [ ] Bug fix (non-breaking change which fixes an issue)

- [ ] New feature (non-breaking change which adds functionality)

- [ ] Breaking change (fix or feature that would cause existing functionality to change)

- [x] Chore (changes that do not relate to a fix or feature and don't modify src or test files)

# **Check List**

<!--- Go over all the following points, and put an `x` in all the boxes that apply. -->

<!--- If you're unsure about any of these, don't hesitate to ask. We're here to help! -->

- [x] My code follows the code style of this project.

- [x] This PR does not contain plagiarized content.

- [x] The title and description of the PR are clear and explain the approach.

- [x] I am making a pull request against the **dev branch** (left side).

- [x] My commit message style matches our requested structure.

- [x] My code additions will not fail code linting checks or unit tests.

- [x] I am only making changes to files I was requested to.

---

# Images

<!-- Add Screenshots of: -->

- The live component worked on

- Linting check (run pnpm lint)

