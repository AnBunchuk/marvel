

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=0f2728f588b08e1977bf85ed24a86b82';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacters = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        //   console.log(this.correctImage(char))  
        return {
            name: char.name,
            // description: char.description,
            description: this.descriptionFormat(char.description),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: this.updateComics(char.comics.items)
            // для смены стиля заглушки картинки 
            // styleThumbnail:this.correctImage(char.thumbnail.path)
        }

    }

    descriptionFormat = (description, name) => {
        if (description && description.length > 190) {
            return description.slice(0, 190) + "..."
        }
        if (!description) {
            return 'У этого героя еще нет описания'
        }
        return description
    }

    updateComics = (comics) => {
        if (comics.length === 0) {
            comics[0] = { name: 'Комиксы этого героя не добавлены' }
        }
        if (comics.length > 10) {
            comics.length = 10
        }
        return comics
    }


    // есть картинка или на экране заглушка, если заглушка true и тогда меняем класс стилей
    // correctImage = (str) => {
    //     const result = str.endsWith('image_not_available')
    //     console.log(result)
    //     return result
    // }

}

export default MarvelService;
