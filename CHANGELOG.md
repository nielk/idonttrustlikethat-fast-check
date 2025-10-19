# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.59] - 2024-12-23

### Fixed

- Sync package.json with pnpm-lock.yaml to fix CI frozen-lockfile error
- Add missing dependencies that were installed by pnpm

## [0.0.58] - 2024-12-23

### Changed

- Updated all development dependencies to latest versions
- Updated knip configuration to include test files and JavaScript files

## [0.0.57] - 2024-12-23

### Fixed

- Externalize peer dependencies (fast-check, idonttrustlikethat) in build configuration
- Bundle size reduced from 94kB to 3.4kB (96% reduction)
- Improves install performance and prevents dependency conflicts
- Add noInvalidDate option to date arbitrary to prevent Invalid time value errors

### Changed

- Updated all development dependencies to latest versions
- Updated knip configuration to include test files and JavaScript files

## [0.0.56] - 2024-12-23

### Added

- CI: added `npm publish` github workflow

### Changed

- Updated dependencies
- Fix minor regex performance issue

[0.0.56]: https://github.com/nielk/idonttrustlikethat-fast-check/releases/tag/v0.0.56

## [0.0.55] - 2024-10-19

### Added

- CI: added `Codecov` coverage reporting and build performance
- Added a `CHANGELOG.md`
- CI: added prepublishOnly

### Changed

- CI: changed `dependabot` schedule from `daily` to `weekly`
- Updated dependencies
- Enhanced the contributing section in `README.md`
- Added more strict rules in `tsconfig.json`

[0.0.55]: https://github.com/nielk/idonttrustlikethat-fast-check/releases/tag/v0.0.55
