/**
 * Sligar
 * Copyleft (C) 2011, Edgar Hoo
 * http://edgarhoo.net/ - mail@edgarhoo.net
 *
 * Version: alpha
 * 
 * URI: http://github.com/edgarhoo/sligar
 */

(function( win, doc ){
    
    var 
        // vars
        current = 0,
        currentSlide,
        lastSlide,
        ordinalArea,
        prevSlideArea,
        nextSlideArea,
        slides = [],
        slidesLength = 0,
        slideLayout = {},
        CURRENT_CLASS = 'current',
        
        // methods
        on,
        ready,
        query,
        addClass,
        removeClass,
        createDiv,
        getCurrentFormHash,
        getSlide,
        displayOrdinal,
        updateHash,
        buildNextItem,
        trunSlide,
        nextSlide,
        prevSlide,
        showSlide,
        createSubsidiary,
        getLayouts,
        makeLayout,
        makeBuildList,
        buildSlides,
        setupSlide,
        clickNav,
        keyboardNav,
        initialize,
        navigation,
        end;
    
    on = function( el, type, fn ){
        el.addEventListener( type, fn, false );
    };
    
    ready = function( fn ){
        on( doc, 'DOMContentLoaded', fn );
    };
    
    query = function( selectors, baseElement ){
        if ( baseElement ){
            return baseElement.querySelectorAll( selectors );
        } else {
            return doc.querySelectorAll( selectors );
        }
    };
    
    addClass = function( el, cl ){
        el.classList.add( cl );
    };
    
    removeClass = function( el, cl ){
        el.classList.remove( cl );
    };
    
    createDiv = function(){
        var div = doc.createElement('div');
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            addClass( div, arguments[i] );
        }
        doc.body.appendChild( div );
        return div;
    };
    
    getCurrentFormHash = function(){
        var i = parseInt( win.location.hash.substr(1), 10 );
        if ( i ){
            current = i - 1;
        } else {
            current = 0;
        }
    };
    
    getSlide = function( i ){
        if ( i < 0 || i > slidesLength ){
            current = 0;
            return slides[0];
        } else {
            return slides[i];
        }
    };
    
    displayOrdinal = function(){
        var i = current + 1;
        ordinalArea.innerHTML = i + '/' + slidesLength;
    };
    
    updateHash = function(){
        win.location.hash = current + 1;
    };
    
    buildNextItem = function(){
        var build = query( '.to-build', currentSlide );
        if ( !build.length ){
            return false;
        }
        removeClass( build[0], 'to-build' );
        return true;
    };
    
    trunSlide = function(){
        lastSlide = currentSlide;
        currentSlide = getSlide( current );
        addClass( currentSlide, CURRENT_CLASS );
        removeClass( lastSlide, CURRENT_CLASS );
        updateHash();
        displayOrdinal();
    };
    
    prevSlide = function(){
        if ( current > 0 ){
            current--;
            trunSlide();
        }
    };
    
    nextSlide = function(){
        if ( buildNextItem() ){
            return;
        }
        if ( current < slidesLength - 1 ){
            current++;
            trunSlide();
        }
    };
    
    showSlide = function( i ){
        current = i;
        trunSlide();
    };
    
    createSubsidiary = function(){
        ordinalArea = createDiv( 'area-ordinal' );
        prevSlideArea = createDiv( 'area-nav', 'area-slide-prev' );
        nextSlideArea = createDiv( 'area-nav', 'area-slide-next' );
        //prevSlideArea.innerHTML = 'prevSlide';
        //nextSlideArea.innerHTML = 'nextSlide';
    };
    
    getLayouts = function(){
        var layouts = query( 'section.layouts > article' );
        if ( !layouts.length ){
            return;
        }
        for ( var i = 0, l = layouts.length; i < l; i++ ){
            var layout = layouts[i],
                name = layout.getAttribute('data-name');
            slideLayout[name] = layout.innerHTML;
        }
        if ( !slideLayout['default'] ){
            slideLayout['default'] = '';
        }
    };
    
    makeLayout = function( slide ){
        var layout = slide.getAttribute('data-layout');
        if ( !layout || slideLayout[layout] ){
            layout = 'default';
        }
        slide.innerHTML += slideLayout[layout];
    };
    
    makeBuildList = function( slide ){
        var items = query( '.build > *', slide );
        if ( !items.length ){
            return;
        }
        for ( var i = 0, l = items.length; i < l; i++ ){
            addClass( items[i], 'to-build' );
        }
    };
    
    buildSlides = function(){
        slides = query( 'section.slides > article' );
        slidesLength = slides.length;
        getLayouts();
        for ( var i = 0; i < slidesLength; i++ ){
            var slide = slides[i];
            makeLayout( slide );
            makeBuildList( slide );
        }
    };
    
    setupSlide = function(){
        currentSlide = getSlide( current );
        addClass( currentSlide, CURRENT_CLASS );
        updateHash();
        displayOrdinal();
    };
    
    clickNav = function(){
        on( prevSlideArea, 'click', prevSlide );
        on( nextSlideArea, 'click', nextSlide );
    };
    
    keyboardNav = function(){
        on( doc, 'keydown', function(event){
            switch( event.keyCode ){
                case 13: // enter
                case 32: // space
                case 34: // pg dn
                case 39: // right arrow
                case 40: // down arrow
                    nextSlide();
                    event.preventDefault();
                    break;
                case 8: // backspace
                case 33: // pg up
                case 37: // left arrow
                case 38: // up arrow
                    prevSlide();
                    event.preventDefault();
                    break;
                case 36: // home
                    showSlide(0);
                    event.preventDefault();
                    break;
                case 35: // end
                    showSlide( slidesLength - 1 );
                    event.preventDefault();
                    break;
            }
        } );
    };
    
    initialize = function(){
        getCurrentFormHash();
        createSubsidiary();
        buildSlides();
        setupSlide();
    };
    
    navigation = function(){
        clickNav();
        keyboardNav();
    };
    
    ready(function(){
        initialize();
        navigation();
    });
    
})( window, document );
