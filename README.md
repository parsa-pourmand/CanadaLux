# CanadaLux Mobile Application
CanadaLux is a mobile application built with React Native and Expo, designed to deliver a modern, intuitive experience for browsing products, managing orders, viewing payments, and engaging with a loyalty/points system. The app focuses on clean UI, reusable components, and scalable architecture to support future backend integration.

## Features

- Cross‑Platform Mobile App (iOS & Android) using React Native + Expo
- Product Browsing with reusable card components and local image assets
- Featured Products & Promotions with pricing and visual highlights
- Loyalty / Points System with custom icons and point indicators
- Orders & Payments Screens with structured layouts and separators
- Custom Bottom Tab Navigation including a dedicated action button
- Reusable UI Components (Cards, Lists, Icons, Separators)
- Scalable Architecture ready for Node.js backend integration
## Tech Stack

- Frontend: React Native (JavaScript)
- Framework: Expo
- Navigation: React Navigation (Bottom Tabs & Stack Navigation)
- UI Components: Custom reusable components
- Styling: StyleSheet API
- Assets: Local images and icons
- Backend (Planned): Node.js / REST APIs
## Screens Overview

- Home 
- Promotions - Displays on sale products using card components
- Featured Products – Displays highlighted products using card components
- Orders – View user orders
- Invoices - View user invoices
- Payments – Payment history with amount, date, and method
- Points - View user points and the option to redeem points
- Account – User account and profile options
- Custom Action Tab – Central action button for quick tasks (e.g., new order)
- Login
- Register
- Welcome

## Project Structure

```text
canadalux/
├── app/
│   ├── screens/          # App screens
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation configuration
│   ├── config/           # Theme colors and constants
│   └── assets/           # Images and icons
├── App.js                # App entry point
├── package.json
└── README.md

```
## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Expo CLI
### Installation
```
npm install
```
### Run the App
```
npx expo start
```
Then scan the QR code using the Expo Go app or run it on an emulator.

## Component Design Philosophy
- Components are modular and reusable to reduce duplication
- Styling is kept consistent and centralized where possible
- Screens focus on layout and logic, while components handle UI rendering
- Designed to scale easily as backend APIs and authentication are added

## Future Enhancements
- Backend integration with Node.js & REST APIs
- User authentication & authorization
- Real‑time order tracking
- Persistent loyalty points system
- Push notifications
- Improved accessibility and performance optimizations


## Author
### Parsa Pourmand
Mobile & Software Developer

## License
This project is currently for educational and portfolio purposes. Licensing can be updated as the project evolves.
