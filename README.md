# Aayush’s Orbit Journal

This folder is a ready-to-publish GitHub Pages site. The homepage is `index.html`. All site files, images and fonts are included.

## Publish on GitHub Pages

1. Extract the ZIP. In the GitHub repository you want to use, upload the extracted files and folders to the top level of the publishing branch (usually `main`). Make sure `index.html` is visible at the top level. Commit the files.
2. Open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, choose **main** (or your publishing branch) and **/(root)**. Click **Save**.
3. When the deployment finishes, open **Visit site**. A project repository normally appears at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

The finished site runs directly from the files. The `source/` folder contains the editable React components and an optional build script.

[GitHub’s publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Connect a domain you own

A subdomain such as `astro.example.com` gives the journal its own address alongside an existing website.

1. In the journal repository, open **Settings → Pages → Custom domain**. Enter `astro.example.com` using your own domain and click **Save**.
2. In the DNS settings where your domain’s records are managed, add a **CNAME** with host/name `astro` and target/value `YOUR-USERNAME.github.io`. The value contains only the GitHub hostname. Some providers expect the full subdomain in the name field.
3. Return to GitHub Pages settings. After the DNS check passes and the certificate is ready, select **Enforce HTTPS**. Open `https://astro.example.com`. The custom address stays in the browser.

For a main domain such as `example.com`, save that name in **Custom domain** first. In DNS, use an apex `ALIAS` or `ANAME` pointing to `YOUR-USERNAME.github.io` if your provider supports it. Alternatively, set these four `A` records at the root (often named `@`).

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Changing the root destination sends visits to your main website to the journal. Using `astro` affects that subdomain. DNS changes may take up to 24 hours. GitHub provides the current DNS values, optional IPv6 records, domain verification, and HTTPS instructions.

[GitHub’s custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [HTTPS on GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## Where the journal is saved

GitHub serves the application. Each browser keeps its own entries and pictures in IndexedDB. Visitors see their own journal. The included NASA and ESA discovery cards, starter question, learning concepts, and suggested plans are available to everyone running this edition. Your personal entries are created on the device as you use it.

Open **Journal backup → Download backup** to save a copy of your entries and pictures. To move to a new browser or from the GitHub address to a custom domain, download the backup at the old address, open the new address, and use **Journal backup → Choose a backup to restore**. Confirm the restore after checking the entry and picture counts. Clearing browser data also clears the journal on that browser.

## A first 15-minute session

- **Observe for five minutes.** Open the weekly plan. Use a sky map to pick Jupiter or a bright star that is visible at your location and time. A cloudy-night option is included.
- **Record for five minutes.** Log the target, time, conditions, and something you noticed. Add a photo or use **Draw a sketch**.
- **Explore for five minutes.** Explain a concept, add a question, or discuss one discovery. Click a step in the weekly plan to mark it complete.

An observation streak counts consecutive Monday–Sunday weeks containing at least one **Sky sighting**. There is time until Sunday to extend a streak from the previous week. Cloudy-night entries and sky-map practice stay in the log. The date controls use the Princeton, New Jersey time zone.

Use the arrows in Weekly plan and Discovery desk to revisit older weeks or plan ahead. Each week has room for three discoveries. Source links and publication dates accompany each starter finding. Add more findings in later weeks or choose an existing pick to replace.

## Edit the application (optional)

Run `npm install` in `source/`, edit its components or stylesheet, and run `npm run build` there to refresh `app.js` and `styles.css` in the publishing folder. Keep the image and font folders beside `index.html`.

## Images and sources

- Jupiter is a Cassini composite credited to NASA/JPL/University of Arizona. [NASA original](https://science.nasa.gov/resource/high-resolution-globe-of-jupiter/)
- Vega was photographed by Stephen Rahn and released under CC0. [Original image](https://commons.wikimedia.org/wiki/File:Vega_by_Stephen_Rahn.jpg)
- The planet crossing a star is a representative illustration by ESA, NASA, STScI and M. Kornmesser. The two giant planets are reported separately in the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/overview/KMT-2026-BLG-0083L).
- NGC 4559 imagery comes from NASA/CXC/University of Virginia/M. Aghakhanloo et al. (X-ray), SDSS (optical), and NASA/CXC/SAO/P. Edmonds (processing). [Chandra discovery](https://chandra.harvard.edu/press/26_releases/press_110926.html)
- The lens montage is credited to ESA/Euclid/Euclid Consortium/NASA, with processing by N. Lines and T. Li. The image was resized for display. [Euclid release](https://euclid.caltech.edu/news/euclid-lays-the-foundation-for-its-best-ever-3d-map-of-the-universe)
- The telescope and mountain banner is an original illustration.

