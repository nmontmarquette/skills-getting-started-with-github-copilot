document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Handle unregister functionality
  async function unregisterStudent(activity, email) {
    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        fetchActivities(); // Refresh activities list
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to unregister. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error unregistering:", error);
    }
  }

  // Add unregister button to each participant
  function addUnregisterButtons(activityCard, activityName, participants) {
    const participantList = activityCard.querySelector("ul");
    participants.forEach((participant) => {
      const listItem = participantList.querySelector(`li:contains(${participant})`);
      if (listItem) {
        const unregisterButton = document.createElement("button");
        unregisterButton.textContent = "Unregister";
        unregisterButton.className = "unregister-button";
        unregisterButton.addEventListener("click", () => {
          unregisterStudent(activityName, participant);
        });
        listItem.appendChild(unregisterButton);
      }
    });
  }

  // Modify fetchActivities to include unregister buttons
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4 class="activity-title">${name}</h4>
          <div class="activity-details">
            <p>${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
            <p><strong>Participants:</strong></p>
            <ul>
              ${details.participants
                .map(
                  (participant) =>
                    `<li class="participant">${participant}</li>`
                )
                .join("")}
            </ul>
          </div>
        `;

        // Add unregister buttons
        addUnregisterButtons(activityCard, name, details.participants);

        // Add toggle functionality for collapsing/expanding details
        const title = activityCard.querySelector(".activity-title");
        const detailsDiv = activityCard.querySelector(".activity-details");
        detailsDiv.style.display = "none"; // Initially collapsed

        title.addEventListener("click", () => {
          detailsDiv.style.display =
            detailsDiv.style.display === "none" ? "block" : "none";
        });

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Add dark mode toggle
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll("header, section, .activity-card, button, footer").forEach((el) => {
      el.classList.toggle("dark-mode");
    });
  };

  // Create and add dark mode toggle button
  const darkModeButton = document.createElement("button");
  darkModeButton.textContent = "Toggle Dark Mode";
  darkModeButton.style.position = "fixed";
  darkModeButton.style.top = "10px";
  darkModeButton.style.right = "10px";
  darkModeButton.addEventListener("click", toggleDarkMode);
  document.body.appendChild(darkModeButton);

  // Initialize app
  fetchActivities();
});
