const API_KEY = "e28fbe3eeb9a46eab1deceb1eefddcd9";
const url = "https://newsapi.org/v2/everything?q=";

const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news-card");
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

let curSelectedNav = null;

// Load India news on first load
window.addEventListener("load", () => fetchNews("India"));

// Reload button handler
function reload() {
    window.location.reload();
}

// Fetch news from API
async function fetchNews(query) {
    showLoader();
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        if (data.articles.length === 0) {
            showMessage("No news found for this topic.");
        } else {
            bindData(data.articles);
        }
    } catch (error) {
        showMessage("Something went wrong. Please try again later.");
        console.error("Error fetching news:", error);
    }
}

// Bind articles to UI
function bindData(articles) {
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill each card with article data
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerText = article.title;
    newsDesc.innerText = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerText = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Handle nav item clicks (categories)
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Handle search
searchButton.addEventListener("click", handleSearch);
searchText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});

function handleSearch() {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews(query);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
}

// Show loading message
function showLoader() {
    cardsContainer.innerHTML = `<p style="padding: 20px; font-size: 18px;">Loading...</p>`;
}

// Show custom message 
function showMessage(message) {
    cardsContainer.innerHTML = `<p style="padding: 20px; font-size: 18px;">${message}</p>`;
}

const toggleBtn = document.getElementById("themeToggle");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });