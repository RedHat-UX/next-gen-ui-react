# Release Guide

This document describes how to release a new version of `@rhngui/patternfly-react-renderer`.

## Automated Releases with GitHub Actions

This project uses GitHub Actions to automatically publish releases to npm when you push a version tag.

## Prerequisites

### Required Permissions

To perform a release, you need:

1. **GitHub Repository Access**: Write/maintain permissions on the `RedHat-UX/next-gen-ui-react` repository
2. **npm Organization Access**: Publish permissions for the `@rhngui` scope on [npmjs.com](https://www.npmjs.com/)

### NPM_TOKEN Configuration

The `NPM_TOKEN` secret is **already configured** in the GitHub repository for automated releases. This token is used by GitHub Actions to publish packages to npm.

**Token Maintenance**: The npm access token has a limited validity period and needs to be renewed periodically. If releases fail with authentication errors:

1. Generate a new token on [npmjs.com](https://www.npmjs.com/):
   - Go to Account Settings → Access Tokens → Generate New Token
   - Select "Automation" type (or "Publish" if you want stricter permissions)
   - Copy the token
2. Update the GitHub secret:
   - Go to repository Settings → Secrets and variables → Actions
   - Update the `NPM_TOKEN` secret with the new token value
   - **Note**: Only repository admins can update secrets

## Release Process

### 1. Prepare the Release

Make sure you're on the `main` branch with all changes committed:

```bash
git checkout main
git pull origin main
```

Review and update documentation:

- Ensure `README.md` is up to date with all new features and components
- Update examples if needed
- Verify all links are working

Verify everything is working locally:

```bash
npm run verify
```

This command runs type checking, linting, tests, and builds the package.

### 2. Create a Version Tag

Use npm's version command to bump the version and create a git tag:

```bash
# For a prerelease (1.0.0-alpha.0 → 1.0.0-alpha.1)
npm version prerelease --preid=alpha

# For a patch release (1.0.0 → 1.0.1)
npm version patch

# For a minor release (1.0.0 → 1.1.0)
npm version minor

# For a major release (1.0.0 → 2.0.0)
npm version major

# Or specify an exact version
npm version 1.0.0
```

This will:

- Update the version in `package.json`
- Create a git commit with the version change
- Create a git tag (e.g., `v1.0.0`)

### 3. Push the Tag

Push both the commit and the tag to GitHub:

```bash
git push origin main --follow-tags
```

### 4. Automated Build & Publish

Once the tag is pushed, GitHub Actions will automatically:

1. ✅ Run type checking
2. ✅ Run linting
3. ✅ Run all tests
4. ✅ Build the package
5. ✅ Publish to npm with the appropriate tag:
   - `alpha`, `beta`, or `rc` versions → `npm install @rhngui/patternfly-react-renderer@next`
   - Stable versions → `npm install @rhngui/patternfly-react-renderer@latest`
6. ✅ Create a GitHub Release with auto-generated release notes

### 5. Verify the Release

1. Check the GitHub Actions workflow completed successfully:
   - Go to your repository → Actions tab
   - Look for the "Release" workflow for your tag

2. Verify on npm:

   ```bash
   npm view @rhngui/patternfly-react-renderer
   ```

3. Check the GitHub Releases page for your new release

## Version Strategy

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/) (SemVer):

- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: New features, backwards compatible
- **Patch (1.0.X)**: Bug fixes, backwards compatible

### Pre-release Versions

For pre-releases, use these suffixes:

- **alpha**: Early development, unstable API
  - Example: `1.0.0-alpha.0`, `1.0.0-alpha.1`
- **beta**: Feature complete, testing phase
  - Example: `1.0.0-beta.0`, `1.0.0-beta.1`
- **rc**: Release candidate, final testing
  - Example: `1.0.0-rc.0`, `1.0.0-rc.1`

Pre-releases are automatically published with the `next` tag on npm.

## Manual Release (Fallback)

If the automated workflow fails or you need to publish manually:

```bash
# Ensure you're logged in to npm
npm login

# Build the package
npm run build

# Publish
npm publish --tag next  # for prereleases
npm publish             # for stable releases
```

## Continuous Integration

The CI workflow runs automatically on:

- Pull requests to `main`
- Pushes to `main`

It runs:

- Type checking
- Linting
- Format checking
- Tests on Node.js 20
- Package build
- Demo app build

All checks must pass before merging PRs.

## Troubleshooting

### Release workflow failed

1. Check the GitHub Actions logs for the specific error
2. Common issues:
   - `NPM_TOKEN` not set or invalid → Add/update the secret
   - Tests failing → Fix the tests before releasing
   - Build errors → Fix build issues locally first

### Wrong npm tag

If a version was published with the wrong tag:

```bash
# Add the correct tag
npm dist-tag add @rhngui/patternfly-react-renderer@1.0.0 latest

# Remove the wrong tag
npm dist-tag rm @rhngui/patternfly-react-renderer@1.0.0 next
```

### Need to unpublish

You can only unpublish within 72 hours:

```bash
npm unpublish @rhngui/patternfly-react-renderer@1.0.0
```

**Note**: Avoid unpublishing when possible. If there's a bug, publish a patch version instead.

## Release Checklist

- [ ] All changes merged to `main`
- [ ] `README.md` reviewed and updated with new features
- [ ] All tests passing locally
- [ ] Version number follows SemVer
- [ ] `npm version` command run
- [ ] Tag pushed to GitHub
- [ ] GitHub Actions workflow completed successfully
- [ ] npm package published and available
- [ ] GitHub Release created with auto-generated notes
- [ ] Documentation site updated (if needed)

**Note**: This project does not currently maintain a `CHANGELOG.md` file. Release notes are automatically generated from commit messages by GitHub Actions.

## Questions?

If you have questions about the release process, check:

- [npm documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- Open an issue in this repository
