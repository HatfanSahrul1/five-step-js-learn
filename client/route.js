
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

            console.log(await response.json());
        }
        catch(err){
            console.log(err);
        }
    }
}

const api = new API_BRIGDE('http://localhost:3000');
module.exports = { api };