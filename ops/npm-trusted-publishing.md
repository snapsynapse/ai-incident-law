# npm trusted publishing boundary

The manual `publish-npm-reviewed.yml` workflow requires the GitHub Environment
`npm-publish`. Its `if: main` expression is an additional check, not an access
control boundary: a workflow on another branch can edit that expression.

Before adding npm trust, create `npm-publish` in this public repository's GitHub
Settings → Environments. Select deployment branches and allow only the literal
`main` branch. Add a required reviewer if available. Verify the environment's
branch policy and reviewer setting through GitHub before configuring npm. A
workflow reference to a missing environment can create it without protection.

In the npm package's Trusted Publisher settings, select GitHub Actions and set:

- Organization or user: `snapsynapse`
- Repository: `ai-incident-law`
- Workflow filename: `publish-npm-reviewed.yml`
- Environment name: `npm-publish`
- Allowed action: direct `npm publish`

The environment name must match exactly. GitHub holds jobs at the environment
protection gate before they run or receive OIDC credentials. The job's OIDC
identity includes its environment; npm must require that same environment.
If a branch removes the environment from its workflow, its identity no longer
matches this npm trust connection. Keep the GitHub branch policy in force for
the life of the connection.

The first successful publish must occur within two days after creating npm
trust, or the connection expires. npm-side setup requires the maintainer's
interactive authentication. Do not configure trust or dispatch the workflow
until the GitHub environment rules are verified and release approval is in hand.

References: [GitHub environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments),
[GitHub OIDC claims](https://docs.github.com/en/actions/reference/security/oidc),
and [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
