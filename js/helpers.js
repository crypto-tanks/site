/** @dev : ++ ФУНКЦИИ :: Вспомогательные функции для работы */
UI.helpers = {

	// Искуственная задержка
    sleep: (ms) => { 
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    // Предзагрузка куска кода с рендерингом
    load_file_memory: {},
    tpl: async ( pathname, objectData, cache = true ) => {
        let tplString = ( cache && UI.helpers.load_file_memory[pathname] !== undefined ) ? UI.helpers.load_file_memory[pathname] : await fetch(`/site/layouts/${pathname}.twig`).then(res => res.text())
        return twig({ data: tplString }).render( objectData )
    },

    // Дата в timestamp
    time: () => {
        return (Math.round(new Date().getTime()/1000)) 
    },

    // timestamp -> date
    timetoFormat: ( timestamp ) => {        
        var d = new Date( timestamp * 1000 )
        var date = {
            d : d.getDate() < 10 ? '0'+d.getDate() : d.getDate(),
            m : d.getMonth() < 10 ? '0'+d.getMonth() : d.getMonth(),
            y : d.getFullYear(),
            h : d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),
            i : d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes()
        }
        return `${date.d}.${date.m}.${date.y} ${date.h}:${date.i}`        
    },

    // Custom alert
    alert: ( type, message, completed ) => {

        var completed   = completed || false
        var type        = type || 'error'
        var mess        = message || lang.bell.alert.default

        if( type === 'success' ){
            iziToast.success({
                title: lang.bell.alert.success,
                message: mess,
                position: 'bottomCenter'
            })
        }

        if( type === 'error' ){
            iziToast.error({
                title: lang.bell.alert.error,
                message: mess,
                position: 'bottomCenter'
            })
        }

        if( completed ){
            completed()
        }

    },

    // Custom confirm
    confirm: ( answer, callback, buttons ) => {
        
        var answer      = answer || 'Вопрос?'
        var btns        = buttons || lang.bell.confirm.buttons;
        var callback    = callback || function( status ){
            if( status === true  ) {}
            if( status === false ) {}
        }

        iziToast.show({
            theme:      'dark',
            icon:       'icon-person',
            title:      lang.bell.confirm.header,
            message:    answer,
            position:   'center', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
            progressBarColor: 'rgb(0, 255, 184)',
            buttons: [
                ['<button>'+btns[0]+'</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'fadeOutUp',
                        onClosing: function(instance, toast, closedBy){
                            callback(true);
                        }
                    }, toast, 'buttonName');
                }, true],
                ['<button>'+btns[1]+'</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'fadeOutUp',
                        onClosing: function(instance, toast, closedBy){
                            callback(false);
                        }
                    }, toast, 'buttonName');
                }]
            ]
        })

        return true

    },
    
    // Случайное значение
    rand: ( min, max ) => {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    },
   
    // Остаток секунд в таймер
    timer_convert : function( countdown ) {
        var countdown = (function (countdown){
            var countdown = countdown || false;
            if(countdown){
                if(countdown > 0){
                    return countdown;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        })(countdown);
        if(countdown){
            var secs = countdown % 60;
            var countdown1 = (countdown - secs) / 60;
            var mins = countdown1 % 60;
            countdown1 = (countdown1 - mins) / 60;
            var hours = countdown1 % 24;
            var days = (countdown1 - hours) / 24;
            return {
                d: (days < 10)?'0'+days:days,
                h: (hours < 10)?'0'+hours:hours,
                m: (mins < 10)?'0'+mins:mins,
                s: (secs < 10)?'0'+secs:secs
            };
        }else{
            return false;
        }
    }

}