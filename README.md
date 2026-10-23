# PR Body Workflow Action

A small GitHub Action (Node 24) that reads the description of the pull request that triggered a workflow and optionally extracts a value from it with a regular expression. Use it to pass information written in a PR description (ticket IDs, deploy targets, feature flags, ...) to later workflow steps.

## Usage

```yaml
on:
  pull_request:
    types: [opened, edited]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - id: pr
        uses: brainial/PR-body-workflow-action@v1
        with:
          pattern: 'Ticket:\s*([A-Z]+-\d+)'

      - run: echo "Ticket is ${{ steps.pr.outputs.value }}"
      - run: echo "Full body is ${{ steps.pr.outputs.pr_body }}"
```

## Inputs

| Name      | Required | Description                                                                                  |
| --------- | -------- | -------------------------------------------------------------------------------------------- |
| `pattern` | no       | Regular expression applied to the PR body. The first capture group becomes the `value` output. |

## Outputs

| Name      | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| `pr_body` | The full PR body (empty string if the event has no pull request).                   |
| `value`   | First capture group of `pattern`. Not set when there is no pattern or no match.     |

## How it works

`main.ts` takes `github.context.payload.pull_request.body`, sets it as `pr_body`, then runs `body.match(pattern)` and sets `value` to capture group 1. Errors fail the step. The action only works on events that carry a pull request payload (e.g. `pull_request`, `pull_request_target`).

## Development

```sh
npm ci
npm run typecheck   # tsc --noEmit
npm run build       # vite build -> dist/index.js (committed, used by action.yml)
```

- **CI** (`.github/workflows/ci.yml`): typecheck and build on every push.
- **Release** (`.github/workflows/release.yml`): on push to `main`, semantic-release derives the version from conventional commits (`feat:`, `fix:`, ...), tags it, creates a GitHub release and commits the rebuilt `dist/index.js`.
