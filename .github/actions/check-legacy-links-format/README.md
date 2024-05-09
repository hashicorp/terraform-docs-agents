# Github Action: Check legacy links format

This action checks all links for a space-separated list of MDX file paths to see if the links are in a legacy format.

Legacy link formats include:

- Documentation links to old .io sites (e.g. https://waypointproject.io)
  - At the time of writing, some links to these sites are still valid: /community, /use-cases, etc.
- Links with `learn.hashicorp.com` as the hostname
- Links with `developer.hashicorp.com` as the hostname
- Links to the old `/search` page
- Collection page links starting with `/collections`
- Tutorial page links starting with `/tutorials`

If legacy link formats are detected, this action comments on a PR with a list of errors.

## Inputs & outputs

This action depends on two environment variables:

- `FILE_PATHS` (**string**): a space-separated list of paths to files that will have their links checked.
- `COMMENT_BODY_PREFIX` (**string**): this is needed for the find/update PR comment action to work and not create several comments on a PR.

And it provides two outputs:

- `check-legacy-links-format-found-errors` (**boolean**): whether or not the action found errors. This is used to fail the action in a subsquent step that runs `exit 1`.
- `comment-body` (**string**): the body of the comment to make on the PR.

## The build step

This action is built with [`@vercel/ncc`](https://github.com/vercel/ncc): "(A) Simple CLI for compiling a Node.js module into a single file, together with all its dependencies." This allows the action to run off of a single file, without having to install dependencies during the run.

> **Important Note**: if you make changes to `index.js`, you need to run `npm run build` to generate the proper action output in `dist/index.js` and commit / push those changes.
