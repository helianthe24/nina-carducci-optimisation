$(document).ready(function () {
  $(".gallery").mauGallery({
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 3,
    },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });
});
// --- ACTIVE FILTER MANAGEMENT (category in gold background) ---
$(document).on("click", ".gallery .nav-link", function () {
  // Removes the active class from all filters
  $(".gallery .nav-link").removeClass("active");
  // Adds the active class to the clicked filter
  $(this).addClass("active");
});
