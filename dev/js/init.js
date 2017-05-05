// JavaScript Document

/* Create a closure to maintain scope of the '$' and remain compatible with other frameworks.  */
(function ($) {

	// *************************************************************************************************** //
	// *************************************************************************************************** //
	// begin: same as $(document).ready(); event fires when the DOM is ready                               //
	// *************************************************************************************************** //
	// *************************************************************************************************** //
	$(function () {
		
		
		$(function () {
			var isMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
				},
				any: function() {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				}
			};
			
			if (isMobile.any() && $(".carousel").length > 0) {
			   // $(".carousel").swiperight(function() {  
				  // $(this).carousel('prev');  
			   // });  
			   // $(".carousel").swipeleft(function() {  
				  // $(this).carousel('next');  
			   // });
			}

			if($('.c-carousel').length > 0) {
				$('.c-carousel').slick({
					dots: true,
					infinite: true,
					speed: 300,
					slidesToShow: 1
				});
			}
			
			if($('.c-carousel--slide').length > 0) {
				var slider = $('.c-carousel--slide');
				var modal = $('#captionModal');
				let caption = "";

				modal.on('hide.bs.modal', function (e) {
					$('.c-slider--caption').text("");
				});

				$('.c-carousel--slide').click(function(e) {
					$('#captionModal').modal();
					caption = $(this).attr('aria-describedby');
					$('.c-slider--caption').text(caption);
				});

			}
			
		});
		
	});
	// end: bind window resize

})(jQuery);
/* =End closure */