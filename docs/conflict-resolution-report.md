# Conflict Resolution Report

## 1) Conflict Scenario

The conflict occurred in README.md between feature/user-authentication and feature/api-endpoints. Both branches modified the same line near the top of the file — the "starter template for practicing:" description. The auth branch changed it to "...for practicing (extended on the user-authentication branch):" and the api branch changed it to "...for practicing (extended on the api-endpoints branch):". I squash-merged the database PR (#4) and the auth PR (#5) first; both were clean. When I then tried to merge the api PR (#6), GitHub reported "This branch has conflicts that must be resolved" because the api branch was still based on the original wording of that line, which main no longer had.

## 2) What You Saw

I switched to main, pulled in the db and auth squash commits, switched back to feature/api-endpoints, fetched origin, and ran git rebase origin/main. Git paused with a CONFLICT (content) message for README.md and failed to apply the "docs(readme): note the api-endpoints branch additions" commit. Opening the file revealed standard Git conflict markers around the description line:

<<<<<<< HEAD
This repository is a **starter template** for practicing (extended on the user-authentication branch):
=======
This repository is a **starter template** for practicing (extended on the api-endpoints branch):
>>>>>>> docs(readme): note the api-endpoints branch additions

The HEAD section showed the wording from auth, already on main; the lower section showed the wording from my api branch. See screenshot-6-conflict-markers.png.

## 3) Resolution Strategy

I chose to combine both notes into a single line rather than discard either one — both branches contributed real changes worth mentioning. I deleted the three marker lines and merged the two sentences into: "This repository is a **starter template** for practicing (extended on the user-authentication and api-endpoints branches):". See screenshot-7-resolved.png for the cleaned file.

To verify, I ran grep for any remaining marker characters across the repo, which returned clean, then ran npm test, npm run lint, and npm run format:check — all three passed. I finished the rebase with git add README.md and git rebase --continue, then pushed with git push --force-with-lease since a rebase rewrites branch history. The api PR's red "conflicts must be resolved" banner disappeared in the GitHub UI, and I squash-merged it as PR #6. The conflict-resolution commit message that landed on main was: chore(merge): resolve README conflict between auth and api branches.

## 4) Prevention Methods

Smaller, more focused PRs reduce the surface area for conflicts — the README change in this case was a single line in a docs commit, but it still collided because two branches both touched it. Communicating with collaborators before editing shared files like README.md, package.json, or core route files prevents two branches from racing for the same lines. Rebasing or merging from main frequently — ideally at the start of every work session — catches drift early while it is still small and trivial to resolve. Finally, structuring work so that each branch edits separate files or separate sections of the same file, or using a feature-flag pattern when truly shared code must change, eliminates many conflicts entirely.
