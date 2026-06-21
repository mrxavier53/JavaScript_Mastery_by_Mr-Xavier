# JavaScript Mastery by Xavier

A responsive, GitHub Pages-ready JavaScript learning platform with **53 course chapters**, interactive quizzes, coding tasks, project milestones, notes, XP, badges, and progress tracking.

> **Release note:** This version adds browser-based **Read Aloud** for every lesson. It does not include music, click sounds, or visual effects; those remain planned for a later update.

## Features

- 53 structured JavaScript chapters across five modules
- Responsive layout for phones, tablets, PCs, and Smart TV browsers
- Lesson reader with chapter navigation and copyable code examples
- Read Aloud controls: device voice picker, speed selection, skip-code option, pause, resume, and stop
- Installable web app support for supported Chrome/Edge browsers after the site is published
- Chapter quizzes with saved best scores
- 212 practice tasks: Easy, Medium, Hard, and Bonus
- Six project milestones
- XP levels and twelve unlockable badges
- Personal notes saved per chapter
- Dark/light theme toggle
- Browser-based progress saving with `localStorage`
- No account, database, or backend required

## Course roadmap

1. **Start JavaScript** — Chapters 1–14
2. **Logic & Decisions** — Chapters 15–25
3. **Functions & Reusable Code** — Chapters 26–34
4. **Arrays & Objects** — Chapters 35–45
5. **Build for the Web** — Chapters 46–53

## Run locally

Download or clone this repository, then open `index.html` in a browser.

For the best local test experience, use VS Code with the **Live Server** extension.

## Read aloud

Open any chapter and use **Read lesson**. The website uses the voice(s) available on each user’s device or browser. Users can choose a voice and speed, pause, resume, stop, and skip code examples.

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `javascript-mastery-by-xavier`.
2. Upload every file in this project to the repository root.
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. GitHub will show your public website address after deployment.

For a detailed mobile-friendly upload walkthrough, open [GITHUB-PAGES-GUIDE.md](GITHUB-PAGES-GUIDE.md).

## Important storage note

Progress, tasks, quiz scores, notes, badge status, and theme settings are stored with browser `localStorage`. This means each browser/device has separate saved progress. Clearing browser website data will remove it.

## Future update ideas

- Optional button/correct-answer/badge sounds
- Optional visual effects and confetti
- A code playground with runnable JavaScript
- Search across lesson text
- Cloud accounts and sync (would require a backend)
- Completion certificate

## Credits

Created for **JavaScript Mastery by Xavier**.

## License

This project uses the MIT License. See [LICENSE](LICENSE).
