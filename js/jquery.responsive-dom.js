(function(window, $) {
  var instances = [];
  var throttleCount = 0;
  var throttleRate = 3;

  $.fn.responsiveDom = function(options){
    var settings = $.extend({
          appendTo: 'body',
          mediaQuery: '(min-width: 0)',
          callback: null
        }, options);

    return this.each(function(){
      instances.push(new ResponsiveDOM($(this), settings));
    });
  };

  $(window).on('resize', function(){
    throttleCount++;
    if(throttleCount >= throttleRate){
      throttleCount = 0;
    } else {
      return false;
    }

    instances.forEach(function(inst){
      inst.update();
    });
  });

})(window, jQuery);

var ResponsiveDOM = function(el, opts){
  this.el = el;
  this.location = $(opts.appendTo);
  this.opts = opts;
  this.isMoved = false;

  this.makePlaceholder();
  this.update();
};

ResponsiveDOM.prototype.makePlaceholder = function(){
  this.placeholder = $('<div />').insertAfter(this.el).hide();
};

ResponsiveDOM.prototype.update = function(){
  var doesMatch = window.matchMedia(this.opts.mediaQuery).matches;

  if(!this.isMoved && doesMatch){
    this.place();
  } else if(this.isMoved && !doesMatch){
    this.revert();
  }
};

ResponsiveDOM.prototype.place = function(){
  this.el.appendTo(this.location);
  if(this.opts.callback){
    this.opts.callback(this);
  }
  this.isMoved = true;
};

ResponsiveDOM.prototype.revert = function(){
  this.el.insertBefore(this.placeholder);
  this.isMoved = false;
};