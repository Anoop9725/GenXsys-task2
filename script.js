const input = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const card = document.getElementById("profileCard");

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const username = document.getElementById("username");
const bio = document.getElementById("bio");

const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const reposEl = document.getElementById("repos");

const locationEl = document.getElementById("location");
const companyEl = document.getElementById("company");
const twitterEl = document.getElementById("twitter");
const blogEl = document.getElementById("blog");
const joinedEl = document.getElementById("joined");

const repoList = document.getElementById("repoList");
const profileLink = document.getElementById("profileLink");

// Debounce function
let timer;
function debounce(func, delay) {
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

async function fetchProfile(username) {
    if (!username) return;

    loading.classList.remove("hidden");
    error.classList.add("hidden");
    card.classList.add("hidden");

    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);

        if (!userRes.ok) throw new Error("User not found");

        const user = await userRes.json();

        avatar.src = user.avatar_url;
        nameEl.textContent = user.name || "No name";
        username.textContent = "@" + user.login;
        bio.textContent = user.bio || "No bio available";

        followersEl.textContent = user.followers;
        followingEl.textContent = user.following;
        reposEl.textContent = user.public_repos;

        locationEl.textContent = user.location || "Not provided";
        companyEl.textContent = user.company || "Not provided";
        twitterEl.textContent = user.twitter_username || "Not available";
        blogEl.textContent = user.blog || "Not provided";
        joinedEl.textContent = new Date(user.created_at).toDateString();

        profileLink.href = user.html_url;

        // Fetch repositories
        const repoRes = await fetch(user.repos_url);
        const repos = await repoRes.json();

        repoList.innerHTML = "";
        repos.slice(0, 5).forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(li);
        });

        card.classList.remove("hidden");

    } catch (err) {
        error.textContent = err.message;
        error.classList.remove("hidden");
    }

    loading.classList.add("hidden");
}

input.addEventListener(
    "input",
    debounce(() => {
        fetchProfile(input.value.trim());
    }, 400)
);
