(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function (index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };
  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $("body").on("click", ".mg-prev", function () {
      $.fn.mauGallery.methods.prevImage(options.lightboxId);
    });
    $("body").on("click", ".mg-next", function () {
      $.fn.mauGallery.methods.nextImage(options.lightboxId);
    });
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage(lightboxId) {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      // Adapt this selector to the class used for the active tag
      let activeTag =
        $(".gallery .nav-link.active").data("images-toggle") || "all";
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column img.gallery-item").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $(".item-column img.gallery-item").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }
      // Find the index of the current image
      let index = imagesCollection.findIndex(
        (img) => img.attr("src") === $(activeImage).attr("src")
      );
      // Go to the previous image (loop on the last one if you are on the first one)
      let prevIndex =
        (index - 1 + imagesCollection.length) % imagesCollection.length;
      $(".lightboxImage").attr("src", imagesCollection[prevIndex].attr("src"));
    },
    nextImage(lightboxId) {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      // Adapt this selector to the class used for the active tag
      let activeTag =
        $(".gallery .nav-link.active").data("images-toggle") || "all";
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column img.gallery-item").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $(".item-column img.gallery-item").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }
      // Find the index of the current image
      let index = imagesCollection.findIndex(
        (img) => img.attr("src") === $(activeImage).attr("src")
      );
      // Go to the next image (loop on the first if you are at the last)
      let nextIndex = (index + 1) % imagesCollection.length;
      $(".lightboxImage").attr("src", imagesCollection[nextIndex].attr("src"));
    },

    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`
        <div class="modal fade" id="${
          lightboxId ? lightboxId : "galleryLightbox"
        }" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body" style="position:relative;">
                        ${
                          navigation
                            ? '<div class="mg-prev" aria-label="Image précédente" style="cursor:pointer;position:absolute;top:50%;left:10px;transform:translateY(-50%);background:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:2rem;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.1);"><</div>'
                            : ""
                        }
                        <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clic"/>
                        ${
                          navigation
                            ? '<div class="mg-next" aria-label="Image suivante" style="cursor:pointer;position:absolute;top:50%;right:10px;transform:translateY(-50%);background:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:2rem;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.1);">></div>'
                            : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `);
    },

    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide();
        if (tag === "all") {
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    },
  };
})(jQuery);
