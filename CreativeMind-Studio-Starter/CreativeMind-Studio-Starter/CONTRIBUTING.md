# Contributing Guide

## Clone
```bash
git clone <REPOSITORY_URL>
cd CreativeMind-Studio
```

## Branching
Never work directly on `main`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## Commit Style
```text
feat: add strategy war room interface
fix: handle invalid model JSON
docs: update API contract
test: add scorecard edge cases
```

## Push
```bash
git add .
git commit -m "feat: describe your change"
git push -u origin feature/your-feature-name
```

Open a pull request from your feature branch into `develop`.

## PR Checklist
- [ ] Works locally
- [ ] No credentials committed
- [ ] API contract followed
- [ ] Responsive UI checked
- [ ] Documentation updated
- [ ] Screenshots included for UI changes

## Team Rules
- Pull latest `develop` before work
- Communicate blockers early
- Do not overwrite teammate work
- Keep PRs small
- Never commit `.env`
