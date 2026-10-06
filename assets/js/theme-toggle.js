(() => {
  const STORAGE_KEY = "theme";

  const systemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const storedTheme = () => {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  };

  const syncToggle = (theme) => {
    const input = document.querySelector("[data-theme-toggle]");
    if (!input) return;

    input.checked = theme === "dark";
    input.setAttribute(
      "aria-label",
      theme === "dark" ? "Увімкнути світлу тему" : "Увімкнути темну тему"
    );
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    syncToggle(theme);
  };

  applyTheme(storedTheme() || systemTheme());

  document.querySelector("[data-theme-toggle]")?.addEventListener("change", (event) => {
    const next = event.target.checked ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!storedTheme()) applyTheme(systemTheme());
  });
})();
