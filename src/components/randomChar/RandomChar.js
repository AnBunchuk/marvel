import { Component } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
// import thor from '../../resources/img/thor.jpeg';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';

class RandomChar extends Component {


    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false
        })
    }
    // для запуска спиннера ожидания
    onCharLoading = () => {
        this.setState({
            loading: true,
            error:false
        }
        )
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1010789 - 1009146) + 1009146);
        // устанавливаем loading в true функцией onCharLoading
        this.onCharLoading()
        this.marvelService
            .getCharacters(id)
            // устанавливаем loading в false функцией onCharLoaded
            .then(this.onCharLoaded)
            .catch(this.onError)

    }



    componentDidMount() {
        this.updateChar()
        // console.log('mount')
        //  this.timerId = setInterval(this.updateChar, 30000);
    }

    componentWillUnmount() {
        // clearInterval(this.timerId)
    }


    render() {
        const { char, loading, error } = this.state

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null

        return (
            <div className="randomchar">
                {/* {loading ? <Spinner /> : <View char={char} />} */}
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button
                        onClick={this.updateChar}
                        className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;
    // const stylesImg = styleThumbnail ? "randomchar__img2" : "randomchar__img"
    let imgStyle = { 'objectFit': 'cover' }
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = { 'objectFit': 'unset' };
    }

    return (
        <div className="randomchar__block">
            <img style={imgStyle}
                // style={{width: '180px', height: '180px', objectFit: 'contain'}} 
                src={thumbnail} alt="Random character" className="randomchar__img"  />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default RandomChar;