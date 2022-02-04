$(function(){
        
    window.lang = {}

    window.UI = new Object({

        /** @dev : Актуальный слой */
        curent_layout: 'index',
                
        /** @dev : Параметры приложения */
        app_configs: {},
        
        /** @dev : Параметры servers */
        server_configs: {},

        /** @dev : Параметры управляющих элементов */
        layout: {
            body: 'body',
            nav: '.tpl-nav',
            container: '.tpl-container'
        },
        
        /** @dev : Функции для оболочки */
        autoload: {
            
            /** @dev : Автозагрузка */
            init: async () => {
				
                await UI.autoload.getAppConfig()
                await UI.autoload.getloadLanguage()
                await UI.autoload.loadScripts()

                //await UI.remote.params()
                //await UI.remote.start()
                await UI.layouts.build()
                //await UI.route.init()

            },

            /** @dev : Предзагрузка скриптов */
            loadScripts: async () => {
                
                $.cachedScript = function( url, options ) {
                    options = $.extend( options || {}, {
                        dataType: "script",
                        cache: true,
                        url: url
                    })
                    return $.ajax( options )
                };
                
                let loadScript = uri => {
                    return new Promise(( resolve, reject ) => {
                        $.cachedScript( uri ).done(function( script, textStatus ) {
                            resolve( true )
                        })
                    })
                }
				
				await loadScript('/js/helpers.js')
				await loadScript('/js/layouts.js')
                                 
            },

            /** @dev : Предзагрузка конфига */
            getAppConfig: () => {
                return new Promise(( resolve, reject ) => {
					$.getJSON( "/config.json", result => {
                        UI.app_configs = result
                        resolve()
					});
                })
            },

            /** @dev : Предзагрузка языкового перевода */
            getloadLanguage: () => {
				
				let lang = UI.app_configs.lang
				if( localStorage.getItem('lang') ){
					lang = localStorage.getItem('lang')
					UI.app_configs.lang = lang
				}
			
                return new Promise(( resolve, reject ) => {
					$.getScript( `/lang/${lang}.js`, () => {
                        resolve()
					});
                })  
            }  

        }                 
        
    })

    UI.autoload.init()
    //.catch( () => {})
    
})