import * as github from "@actions/github";
import * as core from "@actions/core";

try {
  const pattern = core.getInput("pattern");
  const source = github.context.payload.pull_request?.body || "";
  core.setOutput("pr_body", source);

  const results = source.match(pattern) || [];
  const match = results[1];
  if (match) {
    core.setOutput("value", match);
  }
} catch (error) {
  core.setFailed(error instanceof Error ? error.message : String(error));
}
