# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "GestionaleRK" - a Blazor WebAssembly application built with .NET 8. It's a single-page application that runs entirely in the browser.

## Common Development Commands

### Building and Running
- `dotnet build` - Build the project
- `dotnet run --project GestionaleRK` - Run the development server (serves at http://localhost:5294 and https://localhost:7230)
- `dotnet publish` - Create a production build

### Project Management
- The main project is located in the `GestionaleRK/` subdirectory
- Solution file: `GestionaleRK.sln` (for Visual Studio)
- Project file: `GestionaleRK/GestionaleRK.csproj`

## Architecture Overview

### Application Structure
- **Blazor WebAssembly**: Client-side application that downloads and runs in the browser
- **Routing**: Uses Blazor's built-in router with page-based routing via `@page` directives
- **Layout**: Single main layout (`MainLayout.razor`) with sidebar navigation
- **Components**: Pages are in `Pages/` directory, shared components in `Layout/`

### Key Files
- `Program.cs` - Application entry point and service configuration
- `App.razor` - Root component with router configuration
- `_Imports.razor` - Global using statements for Razor components
- `wwwroot/index.html` - Main HTML template
- `Properties/launchSettings.json` - Development server configuration

### Current Pages
- Home (`/`) - Welcome page
- Counter (`/counter`) - Sample interactive component
- Weather (`/weather`) - Sample data display component

### Styling
- Uses Bootstrap CSS framework
- Custom styles in `wwwroot/css/app.css`
- Component-specific styles in `.razor.css` files

### Dependencies
- Microsoft.AspNetCore.Components.WebAssembly 8.0.18
- Microsoft.AspNetCore.Components.WebAssembly.DevServer 8.0.18 (development only)

## Development Notes

- This is a template/starter project with sample components
- Uses implicit usings and nullable reference types enabled
- All Razor components use the standard Blazor WebAssembly patterns
- Static files served from `wwwroot/` directory