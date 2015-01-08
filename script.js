var Parallax3D = (function() {
	var self = {};
	self.elements = [];

	self.handleSingle = function($this, scrollTop, screenHeight, scrollBottom) {
		if (null == $this.data('parallax-offset') || $this.data('parallax-offset') < 0) return;

		scrollTop = scrollTop || $(window).scrollTop();
		screenHeight = screenHeight || $(window).height();
		scrollBottom = scrollTop + screenHeight;

		var translation = (scrollBottom - $this.data('parallax-start')) / (screenHeight + $this.data('parallax-height'));
		var cssTranslation = -1 * Math.min(Math.max(translation,0),1) * $this.data('parallax-offset');

		$this.data('parallax-object').css(prefix.css + 'transform', 'translate3d(0, ' + cssTranslation + 'px, 0)');
	};

	self.handler = function(){
		var scrollTop = $(window).scrollTop();
		var screenHeight = $(window).height();
		var scrollBottom = scrollTop + screenHeight;
		self.elements.each(function(){
			self.handleSingle($(this), scrollTop, screenHeight, scrollBottom);
		});
	};

	self.parse = function() {
		self.elements = $('[data-parallax-3d]');
		if (self.elements.length === 0) return;

		self.elements.each(function(){
			var $el = $(this);
			$el.css({ overflow: 'hidden', position: 'relative' }).data({
				'parallax-start': $el.offset().top,
				'parallax-height': $el.outerHeight()
			});

			var $obj = $el.find('>[data-parallax-3d-object]');
			$el.data('parallax-object', $obj);

			$obj.load(function(){
				var imageNaturalHeight = $obj[0].naturalHeight / $obj[0].naturalWidth * $el.outerWidth();
				$el.data('parallax-offset', imageNaturalHeight - $el.outerHeight());

				if ($el.data('parallax-offset') > 0) {
					$obj.css({ position: 'absolute', width: '100%', height: 'auto', top: 0, left: 0,	right: 0, opacity: 1 });
					self.handleSingle($el);
				} else {
					$obj.css(prefix.css + 'transform', 'none').css('height', $el.outerHeight()).css({
						position: 'absolute', width: 'auto', top: 0, bottom: 0,left: '-9999px', right: '-9999px', margin: '0 auto', opacity: 1
					});
				}
			});
			if ($obj[0].complete) $obj.load();
		});
	};

	$('head').append('<style>[data-parallax-3d]{ overflow: hidden; position: relative; } [data-parallax-3d-object]{ position: absolute; width: 100%; height: auto; top: 0; left: 0; right: 0; opacity: 0; '+prefix.css+'transition: opacity 1s; }</style>');

	$(self.parse);
	$(window).load(function() {
		$(window).resize(self.parse);
		$(window).scroll(self.handler);
	});

	return self;
})();
