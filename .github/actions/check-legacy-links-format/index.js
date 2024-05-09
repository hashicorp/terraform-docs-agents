const fs = require("fs");
const { URL } = require("url");
const core = require("@actions/core");
const remark = require("remark");
const visit = require("unist-util-visit");

const TEST_URL_ORIGIN = "https://test.com";
const LEARN_HOSTNAME = "learn.hashicorp.com";
const DEV_DOT_HOSTNAME = "developer.hashicorp.com";

const PRODUCT_SLUGS_TO_HOST_NAMES = {
  boundary: "boundaryproject.io",
  consul: "consul.io",
  hcp: "cloud.hashicorp.com",
  nomad: "nomadproject.io",
  packer: "packer.io",
  terraform: "terraform.io",
  vagrant: "vagrantup.com",
  vault: "vaultproject.io",
  waypoint: "waypointproject.io",
};

const PRODUCT_SLUGS_TO_BASE_PATHS = {
  boundary: ["docs", "api-docs", "downloads"],
  consul: ["docs", "api-docs", "commands", "downloads"],
  hcp: ["docs", "api-docs"],
  nomad: ["docs", "api-docs", "plugins", "tools", "intro", "downloads"],
  packer: ["docs", "guides", "intro", "plugins", "downloads"],
  terraform: [
    "cdktf",
    "cli",
    "cloud-docs",
    "cloud-docs/agents",
    "docs",
    "enterprise",
    "internals",
    "intro",
    "language",
    "plugin",
    "plugin/framework",
    "plugin/log",
    "plugin/mux",
    "plugin/sdkv2",
    "registry",
    "downloads",
  ],
  vagrant: ["docs", "intro", "vagrant-cloud", "vmware", "downloads"],
  vault: ["docs", "api-docs", "intro", "downloads", "downloads"],
  waypoint: ["commands", "docs", "plugins", "downloads"],
};

const linkFormatCheckerPlugin = () => {
  return async function transformer(tree, file) {
    return visit(tree, ["link", "definition"], (node) => {
      const thisLinksErrors = [];
      const urlObject = new URL(node.url, TEST_URL_ORIGIN);
      const { hostname, pathname, search = "", hash = "" } = urlObject;
      const isRelativePath = hostname === TEST_URL_ORIGIN

      // Set up `linksToErrors` map
      const data = file.data;
      if (!data.linksToErrors) {
        data.linksToErrors = {};
      }

      // Check for .io hostname
      const dotIoLinkProductSlug = Object.keys(
        PRODUCT_SLUGS_TO_HOST_NAMES
      ).find((productSlug) => {
        return (
          hostname === PRODUCT_SLUGS_TO_HOST_NAMES[productSlug] ||
          hostname === `www.${PRODUCT_SLUGS_TO_HOST_NAMES[productSlug]}`
        );
      });
      if (dotIoLinkProductSlug) {
        const devDotBasePaths =
          PRODUCT_SLUGS_TO_BASE_PATHS[dotIoLinkProductSlug];
        const isDevDotBasePath =
          pathname === "/" ||
          devDotBasePaths.some((devDotBasePath) => {
            return pathname.startsWith(`/${devDotBasePath}`);
          });
        if (isDevDotBasePath) {
          thisLinksErrors.push(
            `Old .io link: \`${
              node.url
            }\`. Try replacing it with: \`${`/${dotIoLinkProductSlug}${
              pathname === "/" ? "" : pathname
            }`}\`.`
          );
        }
      }

      // Check for learn hostname
      if (hostname === LEARN_HOSTNAME) {
        thisLinksErrors.push(
          `Old \`learn.hashicorp.com\` domain link: \`${node.url}\`. Replace it with a relative path internal to Dev Dot.`
        );
      }

      // Check for developer hostname
      if (hostname === DEV_DOT_HOSTNAME) {
        thisLinksErrors.push(
          `Full \`developer.hashicorp.com\` domain link: \`${node.url}\`. Replace with a relative path internal to Dev Dot. Possibly: \`${pathname}${search}${hash}\`.`
        );
      }

      // Check if old search link (starts with "/search")
      if (pathname.startsWith("/search") && (hostname === LEARN_HOSTNAME || isRelativePath)) {
        thisLinksErrors.push(
          `Old search page link: \`${node.url}\`. Replace it with \`/tutorials/library${search}${hash}\`.`
        );
      }

      // Check if one of old collection links
      if (
        pathname.startsWith("/collections/well-architected-framework") ||
        pathname.startsWith("/collections/onboarding")
      ) {
        thisLinksErrors.push(
          `Old waf/onboarding collection page link: \`${node.url}\`. WAF/onboarding collection links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}\``
        );
      } else if (pathname.startsWith("/collections")) {
        thisLinksErrors.push(
          `Old collection page link: \`${node.url}\`. Collections links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}\`.`
        );
      }

      // Check if one of old tutorial links
      if (
        pathname.startsWith("/tutorials/well-architected-framework") ||
        pathname.startsWith("/tutorials/onboarding")
      ) {
        thisLinksErrors.push(
          `Old waf/onboarding tutorials page link: \`${node.url}\`. WAF/onboarding tutorial links should be formatted like: \`/{well-architected-framework|onboarding}/{collectionSlug}/{tutorialSlug}\``
        );
      } else if (pathname.startsWith("/tutorials")) {
        thisLinksErrors.push(
          `Old tutorial page link: \`${node.url}\`. Tutorials links should be formatted like: \`/{productSlug}/tutorials/{collectionSlug}/{tutorialSlug}\`.`
        );
      }

      // If a link has error(s), put them in the `linksToErrors` map
      // A single link can have multiple errors
      if (thisLinksErrors.length > 0) {
        data.linksToErrors[node.url] = thisLinksErrors;
      }
    });
  };
};

