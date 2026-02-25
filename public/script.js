const form = document.getElementById("shortenForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("url").value;
  const alias = document.getElementById("alias").value;

  try {
    const res = await fetch("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, alias })
    });

    const data = await res.json();

    if (res.status === 201) {
      resultDiv.classList.remove("hidden");
      resultDiv.innerHTML = `
        <p><strong>Short Link:</strong></p>
        <a href="javascript:void(0)" onclick="visitLink('${alias}'); return false;">${data.shortUrl}</a>


        <div class="actions">
          <button onclick="deleteLink('${alias}')">Delete</button>
          <button onclick="restoreLink('${alias}')">Restore</button>
        </div>
      `;
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError("Failed to create short link: " + error.message);
  }
});

async function deleteLink(alias) {
  try {
    const res = await fetch(`/${alias}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showError(data.message);
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError("Failed to delete link: " + error.message);
  }
}

async function restoreLink(alias) {
  try {
    const res = await fetch(`/${alias}/restore`, { method: "PATCH" });
    const data = await res.json();
    if (res.ok) {
      showError(data.message);
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError("Failed to restore link: " + error.message);
  }
}

async function visitLink(alias) {
  try {
    const res = await fetch(`/${alias}`, {
      headers: { "Accept": "application/json" }
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error);
      return false;
    }

    if (data.milestone) {
      showMilestone(data.milestone);
    }

    window.open(data.originalUrl, "_blank");
  } catch (error) {
    showError("Failed to visit link: " + error.message);
  }
  return false;
}

function showMilestone(message) {
  const milestoneDiv = document.createElement("div");
  milestoneDiv.className = "milestone";
  milestoneDiv.innerText = message;

  document.body.appendChild(milestoneDiv);

  setTimeout(() => {
    milestoneDiv.remove();
  }, 4000);
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.innerText = message;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 4000);
}
