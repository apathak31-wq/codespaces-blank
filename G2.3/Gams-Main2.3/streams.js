const streamsList = [
    { section: "anime-section", title: "Anikoto", url: "https://anikototv.to" },
    { section: "anime-section", title: "ReAnime", url: "https://reanime.to" },
    { section: "anime-section", title: "Gotaku", url: "https://gotaku.to" },
    { section: "anime-section", title: "AniPm", url: "https://ani.pm" },
    { section: "anime-section", title: "AniSnatch", url: "https://anisnatch.to" },
    { section: "anime-section", title: "Anime Heaven", url: "https://animeheaven.me" },
    { section: "anime-section", title: "Anime Onsen", url: "https://animeonsen.xyz" },
    { section: "anime-section", title: "Anime X", url: "https://animex.one" },

    { section: "manga-section", title: "Comix.to", url: "https://comix.to" },
    { section: "manga-section", title: "MangaDot", url: "https://mangadot.net" },
    { section: "manga-section", title: "Atsumaru", url: "https://atsu.moe" },
    { section: "manga-section", title: "Chikari", url: "https://chikari.moe" },
    { section: "manga-section", title: "Toonkotsu", url: "https://toonkotsu.com" },

    { section: "video-section", title: "YouTube & Video Player (IN PROGRESS)", url: "./stream-players/video-player.html" },
    { section: "video-section", title: "Invidious", url: "https://inv.nadeko.net/" },

    { section: "movies-section", title: "Kool.WS", url: "https://kool.ws/" },
    { section: "movies-section", title: "AZ Series", url: "https://azseries.org" },
    { section: "movies-section", title: "fprime", url: "https://fprime.at" },
    { section: "movies-section", title: "Aether", url: "https://aether.st" },
    { section: "movies-section", title: "Fly Series", url: "https://flystream.net/" },

    { section: "livetv-section", title: "Live TV Portal 1", url: "" },
    { section: "livetv-section", title: "Live TV Portal 2", url: "" },

    { section: "sports-section", title: "Live Sports Portal 1", url: "" },
    { section: "sports-section", title: "Live Sports Portal 2", url: "" }
];

const streamSections = [
    { id: "anime-section", title: "Anime" },
    { id: "manga-section", title: "Manga & Comics" },
    { id: "video-section", title: "Video" },
    { id: "movies-section", title: "Movies & Series" },
    { id: "livetv-section", title: "Live TV" },
    { id: "sports-section", title: "Live Sports" }
];

const streamsCatalog = document.getElementById("streams-catalog");

const streamViewer = document.createElement("section");
streamViewer.className = "stream-viewer";
streamViewer.setAttribute("role", "dialog");
streamViewer.setAttribute("aria-modal", "true");
streamViewer.setAttribute("aria-labelledby", "stream-viewer-title");
streamViewer.hidden = true;

const viewerHeader = document.createElement("header");
viewerHeader.className = "stream-viewer-header";

const backButton = document.createElement("button");
backButton.className = "stream-viewer-back";
backButton.type = "button";
backButton.textContent = "Back to catalog";
viewerHeader.appendChild(backButton);

const viewerTitle = document.createElement("h1");
viewerTitle.className = "stream-viewer-title";
viewerTitle.id = "stream-viewer-title";
viewerHeader.appendChild(viewerTitle);
streamViewer.appendChild(viewerHeader);

const viewerFrame = document.createElement("iframe");
viewerFrame.className = "stream-viewer-frame";
viewerFrame.title = "Stream portal";
viewerFrame.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
viewerFrame.allowFullscreen = true;
viewerFrame.referrerPolicy = "no-referrer";
streamViewer.appendChild(viewerFrame);

document.body.appendChild(streamViewer);

let activeStreamLink;

function closeStreamViewer() {
    streamViewer.hidden = true;
    viewerFrame.removeAttribute("src");
    activeStreamLink?.focus();
}

backButton.addEventListener("click", closeStreamViewer);

streamSections.forEach((section) => {
    const streams = streamsList.filter((stream) => stream.section === section.id);
    if (streams.length === 0) return;

    const sectionElement = document.createElement("section");
    sectionElement.className = "stream-section";
    sectionElement.id = section.id;

    const heading = document.createElement("h2");
    heading.textContent = section.title;
    sectionElement.appendChild(heading);

    if (streams.some((stream) => !stream.url)) {
        const note = document.createElement("p");
        note.className = "stream-note";
        note.textContent = "Add a portal URL in streams.js to enable these options.";
        sectionElement.appendChild(note);
    }

    const grid = document.createElement("div");
    grid.className = "stream-grid";

    streams.forEach((stream) => {
        const option = stream.url ? document.createElement("a") : document.createElement("div");
        option.className = "stream-link";

        const icon = document.createElement("span");
        icon.className = "stream-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = stream.title.charAt(0).toUpperCase();
        option.appendChild(icon);

        const title = document.createElement("span");
        title.textContent = stream.title;
        option.appendChild(title);

        if (stream.url) {
            if (stream.url.startsWith("./")) {
                option.href = stream.url;
            } else {
                const params = new URLSearchParams({ url: stream.url, title: stream.title });
                option.href = `stream-players/embed.html?${params.toString()}`;
            }
            option.addEventListener("click", (event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

                const destination = new URL(stream.url, window.location.href);
                if (!["http:", "https:"].includes(destination.protocol)) return;

                event.preventDefault();
                activeStreamLink = option;
                viewerTitle.textContent = stream.title;
                viewerFrame.title = `${stream.title} portal`;
                viewerFrame.src = destination.href;
                streamViewer.hidden = false;
                backButton.focus();
            });
        } else {
            option.classList.add("stream-disabled");
            option.setAttribute("aria-disabled", "true");
            option.title = "Portal URL not configured";
        }

        grid.appendChild(option);
    });

    sectionElement.appendChild(grid);
    streamsCatalog.appendChild(sectionElement);
});
