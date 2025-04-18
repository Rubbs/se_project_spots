const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeProfileButton = editProfileModal.querySelector(
  ".modal__close-button"
);

const newPostButton = document.querySelector(".profile__add-button");
const modalNewPost = document.querySelector("#new-post-modal");
const newPostCloseButton = modalNewPost.querySelector(".modal__close-button");

editProfileButton.addEventListener("click", function () {
  editProfileModal.classList.add("modal_is-opened");
});

closeProfileButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostButton.addEventListener("click", function () {
  modalNewPost.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function () {
  modalNewPost.classList.remove("modal_is-opened");
});