const checkForLegacyLinkFormatErrors = async (filePaths) => {
  const errors = {};

  console.log(`\nChecking "filePaths": ${JSON.stringify(filePaths, null, 2)}\n`)
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i];
    if (fs.existsSync(filePath)) {
      console.log(`checking "${filePath}" for errors`)
      const rawMarkdownContent = String(fs.readFileSync(filePath, "utf-8"));
      const {
        data: { linksToErrors = {} },
      } = await remark().use(linkFormatCheckerPlugin).process(rawMarkdownContent);

      if (Object.keys(linksToErrors).length > 0) {
        errors[filePath] = linksToErrors;
      }
    } else {
      console.log(`skipping "${filePath}"; file does not exist`)
    }
  }

  return errors;
};

const main = async () => {
  try {
    const filePaths = process.env.FILE_PATHS?.split(/\s/).filter(filePath => {
      return filePath.startsWith('content/tutorials') && filePath.endsWith('.mdx')
    }) ?? [];
    const allErrors = await checkForLegacyLinkFormatErrors(filePaths);
    const filesWithErrors = Object.keys(allErrors);

    let commentBody = "";
    if (process.env.COMMENT_BODY_PREFIX) {
      commentBody += `${process.env.COMMENT_BODY_PREFIX}\n\n`;
    }

    if (filesWithErrors.length > 0) {
      core.setOutput("check-legacy-links-format-found-errors", true);
      commentBody += `Found legacy link format errors in ${filesWithErrors.length} file(s) :red_circle:\n\n`;

      filesWithErrors.forEach((filePath) => {
        const fileErrors = allErrors[filePath];
        const linksWithErrors = Object.keys(fileErrors);
        commentBody += `- ${linksWithErrors.length} link(s) with error(s) in \`${filePath}\`\n`;

        linksWithErrors.forEach((link) => {
          const linkErrors = fileErrors[link];
          commentBody += `  - ${linkErrors.length} error(s) for \`${link}\`\n`;

          linkErrors.forEach((linkError) => {
            commentBody += `    - ${linkError}\n`;
          });
        });
      });
    } else {
      core.setOutput("check-legacy-links-format-found-errors", false);
      commentBody += "No legacy link format errors found! :white_check_mark:";
    }

    core.setOutput("comment-body", commentBody);
  } catch (e) {
    core.setFailed(`Error in executing \`check-legacy-links-format\`: ${e}`);
  }
};

main();
