(() => {
  "use strict";

  /* ---------- Video: load the YouTube player only on click ---------- */
  document.querySelectorAll("[data-youtube]").forEach((frame) => {
    const button = frame.querySelector("[data-video-play]");
    if (!button) return;
    button.addEventListener("click", () => {
      const id = frame.dataset.youtube;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      iframe.title = button.getAttribute("aria-label") || "Відеоурок";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      frame.replaceChildren(iframe);
      frame.classList.add("is-playing");
      iframe.focus();
    });
  });

  /* ---------- Quiz ---------- */
  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const items = [...quiz.querySelectorAll("[data-quiz-item]")];
    const score = quiz.querySelector("[data-quiz-score]");
    const reset = quiz.querySelector("[data-quiz-reset]");
    quiz.classList.add("is-interactive");

    const update = () => {
      const answered = items.filter((i) => i.dataset.state);
      const right = answered.filter((i) => i.dataset.state === "right").length;
      if (answered.length < items.length) {
        score.textContent = `Відповіли на ${answered.length} з ${items.length}`;
        score.dataset.state = "";
      } else {
        score.textContent = `Результат: ${right} з ${items.length}` +
          (right === items.length ? " — чудово!" : ". Перегляньте пояснення до помилок і спробуйте ще раз.");
        score.dataset.state = right === items.length ? "right" : "done";
      }
    };

    items.forEach((item) => {
      const correct = item.dataset.answer;
      const inputs = [...item.querySelectorAll("input[type=radio]")];
      const verdict = item.querySelector("[data-verdict]");
      const explain = item.querySelector("[data-explain]");

      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          if (item.dataset.state) return;
          const ok = input.value === correct;
          item.dataset.state = ok ? "right" : "wrong";
          inputs.forEach((other) => {
            other.disabled = true;
            const label = other.closest(".quiz__option");
            if (other.value === correct) label.classList.add("is-correct");
            else if (other === input) label.classList.add("is-wrong");
          });
          verdict.textContent = ok ? "Правильно!" : "Не зовсім.";
          explain.open = true;
          update();
        });
      });
    });

    reset.addEventListener("click", () => {
      items.forEach((item) => {
        delete item.dataset.state;
        item.querySelectorAll("input[type=radio]").forEach((input) => {
          input.checked = false;
          input.disabled = false;
          input.closest(".quiz__option").classList.remove("is-correct", "is-wrong");
        });
        item.querySelector("[data-verdict]").textContent = "";
        item.querySelector("[data-explain]").open = false;
      });
      update();
      const first = quiz.querySelector("input[type=radio]");
      if (first) first.focus();
    });

    update();
  });
})();
