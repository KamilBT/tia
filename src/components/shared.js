
class Shared{
    constructor() {
        this.baseUrl = 'http://localhost/fmfi/tia/event-planner';
        this.getUrl = this.getUrl.bind(this);
        this.getSupportedLang = this.getSupportedLang.bind(this);
      }
    
    //shared base url for ajax
    getUrl(){
        return this.baseUrl;
    }

    //check for supported langs
    getSupportedLang(){
        let lang = navigator.language.substring(0, 2);
        let supported = ['sk', 'en'];
        if(!supported.includes(lang)) lang='en';
        return lang
    }
}

export{Shared}