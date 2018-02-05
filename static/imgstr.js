	var strOldimage = "http://image.ehaofang.com:8081/";
    var strNewimage = "http://images.ehaofang.com/";

    function strImageurl(sourceStr, strtype) {
        var strTurn = "";

        if (sourceStr.indexOf('/') > -1) {
            strTurn = GetTypePictureExtension(strOldimage + sourceStr, strtype, "1");
        }
        else {
            strTurn = GetTypePictureExtension(strNewimage + sourceStr, strtype, "2");
        }

        return strTurn;
    }


    function GetTypePictureExtension(strUrl, strtype, strServer) {
        var strMinqiniu = "";
        if (strUrl == null) {
            return "";
        }
        if (strServer == "1") {

            var strUrlarr = strUrl.split(".")
            switch (strtype) {
                case "min":
                    path = strUrlarr[0] + '-min.' + strUrlarr[1];
                    break;
                case "mid":
                    path = strUrlarr[0] + '-mid.' + strUrlarr[1];
                    break;
                default:
                    path = strUrlarr[0] + '-big.' + strUrlarr[1];
            }

        }
        else if (strServer == "2") {

            switch (strtype) {
                case "min":
                    path = strUrl + '?imageView2/2/h/100';
                    break;
                case "mid":
                    path = strUrl + '?imageView2/2/h/400';
                    break;
                default:
                    path = strUrl + '?imageView2/2/h/800';
            }
        }
        return path;
    }
