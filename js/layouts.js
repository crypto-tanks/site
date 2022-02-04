/** @dev : ++ ЗАПУСК :: Узел запуска */
UI.layouts = {

    /** @dev : Сборка основного каркаса для вёрстки */
    build: async () => {					
		await UI.layouts.framed()			  
    },
		
    /** @dev : Пересборка компонентов каркаса */
    framed: async () => {

        await UI.layouts.nav()
        await UI.layouts.about_block()
        await UI.layouts.levels_block()
        await UI.layouts.stages_block()
        await UI.layouts.token_block()
        await UI.layouts.contacts_block()
        await UI.layouts.footer_block()

    },
	
    nav : async () => {
        let html = await UI.helpers.tpl('nav', {
            lang: lang
        }, false)
        $('.tpl-nav').html( html )
        var $page = $('html, body');
        $('a[href*="#"]').click(function() {
            $page.animate({
                scrollTop: ( $($.attr(this, 'href')).offset().top - 60 )
            }, 400);
            return false;
        });
    },

    about_block : async () => {
        let html = await UI.helpers.tpl('about_play', {
            lang: lang
        }, false)
        $('.tpl-about_block').html( html )
    },

    levels_block : async () => {
        let html = await UI.helpers.tpl('levels', {
            lang: lang
        }, false)
        $('.tpl-levels_block').html( html )
    },

    stages_block : async () => {
        
        let html = await UI.helpers.tpl('stages', {
            lang: lang
        }, false)
        $('.tpl-stages').html( html )

        $('.js-stages-slick').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            customPaging: 0,
            infinite: false,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1
                }
              }
            ]
        })

    },

    token_block : async () => {
        let html = await UI.helpers.tpl('token', {
            lang: lang
        }, false)
        $('.tpl-token_block').html( html )
    },

    contacts_block : async () => {
        let html = await UI.helpers.tpl('contacts', {
            lang: lang
        }, false)
        $('.tpl-contacts_block').html( html )
    },

    footer_block : async () => {
        let html = await UI.helpers.tpl('footer', {
            lang: lang
        }, false)
        $('.tpl-footer_block').html( html )
    },

    change_language: async prefix => {
		let langs = UI.app_configs.langs.map( e => e.file)
        if( langs.indexOf( prefix ) !== -1 ){
			localStorage.setItem( 'lang', prefix )
			UI.app_configs.lang = prefix
            await UI.autoload.getloadLanguage()
            await UI.layouts.build()
        }
    }

}   