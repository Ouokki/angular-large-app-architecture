# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report them by emailing **ouokkimohamed7@gmail.com** with the subject line:

```
[SECURITY] <brief description>
```

Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce or proof-of-concept code
- Any suggested mitigations you are aware of

You will receive an acknowledgement within **48 hours** and a status update within **7 days**.

## Disclosure Policy

Once a fix is available we will:

1. Publish a patched release
2. Credit the reporter in the release notes (unless you prefer to remain anonymous)
3. Open a public issue linking to the fix

## Scope

This is a **reference / starter** project. It contains:

- No real authentication backend (mock session only)
- No production database or persistent user data
- No secrets in the repository

The primary security concern is keeping third-party dependencies up-to-date. Dependabot is configured to open PRs automatically for npm and GitHub Actions updates.
