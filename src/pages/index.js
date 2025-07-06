// Module & Asset Imports
import Api from "../utils/Api.js";
import logo from "../images/Logo.svg";
import pencilDark from "../images/pencil.svg";
import plusIcon from "../images/plusicon.svg";
import pencilLight from "../images/light-pencil.svg";
import { setButtonText } from "../utils/helpers.js";

import "./index.css";
import "../blocks/card.css";
import "../blocks/modal.css";

// Form Validation Imports
import {
  enableValidation,
  settings,
  resetValidation,
  disabledButton,
} from "../scripts/validation.js";

// API Instance
const api = new Api("https://around-api.en.tripleten-services.com/v1", {
  authorization: "7661e041-1920-4a50-8a75-db1c025f7ca2",
  "Content-Type": "application/json",
});

// DOM Elements
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostButton = document.querySelector(".profile__add-button");
const modalNewPost = document.querySelector("#new-post-modal");
const newPostCloseButton = modalNewPost.querySelector(".modal__close-button");
const newPostForm = modalNewPost.querySelector(".modal__form");
const newPostImageInput = newPostForm.querySelector("#card-image-input");
const newPostCaptionInput = newPostForm.querySelector("#post-caption-input");

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarCloseButton = editAvatarModal.querySelector(
  ".modal__close-button"
);
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarUrlInput = editAvatarForm.querySelector("#avatar-url-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__cancel-button"
);
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewTitleEl = previewModal.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// State Variables
let selectedCard = null;
let selectedCardId = null;
let currentUserId = null;

// Modal Functions
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// API Call Handlers
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = editProfileForm.querySelector(".modal__submit-button");

  //submitButton.textContent = "Saving...";
  setButtonText(submitButton, true); // Change button text to "Saving..." and disable it

  //change text content to saving...
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      //TODO - use data argument insteaaf of the input values
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false); // Change button text back to original and enable it
    });
}
//TODO - implement loading text for all other forms submissions

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const submitButton = newPostForm.querySelector(".modal__submit-button");

  setButtonText(submitButton, true);
  console.log("Sending data:", {
    name: newPostCaptionInput.value,
    link: newPostImageInput.value,
  });

  api
    .addNewCard({
      name: newPostCaptionInput.value,
      link: newPostImageInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      newPostForm.reset();

      disabledButton(submitButton, settings);
      closeModal(modalNewPost);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false); // Change button text back to original and enable it
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = editAvatarForm.querySelector(".modal__submit-button");
  setButtonText(submitButton, true);

  api
    .editAvatarInfo({ avatar: editAvatarUrlInput.value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      editAvatarForm.reset();

      disabledButton(submitButton, settings);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false); // Change button text back to original and enable it
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = deleteForm.querySelector(".modal__submit-button");
  setButtonText(submitButton, true, "Delete", "Deleting...");
  if (!selectedCardId || !selectedCard) return;
  api
    .removedCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Delete");
    });
}

// Card Generator
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Set initial like button state
  if (data.isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  // Preview
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewTitleEl.textContent = data.name;
    openModal(previewModal);
  });

  // Like
  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");

    api
      .changeAddLikeStatus(data._id, isLiked)
      .then((updatedData) => {
        data.likes = updatedData.likes;
        data.isLiked = updatedData.isLiked;
        likeButton.classList.toggle(
          "card__like-button_active",
          updatedData.isLiked
        );
      })
      .catch(console.error);
  });

  // Delete
  deleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  return cardElement;
}

// Initial API Call
api
  .getAppInfo()
  .then(([cards, user]) => {
    api.userId = user._id;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    document.querySelector(".profile__avatar").src = user.avatar;
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
  })
  .catch(console.error);

// Edit Profile
editProfileButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  const inputs = Array.from(
    editProfileForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(editProfileForm, inputs, settings);
  openModal(editProfileModal);
});
editProfileCloseButton.addEventListener("click", () =>
  closeModal(editProfileModal)
);
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// New Post
newPostButton.addEventListener("click", () => {
  const inputs = Array.from(
    newPostForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(newPostForm, inputs, settings);
  openModal(modalNewPost);
});
newPostCloseButton.addEventListener("click", () => closeModal(modalNewPost));
newPostForm.addEventListener("submit", handleNewPostSubmit);

// Edit Avatar
avatarModalBtn.addEventListener("click", () => {
  const inputs = Array.from(
    editAvatarForm.querySelectorAll(settings.inputSelector)
  );
  resetValidation(editAvatarForm, inputs, settings);
  openModal(editAvatarModal);
});
editAvatarCloseButton.addEventListener("click", () =>
  closeModal(editAvatarModal)
);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

// Preview Modal
previewModalCloseButton.addEventListener("click", () =>
  closeModal(previewModal)
);

// Delete Modal
deleteForm.addEventListener("submit", handleDeleteSubmit);
deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});
deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCard = null;
  selectedCardId = null;
});

// Close any modal when clicking on the overlay background
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(modal);
    }
  });
});

// Validation Setup
enableValidation(settings);

// Static Images
document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__edit-button img").src = pencilDark;
document.querySelector(".profile__add-button img").src = plusIcon;
