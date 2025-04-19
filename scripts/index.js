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
const newPostImageUrlInput = modalNewPost.querySelector("#card-image-input");
const newPostCaptionInput = modalNewPost.querySelector("#post-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostButton.addEventListener("click", function () {
  modalNewPost.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function () {
  modalNewPost.classList.remove("modal_is-opened");
});

function handleEditPtofileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
}

editProfileForm.addEventListener("submit", handleEditPtofileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const newPost = {
    imageURL: newPostImageUrlInput.value,
    caption: newPostCaptionInput.value,
  };
  console.log(newPost);
  modalNewPost.classList.remove("modal_is-opened");
}
newPostForm.addEventListener("submit", handleNewPostSubmit);
