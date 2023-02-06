import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService'

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    // activElement = React.createRef() //почему это не обьявляется?????!!!!!

    marvelService = new MarvelService();
    // после создания onRequest этот метод вроде бы как и не нужен
    updateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        // this.updateChars()
        // первый раз этот метод загружается по умолчанию с первыми 9-ю картинками по умолчанию
        this.onRequest()
    }

    // закрепляем этот метод за кнопкой
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onCharListLoaded = (newcharList) => {
        let ended = false;
        if (newcharList.length < 9) {
            ended = true;
        }

        // возвращаем обьект из колбекфункции
        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newcharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    //реализация ref для фокуса,таба и выделения элемента
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // console.log(this.itemRefs[id])
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus()
    }

    // метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' }
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' }
            }
            return (
                <li
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    className="char__item"
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // конструкция внесена для центровки спиннера
        return (
            <ul className="char__grid">


                {items}


            </ul>
        )
    }



    render() {
        const { charList, loading, error, newItemloading, offset, charEnded } = this.state
        // console.log(chars.map(res => res.id))
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                {/* <ul className="char__grid"> */}
                {errorMessage}
                {spinner}
                {content}

                {/* </ul> */}

                <button className="button button__main button__long"
                    disabled={newItemloading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div >
        )
    }
}

CharList.propType = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;