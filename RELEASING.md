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

Releases are **tag-only**: you create a version tag from current `main` and push the tag. The workflow uses the tag as the version (no version-bump commit or release PR needed). Branch protection on `main` does not block pushing tags.

### 1. Prepare

Ensure everything you want in the release is merged to `main`, then verify locally:

```bash
# Use upstream if you use a fork; origin if you have direct access
git fetch upstream   # or: git fetch origin
git checkout main
git pull upstream main   # or: git pull origin main
```

- Review that `README.md` and docs are up to date.
- Run the full check:

```bash
npm run verify
```

### 2. Create and Push the Version Tag

Create a tag on the current `main` and push it. The tag name is the release version (e.g. `v1.2.0`). You are **not** pushing `main`, only the tag.

**Option A — From your machine:**

```bash
# Tag the current main (replace v1.2.0 with your version)
git tag v1.2.0
git push upstream v1.2.0   # or: git push origin v1.2.0
```

**Option B — From GitHub:**

1. Go to **Releases** → **Create a new release**.
2. Under “Choose a tag”, type the new version (e.g. `v1.2.0`) and select **Create new tag on publish**.
3. Choose the `main` branch as the target.
4. Publish the release. Creating/publishing the release pushes the tag and triggers the workflow.

Use [Semantic Versioning](https://semver.org/): `v1.0.0` (patch), `v1.1.0` (minor), `v2.0.0` (major). Pre-releases: `v1.0.0-alpha.0`, `v1.0.0-beta.0`, `v1.0.0-rc.0`.

**Note:** The repo keeps a placeholder version in `package.json` (`0.0.0-development`). The real version is the git tag; the release workflow sets the published version from the tag. This is the same pattern used by many tag-driven projects (e.g. semantic-release): no version-bump commits or sync PRs.

### 3. Automated Build & Publish

Once the tag is pushed, GitHub Actions will automatically:

1. ✅ Run type checking
2. ✅ Run linting
3. ✅ Run all tests
4. ✅ Build the package
5. ✅ Publish to npm with the appropriate tag:
   - `alpha`, `beta`, or `rc` versions → `npm install @rhngui/patternfly-react-renderer@next`
   - Stable versions → `npm install @rhngui/patternfly-react-renderer@latest`
6. ✅ Create a GitHub Release with auto-generated release notes

### 4. Verify the Release

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

### Push to main rejected (GH013)

If you see that error when pushing a branch, you're trying to push to `main` directly. For releases you don't need to push `main`—only push the version tag (e.g. `git push upstream v1.2.0`). Tags are not blocked by branch protection.

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
- [ ] `npm run verify` passing locally
- [ ] Version tag created from `main` (e.g. `v1.2.0`) and pushed
- [ ] GitHub Actions release workflow completed successfully
- [ ] npm package published and available
- [ ] GitHub Release created with auto-generated notes
- [ ] Documentation site updated (if needed)

**Note**: This project does not currently maintain a `CHANGELOG.md` file. Release notes are automatically generated from commit messages by GitHub Actions.

## Questions?

If you have questions about the release process, check:

- [npm documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- Open an issue in this repository
