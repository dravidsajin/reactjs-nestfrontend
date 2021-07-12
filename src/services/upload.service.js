import * as constant from '../constants/constants';
class uploadService{

    uploadFile(fileData, callback){
        let uploadUrl = constant.PUBLIC_CLOUDINARY_CLOUDNAME;
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener("progress", (e) => {
        // setProgress(Math.round((e.loaded * 100.0) / e.total));
        // console.log(Math.round((e.loaded * 100.0) / e.total));
        });

        xhr.onreadystatechange = (e) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);     
        }
        };

        fd.append(
        "upload_preset",
        constant.PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
        );
        fd.append("tags", "browser_upload");
        fd.append("file", fileData);
        xhr.send(fd);
    }
}

export default new uploadService();