document.addEventListener("DOMContentLoaded", () => {
  const menuLinks = document.querySelectorAll(".menu-link");
  const views = document.querySelectorAll(".dashboard-view");

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.view;

      views.forEach((view) => {
        view.classList.remove("active");
        if (view.id === `view-${target}`) {
          view.classList.add("active");
        }
      });

      menuLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Only run if the dashboard form exists
  const shortenForm = document.getElementById("shorten-form");
  if (shortenForm) {
    const longUrlInput = document.getElementById("longUrl");
    const resultBox = document.getElementById("short-url-result");
    const shortUrlAnchor = document.getElementById("short-url");
    const copyResultButton = document.getElementById("copy-result-button");

    shortenForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const longUrl = longUrlInput.value.trim();
      if (!longUrl) return;

      try {
        const res = await fetch("/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ longUrl }),
        });

        const data = await res.json();
        if (res.ok && data.shortUrl && data.id) {
          shortUrlAnchor.textContent = data.shortUrl;
          shortUrlAnchor.href = data.shortUrl;
          resultBox.classList.remove("hidden");

          shortenForm.reset();

          const noLinksRow = document.getElementById("no-links-row");
          if (noLinksRow) noLinksRow.remove();

          const tableBody = document.getElementById("links-table-body");
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${longUrl}</td>
            <td><a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></td>
            <td>0</td>
            <td><button class="copy-button" data-link="${data.shortUrl}">COPY</button></td>
            <td><button class="delete-button" data-id="${data.id}">DELETE</button></td>
          `;
          tableBody.prepend(newRow);

          attachCopyAndDeleteHandlers();
        } else {
          alert(data.error || "Error shortening URL.");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      }
    });

    copyResultButton.addEventListener("click", () => {
      const url = shortUrlAnchor.href;
      navigator.clipboard.writeText(url).then(() => {
        alert("Copied to clipboard!");
      });
    });

    attachCopyAndDeleteHandlers();
  }
});

function attachCopyAndDeleteHandlers() {
  document.querySelectorAll(".copy-button").forEach((btn) => {
    btn.onclick = () => {
      const link = btn.getAttribute("data-link");
      navigator.clipboard.writeText(link).then(() => {
        alert("Copied to clipboard!");
      });
    };
  });

  document.querySelectorAll(".delete-button").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      if (!id) return;

      const confirmDelete = confirm("Are you sure you want to delete this link?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/links/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          btn.closest("tr").remove();

          const remainingRows = document.querySelectorAll("#links-table-body tr");
          if (remainingRows.length === 0) {
            document.getElementById("links-table-body").innerHTML = `
              <tr id="no-links-row">
                <td colspan="5" class="empty-table">No links found.</td>
              </tr>
            `;
          }
        } else {
          const data = await res.json();
          alert(data.error || "Could not delete link.");
        }
      } catch (e) {
        console.error(e);
        alert("Error deleting link.");
      }
    };
  });
}
