export function setButtonText(
  submitButton,
  isLoading,
  defaultText = "Save",
  LoadingText = "Saving..."
) {
  if (isLoading) {
    //set the loading text
    submitButton.textContent = LoadingText;
    submitButton.disabled = true;
  } else {
    //set the not loading text
    submitButton.textContent = defaultText;
    submitButton.disabled = false;
  }
}
