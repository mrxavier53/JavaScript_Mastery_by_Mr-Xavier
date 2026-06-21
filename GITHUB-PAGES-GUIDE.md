# GitHub Pages Guide — JavaScript Mastery by Xavier

This project is ready for **GitHub Pages**. You do not need Node.js, a server, or paid hosting.

## Before uploading

1. Extract the ZIP file first.
2. Open the extracted `javascript-mastery-by-xavier-read-aloud` folder.
3. Make sure `index.html`, `learn.html`, `css`, `js`, `manifest.webmanifest`, and `service-worker.js` are visible directly inside that folder.
4. Do **not** upload the ZIP file itself to the repository. Upload the files inside the extracted folder.

## Create the repository

1. Log in to GitHub.
2. Press the `+` button and choose **New repository**.
3. Set the repository name to `javascript-mastery-by-xavier`.
4. Select **Public**.
5. Do not add a README, `.gitignore`, or license during repository creation because this project already includes them.
6. Press **Create repository**.

## Upload the website from a phone or computer

1. In the new repository, press **Add file** → **Upload files**.
2. Select **all files and folders inside** the extracted project folder.
3. Check that `index.html` is at the repository root — not hidden inside a second folder.
4. Scroll down and press **Commit changes**.

## Turn on GitHub Pages

1. Open your repository.
2. Open **Settings**. On a narrow phone screen, it may be inside the repository’s overflow/menu area.
3. On the left, select **Pages**.
4. In **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose branch **main**.
6. Choose folder **/(root)**.
7. Press **Save**.
8. Wait for the deployment status to finish, then refresh the Pages section.

Your published address will normally follow this pattern:

```text
https://YOUR-GITHUB-USERNAME.github.io/javascript-mastery-by-xavier/
```

## Test the live site

1. Open the public Pages link.
2. Open **Learn** and select any chapter.
3. Press **Read lesson**. Chrome may use the device’s system voice automatically.
4. For installable-app support, open the published website in Chrome. Chrome may show **Install app** in its menu or address bar, depending on the device.
5. Try the site on one phone and one computer. Each device keeps its own progress, notes, and XP because the site uses browser local storage.

## Updating the book later

When you edit a file on GitHub and press **Commit changes**, GitHub Pages republishes the updated site from the `main` branch. Do not create a new Pages site every time.

## Important troubleshooting

- **The website is blank or 404:** confirm `index.html` is directly in the repository root and that Pages is set to `main` + `/(root)`.
- **The link is not visible yet:** return to **Settings → Pages** after a few minutes and refresh.
- **Read aloud does not start:** press the Read button manually, make sure device media volume is on, and try a different available voice.
- **A lesson update does not appear immediately:** reload the page. Since this site is installable, browser cache may briefly keep an older version after an update.
- **Progress disappeared:** the browser’s website data was cleared, or the user opened the course on a different browser/device.
