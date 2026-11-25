# Release checklist

Use this checklist for every tagged package or public-site release. A release
candidate is not ready until every required gate passes on the exact candidate
commit.

## Required local gates

- [ ] `npm ci` completed from `package-lock.json` in a clean checkout.
- [ ] `npm run verify:ci` passed without generated-output drift.
- [ ] `npm pack --dry-run` contains the root and well-known assistant guide and
  manifest pairs.
- [ ] `git diff --check` passed.

## Required GitHub gates

- [ ] The `Validate` workflow passed on the exact candidate commit.
- [ ] The `Accessibility Regression Gate` workflow passed on the exact candidate
  commit with no axe violations on the four public HTML routes.
- [ ] Required branch/ruleset policy, once approved and applied, passed.

## Publication approval

- [ ] Release authority was explicitly approved for this candidate.
- [ ] Package publication, GitHub release/tag, Pages source changes, and search
  console mutations were approved separately when applicable.
- [ ] If the Pages source changes, follow `ops/pages-migration.md` and verify all
  old public URLs before removing any root fallback.

## Post-publication verification

- [ ] Compare source, packed artifact, deployed site, and machine-readable
  discovery surfaces.
- [ ] Verify the assistant guide manifest hash and byte count against the
  deployed guide.
- [ ] Confirm canonical bare-domain redirects and the sitemap remain healthy.
- [ ] Record dated GSC or Bing evidence without repeating already accepted
  submissions.
