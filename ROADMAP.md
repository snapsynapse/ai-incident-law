# Roadmap

## Current state

The repository currently serves a static, portable index backed by a canonical JSON dataset and a generated browser bundle.

Current dataset buckets:

- `included`: records ready for public presentation in the main index
- `review`: candidates that need verification, source hardening, or scope decisions
- `global`: non-US or cross-jurisdiction candidates that need additional translation, sourcing, or normalization

## Near-term priorities

### 1. Tighten dataset inclusion discipline

- Define sharper admission criteria for what counts as an AI-mediated legal error event
- Distinguish clearly between direct legal proceedings, regulatory actions, and reliable review-queue candidates
- Document exclusion rules for adjacent but out-of-scope algorithmic controversy

### 2. Improve source rigor

- Prefer primary public records where they exist
- Add archived or stable source locations where practical
- Reduce dependency on secondary reporting for records that can be upgraded to primary-source status

### 3. Stabilize schema expectations

- Keep `included` records normalized for consistent rendering
- Preserve candidate-only fields for `review` and `global` without forcing premature normalization
- Document which fields are required for publication versus queue management

### 4. Improve publication quality

- Add clearer dataset notes on methodology and scope boundaries
- Add a visible “last updated” indicator in the UI from `generated_at`
- Consider a record detail view if the current card layout becomes too compressed

## Medium-term improvements

- Add archive or snapshot references for fragile sources
- Add a changelog or release cadence for major dataset updates
- Add issue templates for data corrections and source challenges
- Consider whether `data.js` should remain committed long term or become a deploy artifact

## Not a priority right now

- Framework migration
- Complex build tooling
- Database backend
- Client-side persistence
- Search infrastructure beyond the current local bundle

## Decision rules

- Favor portability over stack complexity
- Favor source quality over record count
- Favor explicit scope boundaries over broad inclusion
- Favor reproducibility over convenience

