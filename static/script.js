document.getElementById("fetch-data").addEventListener("click", async () => {
    const response = await fetch("/api");
    const data = await response.json();
    document.getElementById("response").textContent = data.message;
});
