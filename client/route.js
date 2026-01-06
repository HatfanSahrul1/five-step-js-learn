
class API_BRIGDE {
    constructor(url) {
        this._url = url;
    }

    async addFile(name){
        try{
            const response = await fetch(`${this._url}/add`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json'
                },
                body: JSON.stringify({
                    filename: name
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data.message);
            return data;
        }
        catch(err){
            console.log(err.message);
            return null;
        }
    }

    async listFiles(){
        try{
            const response = await fetch(`${this._url}/files`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if(result.success === 'true'){
                result.data.forEach((file) => {
                    console.log(`[${file.id}] ${file.name} - ${file.status}`);
                });
            }
            return result;
        }
        catch(err){
            console.log(err.message);
            return null;
        }
    }

    async showFileStatus(id){
        try{
            const response = await fetch(`${this._url}/file/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if(result.success === 'true'){
                console.log(`File ${result.data.id} is ${result.data.status}`);
            } else {
                console.log(result.message);
            }
            return result;
        }
        catch(err){
            console.log(err.message);
            return null;
        }
    }

    async processFile(id){
        try{
            const response = await fetch(`${this._url}/process`, {
                method: 'POST',
                headers: {
                    'content-type' : 'application/json'
                },
                body: JSON.stringify({
                    fileId: id
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if(result.success === 'true'){
                console.log(`${result.message} [${result.time} ms]`);
            } else {
                console.log(result.message);
            }
            return result;
        }
        catch(err){
            console.log(err.message);
            return null;
        }
    }
}

const api = new API_BRIGDE('http://localhost:3000');
module.exports = { api };