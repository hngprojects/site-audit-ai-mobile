# PR Documentation

## Description
This PR implements enhancements to the profile flow, including the addition of new support features such as phone support, email support, and send message functionality. It also includes modifications to existing account, profile, and settings screens for improved user experience.

## Changes Proposed
- Added new support features including phone support, email support, and send message functionality with corresponding screens (phone-support.tsx, send-message.tsx) and stylesheets (phone-support-stylesheet.ts, send-message-stylesheet.ts).
- Introduced a final confirmation screen for account deletion (delete-account-final-confirmation.tsx) with its stylesheet.
- Added a ProfileListItem component for enhanced profile UI.
- Updated stylesheets and screens for account management (delete account flows, layout), profile editing (change password, edit profile, privacy policy), settings (language), and support (contact support, email support, FAQ).
- Modified .gitignore to exclude relevant files.

## What were you told to do?
Implement the profile flow feature branch, including adding support functionality (phone support, email support, send message) and refining account management screens (delete account final confirmation, profile list item component).

## What did you do?
- Added new support screens: phone-support.tsx, send-message.tsx, and their corresponding stylesheets.
- Created a new delete account final confirmation screen and stylesheet.
- Added a ProfileListItem component.
- Modified existing stylesheets and screens for account, profile, settings, and support to integrate the new features and improve styling.
- Updated .gitignore as needed.