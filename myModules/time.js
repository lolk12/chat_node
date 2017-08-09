exports.dateTime = {
    timeS : function() {
        let Data = new Date();
        let Hour,Minutes,Seconds;
        if(Data.getHours()<10){
            Hour = '0' + Data.getHours();
        }else {Hour = Data.getHours();}
        if(Data.getMinutes()<10){
            Minutes = '0' + Data.getMinutes();
        }else{Minutes = Data.getMinutes();}
        if(Data.getSeconds()<10){
            Seconds = '0' + Data.getSeconds();
        }else{Seconds = Data.getSeconds()}
        var timeF = Hour+':'+Minutes+':'+ Seconds;
        return timeF;
    },
    dateS: function() {
        let date = new Date();
        date = date.toDateString();
        return date;
    }

};